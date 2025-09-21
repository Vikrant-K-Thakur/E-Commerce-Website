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
    
    // Validate required fields
    if (action === 'sendReward') {
      if (!data.type || !data.value || !data.title || !data.description || !data.customerEmail) {
        return NextResponse.json({ success: false, error: 'Missing required fields' })
      }
    }
    
    const db = await connectDB()
    
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    if (action === 'sendReward') {
      const reward = {
        id: new Date().getTime().toString(),
        type: data.type, // 'discount' or 'coins'
        value: parseFloat(data.value),
        title: data.title,
        description: data.description,
        customerEmail: data.customerEmail,
        isRead: false,
        isUsed: false,
        created_at: new Date(),
        expiresAt: data.expires_at ? new Date(data.expires_at) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }

      if (data.customerEmail === 'all') {
        // Send to all customers
        const customers = await db.collection('customers').find({}).toArray()
        if (customers.length === 0) {
          return NextResponse.json({ success: false, error: 'No customers found' })
        }
        
        const rewards = customers.map(customer => ({
          ...reward,
          id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
          customerEmail: customer.email
        }))
        
        // Insert rewards
        await db.collection('rewards').insertMany(rewards)
        
        // If coins, update all customer wallets and create transactions with 15-day expiration
        if (data.type === 'coins') {
          const expirationDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
          
          for (const customer of customers) {
            // Update wallet
            await db.collection('customers').updateOne(
              { email: customer.email },
              { 
                $inc: { coinBalance: parseFloat(data.value) },
                $set: { updated_at: new Date() }
              },
              { upsert: true }
            )
            
            // Create transaction with expiration
            const transaction = {
              id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
              email: customer.email,
              type: 'credit',
              description: `Admin Reward: ${data.title}`,
              amount: 0,
              coins: parseFloat(data.value),
              paymentMethod: 'admin_reward',
              status: 'completed',
              expires_at: expirationDate,
              created_at: new Date(),
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
            }
            await db.collection('transactions').insertOne(transaction)
          }
        }
        
        return NextResponse.json({ 
          success: true, 
          message: `Reward sent to ${customers.length} customers successfully!` 
        })
      } else {
        // Send to specific customer
        await db.collection('rewards').insertOne(reward)
        
        // If coins, update customer wallet and create transaction with 15-day expiration
        if (data.type === 'coins') {
          const expirationDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
          
          // Update wallet
          await db.collection('customers').updateOne(
            { email: data.customerEmail },
            { 
              $inc: { coinBalance: parseFloat(data.value) },
              $set: { updated_at: new Date() }
            },
            { upsert: true }
          )
          
          // Create transaction with expiration
          const transaction = {
            id: new Date().getTime().toString(),
            email: data.customerEmail,
            type: 'credit',
            description: `Admin Reward: ${data.title}`,
            amount: 0,
            coins: parseFloat(data.value),
            paymentMethod: 'admin_reward',
            status: 'completed',
            expires_at: expirationDate,
            created_at: new Date(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
          }
          await db.collection('transactions').insertOne(transaction)
        }
        
        return NextResponse.json({ 
          success: true, 
          message: 'Reward sent successfully!' 
        })
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' })
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

    const rewards = await db.collection('rewards').find({ customerEmail: email }).sort({ created_at: -1 }).toArray()
    
    // Mark rewards as read when fetched
    if (rewards.length > 0) {
      await db.collection('rewards').updateMany(
        { customerEmail: email, isRead: false },
        { $set: { isRead: true } }
      )
    }
    
    return NextResponse.json({ success: true, data: rewards })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error') })
  }
}