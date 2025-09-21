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
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    const now = new Date()
    
    // Find all expired coin transactions that haven't been processed
    const expiredTransactions = await db.collection('transactions').find({
      type: 'credit',
      coins: { $gt: 0 },
      expires_at: { $lt: now },
      expired_processed: { $ne: true }
    }).toArray()

    let totalExpiredCoins = 0
    const customerUpdates = new Map()

    // Group expired coins by customer email
    for (const transaction of expiredTransactions) {
      const email = transaction.email
      const coins = transaction.coins || 0
      
      if (!customerUpdates.has(email)) {
        customerUpdates.set(email, 0)
      }
      customerUpdates.set(email, customerUpdates.get(email) + coins)
      totalExpiredCoins += coins
    }

    // Update customer wallets and mark transactions as processed
    for (const [email, expiredCoins] of customerUpdates) {
      // Deduct expired coins from customer wallet
      await db.collection('customers').updateOne(
        { email },
        { 
          $inc: { coinBalance: -expiredCoins },
          $set: { updated_at: new Date() }
        }
      )

      // Create expiration transaction record
      const expirationTransaction = {
        id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
        email,
        type: 'debit',
        description: `Coins Expired (15-day limit)`,
        amount: 0,
        coins: expiredCoins,
        paymentMethod: 'expiration',
        status: 'completed',
        created_at: new Date(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }
      
      await db.collection('transactions').insertOne(expirationTransaction)
    }

    // Mark all expired transactions as processed
    if (expiredTransactions.length > 0) {
      const expiredIds = expiredTransactions.map(t => t._id)
      await db.collection('transactions').updateMany(
        { _id: { $in: expiredIds } },
        { $set: { expired_processed: true } }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${expiredTransactions.length} expired transactions, removed ${totalExpiredCoins} coins from ${customerUpdates.size} customers`,
      data: {
        expiredTransactions: expiredTransactions.length,
        totalExpiredCoins,
        affectedCustomers: customerUpdates.size
      }
    })
  } catch (error) {
    console.error('Coin expiration API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error') })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    const now = new Date()
    
    if (email) {
      // Get expiring coins for specific customer
      const expiringTransactions = await db.collection('transactions').find({
        email,
        type: 'credit',
        coins: { $gt: 0 },
        expires_at: { $exists: true, $gte: now },
        expired_processed: { $ne: true }
      }).sort({ expires_at: 1 }).toArray()

      return NextResponse.json({ 
        success: true, 
        data: expiringTransactions.map(t => ({
          id: t.id,
          coins: t.coins,
          description: t.description,
          expires_at: t.expires_at,
          daysLeft: Math.ceil((new Date(t.expires_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        }))
      })
    } else {
      // Get all customers with expiring coins
      const expiringTransactions = await db.collection('transactions').find({
        type: 'credit',
        coins: { $gt: 0 },
        expires_at: { $exists: true, $gte: now },
        expired_processed: { $ne: true }
      }).toArray()

      return NextResponse.json({ 
        success: true, 
        data: {
          totalExpiringTransactions: expiringTransactions.length,
          totalExpiringCoins: expiringTransactions.reduce((sum, t) => sum + (t.coins || 0), 0)
        }
      })
    }
  } catch (error) {
    console.error('Coin expiration API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error') })
  }
}