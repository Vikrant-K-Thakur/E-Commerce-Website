"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"

interface Product {
  id: string
  productId?: string
  name: string
  price: number
  image: string
  sizes?: any[]
  coins?: number
}

interface SizeSelectionDialogProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function SizeSelectionDialog({ product, isOpen, onClose }: SizeSelectionDialogProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const { addItem } = useCart()

  if (!product) return null

  const availableSizes = product.sizes?.filter((s: any) => {
    if (typeof s === 'string') return true
    return s.available !== false
  }) || []

  const handleAddToCart = () => {
    if (!selectedSize && availableSizes.length > 0) {
      alert("Please select a size")
      return
    }

    addItem({
      id: product.id,
      productId: product.productId,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize || undefined,
      coins: product.coins || 0
    })

    setSelectedSize("")
    onClose()
  }

  const handleClose = () => {
    setSelectedSize("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Size</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-sm">{product.name}</h3>
              <p className="text-sm font-semibold">₹{product.price}</p>
              {product.coins && product.coins > 0 && (
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full mt-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">₹</span>
                  </div>
                  <span className="text-xs text-blue-700 font-medium">
                    {product.coins} coins discount
                  </span>
                </div>
              )}
              {product.productId && (
                <Badge variant="outline" className="text-xs mt-1">
                  {product.productId}
                </Badge>
              )}
            </div>
          </div>

          {availableSizes.length > 0 ? (
            <div className="space-y-3">
              <label className="text-sm font-medium">Choose Size:</label>
              <div className="grid grid-cols-3 gap-2">
                {availableSizes.map((sizeObj: any, index: number) => {
                  const sizeValue = typeof sizeObj === 'string' ? sizeObj : sizeObj.size || sizeObj
                  return (
                    <Button
                      key={index}
                      variant={selectedSize === sizeValue ? "default" : "outline"}
                      className="h-10"
                      onClick={() => setSelectedSize(sizeValue)}
                    >
                      {sizeValue}
                    </Button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No sizes available for this product</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleAddToCart} 
              className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              disabled={availableSizes.length > 0 && !selectedSize}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}