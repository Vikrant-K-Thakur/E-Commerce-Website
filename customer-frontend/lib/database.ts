export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  password?: string
  cartItems?: any[]
  created_at: Date
  updated_at: Date
}

export async function saveCustomer(data: {
  name: string
  email: string
  phone?: string
  address?: string
  password?: string
  cartItems?: any[]
}): Promise<void> {
  try {
    await fetch('/api/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  } catch (error) {
    console.error('Save customer failed:', error)
  }
}

export async function saveCart(email: string, cartItems: any[]): Promise<void> {
  try {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, cartItems })
    })
  } catch (error) {
    console.error('Save cart failed:', error)
  }
}

export async function getCart(email: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/cart?email=${email}`)
    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error('Get cart failed:', error)
    return []
  }
}

export async function getCustomer(email: string): Promise<Customer | null> {
  try {
    const response = await fetch(`/api/customer?email=${email}`)
    const result = await response.json()
    return result.success ? result.data : null
  } catch (error) {
    console.error('Get customer failed:', error)
    return null
  }
}

export async function saveWishlist(email: string, wishlistItems: any[]): Promise<void> {
  try {
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, wishlistItems })
    })
  } catch (error) {
    console.error('Save wishlist failed:', error)
  }
}

export async function getWishlist(email: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/wishlist?email=${email}`)
    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error('Get wishlist failed:', error)
    return []
  }
}