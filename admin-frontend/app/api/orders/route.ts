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
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
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
          address: order.address || customerDetails?.address || ''
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