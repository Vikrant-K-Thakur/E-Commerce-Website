import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(process.env.DATABASE_URL!, {
  serverSelectionTimeoutMS: 10000,
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

// 📌 GET all products
export async function GET() {
  try {
    const db = await connectDB()
    if (!db) return NextResponse.json({ success: false, error: 'Database connection failed' })

    const products = await db.collection('products').find({}).toArray()

    // convert MongoDB _id → id and ensure all fields are properly formatted
    const formatted = products.map((p) => ({
      ...p,
      id: p._id.toString(),
      productId: p.productId || null,
      category: p.category || '',
      sizes: p.sizes || [],
      coins: p.coins || 0,
      available: p.available !== false,
      codAvailable: p.codAvailable !== false,
      images: p.images || [p.image],
      _id: undefined,
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error) {
    console.error('Get products failed:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}

// 📌 POST add/update product
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const db = await connectDB()
    if (!db) return NextResponse.json({ success: false, error: 'Database connection failed' })

    if (data.action === 'update' && data.id) {
      // Update existing product
      const updateData = {
        productId: data.productId,
        name: data.name,
        price: data.price,
        coins: data.coins || 0,
        description: data.description,
        image: data.images?.[0] || data.image,
        images: data.images || [data.image],
        category: data.category || '',
        sizes: data.sizes || [],
        available: data.available !== false,
        codAvailable: data.codAvailable !== false,
        updated_at: new Date(),
      }

      await db.collection('products').updateOne(
        { _id: new ObjectId(data.id) },
        { $set: updateData }
      )

      return NextResponse.json({ success: true, data: { ...updateData, id: data.id } })
    } else {
      // Add new product
      const product = {
        productId: data.productId,
        name: data.name,
        price: data.price,
        coins: data.coins || 0,
        description: data.description,
        image: data.images?.[0] || data.image,
        images: data.images || [data.image],
        category: data.category || '',
        sizes: data.sizes || [],
        available: data.available !== false,
        codAvailable: data.codAvailable !== false,
        created_at: new Date(),
        updated_at: new Date(),
      }

      const result = await db.collection('products').insertOne(product)

      return NextResponse.json({
        success: true,
        data: { ...product, id: result.insertedId.toString() },
      })
    }
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
