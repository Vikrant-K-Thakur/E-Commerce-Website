"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Share, Star, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock product data
const product = {
  id: 1,
  name: "UltraBoost Running Shoes",
  price: 129.99,
  originalPrice: 159.99,
  rating: 4.8,
  reviews: 234,
  images: ["/premium-running-shoes-front-view.jpg", "/premium-running-shoes-side-view.jpg", "/premium-running-shoes-back-view.jpg"],
  description:
    "Experience ultimate comfort and performance with our premium running shoes. Featuring advanced cushioning technology and breathable materials.",
  features: ["Advanced cushioning technology", "Breathable mesh upper", "Durable rubber outsole", "Lightweight design"],
  sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11"],
  colors: ["Black", "White", "Navy", "Gray"],
  inStock: true,
  stockCount: 15,
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)

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
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="px-4 py-6">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={product.images[selectedImageIndex] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.originalPrice > product.price && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">Sale</Badge>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  selectedImageIndex === index ? "border-secondary" : "border-border"
                }`}
              >
                <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
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
              <span className="font-medium">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-foreground">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>

          {product.inStock ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              In Stock ({product.stockCount} left)
            </Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>

        {/* Size Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Size</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-border bg-background text-foreground hover:border-secondary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Color</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedColor === color
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-border bg-background text-foreground hover:border-secondary"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
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
          <ul className="space-y-1">
            {product.features.map((feature, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 bg-secondary rounded-full"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Customer Reviews</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {reviews.slice(0, 2).map((review) => (
              <Card key={review.id} className="bg-card/50">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{review.user}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-pretty">{review.comment}</p>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 bg-background border-t p-4 space-y-3">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent">
            Add to Cart
          </Button>
          <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground">Buy Now</Button>
        </div>
      </div>
    </div>
  )
}
