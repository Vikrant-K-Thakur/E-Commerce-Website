"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, ShoppingCart, Star, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const wishlistItems = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.5,
    reviews: 128,
    image: "/wireless-earbuds.png",
    inStock: true,
  },
  {
    id: 2,
    name: "Laptop Sleeve",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.3,
    reviews: 67,
    image: "/placeholder.svg?height=120&width=120&text=Sleeve",
    inStock: true,
  },
  {
    id: 3,
    name: "Premium Headphones",
    price: 199.99,
    rating: 4.8,
    reviews: 245,
    image: "/placeholder.svg?height=120&width=120&text=Headphones",
    inStock: false,
  },
]

export default function WishlistPage() {
  const [items, setItems] = useState(wishlistItems)
  const [searchQuery, setSearchQuery] = useState("")

  const removeFromWishlist = (id: number) => {
    setItems((items) => items.filter((item) => item.id !== id))
  }

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">My Wishlist</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wishlist..."
            className="pl-10"
          />
        </div>

        {/* Wishlist Items */}
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} •{" "}
              {filteredItems.filter((item) => item.inStock).length} in stock
            </p>

            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-32 object-cover" />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full"
                    >
                      <Heart className="w-4 h-4 text-destructive fill-destructive" />
                    </button>
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <h3 className="font-medium text-sm line-clamp-2 text-balance">{item.name}</h3>

                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs text-muted-foreground">
                        {item.rating} ({item.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">${item.price}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-muted-foreground line-through">${item.originalPrice}</span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      disabled={!item.inStock}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No items match your search." : "Save items you love to your wishlist."}
            </p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
