"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Heart } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { getProducts } from "@/lib/products"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { SizeSelectionDialog } from "@/components/size-selection-dialog"

interface Product {
  id: string
  productId?: string
  name: string
  price: number
  description: string
  image: string
  images?: string[]
  sizes?: any[]
  available?: boolean
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showSizeDialog, setShowSizeDialog] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  const handleAddToCart = (product: Product) => {
    if (product.available === false) {
      return // Don't allow adding unavailable products to cart
    }

    const availableSizes = product.sizes?.filter((s: any) => {
      if (typeof s === 'string') return true
      return s.available !== false
    }) || []

    if (availableSizes.length > 0) {
      setSelectedProduct(product)
      setShowSizeDialog(true)
    } else {
      addItem({
        id: product.id,
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: (product.images && product.images[0]) || product.image
      })
    }
  }

  const handleWishlistToggle = (product: Product) => {
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

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className={`overflow-hidden hover:shadow-lg transition-shadow bg-card border-border/50 ${
            product.available === false ? 'border-red-200 bg-red-50' : ''
          }`}>
            <div className="relative">
              <Link href={`/products/${product.id}`}>
                <img
                  src={(product.images && product.images[0]) || product.image || "/placeholder.svg"}
                  alt={product.name}
                  className={`w-full h-40 sm:h-48 object-cover ${
                    product.available === false ? 'opacity-60 grayscale' : ''
                  }`}
                />
              </Link>
              {product.available === false && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Not Available
                  </span>
                </div>
              )}
              <AuthGuard>
                <button 
                  className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background/90 transition-colors"
                  onClick={() => handleWishlistToggle(product)}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} />
                </button>
              </AuthGuard>
            </div>
            <CardContent className="p-3 space-y-2">
              <div className="space-y-1">
                <h3 className={`font-medium text-sm line-clamp-2 text-balance ${
                  product.available === false ? 'text-red-600' : 'text-foreground'
                }`}>{product.name}</h3>
                <p className={`text-xs line-clamp-2 ${
                  product.available === false ? 'text-red-400' : 'text-muted-foreground'
                }`}>{product.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`font-semibold ${
                  product.available === false ? 'text-red-600' : 'text-foreground'
                }`}>₹{product.price}</span>
                {product.available === false && (
                  <span className="text-xs text-red-500 font-medium">Unavailable</span>
                )}
              </div>

              <AuthGuard>
                <Button
                  size="sm"
                  className={`w-full ${
                    product.available === false 
                      ? 'bg-red-100 hover:bg-red-100 text-red-600 cursor-not-allowed' 
                      : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                  }`}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.available === false}
                >
                  {product.available === false ? 'Not Available' : 'Add to Cart'}
                </Button>
              </AuthGuard>
            </CardContent>
          </Card>
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No products available. Admin can add products from the admin panel.
          </div>
        )}
      </div>
      
      {selectedProduct && (
        <SizeSelectionDialog
          product={selectedProduct}
          isOpen={showSizeDialog}
          onClose={() => {
            setShowSizeDialog(false)
            setSelectedProduct(null)
          }}
        />
      )}
    </>
  )
}
