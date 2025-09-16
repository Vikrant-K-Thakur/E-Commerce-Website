import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ success: false, error: 'Authorization code required' })
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID || '',
        client_secret: process.env.GITHUB_CLIENT_SECRET || '',
        code
      })
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return NextResponse.json({ success: false, error: 'Failed to get access token' })
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { 
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'NXTFIT-App'
      }
    })

    const userData = await userResponse.json()

    // Get user email (GitHub might not return email in user endpoint)
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: { 
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'NXTFIT-App'
      }
    })

    const emailData = await emailResponse.json()
    const primaryEmail = emailData.find((email: any) => email.primary)?.email || userData.email

    if (!primaryEmail) {
      return NextResponse.json({ success: false, error: 'Failed to get user email' })
    }

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create new user if doesn't exist
    // 3. Generate JWT token
    // 4. Return user data and token

    // For now, return mock success response
    const user = {
      id: userData.id.toString(),
      email: primaryEmail,
      name: userData.name || userData.login,
      picture: userData.avatar_url,
      provider: 'github'
    }

    // Generate a simple token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({ userId: userData.id, email: primaryEmail })).toString('base64')

    return NextResponse.json({
      success: true,
      user,
      token
    })
  } catch (error) {
    console.error('GitHub auth error:', error)
    return NextResponse.json({ success: false, error: 'Authentication failed' })
  }
}