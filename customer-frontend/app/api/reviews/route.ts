import { NextRequest, NextResponse } from 'next/server'

// Use global shared storage
if (!global.reviewsStore) {
  global.reviewsStore = [
    {
      id: '1',
      productId: '1',
      productName: 'Premium Cotton T-Shirt',
      rating: 5,
      comment: 'Amazing quality! Very comfortable and fits perfectly.',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      date: new Date().toISOString(),
      isNew: true
    },
    {
      id: '2',
      productId: '2',
      productName: 'Classic White Shirt',
      rating: 4,
      comment: 'Good quality shirt, exactly as described.',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      date: new Date(Date.now() - 86400000).toISOString(),
      isNew: true
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    if (productId) {
      const productReviews = global.reviewsStore.filter(review => review.productId === productId)
      return NextResponse.json({ success: true, data: productReviews })
    }
    
    return NextResponse.json({ success: true, data: global.reviewsStore })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, productName, rating, comment, customerName, customerEmail } = body
    
    const newReview = {
      id: Date.now().toString(),
      productId,
      productName,
      rating,
      comment,
      customerName: customerName || 'Anonymous',
      customerEmail,
      date: new Date().toISOString(),
      isNew: true
    }
    
    global.reviewsStore.unshift(newReview)
    
    return NextResponse.json({ success: true, data: newReview })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save review' }, { status: 500 })
  }
}