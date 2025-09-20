import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

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

// Generate random OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via email using nodemailer
async function sendOTPEmail(email: string, otp: string, isReset: boolean = false): Promise<boolean> {
  try {
    console.log('Attempting to send email to:', email)
    console.log('Email user configured:', process.env.EMAIL_USER ? 'Yes' : 'No')
    console.log('Email pass configured:', process.env.EMAIL_PASS ? 'Yes' : 'No')
    
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const subject = isReset ? 'Password Reset OTP' : 'Change Password OTP'
    const action = isReset ? 'reset your password' : 'change your password'
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Security Verification</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">Your OTP Code</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              You requested to ${action}. Please use the following OTP to complete the process:
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; font-family: 'Courier New', monospace;">${otp}</span>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                ⚠️ <strong>Important:</strong> This OTP will expire in 10 minutes. Do not share this code with anyone.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you didn't request this, please ignore this email or contact support.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated message from E-Commerce Website. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log(`OTP email sent successfully to ${email}`, result.messageId)
    return true
  } catch (error) {
  console.error('Failed to send OTP email:', error)
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
  console.error('Error details:', errorMessage)
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
        return NextResponse.json({ success: false, error: 'This account uses social login. Please login with Google.' })
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
      const emailSent = await sendOTPEmail(email, generatedOTP, true)
      if (!emailSent) {
        return NextResponse.json({ success: false, error: 'Failed to send OTP email' })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Password reset OTP sent to your email'
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

      // Check if password is hashed (starts with $2a, $2b, etc.) or plain text
      let isValidPassword = false
      if (customer.password.startsWith('$2')) {
        // Password is hashed, use bcrypt compare
        isValidPassword = await bcrypt.compare(currentPassword, customer.password)
      } else {
        // Password is plain text, direct comparison
        isValidPassword = currentPassword === customer.password
      }
      
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
      const emailSent = await sendOTPEmail(email, generatedOTP, false)
      if (!emailSent) {
        return NextResponse.json({ success: false, error: 'Failed to send OTP email' })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent to your email address'
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
      const updateResult = await db.collection('customers').updateOne(
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

      console.log('Password update result:', updateResult.modifiedCount > 0 ? 'Success' : 'Failed')
      console.log('Updated password for email:', email)

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
