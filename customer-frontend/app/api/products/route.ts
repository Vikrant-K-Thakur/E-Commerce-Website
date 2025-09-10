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
    await client.connect()
    return client.db('ecommerce')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    return null
  }
}

export async function GET() {
  try {
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    const products = await db.collection('products').find({}).toArray()
    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error('Get products failed:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const db = await connectDB()
    
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    const product = {
      ...data,
      id: new ObjectId().toString(),
      created_at: new Date(),
      updated_at: new Date()
    }

    await db.collection('products').insertOne(product)
    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Add product failed:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' })
    }

    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    await db.collection('products').deleteOne({ id })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product failed:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}