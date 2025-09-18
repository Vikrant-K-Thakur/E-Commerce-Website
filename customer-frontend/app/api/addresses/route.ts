import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

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

// GET addresses
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

    const addresses = await db.collection('addresses')
      .find({ email })
      .sort({ created_at: -1 })
      .toArray()

    const formatted = addresses.map(addr => ({ ...addr, id: addr._id.toString() }))
    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('Get addresses failed:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}

// POST add address
export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, address, city, pincode, type, isDefault } = await request.json()
    
    if (!email || !name || !phone || !address || !city || !pincode) {
      return NextResponse.json({ success: false, error: 'All fields are required' })
    }

    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await db.collection('addresses').updateMany(
        { email },
        { $set: { isDefault: false } }
      )
    }

    const newAddress = {
      email,
      name,
      phone,
      address,
      city,
      pincode,
      type: type || 'home',
      isDefault: isDefault || false,
      created_at: new Date()
    }

    const result = await db.collection('addresses').insertOne(newAddress)
    return NextResponse.json({ 
      success: true, 
      data: { ...newAddress, id: result.insertedId.toString() }
    })
  } catch (error) {
    console.error('Add address failed:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}