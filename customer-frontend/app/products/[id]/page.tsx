"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Share, Star, Plus, Minus, ZoomIn, Ruler, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { getProducts } from "@/lib/products"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

interface Product {
  id: string
  productId?: string
  name: string
  price: number
  description: string
  image: string
  images?: string[]
  category?: string
  sizes?: any[]
  coins?: number
}

const sizeGuide = {
  "XS": { chest: "32-34", waist: "26-28", length: "26" },
  "S": { chest: "34-36", waist: "28-30", length: "27" },
  "M": { chest: "36-38", waist: "30-32", length: "28" },
  "L": { chest: "38-40", waist: "32-34", length: "29" },
  "XL": { chest: "40-42", waist: "34-36", length: "30" },
  "XXL": { chest: "42-44", waist: "36-38", length: "31" }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    if (product) {
      fetchReviews()
    }
  }, [product])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${params.id}`)
      const result = await response.json()
      if (result.success) {
        setReviews(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    }
  }

  const handleSubmitReview = async () => {
    if (newReview.comment.trim() && product) {
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            productName: product.name,
            rating: newReview.rating,
            comment: newReview.comment,
            customerName: 'Customer',
            customerEmail: 'customer@example.com'
          })
        })
        
        const result = await response.json()
        if (result.success) {
          setReviews([result.data, ...reviews])
          setNewReview({ rating: 5, comment: "" })
        }
      } catch (error) {
        console.error('Failed to submit review:', error)
      }
    }
  }
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
    if (!product) return
    
    const availableSizes = product.sizes?.filter((s: any) => {
      if (typeof s === 'string') return true
      return s.available !== false
    }) || []

    if (availableSizes.length > 0 && !selectedSize) {
      alert("Please select a size")
      return
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: (product.images && product.images[0]) || product.image,
        size: selectedSize || undefined,
        coins: product.coins || 0,
        codAvailable: product.codAvailable !== false
      })
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
        image: (product.images && product.images[0]) || product.image
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
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
            <img
              src={(product.images && product.images[currentImageIndex]) || product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="secondary" onClick={() => setIsZoomed(true)}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-semibold text-primary">4.5</span>
            </div>
            <span className="text-muted-foreground">({reviews.length} reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-foreground">₹{product.price}</span>
          </div>

          {product.coins && product.coins > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">₹</span>
                </div>
                <span className="font-semibold text-blue-800">Coins Discount Available!</span>
              </div>
              <p className="text-sm text-blue-700">
                Use <span className="font-bold">{product.coins} coins</span> to get <span className="font-bold">₹{product.coins} off</span> on this product
              </p>
              <p className="text-xs text-blue-600 mt-1">
                💡 Add to cart to apply coins discount during checkout
              </p>
            </div>
          )}

          <Badge variant="secondary" className="bg-green-100 text-green-800">
            In Stock
          </Badge>
        </div>



        {/* Quantity */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Quantity</h3>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl border-2 hover:border-primary"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-5 h-5" />
            </Button>
            <div className="bg-muted/50 px-6 py-3 rounded-xl min-w-[60px] text-center">
              <span className="text-xl font-semibold">{quantity}</span>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-xl border-2 hover:border-primary"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Product Details */}
        {product.category && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Category</h3>
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium rounded-full">{product.category}</Badge>
          </div>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Select Size</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSizeGuide(true)}>
                <Ruler className="w-4 h-4 mr-1" />
                Size Guide
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.sizes
                .filter((s: any) => {
                  if (typeof s === 'string') return true
                  return s.available !== false
                })
                .map((sizeObj: any, index: number) => {
                  const sizeValue = typeof sizeObj === 'string' ? sizeObj : sizeObj.size || sizeObj
                  return (
                    <Button
                      key={index}
                      variant={selectedSize === sizeValue ? "default" : "outline"}
                      className={`h-12 rounded-xl border-2 font-semibold transition-all ${
                        selectedSize === sizeValue 
                          ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105' 
                          : 'hover:border-primary hover:scale-105'
                      }`}
                      onClick={() => setSelectedSize(sizeValue)}
                    >
                      {sizeValue}
                    </Button>
                  )
                })
              }
            </div>
          </div>
        )}

        {product.productId && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Product ID</h3>
            <Badge variant="secondary" className="font-mono text-sm px-4 py-2 rounded-full bg-muted/50">
              {product.productId}
            </Badge>
          </div>
        )}

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Description</h3>
          <div className="bg-muted/30 p-4 rounded-xl">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Customer Reviews</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowReviews(true)}>
              <MessageCircle className="w-4 h-4 mr-1" />
              {reviews.length > 0 ? `View All (${reviews.length})` : 'Write Review'}
            </Button>
          </div>
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.slice(0, 2).map((review) => (
                <Card key={review.id} className="p-4 border-l-4 border-l-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <span className="font-medium">{review.customerName}</span>
                    <span className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center border-dashed border-2">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-3">No reviews yet. Be the first to review this product!</p>
              <Button variant="outline" onClick={() => setShowReviews(true)}>
                Write First Review
              </Button>
            </Card>
          )}
        </div>

      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border/50 p-4 space-y-3">
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1 h-14 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all"
            onClick={handleAddToCart}
            disabled={product?.sizes?.length > 0 && !selectedSize}
          >
            Add to Cart
          </Button>
          <Button className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all">
            Buy Now
          </Button>
        </div>
      </div>

      {/* Image Zoom Dialog */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-black/95">
          <div className="relative w-full h-full min-h-[70vh]">
            <img
              src={(product?.images && product.images[currentImageIndex]) || product?.image || "/placeholder.svg"}
              alt={product?.name}
              className="w-full h-full object-contain"
            />
            {product?.images && product.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-black/70 backdrop-blur-sm p-3 rounded-full">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-4 h-4 rounded-full transition-all ${
                      currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Size Guide Dialog */}
      <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Size Guide
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3 text-sm font-semibold bg-primary/10 p-3 rounded-lg">
              <div>Size</div>
              <div>Chest</div>
              <div>Waist</div>
              <div>Length</div>
            </div>
            {Object.entries(sizeGuide).map(([size, measurements]) => (
              <div key={size} className="grid grid-cols-4 gap-3 text-sm py-2 border-b border-muted last:border-0">
                <div className="font-semibold text-primary">{size}</div>
                <div>{measurements.chest}"</div>
                <div>{measurements.waist}"</div>
                <div>{measurements.length}"</div>
              </div>
            ))}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">📏 How to Measure:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Chest: Measure around the fullest part</p>
                <p>• Waist: Measure around your natural waistline</p>
                <p>• Length: From shoulder to hem</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reviews Dialog */}
      <Dialog open={showReviews} onOpenChange={setShowReviews}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Customer Reviews
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Add Review Form */}
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-l-primary">
              <h4 className="font-semibold mb-4 text-lg">Write a Review</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-medium">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= newReview.rating ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary/50'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Share your experience with this product..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="min-h-[100px] resize-none"
                />
                <Button 
                  className="w-full h-12 font-semibold"
                  onClick={handleSubmitReview}
                  disabled={!newReview.comment.trim()}
                >
                  Submit Review
                </Button>
              </div>
            </Card>

            {/* Existing Reviews */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">All Reviews ({reviews.length})</h4>
                {reviews.map((review) => (
                  <Card key={review.id} className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                      <span className="font-semibold">{review.customerName}</span>
                      <span className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">No reviews yet</p>
                <p className="text-sm text-muted-foreground">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
