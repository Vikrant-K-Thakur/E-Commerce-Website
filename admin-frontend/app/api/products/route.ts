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

// 📌 POST add/update product
export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()
    const db = await connectDB()
    if (!db) return NextResponse.json({ success: false, error: 'Database connection failed' })

    if (action === 'add') {
      // Validate required fields
      if (!data.productId || !data.name || !data.price || !data.description || (!data.images?.length && !data.image)) {
        return NextResponse.json({ success: false, error: 'All required fields must be filled' })
      }

      // Check if product ID already exists
      const existing = await db.collection('products').findOne({ productId: data.productId })
      if (existing) {
        return NextResponse.json({ success: false, error: 'ID already exists, please assign unique ID' })
      }

      const product = {
        productId: data.productId,
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        images: data.images || [data.image],
        image: data.images?.[0] || data.image,
        category: data.category || '',
        sizes: data.sizes || [],
        available: data.available !== false,
        created_at: new Date(),
        updated_at: new Date(),
      }

      const result = await db.collection('products').insertOne(product)
      return NextResponse.json({
        success: true,
        data: { ...product, id: result.insertedId.toString() }
      })
    }

    if (action === 'update') {
      // Validate required fields
      if (!data.id || !data.name || !data.price || !data.description || (!data.images?.length && !data.image)) {
        return NextResponse.json({ success: false, error: 'All required fields must be filled' })
      }

      const updateData = {
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        images: data.images || [data.image],
        image: data.images?.[0] || data.image,
        category: data.category || '',
        sizes: data.sizes || [],
        available: data.available !== false,
        updated_at: new Date(),
      }

      const result = await db.collection('products').updateOne(
        { _id: new ObjectId(data.id) },
        { $set: updateData }
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, error: 'Product not found' })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' })
  } catch (error) {
    console.error('Product operation failed:', error)
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
