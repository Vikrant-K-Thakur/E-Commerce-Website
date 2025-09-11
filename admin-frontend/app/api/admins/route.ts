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

    let admins = await db.collection('admins').find({}).toArray()
    
    // If no admins exist, create default admin
    if (admins.length === 0) {
      const defaultAdmin = {
        username: 'admin',
        password: 'admin123',
        created_at: new Date(),
        updated_at: new Date()
      }
      await db.collection('admins').insertOne(defaultAdmin)
      admins = [defaultAdmin]
    }

    return NextResponse.json({ success: true, data: admins })
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

    if (action === 'add') {
      // Check if username already exists
      const existing = await db.collection('admins').findOne({ username: data.username })
      if (existing) {
        return NextResponse.json({ success: false, error: 'Username already exists' })
      }

      await db.collection('admins').insertOne({
        username: data.username,
        password: data.password,
        created_at: new Date(),
        updated_at: new Date()
      })
    } else if (action === 'update') {
      // Check if new username already exists (if username is being changed)
      if (data.oldUsername !== data.username) {
        const existing = await db.collection('admins').findOne({ username: data.username })
        if (existing) {
          return NextResponse.json({ success: false, error: 'Username already exists' })
        }
      }

      await db.collection('admins').updateOne(
        { username: data.oldUsername },
        {
          $set: {
            username: data.username,
            password: data.password,
            updated_at: new Date()
          }
        }
      )
    } else if (action === 'delete') {
      await db.collection('admins').deleteOne({ username: data.username })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}