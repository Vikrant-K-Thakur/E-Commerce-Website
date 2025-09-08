"use client"

import { useState } from "react"
import { Search, Filter, Grid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"

const searchResults = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.8,
    reviews: 124,
    image: "/premium-cotton-t-shirt.png",
    category: "Apparel",
  },
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.6,
    reviews: 89,
    image: "/wireless-earbuds.png",
    category: "Electronics",
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{searchResults.length} results found</p>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="p-4">
        <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
          {searchResults.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className={viewMode === "grid" ? "w-full h-40 object-cover" : "w-20 h-20 object-cover"}
                />
                {product.originalPrice > product.price && (
                  <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs">
                    Sale
                  </Badge>
                )}
              </div>
              <CardContent className="p-3 space-y-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                  <h3 className="font-medium text-sm line-clamp-2 text-balance">{product.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold">${product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>

                <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
