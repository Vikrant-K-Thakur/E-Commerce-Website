"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Package, Edit } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Product {
  id: string
  productId?: string
  name: string
  price: number
  description: string
  image: string
  category?: string
  sizes?: string[]
  created_at: Date
}

export default function AddProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    price: '',
    description: '',
    images: [''],
    category: '',
    sizes: '',
    available: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')

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
    setError('')

    try {
      const sizesArray = formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : []
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingProduct ? 'update' : 'add',
          id: editingProduct?.id,
          productId: formData.productId,
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          images: formData.images.filter(img => img.trim()),
          category: formData.category,
          sizes: sizesArray,
          available: formData.available
        })
      })

      const result = await response.json()
      if (result.success) {
        setFormData({ productId: '', name: '', price: '', description: '', images: [''], category: '', sizes: '', available: true })
        setEditingProduct(null)
        fetchProducts()
        toast({
          title: editingProduct ? "Product updated successfully" : "Product added successfully",
          description: editingProduct ? "The product has been updated." : "The product has been added to your catalog."
        })
      } else {
        setError(result.error || 'Operation failed')
        toast({
          title: "Error",
          description: result.error || 'Operation failed',
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to save product:', error)
      setError('Failed to save product')
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      })
    }

    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        fetchProducts()
        toast({
          title: "Product deleted",
          description: "The product has been removed from your catalog."
        })
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      productId: product.productId || '',
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      images: product.images || [product.image || ''],
      category: product.category || '',
      sizes: product.sizes?.join(', ') || '',
      available: product.available !== false
    })
    setError('')
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setFormData({ productId: '', name: '', price: '', description: '', images: [''], category: '', sizes: '', available: true })
    setError('')
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

      {/* Add/Edit Product Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Product ID *</label>
                <Input
                  value={formData.productId}
                  onChange={(e) => setFormData({...formData, productId: e.target.value})}
                  placeholder="Enter unique product ID (e.g., PROD001)"
                  required
                  disabled={!!editingProduct}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editingProduct ? 'Product ID cannot be changed' : 'Must be unique across all products'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Product Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter product name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Price (rupee) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="Enter product category"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter product description"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Image URLs *</label>
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={image}
                      onChange={(e) => {
                        const newImages = [...formData.images]
                        newImages[index] = e.target.value
                        setFormData({...formData, images: newImages})
                      }}
                      placeholder={`Enter image URL ${index + 1}`}
                      required={index === 0}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index)
                          setFormData({...formData, images: newImages})
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({...formData, images: [...formData.images, '']})}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Image
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Sizes (optional)</label>
                <Input
                  value={formData.sizes}
                  onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                  placeholder="Enter sizes separated by commas (e.g., S, M, L, XL)"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Availability</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="available"
                      checked={formData.available === true}
                      onChange={() => setFormData({...formData, available: true})}
                      className="text-green-600"
                    />
                    <span className="text-sm text-green-600">Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="available"
                      checked={formData.available === false}
                      onChange={() => setFormData({...formData, available: false})}
                      className="text-red-600"
                    />
                    <span className="text-sm text-red-600">Not Available</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {editingProduct ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {isLoading ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
              </Button>
              {editingProduct && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
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
                  <TableHead className="text-gray-600">Product ID</TableHead>
                  <TableHead className="text-gray-600">Name</TableHead>
                  <TableHead className="text-gray-600">Price</TableHead>
                  <TableHead className="text-gray-600">Category</TableHead>
                  <TableHead className="text-gray-600">Status</TableHead>
                  <TableHead className="text-gray-600">Description</TableHead>
                  <TableHead className="text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {product.productId || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">{product.price} ₹</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{product.category || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.available !== false ? "default" : "destructive"}
                        className={product.available !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {product.available !== false ? 'Available' : 'Not Available'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600">{product.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
          {editingProduct && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Editing:</strong> {editingProduct.name} (ID: {editingProduct.productId || 'N/A'})
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}