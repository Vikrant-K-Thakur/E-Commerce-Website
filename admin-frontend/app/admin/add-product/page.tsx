"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  created_at: Date
}

export default function AddProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const result = await response.json()
      if (result.success) {
        setProducts(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          image: formData.image
        })
      })

      const result = await response.json()
      if (result.success) {
        setFormData({ name: '', price: '', description: '', image: '' })
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to add product:', error)
    }

    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Add and manage your product catalog</p>
          </div>
        </div>
      </div>

      {/* Add Product Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Product Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Price (coins)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter product description"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Image URL</label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="Enter image URL"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              {isLoading ? 'Adding...' : 'Add Product'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Existing Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600">Image</TableHead>
                  <TableHead className="text-gray-600">Name</TableHead>
                  <TableHead className="text-gray-600">Price</TableHead>
                  <TableHead className="text-gray-600">Description</TableHead>
                  <TableHead className="text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">{product.price} coins</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600">{product.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found. Add your first product above.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}