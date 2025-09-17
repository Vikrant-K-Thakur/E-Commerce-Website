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
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect()
    }
    return client.db('ecommerce')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, code, email } = await request.json()
    
    if (!code || !email) {
      return NextResponse.json({ success: false, error: 'Code and email are required' })
    }
    
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    if (action === 'redeem') {
      // Find the redeem code
      const redeemCode = await db.collection('redeem_codes').findOne({ code: code.toUpperCase() })
      
      if (!redeemCode) {
        return NextResponse.json({ success: false, error: 'Invalid redeem code' })
      }

      // Check if code is active
      if (!redeemCode.isActive) {
        return NextResponse.json({ success: false, error: 'This redeem code is no longer active' })
      }

      // Check if code is expired
      if (new Date(redeemCode.expires_at) < new Date()) {
        return NextResponse.json({ success: false, error: 'This redeem code has expired' })
      }

      // Check if usage limit reached
      if (redeemCode.usedCount >= redeemCode.usageLimit) {
        return NextResponse.json({ success: false, error: 'This redeem code has reached its usage limit' })
      }

      // Check if user already used this code
      const existingRedemption = await db.collection('code_redemptions').findOne({
        code: code.toUpperCase(),
        email
      })

      if (existingRedemption) {
        return NextResponse.json({ success: false, error: 'You have already used this redeem code' })
      }

      // Create redemption record
      const redemption = {
        id: new Date().getTime().toString(),
        code: code.toUpperCase(),
        email,
        type: redeemCode.type,
        value: redeemCode.value,
        title: redeemCode.title,
        description: redeemCode.description,
        redeemed_at: new Date()
      }

      await db.collection('code_redemptions').insertOne(redemption)

      // Create reward notification
      const rewardNotification = {
        id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
        type: redeemCode.type,
        value: redeemCode.value,
        title: `Code Redeemed: ${redeemCode.title}`,
        description: `You successfully redeemed code "${code.toUpperCase()}" and received ${redeemCode.type === 'coins' ? `${redeemCode.value} ₹` : `${redeemCode.value}% discount`}`,
        customerEmail: email,
        isRead: false,
        created_at: new Date(),
        expires_at: null
      }

      await db.collection('rewards').insertOne(rewardNotification)

      // Update redeem code usage count
      await db.collection('redeem_codes').updateOne(
        { code: code.toUpperCase() },
        { $inc: { usedCount: 1 } }
      )

      // If it's coins, add to customer wallet
      if (redeemCode.type === 'coins') {
        await db.collection('customers').updateOne(
          { email },
          { 
            $inc: { coinBalance: redeemCode.value },
            $set: { updated_at: new Date() }
          },
          { upsert: true }
        )

        // Create transaction record
        const transaction = {
          id: new Date().getTime().toString(),
          email,
          type: 'credit',
          description: `Redeem Code: ${redeemCode.title}`,
          amount: 0,
          coins: redeemCode.value,
          paymentMethod: 'redeem_code',
          status: 'completed',
          created_at: new Date(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        }

        await db.collection('transactions').insertOne(transaction)
      }

      const successMessage = redeemCode.type === 'coins' 
        ? `${redeemCode.value} ₹ added to your wallet!` 
        : `${redeemCode.value}% discount applied to your account!`
      return NextResponse.json({ 
        success: true, 
        message: successMessage,
        data: {
          type: redeemCode.type,
          value: redeemCode.value,
          title: redeemCode.title,
          description: redeemCode.description
        }
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' })
  } catch (error) {
    console.error('Redeem API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + error.message })
  }
}