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

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    const db = await connectDB()
    
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    // Check if any admins exist
    const adminCount = await db.collection('admins').countDocuments()
    
    // If no admins exist and default credentials are used, create default admin
    if (adminCount === 0 && username === 'admin' && password === 'admin123') {
      await db.collection('admins').insertOne({
        username: 'admin',
        password: 'admin123',
        created_at: new Date(),
        updated_at: new Date()
      })
      return NextResponse.json({ success: true })
    }

    // Check credentials against database
    const admin = await db.collection('admins').findOne({ username, password })
    
    if (admin) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Invalid credentials' })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}