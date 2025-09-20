import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import crypto from 'crypto'

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
    console.error('Failed to connect to MongoDB:', error)
    throw error
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
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
  return NextResponse.json({ success: false, error: 'Operation failed: ' + errorMessage })
}
}

export async function POST(request: NextRequest) {
  try {
    const { 
      action, 
      email, 
      items, 
      totalAmount, 
      discountAmount, 
      coinsUsed, 
      couponId, 
      orderId, 
      refundAmount,
      paymentMethod,
      deliveryAddress,
      pickupPoint,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = await request.json()
    
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
      
      // IMPORTANT: Coupon remains used even after cancellation to prevent reuse
      // This is intentional behavior - once a coupon is used, it cannot be used again
      // even if the order is cancelled to prevent abuse

      // Get order details to check payment method
      const orderDetails = await db.collection('orders').findOne({ orderId, customerEmail: email })
      
      // Note: Refund will be processed separately, no immediate wallet credit
      if (!orderDetails) {
        return NextResponse.json({ success: false, error: 'Updated order not found' })
      }

      // Create refund processing record only if payment method is not COD
      if (orderDetails?.paymentMethod !== 'cod') {
        const refundRecord = {
          id: new Date().getTime().toString(),
          email,
          type: 'refund_pending',
          description: `Refund Processing - Order ${orderId}`,
          amount: refundAmount,
          paymentMethod: orderDetails.paymentMethod,
          status: 'processing',
          orderId,
          created_at: new Date(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        }

        await db.collection('refund_requests').insertOne(refundRecord)
      }

      // Create notification for customer
      // Create notification for customer
const refundMessage = orderDetails.paymentMethod === 'cod'
  ? `Your order ${orderId} has been cancelled.`
  : `Your order ${orderId} has been cancelled. Refund of ₹${refundAmount} will be processed within 1-2 business days.`
      
      const notification = {
        customerEmail: email,
        title: 'Order Cancelled',
        message: refundMessage,
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
    
    if (!email || !items || !totalAmount || !paymentMethod) {
      return NextResponse.json({ success: false, error: 'Missing required fields' })
    }

    // For online payments, verify Razorpay signature
    if (paymentMethod === 'online') {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ success: false, error: 'Missing payment verification data' })
      }
      
      // Verify signature
      const secret = process.env.RAZORPAY_KEY_SECRET || 'your_secret_key'
      const body = razorpay_order_id + "|" + razorpay_payment_id
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex')

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ success: false, error: 'Invalid payment signature' })
      }
    }

    // Get customer data
    const customer = await db.collection('customers').findOne({ email })
    const currentBalance = customer?.coinBalance || 0

    // Create order
    const newOrderId = 'ORD' + new Date().getTime()
    const order = {
      orderId: newOrderId,
      customerEmail: email,
      items,
      subtotal: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      discountAmount: discountAmount || 0,
      coinsUsed: coinsUsed || 0,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      status: 'confirmed',
      deliveryAddress: deliveryAddress || null,
      pickupPoint: pickupPoint || null,
      razorpay_order_id: razorpay_order_id || null,
      razorpay_payment_id: razorpay_payment_id || null,
      isViewedByAdmin: false,
      created_at: new Date(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }

    // Insert order
    await db.collection('orders').insertOne(order)

    // Handle coins discount (deduct coins used for discount from wallet)
    if (coinsUsed > 0) {
      await db.collection('customers').updateOne(
        { email },
        { 
          $inc: { coinBalance: -coinsUsed },
          $set: { updated_at: new Date() }
        }
      )
      
      // Create transaction record for coins usage
      const coinsTransaction = {
        id: new Date().getTime().toString() + '_coins',
        email,
        type: 'debit',
        description: `Coins Discount Applied - ${newOrderId}`,
        amount: coinsUsed,
        coins: -coinsUsed,
        paymentMethod: 'coins',
        status: 'completed',
        orderId: newOrderId,
        created_at: new Date(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }
      
      await db.collection('transactions').insertOne(coinsTransaction)
    }

    // Create payment transaction record
    if (paymentMethod === 'online') {
      const transaction = {
        id: new Date().getTime().toString(),
        email,
        type: 'payment',
        description: `Online Payment - ${newOrderId}`,
        amount: totalAmount,
        paymentMethod: 'razorpay',
        status: 'completed',
        orderId: newOrderId,
        razorpay_order_id,
        razorpay_payment_id,
        created_at: new Date(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }
      
      await db.collection('transactions').insertOne(transaction)
    }

    // Mark coupon as used if applied (PERMANENT - never restored even on cancellation)
    if (couponId) {
      await db.collection('rewards').updateOne(
        { _id: couponId, customerEmail: email },
        { 
          $set: { 
            isUsed: true,
            usedAt: new Date(),
            usedOrderId: newOrderId,
            updated_at: new Date()
          }
        }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order placed successfully',
      orderId: newOrderId
    })
  } catch (error) {
  console.error('API Error:', error)
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
  return NextResponse.json({ success: false, error: 'Operation failed: ' + errorMessage })
}
}
