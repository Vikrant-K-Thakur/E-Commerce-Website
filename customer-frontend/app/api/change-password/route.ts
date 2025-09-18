import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

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

// Generate random OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via email (mock implementation)
async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    // In a real implementation, you would use a service like SendGrid, Nodemailer, etc.
    console.log(`Sending OTP ${otp} to ${email}`)
    
    // For demo purposes, we'll just log the OTP
    // In production, integrate with your email service
    return true
  } catch (error) {
    console.error('Failed to send OTP email:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, email, currentPassword, newPassword, otp } = await request.json()
    
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    // Step 1: Send OTP for forgot password (no current password needed)
    if (action === 'forgotPassword') {
      if (!email) {
        return NextResponse.json({ success: false, error: 'Email required' })
      }

      // Check if customer exists
      const customer = await db.collection('customers').findOne({ email })
      if (!customer) {
        return NextResponse.json({ success: false, error: 'No account found with this email' })
      }

      // Check if customer has a password (for social login users)
      if (!customer.password) {
        return NextResponse.json({ success: false, error: 'This account uses social login. Please login with Google/GitHub.' })
      }

      // Generate and store OTP
      const generatedOTP = generateOTP()
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      await db.collection('customers').updateOne(
        { email },
        {
          $set: {
            passwordResetOTP: generatedOTP,
            otpExpiry: otpExpiry,
            updated_at: new Date()
          }
        }
      )

      // Send OTP email
      const emailSent = await sendOTPEmail(email, generatedOTP)
      if (!emailSent) {
        return NextResponse.json({ success: false, error: 'Failed to send OTP email' })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Password reset OTP sent to your email',
        // For demo purposes, include OTP in response (remove in production)
        otp: generatedOTP
      })
    }

    // Step 2: Send OTP for change password (current password required)
    if (action === 'sendOTP') {
      if (!email || !currentPassword) {
        return NextResponse.json({ success: false, error: 'Email and current password required' })
      }

      // Verify current password
      const customer = await db.collection('customers').findOne({ email })
      if (!customer) {
        return NextResponse.json({ success: false, error: 'Customer not found' })
      }

      // Check if customer has a password (for social login users)
      if (!customer.password) {
        return NextResponse.json({ success: false, error: 'No password set. Please use social login.' })
      }

      const isValidPassword = await bcrypt.compare(currentPassword, customer.password)
      if (!isValidPassword) {
        return NextResponse.json({ success: false, error: 'Current password is incorrect' })
      }

      // Generate and store OTP
      const generatedOTP = generateOTP()
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      await db.collection('customers').updateOne(
        { email },
        {
          $set: {
            passwordChangeOTP: generatedOTP,
            otpExpiry: otpExpiry,
            updated_at: new Date()
          }
        }
      )

      // Send OTP email
      const emailSent = await sendOTPEmail(email, generatedOTP)
      if (!emailSent) {
        return NextResponse.json({ success: false, error: 'Failed to send OTP email' })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent to your email address',
        // For demo purposes, include OTP in response (remove in production)
        otp: generatedOTP
      })
    }

    // Step 2: Verify OTP and change password
    if (action === 'changePassword') {
      if (!email || !newPassword || !otp) {
        return NextResponse.json({ success: false, error: 'Email, new password, and OTP required' })
      }

      const customer = await db.collection('customers').findOne({ email })
      if (!customer) {
        return NextResponse.json({ success: false, error: 'Customer not found' })
      }

      // Verify OTP (check both change password and reset password OTP)
      const isChangePasswordOTP = customer.passwordChangeOTP === otp
      const isResetPasswordOTP = customer.passwordResetOTP === otp
      
      if (!isChangePasswordOTP && !isResetPasswordOTP) {
        return NextResponse.json({ success: false, error: 'Invalid OTP' })
      }

      // Check OTP expiry
      if (!customer.otpExpiry || new Date() > new Date(customer.otpExpiry)) {
        return NextResponse.json({ success: false, error: 'OTP has expired' })
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)

      // Update password and clear OTP
      await db.collection('customers').updateOne(
        { email },
        {
          $set: {
            password: hashedPassword,
            updated_at: new Date()
          },
          $unset: {
            passwordChangeOTP: "",
            passwordResetOTP: "",
            otpExpiry: ""
          }
        }
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Password changed successfully' 
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}