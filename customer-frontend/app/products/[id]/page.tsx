"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Share, Star, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProducts } from "@/lib/products"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
}

const reviews = [
  {
    id: 1,
    user: "Emily R.",
    rating: 5,
    date: "2023-11-20",
    comment: "These shoes are beautiful and comfortable. Perfect for daily wear!",
  },
  {
    id: 2,
    user: "David L.",
    rating: 4,
    date: "2023-11-15",
    comment: "Great quality, fits true to size. Very happy with my purchase.",
  },
  {
    id: 3,
    user: "Sarah K.",
    rating: 5,
    date: "2023-11-10",
    comment: "Absolutely love these! The comfort level is amazing and they look great.",
  },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    const products = await getProducts()
    const foundProduct = products.find(p => p.id === params.id)
    setProduct(foundProduct || null)
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        })
      }
    }
  }

  const handleWishlistToggle = () => {
    if (!product) return
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      })
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Product not found</p>
      </div>
    )
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleWishlistToggle}>
              <Heart className={`w-5 h-5 ${product && isInWishlist(product.id) ? 'text-red-500 fill-red-500' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="px-4 py-6">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground text-balance">{product.name}</h1>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-medium">4.5</span>
            </div>
            <span className="text-muted-foreground">(0 reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-foreground">${product.price}</span>
          </div>

          <Badge variant="secondary" className="bg-green-100 text-green-800">
            In Stock
          </Badge>
        </div>



        {/* Quantity */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Quantity</h3>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Description</h3>
          <p className="text-muted-foreground text-pretty">{product.description}</p>
        </div>


      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 bg-background border-t p-4 space-y-3">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 bg-transparent"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  )
}
