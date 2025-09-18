export interface Product {
  id: string
  productId?: string
  name: string
  price: number
  description: string
  image: string
  images?: string[]
  category?: string
  sizes?: string[]
  coins?: number
  available?: boolean
  created_at: Date
  updated_at: Date
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products')
    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error('Get products failed:', error)
    return []
  }
}

export async function addProduct(product: {
  name: string
  price: number
  description: string
  image: string
}): Promise<Product | null> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
    const result = await response.json()
    return result.success ? result.data : null
  } catch (error) {
    console.error('Add product failed:', error)
    return null
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Delete product failed:', error)
    return false
  }
}
