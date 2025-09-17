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
    return NextResponse.json({ success: true, data: global.reviewsStore })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    
    const reviewIndex = global.reviewsStore.findIndex(review => review.id === id)
    if (reviewIndex !== -1) {
      global.reviewsStore[reviewIndex].isNew = false
      return NextResponse.json({ success: true, data: global.reviewsStore[reviewIndex] })
    }
    
    return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 })
  }
}