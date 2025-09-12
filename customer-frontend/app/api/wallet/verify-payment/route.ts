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
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect()
    }
    return client.db('ecommerce')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      email,
      amount,
      coins,
      paymentMethod
    } = await request.json()

    // Verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'your_secret_key'
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' })
    }

    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    // Create transaction record
    const transaction = {
      id: new Date().getTime().toString(),
      email,
      type: 'credit',
      description: `Added Funds - Razorpay`,
      amount: parseFloat(amount),
      coins: parseInt(coins),
      paymentMethod: 'razorpay',
      status: 'completed',
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      created_at: new Date(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }

    // Insert transaction
    await db.collection('transactions').insertOne(transaction)

    // Update customer wallet balance
    await db.collection('customers').updateOne(
      { email },
      { 
        $inc: { coinBalance: parseInt(coins) },
        $set: { updated_at: new Date() }
      },
      { upsert: true }
    )

    // Create reward notification for funds added
    const fundNotification = {
      id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
      type: 'coins',
      value: parseInt(coins),
      title: 'Funds Added Successfully',
      description: `You have successfully added ${parseFloat(amount)} coins to your wallet and received ${parseInt(coins)} coins`,
      customerEmail: email,
      isRead: false,
      created_at: new Date(),
      expires_at: null
    }

    await db.collection('rewards').insertOne(fundNotification)

    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified and funds added successfully',
      transaction: transaction
    })
  } catch (error) {
    console.error('Payment verification failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Payment verification failed: ' + error.message 
    })
  }
}