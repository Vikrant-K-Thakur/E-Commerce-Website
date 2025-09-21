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
    const { email, amount, coins, paymentMethod, status } = await request.json()
    
    if (!email || !amount || !coins || !paymentMethod) {
      return NextResponse.json({ success: false, error: 'Missing required fields' })
    }

    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    // Create transaction record
    const transaction = {
      id: new Date().getTime().toString(),
      email,
      type: 'credit',
      description: `Added Funds - ${paymentMethod.toUpperCase()}`,
      amount: parseFloat(amount),
      coins: parseInt(coins),
      paymentMethod,
      status: status || 'completed',
      created_at: new Date(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }

    // Insert transaction
    await db.collection('transactions').insertOne(transaction)

    // Update customer wallet balance
    await db.collection('customers').updateOne(
      { email },
      { 
        $inc: { coinBalance: parseInt(coins) },
        $set: { updated_at: new Date() }
      },
      { upsert: true }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Funds added successfully',
      transaction: transaction
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error') })
  }
}

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

    // Get customer wallet balance
    const customer = await db.collection('customers').findOne({ email })
    const coinBalance = customer?.coinBalance || 0

    // Get recent transactions
    const transactions = await db.collection('transactions')
      .find({ email })
      .sort({ created_at: -1 })
      .toArray()

    // Get expiring coins
    const now = new Date()
    const expiringTransactions = await db.collection('transactions').find({
      email,
      type: 'credit',
      coins: { $gt: 0 },
      expires_at: { $exists: true, $gte: now },
      expired_processed: { $ne: true }
    }).sort({ expires_at: 1 }).toArray()

    const expiringCoins = expiringTransactions.map(t => ({
      coins: t.coins,
      description: t.description,
      expires_at: t.expires_at,
      daysLeft: Math.ceil((new Date(t.expires_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }))

    return NextResponse.json({ 
      success: true, 
      data: {
        coinBalance,
        transactions,
        expiringCoins
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error') })
  }
}