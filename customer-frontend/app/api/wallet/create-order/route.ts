import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with your key
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_key', // Replace with your secret
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' })
    }

    const options = {
      amount: amount, // amount in paise
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        purpose: 'Add funds to wallet'
      }
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    })
  } catch (error) {
    console.error('Razorpay order creation failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create order: ' + (error instanceof Error ? error.message : 'Unknown error') 
    })
  }
}