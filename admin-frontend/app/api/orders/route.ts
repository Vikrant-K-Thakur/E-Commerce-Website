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

    const orders = await db.collection('orders').find({}).sort({ orderDate: -1 }).toArray()
    
    const transformedOrders = orders.map(order => ({
      id: order.id || order._id.toString(),
      customer: order.customer || 'Unknown Customer',
      customerEmail: order.customerEmail || '',
      orderDate: order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      total: order.total || 0,
      status: order.status || 'Pending',
      trackingId: order.trackingId || null,
      items: order.items || [],
      address: order.address || ''
    }))

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
      await db.collection('orders').updateOne(
        { id: data.orderId },
        {
          $set: {
            status: data.status,
            trackingId: data.trackingId || null,
            updated_at: new Date()
          }
        }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}