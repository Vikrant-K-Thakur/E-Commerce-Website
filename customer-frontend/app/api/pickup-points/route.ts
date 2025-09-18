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

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c // Distance in kilometers
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userLat = searchParams.get('lat')
    const userLon = searchParams.get('lon')
    
    const db = await connectDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' })
    }

    // Get all active pickup points
    const pickupPoints = await db.collection('pickupPoints')
      .find({ isActive: true })
      .sort({ created_at: -1 })
      .toArray()
    
    let transformedPoints = pickupPoints.map(point => ({
      id: point._id.toString(),
      name: point.name,
      address: point.address,
      latitude: point.latitude,
      longitude: point.longitude,
      contactPhone: point.contactPhone,
      timings: point.timings,
      distance: null as number | null
    }))

    // Calculate distances if user coordinates provided
    if (userLat && userLon) {
      const userLatNum = parseFloat(userLat)
      const userLonNum = parseFloat(userLon)
      
      transformedPoints = transformedPoints.map(point => ({
        ...point,
        distance: calculateDistance(userLatNum, userLonNum, point.latitude, point.longitude)
      }))
      
      // Sort by distance (nearest first)
      transformedPoints.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      
      // Check if user is within delivery range (1km from nearest pickup point)
      const nearestDistance = transformedPoints[0]?.distance || Infinity
      const canDeliver = nearestDistance <= 1.0
      
      return NextResponse.json({ 
        success: true, 
        data: transformedPoints,
        canDeliver,
        nearestDistance: Math.round(nearestDistance * 100) / 100 // Round to 2 decimal places
      })
    }

    return NextResponse.json({ success: true, data: transformedPoints })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}