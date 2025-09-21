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
    const email = searchParams.get('email')
    const type = searchParams.get('type') // 'coupons' for cart page filtering
    
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' })
    }

    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    let query: any = { customerEmail: email }
    
    // If requesting coupons for cart page, filter out only used ones
    if (type === 'coupons') {
      query = {
        customerEmail: email,
        type: 'discount',
        $or: [
          { isUsed: { $ne: true } },
          { isUsed: { $exists: false } }
        ]
      }
    }

    const rewards = await db.collection('rewards').find(query).sort({ created_at: -1 }).toArray()
    return NextResponse.json({ success: true, data: rewards })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error') })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, action } = await request.json()
    
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' })
    }

    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    if (action === 'markAsRead') {
      await db.collection('rewards').updateMany(
        { customerEmail: email },
        { $set: { isRead: true, updated_at: new Date() } }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error') })
  }
}