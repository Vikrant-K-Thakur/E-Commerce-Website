"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Grid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNavigation } from "@/components/bottom-navigation"
import { getProducts } from "@/lib/products"
import { useCart } from "@/contexts/cart-context"

export default function ViewAllProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [sortBy, setSortBy] = useState("name")
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort products
    filtered = filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      return 0
    })

    setFilteredProducts(filtered)
  }, [searchQuery, products, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="p-4 lg:px-8 lg:py-6 space-y-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">View All Products</h1>
            <p className="text-sm lg:text-base text-muted-foreground mt-1">
              Discover our complete collection of premium products
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10 lg:pl-12 h-10 lg:h-12 text-sm lg:text-base"
              />
            </div>
            
            <div className="flex gap-2 lg:gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 lg:w-48 h-10 lg:h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="h-10 lg:h-12 w-10 lg:w-12">
                <Filter className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${filteredProducts.length} products found`}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse rounded-lg h-64 lg:h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-40 lg:h-48 object-cover"
                  />
                </div>
                <CardContent className="p-3 lg:p-4 space-y-2 lg:space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm lg:text-base line-clamp-2">{product.name}</h3>
                    <p className="text-xs lg:text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm lg:text-base">₹{product.price}</span>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs lg:text-sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12 lg:py-16">
            <p className="text-muted-foreground text-sm lg:text-base">No products found matching your search.</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}