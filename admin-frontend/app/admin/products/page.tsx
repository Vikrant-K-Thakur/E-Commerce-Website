"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Package, Plus, Download, Filter, Search, Edit, Trash2, Eye, MoreHorizontal, AlertTriangle, X } from "lucide-react"



export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [error, setError] = useState("")
  const itemsPerPage = 6

  // Form states
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    sizes: []
  })
  const [availableSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
  const [selectedSizes, setSelectedSizes] = useState<{size: string, available: boolean}[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    try {
      setError('')
      
      // Basic validation
      if (!formData.productId || !formData.name || !formData.price) {
        setError('Please fill in all required fields (Product ID, Name, Price)')
        return
      }
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          ...formData,
          sizes: selectedSizes
        })
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Product added successfully!')
        fetchProducts()
        setShowAddDialog(false)
        resetForm()
      } else {
        setError(data.error || 'Failed to add product')
      }
    } catch (error) {
      console.error('Add product error:', error)
      setError('Failed to add product')
    }
  }

  const handleEditProduct = async () => {
    try {
      setError('')
      
      // Basic validation
      if (!formData.name || !formData.price) {
        setError('Please fill in all required fields (Name, Price)')
        return
      }
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: editingProduct.id,
          ...formData,
          sizes: selectedSizes
        })
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Product updated successfully!')
        fetchProducts()
        setShowEditDialog(false)
        resetForm()
      } else {
        setError(data.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Update product error:', error)
      setError('Failed to update product')
    }
  }

  const openEditDialog = (product: any) => {
    setEditingProduct(product)
    setFormData({
      productId: product.productId || '',
      name: product.name || '',
      price: product.price?.toString() || '',
      description: product.description || '',
      image: product.image || '',
      category: product.category || '',
      sizes: product.sizes || []
    })
    setSelectedSizes(product.sizes || [])
    setShowEditDialog(true)
  }

  const resetForm = () => {
    setFormData({
      productId: '',
      name: '',
      price: '',
      description: '',
      image: '',
      category: '',
      sizes: []
    })
    setSelectedSizes([])
    setError('')
    setEditingProduct(null)
  }

  const handleSizeToggle = (size: string, available: boolean) => {
    setSelectedSizes(prev => {
      const existing = prev.find(s => s.size === size)
      if (existing) {
        return prev.map(s => s.size === size ? { ...s, available } : s)
      } else {
        return [...prev, { size, available }]
      }
    })
  }

  const removeSizeFromSelection = (size: string) => {
    setSelectedSizes(prev => prev.filter(s => s.size !== size))
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || product.category?.toLowerCase() === filterType.toLowerCase()
    
    return matchesSearch && matchesType
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "Out of Stock") {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (status === "Low Stock") {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          Low Stock
        </Badge>
      )
    } else {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          In Stock
        </Badge>
      )
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Inventory</h1>
          <p className="text-gray-600 mt-1">Manage your products, track inventory, and update product information.</p>
        </div>
      </div>

      {/* Actions and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product catalog and inventory levels.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gray-300 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Product ID *</Label>
                        <Input
                          value={formData.productId}
                          onChange={(e) => setFormData({...formData, productId: e.target.value})}
                          placeholder="Enter unique product ID"
                        />
                      </div>
                      <div>
                        <Label>Product Name *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Enter product name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Price (coins) *</Label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          placeholder="Enter price in coins"
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          placeholder="Enter category"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Enter product description"
                      />
                    </div>
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div>
                      <Label>Sizes & Availability</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.map(size => (
                            <div key={size} className="flex items-center space-x-2">
                              <Checkbox
                                checked={selectedSizes.some(s => s.size === size)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleSizeToggle(size, true)
                                  } else {
                                    removeSizeFromSelection(size)
                                  }
                                }}
                              />
                              <span className="text-sm">{size}</span>
                            </div>
                          ))}
                        </div>
                        {selectedSizes.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Selected Sizes:</p>
                            {selectedSizes.map(({size, available}) => (
                              <div key={size} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{size}</span>
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={available}
                                    onCheckedChange={(checked) => handleSizeToggle(size, !!checked)}
                                  />
                                  <span className="text-xs">Available</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSizeFromSelection(size)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button onClick={handleAddProduct} className="w-full">
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products by name, ID, or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="home">Home</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PRODUCT ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">IMAGE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PRODUCT NAME</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">CATEGORY</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PRICE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">SIZES</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      Loading products...
                    </td>
                  </tr>
                ) : paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{product.productId}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">{product.category}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{product.price} coins</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {product.sizes?.map((sizeObj: any, index: number) => (
                            <Badge 
                              key={index} 
                              variant={sizeObj.available ? "default" : "secondary"}
                              className={sizeObj.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                              {sizeObj.size}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Sizes</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.reduce((acc, p) => acc + (p.sizes?.filter((s: any) => s.available).length || 0), 0)}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unavailable Sizes</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.reduce((acc, p) => acc + (p.sizes?.filter((s: any) => !s.available).length || 0), 0)}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(products.map(p => p.category).filter(Boolean)).size}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Product ID</Label>
                <Input
                  value={formData.productId}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label>Product Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (coins) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="Enter price in coins"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="Enter category"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter product description"
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <Label>Sizes & Availability</Label>
              <div className="space-y-2 mt-2">
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedSizes.some(s => s.size === size)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleSizeToggle(size, true)
                          } else {
                            removeSizeFromSelection(size)
                          }
                        }}
                      />
                      <span className="text-sm">{size}</span>
                    </div>
                  ))}
                </div>
                {selectedSizes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Sizes:</p>
                    {selectedSizes.map(({size, available}) => (
                      <div key={size} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{size}</span>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={available}
                            onCheckedChange={(checked) => handleSizeToggle(size, !!checked)}
                          />
                          <span className="text-xs">Available</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSizeFromSelection(size)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Button onClick={handleEditProduct} className="w-full">
              Update Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
