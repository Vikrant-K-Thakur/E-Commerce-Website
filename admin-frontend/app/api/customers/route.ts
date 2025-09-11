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

    const customers = await db.collection('customers').find({}).sort({ created_at: -1 }).toArray()
    
    // Transform data to match the expected format
    const transformedCustomers = customers.map(customer => ({
      id: customer.id || customer._id.toString(),
      name: customer.name || 'N/A',
      email: customer.email,
      phone: customer.phone || 'N/A',
      walletBalance: 0, // Default wallet balance
      loyaltyCoins: 0, // Default loyalty coins
      status: 'Active', // Default status
      orderHistory: 0, // Default order count
      joinDate: customer.created_at ? new Date(customer.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      address: customer.address || 'N/A'
    }))

    return NextResponse.json({ success: true, data: transformedCustomers })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}