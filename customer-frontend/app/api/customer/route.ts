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
    const data = await request.json()
    const db = await connectDB()
    
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    // Check if user exists to determine if this is a new user
    const existingUser = await db.collection('customers').findOne({ email: data.email })
    const isNewUser = !existingUser

    const updateData = {
      ...data,
      updated_at: new Date()
    }

    const insertData = {
      id: new Date().getTime().toString(),
      coinBalance: isNewUser ? 50 : 0, // Give login bonus to new users
      loginBonusGiven: isNewUser,
      created_at: new Date()
    }

    await db.collection('customers').updateOne(
      { email: data.email },
      {
        $set: updateData,
        $setOnInsert: insertData
      },
      { upsert: true }
    )

    // If this is a new user, create login bonus transaction and reward notification
    if (isNewUser) {
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 15)
      
      // Create login bonus transaction with 15-day expiration
      const bonusTransaction = {
        id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
        email: data.email,
        type: 'credit',
        description: 'Welcome Bonus - First Login',
        amount: 0,
        coins: 50,
        paymentMethod: 'login_bonus',
        status: 'completed',
        expires_at: expirationDate,
        created_at: new Date(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }
      
      await db.collection('transactions').insertOne(bonusTransaction)
      
      // Create reward notification for the bonus
      const rewardNotification = {
        id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
        customerEmail: data.email,
        type: 'coins',
        title: 'Welcome Bonus!',
        description: 'Congratulations! You received 50 coins as a welcome bonus for joining NXTFIT. Use them for discounts on your purchases!',
        value: 50,
        expires_at: expirationDate,
        isRead: false,
        created_at: new Date()
      }
      
      await db.collection('rewards').insertOne(rewardNotification)
    }

    return NextResponse.json({ success: true, isNewUser })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
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

    const customer = await db.collection('customers').findOne({ email })
    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}

// Handle login bonus for existing users who haven't received it yet
export async function PUT(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' })
    }

    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    // Check if user exists and hasn't received login bonus
    const customer = await db.collection('customers').findOne({ 
      email, 
      $or: [
        { loginBonusGiven: { $ne: true } },
        { loginBonusGiven: { $exists: false } }
      ]
    })

    if (!customer) {
      return NextResponse.json({ success: false, error: 'User not found or bonus already given' })
    }

    // Give login bonus
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 15)
    
    // Update customer with bonus coins and mark bonus as given
    await db.collection('customers').updateOne(
      { email },
      { 
        $inc: { coinBalance: 50 },
        $set: { 
          loginBonusGiven: true,
          updated_at: new Date()
        }
      }
    )
    
    // Create login bonus transaction with 15-day expiration
    const bonusTransaction = {
      id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
      email,
      type: 'credit',
      description: 'Welcome Bonus - First Login',
      amount: 0,
      coins: 50,
      paymentMethod: 'login_bonus',
      status: 'completed',
      expires_at: expirationDate,
      created_at: new Date(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }
    
    await db.collection('transactions').insertOne(bonusTransaction)
    
    // Create reward notification for the bonus
    const rewardNotification = {
      id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
      customerEmail: email,
      type: 'coins',
      title: 'Welcome Bonus!',
      description: 'Congratulations! You received 50 coins as a welcome bonus for joining NXTFIT. Use them for discounts on your purchases!',
      value: 50,
      expires_at: expirationDate,
      isRead: false,
      created_at: new Date()
    }
    
    await db.collection('rewards').insertOne(rewardNotification)

    return NextResponse.json({ success: true, message: 'Login bonus awarded successfully!' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}