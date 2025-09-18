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

// Fast distance calculation using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Quick check for same coordinates
  if (lat1 === lat2 && lon1 === lon2) return 0
  
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * 0.017453292519943295 // Math.PI/180
  const dLon = (lon2 - lon1) * 0.017453292519943295
  const lat1Rad = lat1 * 0.017453292519943295
  const lat2Rad = lat2 * 0.017453292519943295
  
  const a = Math.sin(dLat * 0.5) * Math.sin(dLat * 0.5) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(dLon * 0.5) * Math.sin(dLon * 0.5)
  
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 100) / 100
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
      
      // Quick coordinate validation
      if (isNaN(userLatNum) || isNaN(userLonNum)) {
        return NextResponse.json({ success: false, error: 'Invalid coordinates' })
      }
      
      transformedPoints = transformedPoints.map(point => ({
        ...point,
        distance: isNaN(point.latitude) || isNaN(point.longitude) ? null :
                 calculateDistance(userLatNum, userLonNum, point.latitude, point.longitude)
      }))
      
      // Sort by distance (valid points first)
      transformedPoints.sort((a, b) => {
        if (a.distance === null) return 1
        if (b.distance === null) return -1
        return a.distance - b.distance
      })
      
      // Check delivery eligibility
      const nearestDistance = transformedPoints[0]?.distance
      const canDeliver = nearestDistance !== null && nearestDistance <= 1.0
      
      return NextResponse.json({ 
        success: true, 
        data: transformedPoints,
        canDeliver,
        nearestDistance
      })
    }

    return NextResponse.json({ success: true, data: transformedPoints })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'Operation failed' })
  }
}