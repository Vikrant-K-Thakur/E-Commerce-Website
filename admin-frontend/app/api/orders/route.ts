import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.DATABASE_URL!, {
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
})

async function connectDB() {
  try {
    await client.connect()
    return client.db('ecommerce')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    // Handle new orders count request
    if (action === 'getNewCount') {
      const newOrdersCount = await db.collection('orders').countDocuments({ isViewedByAdmin: { $ne: true } })
      return NextResponse.json({ success: true, count: newOrdersCount })
    }

    const orders = await db.collection('orders').find({}).sort({ created_at: -1 }).toArray()
    
    // Get customer details for each order
    const transformedOrders = await Promise.all(
      orders.map(async (order) => {
        let customerDetails = null
        if (order.customerEmail) {
          customerDetails = await db.collection('customers').findOne({ email: order.customerEmail })
        }
        
        return {
          id: order.orderId || order._id.toString(),
          customer: customerDetails?.name || 'Unknown Customer',
          customerEmail: order.customerEmail || '',
          customerPhone: customerDetails?.phone || '',
          customerAddress: customerDetails?.address || '',
          customerCoinBalance: customerDetails?.coinBalance || 0,
          customerJoinDate: customerDetails?.created_at ? new Date(customerDetails.created_at).toISOString().split('T')[0] : '',
          orderDate: order.date || new Date(order.created_at).toISOString().split('T')[0],
          orderTime: order.time || new Date(order.created_at).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          total: order.totalAmount || 0,
          subtotal: order.subtotal || 0,
          discountAmount: order.discountAmount || 0,
          paymentMethod: order.paymentMethod || 'wallet',
          status: order.status || 'confirmed',
          trackingId: order.trackingId || null,
          items: order.items || [],
          address: order.address || customerDetails?.address || '',
          deliveryAddress: order.deliveryAddress || null
        }
      })
    )

    return NextResponse.json({ success: true, data: transformedOrders })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()
    const db = await connectDB()
    
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    if (action === 'markAsViewed') {
      // Mark all orders as viewed by admin
      await db.collection('orders').updateMany(
        { isViewedByAdmin: { $ne: true } },
        { $set: { isViewedByAdmin: true, viewedAt: new Date() } }
      )
      return NextResponse.json({ success: true })
    }

    if (action === 'cancelOrder') {
      // Get order details
      const order = await db.collection('orders').findOne({ orderId: data.orderId })
      
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not found' })
      }
      
      if (order.status === 'cancelled') {
        return NextResponse.json({ success: false, error: 'Order is already cancelled' })
      }

      // Update order status to cancelled
      await db.collection('orders').updateOne(
        { orderId: data.orderId },
        { $set: { status: 'cancelled', updated_at: new Date() } }
      )

      // Refund amount to customer wallet only if payment method is not COD
      if (order.paymentMethod !== 'cod') {
        await db.collection('customers').updateOne(
          { email: order.customerEmail },
          { 
            $inc: { coinBalance: order.totalAmount },
            $set: { updated_at: new Date() }
          }
        )
      }

      // Create refund transaction record only if payment method is not COD
      if (order.paymentMethod !== 'cod') {
        const transaction = {
          id: new Date().getTime().toString(),
          email: order.customerEmail,
          type: 'credit',
          description: `Admin Order Cancellation Refund - ${data.orderId}`,
          amount: order.totalAmount,
          coins: order.totalAmount,
          paymentMethod: 'wallet',
          status: 'completed',
          orderId: data.orderId,
          created_at: new Date(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        }

        await db.collection('transactions').insertOne(transaction)
      }

      // Create notification for customer
      const refundMessage = order.paymentMethod === 'cod' 
        ? `Your order ${data.orderId} has been cancelled by admin.`
        : `Your order ${data.orderId} has been cancelled by admin and ${order.totalAmount} ₹ have been refunded to your wallet.`
      
      const notification = {
        customerEmail: order.customerEmail,
        title: 'Order Cancelled',
        message: refundMessage,
        type: 'order',
        orderId: data.orderId,
        read: false,
        created_at: new Date(),
        time: new Date().toLocaleString()
      }
      
      await db.collection('notifications').insertOne(notification)

      return NextResponse.json({ success: true })
    }

    if (action === 'updateStatus') {
      // Get order details for notification
      const order = await db.collection('orders').findOne({ orderId: data.orderId })
      
      await db.collection('orders').updateOne(
        { orderId: data.orderId },
        {
          $set: {
            status: data.status,
            trackingId: data.trackingId || null,
            updated_at: new Date()
          }
        }
      )

      // Create notification for customer
      if (order?.customerEmail) {
        const notification = {
          customerEmail: order.customerEmail,
          title: `Order ${data.status}`,
          message: `Your order ${data.orderId} has been ${data.status.toLowerCase()}${data.trackingId ? `. Tracking ID: ${data.trackingId}` : '.'}`,
          type: 'order',
          orderId: data.orderId,
          read: false,
          created_at: new Date(),
          time: new Date().toLocaleString()
        }
        
        await db.collection('notifications').insertOne(notification)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}