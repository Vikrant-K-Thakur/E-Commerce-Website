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

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()
    
    // Validate required fields
    if (action === 'sendReward') {
      if (!data.type || !data.value || !data.title || !data.description || !data.customerEmail) {
        return NextResponse.json({ success: false, error: 'Missing required fields' })
      }
    }
    
    const db = await connectDB()
    
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    if (action === 'sendReward') {
      const reward = {
        id: new Date().getTime().toString(),
        type: data.type, // 'discount' or 'coins'
        value: parseFloat(data.value),
        title: data.title,
        description: data.description,
        customerEmail: data.customerEmail,
        isRead: false,
        created_at: new Date(),
        expires_at: data.expires_at ? new Date(data.expires_at) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }

      if (data.customerEmail === 'all') {
        // Send to all customers
        const customers = await db.collection('customers').find({}).toArray()
        if (customers.length === 0) {
          return NextResponse.json({ success: false, error: 'No customers found' })
        }
        
        const rewards = customers.map(customer => ({
          ...reward,
          id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
          customerEmail: customer.email
        }))
        
        const result = await db.collection('rewards').insertMany(rewards)
        return NextResponse.json({ 
          success: true, 
          message: `Reward sent to ${result.insertedCount} customers successfully!` 
        })
      } else {
        // Send to specific customer
        const result = await db.collection('rewards').insertOne(reward)
        return NextResponse.json({ 
          success: true, 
          message: 'Reward sent successfully!' 
        })
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + error.message })
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

    const rewards = await db.collection('rewards').find({ customerEmail: email }).sort({ created_at: -1 }).toArray()
    
    // Mark rewards as read when fetched
    if (rewards.length > 0) {
      await db.collection('rewards').updateMany(
        { customerEmail: email, isRead: false },
        { $set: { isRead: true } }
      )
    }
    
    return NextResponse.json({ success: true, data: rewards })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + error.message })
  }
}