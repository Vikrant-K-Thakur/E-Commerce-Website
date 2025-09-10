import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

let cachedClient: MongoClient | null = null

async function connectDB() {
  if (cachedClient) return cachedClient.db('ecommerce')

  try {
    const client = new MongoClient(process.env.DATABASE_URL!, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    })
    await client.connect()
    cachedClient = client
    return client.db('ecommerce')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    return null
  }
}

// 📌 GET products
export async function GET() {
  try {
    const db = await connectDB()
    if (!db) return NextResponse.json({ success: false, error: 'Database connection failed' })

    const products = await db.collection('products').find({}).toArray()
    // Convert _id to id
    const formatted = products.map(p => ({ ...p, id: p._id.toString() }))
    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('Get products failed:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}

// 📌 POST add product
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const db = await connectDB()
    if (!db) return NextResponse.json({ success: false, error: 'Database connection failed' })

    const product = {
      name: data.name,
      price: data.price,
      description: data.description,
      image: data.image,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await db.collection('products').insertOne(product)
    return NextResponse.json({
      success: true,
      data: { ...product, id: result.insertedId.toString() }
    })
  } catch (error) {
    console.error('Add product failed:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}

// 📌 DELETE product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Product ID required' })

    const db = await connectDB()
    if (!db) return NextResponse.json({ success: false, error: 'Database connection failed' })

    await db.collection('products').deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product failed:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}
