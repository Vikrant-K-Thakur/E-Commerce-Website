"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, ShoppingCart, Star, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useWishlist } from "@/contexts/wishlist-context"
import { useCart } from "@/contexts/cart-context"

export default function WishlistPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { items, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    })
  }

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
              {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
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
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <h3 className="font-medium text-sm line-clamp-2 text-balance">{item.name}</h3>

                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs text-muted-foreground">4.5 (0)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">₹{item.price}</span>
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add to Cart
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
