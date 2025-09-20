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
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ success: false, error: 'Authorization code required' })
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/google`
      })
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return NextResponse.json({ success: false, error: 'Failed to get access token' })
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    })

    const userData = await userResponse.json()

    if (!userData.email) {
      return NextResponse.json({ success: false, error: 'Failed to get user data' })
    }

    // Connect to database and handle user
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    // Check if user exists in database
    let existingUser = await db.collection('customers').findOne({ email: userData.email })
    
    if (!existingUser) {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: '',
        address: '',
        avatar: userData.picture,
        provider: 'google',
        googleId: userData.id,
        coinBalance: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
      
      await db.collection('customers').insertOne(newUser)
      existingUser = await db.collection('customers').findOne({ email: userData.email })
    } else {
      // Update existing user with Google info if needed
      await db.collection('customers').updateOne(
        { email: userData.email },
        { 
          $set: { 
            avatar: userData.picture,
            googleId: userData.id,
            updated_at: new Date()
          }
        }
      )
    }

    if (!existingUser) {
      return NextResponse.json({ success: false, error: 'Failed to create or retrieve user' })
    }

    const user = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      phone: existingUser.phone || '',
      address: existingUser.address || '',
      avatar: userData.picture || '/placeholder.svg?height=40&width=40'
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json({ success: false, error: 'Authentication failed' })
  }
}
