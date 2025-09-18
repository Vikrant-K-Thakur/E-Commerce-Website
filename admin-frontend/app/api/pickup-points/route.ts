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

    const pickupPoints = await db.collection('pickupPoints').find({}).sort({ created_at: -1 }).toArray()
    
    const transformedPoints = pickupPoints.map(point => ({
      id: point._id.toString(),
      name: point.name,
      address: point.address,
      latitude: point.latitude,
      longitude: point.longitude,
      contactPhone: point.contactPhone,
      timings: point.timings,
      isActive: point.isActive,
      created_at: point.created_at
    }))

    return NextResponse.json({ success: true, data: transformedPoints })
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

    if (action === 'create') {
      const pickupPoint = {
        name: data.name,
        address: data.address,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        contactPhone: data.contactPhone,
        timings: data.timings,
        isActive: data.isActive !== false,
        created_at: new Date(),
        updated_at: new Date()
      }

      await db.collection('pickupPoints').insertOne(pickupPoint)
      return NextResponse.json({ success: true, message: 'Pickup point created successfully' })
    }

    if (action === 'update') {
      await db.collection('pickupPoints').updateOne(
        { _id: new (require('mongodb')).ObjectId(data.id) },
        {
          $set: {
            name: data.name,
            address: data.address,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            contactPhone: data.contactPhone,
            timings: data.timings,
            isActive: data.isActive,
            updated_at: new Date()
          }
        }
      )
      return NextResponse.json({ success: true, message: 'Pickup point updated successfully' })
    }

    if (action === 'delete') {
      await db.collection('pickupPoints').deleteOne({ _id: new (require('mongodb')).ObjectId(data.id) })
      return NextResponse.json({ success: true, message: 'Pickup point deleted successfully' })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}