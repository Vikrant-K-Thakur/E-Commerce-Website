"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Package, Plus, Download, Filter, Search, Edit, Trash2, Eye, MoreHorizontal, AlertTriangle } from "lucide-react"

const productData = [
  {
    id: "PRO001",
    name: "Voyager Tote",
    type: "Bag",
    price: 139.95,
    colors: ["Black", "Navy"],
    style: "Luxury",
    category: "Urban",
    barcode: "1234567890123",
    stock: 45,
    status: "In Stock",
    image: "/black-tote-bag.jpg",
  },
  {
    id: "PRO002",
    name: "Timeless Chronos",
    type: "Watch",
    price: 299.0,
    colors: ["Silver", "Gold"],
    style: "Classic",
    category: "Formal",
    barcode: "9876543210987",
    stock: 23,
    status: "In Stock",
    image: "/luxury-watch.jpg",
  },
  {
    id: "PRO003",
    name: "Stride Runner",
    type: "Shoes",
    price: 120.5,
    colors: ["White", "Grey"],
    style: "Athletic",
    category: "Casual",
    barcode: "1122334455668",
    stock: 8,
    status: "Low Stock",
    image: "/running-shoes-on-track.png",
  },
  {
    id: "PRO004",
    name: "Lighthouse Desk Lamp",
    type: "Lamp",
    price: 75.0,
    colors: ["Black", "White"],
    style: "Minimalist",
    category: "Modern",
    barcode: "0098765432109",
    stock: 67,
    status: "In Stock",
    image: "/modern-desk-lamp.png",
  },
  {
    id: "PRO005",
    name: "Pixel Pro Camera",
    type: "Electronics",
    price: 450.0,
    colors: ["Silver", "Graphite"],
    style: "Retro",
    category: "Professional",
    barcode: "2207654321098",
    stock: 0,
    status: "Out of Stock",
    image: "/vintage-camera-still-life.png",
  },
  {
    id: "PRO006",
    name: "Acoustic Bliss Headphones",
    type: "Audio",
    price: 150.0,
    colors: ["Red", "Blue"],
    style: "Wireless",
    category: "Comfort",
    barcode: "9988776655443",
    stock: 34,
    status: "In Stock",
    image: "/diverse-people-listening-headphones.png",
  },
]

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredProducts = productData.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm)
    const matchesType = filterType === "all" || product.type.toLowerCase() === filterType.toLowerCase()
    const matchesStatus =
      filterStatus === "all" || product.status.toLowerCase().replace(" ", "") === filterStatus.toLowerCase()

    return matchesSearch && matchesType && matchesStatus
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
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
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
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bag">Bag</SelectItem>
                <SelectItem value="watch">Watch</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="lamp">Lamp</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="instock">In Stock</SelectItem>
                <SelectItem value="lowstock">Low Stock</SelectItem>
                <SelectItem value="outofstock">Out of Stock</SelectItem>
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
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">TYPE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PRICE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">COLORS</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STYLE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">BARCODE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STOCK</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{product.id}</span>
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
                      <span className="text-gray-600">{product.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">${product.price.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        {product.colors.map((color, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {product.style}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 font-mono text-sm">{product.barcode}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{product.stock}</span>
                        {product.stock <= 10 && product.stock > 0 && (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        )}
                        {product.stock === 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="mt-1">{getStatusBadge(product.status, product.stock)}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Duplicate Product</DropdownMenuItem>
                            <DropdownMenuItem>Update Stock</DropdownMenuItem>
                            <DropdownMenuItem>Add to Sale</DropdownMenuItem>
                            <DropdownMenuItem>View Analytics</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
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
                <p className="text-2xl font-bold text-gray-900">{productData.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {productData.filter((p) => p.status === "In Stock").length}
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
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">
                  {productData.filter((p) => p.status === "Low Stock").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {productData.filter((p) => p.status === "Out of Stock").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
