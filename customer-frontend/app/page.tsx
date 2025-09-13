"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { SearchBar } from "@/components/search-bar"
import { CategoryGrid } from "@/components/category-grid"
import { FeaturedProducts } from "@/components/featured-products"
import { HeroBanner } from "@/components/hero-banner"
import { BottomNavigation } from "@/components/bottom-navigation"
import { SizeSelectionDialog } from "@/components/size-selection-dialog"
import { getProducts } from "@/lib/products"
import { useCart } from "@/contexts/cart-context"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [sortBy, setSortBy] = useState("name")
  const { addToCart } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showSizeDialog, setShowSizeDialog] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      let filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      // Apply sorting
      filtered = filtered.sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name)
        if (sortBy === "price-low") return a.price - b.price
        if (sortBy === "price-high") return b.price - a.price
        return 0
      })
      
      setFilteredProducts(filtered)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
      setFilteredProducts([])
    }
  }, [searchQuery, products, sortBy])

  const clearSort = () => {
    setSortBy("name")
  }

  const fetchProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  const handleAddToCart = (product: any) => {
    const availableSizes = product.sizes?.filter((s: any) => {
      if (typeof s === 'string') return true
      return s.available !== false
    }) || []

    if (availableSizes.length > 0) {
      setSelectedProduct(product)
      setShowSizeDialog(true)
    } else {
      addToCart({
        id: product.id,
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b lg:hidden">
        <SearchBar />
      </div>

      {/* Desktop Search Bar - Only visible on laptop/desktop */}
      <div className="hidden lg:block sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-8 py-4">
          <div className="max-w-4xl mx-auto flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="pl-12 pr-4 h-12 text-base bg-muted/50 border-0 focus-visible:ring-2"
              />
            </div>
            
            {/* Desktop Sort */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sort - Only show when searching */}
      {showSearchResults && (
        <div className="lg:hidden sticky top-16 z-30 bg-background/95 backdrop-blur border-b p-4">
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setSearchQuery("")
                clearSort()
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20 lg:pb-8">
        {/* Search Results - Only show when searching */}
        {showSearchResults && (
          <section className="px-4 py-6 lg:px-8">
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-2">
                Search Results
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} products found for "{searchQuery}"
                </p>
{sortBy !== "name" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearSort}
                    className="text-xs"
                  >
                    Clear Sort
                  </Button>
                )}
              </div>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-40 lg:h-48 object-cover"
                      />
                    </div>
                    <CardContent className="p-3 space-y-2">
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{product.price} coins</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your search.</p>
              </div>
            )}
          </section>
        )}

        {/* Show normal content when not searching */}
        {!showSearchResults && (
          <>
            {/* Hero Banner with Video */}
            <HeroBanner />

            {/* Categories */}
            <section className="px-4 py-6 lg:px-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-4 lg:mb-6">Shop by Style</h2>
              <CategoryGrid />
            </section>

            {/* Featured Products */}
            <section className="px-4 py-6 lg:px-8">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">Featured Products</h2>
                <Link href="/shirts">
                  <button className="text-sm text-secondary font-medium hover:text-secondary/80 transition-colors">
                    View All Products
                  </button>
                </Link>
              </div>
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-muted animate-pulse rounded-lg h-64"></div>
                    ))}
                  </div>
                }
              >
                <FeaturedProducts />
              </Suspense>
            </section>
          </>
        )}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation />
      
      <SizeSelectionDialog
        product={selectedProduct}
        isOpen={showSizeDialog}
        onClose={() => {
          setShowSizeDialog(false)
          setSelectedProduct(null)
        }}
      />
    </div>
  )
}
