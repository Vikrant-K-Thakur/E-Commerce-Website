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
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

// GET notifications for a customer
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

    const notifications = await db.collection('notifications')
      .find({ customerEmail: email })
      .sort({ created_at: -1 })
      .toArray()

    return NextResponse.json({ success: true, data: notifications })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}

// POST create notification or mark as read
export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()
    const db = await connectDB()
    
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    if (action === 'create') {
      const notification = {
        customerEmail: data.customerEmail,
        title: data.title,
        message: data.message,
        type: data.type || 'order',
        orderId: data.orderId,
        read: false,
        created_at: new Date(),
        time: new Date().toLocaleString()
      }

      await db.collection('notifications').insertOne(notification)
      return NextResponse.json({ success: true })
    }

    if (action === 'markRead') {
      await db.collection('notifications').updateOne(
        { _id: data.notificationId },
        { $set: { read: true, read_at: new Date() } }
      )
      return NextResponse.json({ success: true })
    }

    if (action === 'markAllRead') {
      await db.collection('notifications').updateMany(
        { customerEmail: data.email, read: false },
        { $set: { read: true, read_at: new Date() } }
      )
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}
