import { NextRequest, NextResponse } from 'next/server'

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

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create new user if doesn't exist
    // 3. Generate JWT token
    // 4. Return user data and token

    // For now, return mock success response
    const user = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      provider: 'google'
    }

    // Generate a simple token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({ userId: userData.id, email: userData.email })).toString('base64')

    return NextResponse.json({
      success: true,
      user,
      token
    })
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json({ success: false, error: 'Authentication failed' })
  }
}