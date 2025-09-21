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
    const { action, ...data } = await request.json()
    
    if (action === 'create') {
      if (!data.code || !data.type || !data.value || !data.title || !data.description) {
        return NextResponse.json({ success: false, error: 'Missing required fields' })
      }
    }
    
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    if (action === 'create') {
      // Check if code already exists
      const existingCode = await db.collection('redeem_codes').findOne({ code: data.code.toUpperCase() })
      if (existingCode) {
        return NextResponse.json({ 
          success: false, 
          error: `Code "${data.code}" already exists. Please choose a different code.` 
        })
      }
      
      const redeemCode = {
        id: new Date().getTime().toString(),
        code: data.code.toUpperCase(),
        type: data.type,
        value: parseFloat(data.value),
        title: data.title,
        description: data.description,
        validityDays: parseInt(data.validityDays),
        usageLimit: parseInt(data.usageLimit),
        usedCount: 0,
        isActive: true,
        created_at: new Date(),
        expires_at: new Date(Date.now() + parseInt(data.validityDays) * 24 * 60 * 60 * 1000)
      }

      await db.collection('redeem_codes').insertOne(redeemCode)
      return NextResponse.json({ 
        success: true, 
        message: 'Redeem code created successfully!',
        data: redeemCode
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error') })
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    const redeemCodes = await db.collection('redeem_codes').find({}).sort({ created_at: -1 }).toArray()
    return NextResponse.json({ success: true, data: redeemCodes })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error') })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action, id, isActive } = await request.json()
    
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    if (action === 'toggle') {
      await db.collection('redeem_codes').updateOne(
        { id },
        { $set: { isActive, updated_at: new Date() } }
      )
      return NextResponse.json({ success: true, message: 'Code status updated' })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error') })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Code ID is required' })
    }
    
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    const result = await db.collection('redeem_codes').deleteOne({ id })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Code not found' })
    }

    return NextResponse.json({ success: true, message: 'Redeem code deleted successfully' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error') })
  }
}