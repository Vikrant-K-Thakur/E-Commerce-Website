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
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect()
    }
    return client.db('ecommerce')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' })
    }

    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    const orders = await db.collection('orders')
      .find({ customerEmail: email })
      .sort({ created_at: -1 })
      .toArray()

    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + error.message })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, email, items, totalAmount, discountAmount, couponId, orderId, refundAmount } = await request.json()
    
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    // Handle order cancellation
    if (action === 'cancel') {
      if (!email || !orderId || !refundAmount) {
        return NextResponse.json({ success: false, error: 'Missing required fields for cancellation' })
      }

      // Check if order is already cancelled
      const existingOrder = await db.collection('orders').findOne({ orderId, customerEmail: email })
      if (!existingOrder) {
        return NextResponse.json({ success: false, error: 'Order not found' })
      }
      if (existingOrder.status === 'cancelled') {
        return NextResponse.json({ success: false, error: 'Order is already cancelled' })
      }

      // Update order status to cancelled
      await db.collection('orders').updateOne(
        { orderId, customerEmail: email },
        { $set: { status: 'cancelled', updated_at: new Date() } }
      )

      // Refund amount to customer wallet
      await db.collection('customers').updateOne(
        { email },
        { 
          $inc: { coinBalance: refundAmount },
          $set: { updated_at: new Date() }
        }
      )

      // Create refund transaction record
      const transaction = {
        id: new Date().getTime().toString(),
        email,
        type: 'credit',
        description: `Order Cancellation Refund - ${orderId}`,
        amount: refundAmount,
        coins: refundAmount,
        paymentMethod: 'wallet',
        status: 'completed',
        orderId,
        created_at: new Date(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }

      await db.collection('transactions').insertOne(transaction)

      // Create notification for customer
      const notification = {
        customerEmail: email,
        title: 'Order Cancelled',
        message: `Your order ${orderId} has been cancelled and ${refundAmount} coins have been refunded to your wallet.`,
        type: 'order',
        orderId,
        read: false,
        created_at: new Date(),
        time: new Date().toLocaleString()
      }
      
      await db.collection('notifications').insertOne(notification)

      return NextResponse.json({ success: true, message: 'Order cancelled and refund processed' })
    }
    
    // Original order creation logic
    
    if (!email || !items || !totalAmount) {
      return NextResponse.json({ success: false, error: 'Missing required fields' })
    }

    // Check wallet balance
    const customer = await db.collection('customers').findOne({ email })
    const currentBalance = customer?.coinBalance || 0

    if (currentBalance < totalAmount) {
      return NextResponse.json({ 
        success: false, 
        error: 'Insufficient wallet balance',
        currentBalance,
        requiredAmount: totalAmount
      })
    }

    // Create order
    const newOrderId = 'ORD' + new Date().getTime()
    const order = {
      orderId: newOrderId,
      customerEmail: email,
      items,
      subtotal: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      discountAmount: discountAmount || 0,
      totalAmount,
      paymentMethod: 'wallet',
      status: 'confirmed',
      created_at: new Date(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }

    // Insert order
    await db.collection('orders').insertOne(order)

    // Deduct amount from wallet
    await db.collection('customers').updateOne(
      { email },
      { 
        $inc: { coinBalance: -totalAmount },
        $set: { updated_at: new Date() }
      }
    )

    // Create transaction record
    const transaction = {
      id: new Date().getTime().toString(),
      email,
      type: 'debit',
      description: `Order Payment - ${newOrderId}`,
      amount: totalAmount,
      coins: -totalAmount,
      paymentMethod: 'wallet',
      status: 'completed',
      orderId: newOrderId,
      created_at: new Date(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }

    await db.collection('transactions').insertOne(transaction)

    // Mark coupon as used if applied
    if (couponId) {
      await db.collection('rewards').updateOne(
        { _id: couponId, customerEmail: email },
        { 
          $set: { 
            isUsed: true,
            usedAt: new Date(),
            updated_at: new Date()
          }
        }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order placed successfully',
      orderId: newOrderId,
      newBalance: currentBalance - totalAmount
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + error.message })
  }
}