"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, Trash2, Tag, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, totalPrice, totalItems, clearCart } = useCart()
  const { user } = useAuth()
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [walletBalance, setWalletBalance] = useState(0)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  useEffect(() => {
    if (user?.email) {
      fetchAvailableCoupons()
      fetchWalletBalance()
    }
  }, [user?.email])

  const fetchAvailableCoupons = async () => {
    try {
      const response = await fetch(`/api/rewards?email=${user?.email}`)
      const data = await response.json()
      if (data.success) {
        const validCoupons = data.data.filter((reward: any) => 
          reward.type === 'discount' && 
          !reward.isUsed && 
          new Date(reward.expiresAt) > new Date()
        )
        setAvailableCoupons(validCoupons)
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
    }
  }

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`/api/wallet/add-funds?email=${user?.email}`)
      const data = await response.json()
      if (data.success) {
        setWalletBalance(data.data.coinBalance)
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error)
    }
  }

  const applyCoupon = (coupon: any) => {
    setAppliedCoupon(coupon)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const discount = appliedCoupon ? (totalPrice * appliedCoupon.value / 100) : 0
  const total = totalPrice - discount

  const placeOrder = async () => {
    if (!user?.email) return
    
    if (walletBalance < total) {
      alert(`Insufficient wallet balance. You need ${total - walletBalance} more coins. Please add funds to your wallet.`)
      return
    }

    setIsPlacingOrder(true)
    try {
      const orderData = {
        email: user.email,
        items: cartItems.map(item => ({
          id: item.id,
          productId: item.productId || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || 'N/A',
          image: item.image
        })),
        totalAmount: total
      }
      
      if (discount > 0) {
        orderData.discountAmount = discount
      }
      
      if (appliedCoupon?._id) {
        orderData.couponId = appliedCoupon._id
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()
      if (data.success) {
        alert(`Order placed successfully! Order ID: ${data.orderId}`)
        clearCart()
        setAppliedCoupon(null)
        setWalletBalance(data.newBalance)
      } else {
        if (data.error === 'Insufficient wallet balance') {
          alert(`Insufficient wallet balance. You need ${data.requiredAmount - data.currentBalance} more coins. Please add funds to your wallet.`)
        } else {
          alert('Failed to place order: ' + data.error)
        }
      }
    } catch (error) {
      console.error('Failed to place order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
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
          <h1 className="text-lg font-semibold">Your Cart</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Cart Items ({totalItems})</h2>
            </div>

            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-muted"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm line-clamp-2 text-balance">{item.name}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.price} coins</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Link href="/">
              <Button className="mt-4">Continue Shopping</Button>
            </Link>
          </div>
        )}

        {/* Coupon Section */}
        {cartItems.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-secondary" />
                <span className="font-medium">Available Discount Coupons</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {appliedCoupon.value}% OFF
                    </Badge>
                    <span className="text-sm text-green-700">{appliedCoupon.description}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-green-700">
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableCoupons.length > 0 ? (
                    availableCoupons.map((coupon) => (
                      <div key={coupon._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{coupon.value}% OFF</Badge>
                          <span className="text-sm">{coupon.description}</span>
                        </div>
                        <Button size="sm" onClick={() => applyCoupon(coupon)}>
                          Apply
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No discount coupons available</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Order Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{totalPrice.toFixed(2)} coins</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon?.value}%)</span>
                    <span>-{discount.toFixed(2)} coins</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-base">
                  <span>Total Amount</span>
                  <span>{total.toFixed(2)} coins</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Wallet Balance</span>
                  </div>
                  <span className="font-semibold text-blue-600">{walletBalance.toFixed(2)} coins</span>
                </div>
                
                {walletBalance < total && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700">
                      Insufficient balance. You need {(total - walletBalance).toFixed(2)} more coins.
                    </p>
                    <Link href="/wallet">
                      <Button size="sm" className="mt-2">
                        Add Funds
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              <Button 
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
                onClick={placeOrder}
                disabled={isPlacingOrder || walletBalance < total}
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}