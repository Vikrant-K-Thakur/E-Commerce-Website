"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, Trash2, Tag, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, totalPrice, totalItems, clearCart } = useCart()
  const { user } = useAuth()
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [sessionUsedCoupons, setSessionUsedCoupons] = useState<string[]>([])
  const [walletBalance, setWalletBalance] = useState(0)
  const [usedCoinsPerItem, setUsedCoinsPerItem] = useState<{[key: string]: boolean}>({})
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'online' | 'cod'>('online')
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<any>(null)
  const [pickupPoints, setPickupPoints] = useState<any[]>([])
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null)
  const [canDeliver, setCanDeliver] = useState(true)
  const [nearestDistance, setNearestDistance] = useState<number | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)

  useEffect(() => {
    if (user?.email) {
      loadSessionUsedCoupons()
      fetchWalletBalance()
      fetchPickupPoints()
      getUserLocation()
    }
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [user?.email])

  // Fetch coupons when sessionUsedCoupons changes
  useEffect(() => {
    if (user?.email) {
      fetchAvailableCoupons()
    }
  }, [user?.email, sessionUsedCoupons, appliedCoupon])

  // Cleanup session data when component unmounts or user changes
  useEffect(() => {
    return () => {
      // Only clear if there's an applied coupon that wasn't used in a successful order
      if (appliedCoupon && user?.email) {
        const currentUsedCoupons = JSON.parse(localStorage.getItem(`usedCoupons_${user.email}`) || '[]')
        const updatedUsedCoupons = currentUsedCoupons.filter((id: string) => id !== appliedCoupon._id)
        if (updatedUsedCoupons.length !== currentUsedCoupons.length) {
          localStorage.setItem(`usedCoupons_${user.email}`, JSON.stringify(updatedUsedCoupons))
        }
      }
    }
  }, [appliedCoupon, user?.email])

  const loadSessionUsedCoupons = () => {
    try {
      const stored = localStorage.getItem(`usedCoupons_${user?.email}`)
      if (stored) {
        setSessionUsedCoupons(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load session used coupons:', error)
    }
  }

  const saveSessionUsedCoupons = (coupons: string[]) => {
    try {
      localStorage.setItem(`usedCoupons_${user?.email}`, JSON.stringify(coupons))
      setSessionUsedCoupons(coupons)
    } catch (error) {
      console.error('Failed to save session used coupons:', error)
    }
  }

  const fetchAvailableCoupons = async () => {
    try {
      const response = await fetch(`/api/rewards?email=${user?.email}`)
      const data = await response.json()
      if (data.success) {
        const validCoupons = data.data.filter((reward: any) => 
          reward.type === 'discount' && 
          !reward.isUsed && // Never show used coupons from database
          !sessionUsedCoupons.includes(reward._id) && // Never show session used coupons
          new Date(reward.expiresAt) > new Date() &&
          (!appliedCoupon || reward._id !== appliedCoupon._id) // Exclude currently applied coupon
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

  const getUserLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }

          setUserLocation(location)
          fetchPickupPoints(location)
          setLocationLoading(false)
        },
        (error) => {
          console.error('Location access denied:', error)
          alert('Location access denied. Showing all pickup points without distance calculation.')
          fetchPickupPoints()
          setLocationLoading(false)
        },
        {
          enableHighAccuracy: false, // Faster, less accurate
          timeout: 5000, // 5 seconds instead of 10
          maximumAge: 600000 // 10 minutes cache
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
      fetchPickupPoints()
      setLocationLoading(false)
    }
  }

  const fetchPickupPoints = async (location?: {lat: number, lon: number}) => {
    try {
      const params = location ? `?lat=${location.lat}&lon=${location.lon}` : ''
      const response = await fetch(`/api/pickup-points${params}`)
      const data = await response.json()
      
      if (data.success) {
        setPickupPoints(data.data)
        setCanDeliver(data.canDeliver !== false)
        setNearestDistance(data.nearestDistance || null)
        
        // Auto-select nearest pickup point if available
        if (data.data.length > 0 && data.canDeliver !== false) {
          setSelectedPickupPoint(data.data[0])
        }
      } else {
        console.error('API Error:', data.error)
        alert('Failed to load pickup points: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to fetch pickup points:', error)
      alert('Failed to load pickup points. Please try again.')
    }
  }



  const applyCoupon = (coupon: any) => {
    const confirmed = confirm(
      `Apply ${coupon.value}% discount coupon?\n\n` +
      `Important: Once you place an order with this coupon, it will be permanently used and cannot be reused, even if you cancel the order later.\n\n` +
      `Do you want to continue?`
    )
    
    if (confirmed) {
      setAppliedCoupon(coupon)
      // Mark coupon as used in session to prevent reuse even after refresh
      const updatedUsedCoupons = [...sessionUsedCoupons, coupon._id]
      saveSessionUsedCoupons(updatedUsedCoupons)
    }
  }

  const removeCoupon = () => {
    if (appliedCoupon) {
      // Remove from session used coupons since user is removing it before placing order
      const updatedUsedCoupons = sessionUsedCoupons.filter(id => id !== appliedCoupon._id)
      saveSessionUsedCoupons(updatedUsedCoupons)
    }
    setAppliedCoupon(null)
  }

  const discount = appliedCoupon ? (totalPrice * appliedCoupon.value / 100) : 0
  const coinsDiscount = Object.keys(usedCoinsPerItem).reduce((total, itemId) => {
    if (usedCoinsPerItem[itemId]) {
      const item = cartItems.find(i => i.id === itemId)
      return total + ((item?.coins || 0) * (item?.quantity || 1))
    }
    return total
  }, 0)
  const total = Math.max(0, totalPrice - discount - coinsDiscount)

  const handleOnlinePayment = async () => {
    if (!user?.email) return
    
    if (!selectedPickupPoint) {
      alert('Please select a pickup point')
      return
    }
    
    if (!canDeliver) {
      alert('Delivery not available in your area. You are too far from pickup points.')
      return
    }
    
    setIsPlacingOrder(true)
    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/wallet/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total * 100, // Razorpay expects amount in paise
          currency: 'INR'
        })
      })

      const orderResult = await orderResponse.json()
      if (!orderResult.success) {
        throw new Error(orderResult.error || 'Failed to create order')
      }

      // Razorpay checkout options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
        amount: total * 100,
        currency: 'INR',
        name: 'Your E-Commerce Store',
        description: `Order Payment - ${cartItems.length} items`,
        order_id: orderResult.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment and place order
            const verifyResponse = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
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
                totalAmount: total,
                discountAmount: discount > 0 ? discount : undefined,
                coinsUsed: coinsDiscount > 0 ? coinsDiscount : undefined,
                couponId: appliedCoupon?._id,
                paymentMethod: 'online',
                pickupPoint: selectedPickupPoint,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            const verifyResult = await verifyResponse.json()
            if (verifyResult.success) {
              const successMessage = `Order placed successfully! Order ID: ${verifyResult.orderId}` +
                (appliedCoupon ? `\n\nNote: Your ${appliedCoupon.value}% discount coupon has been used and cannot be reused.` : '')
              alert(successMessage)

              // Persist the used coupon in localStorage so it cannot be reused after a page refresh
              if (appliedCoupon && user?.email) {
                try {
                  const key = `usedCoupons_${user.email}`
                  const stored = JSON.parse(localStorage.getItem(key) || '[]')
                  if (!stored.includes(appliedCoupon._id)) {
                    const updated = [...stored, appliedCoupon._id]
                    localStorage.setItem(key, JSON.stringify(updated))
                    setSessionUsedCoupons(updated)
                  }
                } catch (e) {
                  console.error('Failed to persist used coupon after order:', e)
                }
              }

              clearCart()
              setAppliedCoupon(null)
              setUsedCoinsPerItem({})
              // Do not clear sessionUsedCoupons nor remove localStorage — keep coupon marked as used
            } else {
              throw new Error(verifyResult.error || 'Order placement failed')
            }
          } catch (error) {
            alert('Order placement failed. Please contact support if payment was deducted.')
            // On payment failure, remove the coupon from session used list since order failed
            if (appliedCoupon) {
              const updatedUsedCoupons = sessionUsedCoupons.filter(id => id !== appliedCoupon._id)
              saveSessionUsedCoupons(updatedUsedCoupons)
            }
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email,
          contact: user.phone || ''
        },
        theme: { color: '#3B82F6' },
        modal: {
          ondismiss: function() {
            setIsPlacingOrder(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error) {
      alert('Payment failed. Please try again.')
      // On payment failure, remove the coupon from session used list since order failed
      if (appliedCoupon) {
        const updatedUsedCoupons = sessionUsedCoupons.filter(id => id !== appliedCoupon._id)
        saveSessionUsedCoupons(updatedUsedCoupons)
      }
      setIsPlacingOrder(false)
    }
  }

  const handleCODOrder = async () => {
    if (!user?.email) return
    
    if (!selectedPickupPoint) {
      alert('Please select a pickup point')
      return
    }
    
    if (!canDeliver) {
      alert('Delivery not available in your area. You are too far from pickup points.')
      return
    }
    
    // Check if all items support COD
    const codUnavailableItems = cartItems.filter(item => item.codAvailable === false)
    if (codUnavailableItems.length > 0) {
      alert(`Cash on Delivery is not available for: ${codUnavailableItems.map(item => item.name).join(', ')}`)
      return
    }
    
    setIsPlacingOrder(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          totalAmount: total,
          discountAmount: discount > 0 ? discount : undefined,
          coinsUsed: coinsDiscount > 0 ? coinsDiscount : undefined,
          couponId: appliedCoupon?._id,
          paymentMethod: 'cod',
          pickupPoint: selectedPickupPoint
        })
      })

      const data = await response.json()
      if (data.success) {
        const successMessage = `Order placed successfully! Order ID: ${data.orderId}. Pay ₹${total} on delivery.` +
          (appliedCoupon ? `\n\nNote: Your ${appliedCoupon.value}% discount coupon has been used and cannot be reused.` : '')
        alert(successMessage)

        // Persist the used coupon in localStorage so it cannot be reused after a page refresh
        if (appliedCoupon && user?.email) {
          try {
            const key = `usedCoupons_${user.email}`
            const stored = JSON.parse(localStorage.getItem(key) || '[]')
            if (!stored.includes(appliedCoupon._id)) {
              const updated = [...stored, appliedCoupon._id]
              localStorage.setItem(key, JSON.stringify(updated))
              setSessionUsedCoupons(updated)
            }
          } catch (e) {
            console.error('Failed to persist used coupon after order:', e)
          }
        }

        clearCart()
        setAppliedCoupon(null)
        setUsedCoinsPerItem({})
        // Do not clear sessionUsedCoupons nor remove localStorage — keep coupon marked as used
      } else {
        alert('Failed to place order: ' + data.error)
        // On order failure, remove the coupon from session used list since order failed
        if (appliedCoupon) {
          const updatedUsedCoupons = sessionUsedCoupons.filter(id => id !== appliedCoupon._id)
          saveSessionUsedCoupons(updatedUsedCoupons)
        }
      }
    } catch (error) {
      alert('Failed to place order. Please try again.')
      // On order failure, remove the coupon from session used list since order failed
      if (appliedCoupon) {
        const updatedUsedCoupons = sessionUsedCoupons.filter(id => id !== appliedCoupon._id)
        saveSessionUsedCoupons(updatedUsedCoupons)
      }
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
            
            {/* Coins Discount Summary */}
            {cartItems.some(item => (item.coins || 0) > 0) && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">💰</span>
                  </div>
                  <span className="font-semibold text-yellow-800">Coins Discount Available!</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Total coins discount available: <span className="font-bold">
                    {cartItems.reduce((total, item) => total + ((item.coins || 0) * item.quantity), 0)} coins
                  </span> = <span className="font-bold">
                    ₹{cartItems.reduce((total, item) => total + ((item.coins || 0) * item.quantity), 0)}
                  </span> off
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  💡 Click "Use coins" on individual items below to apply discounts
                </p>
              </div>
            )}

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

                      <div className="space-y-1">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{item.price} ₹</span>
                            {(item.coins || 0) > 0 && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-300">
                                💰 {item.coins} coins discount
                              </Badge>
                            )}
                          </div>
                          {(item.coins || 0) > 0 && (
                            <div className="bg-gradient-to-r from-blue-50 to-transparent border border-blue-200 rounded-lg p-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">₹</span>
                                </div>
                                <span className="text-sm font-medium text-blue-800">
                                  Coins Discount: {(item.coins || 0) * item.quantity} coins = ₹{(item.coins || 0) * item.quantity} off
                                </span>
                              </div>
                              {walletBalance >= ((item.coins || 0) * item.quantity) ? (
                                <div className="flex items-center gap-2">
                                  {usedCoinsPerItem[item.id] ? (
                                    <div className="flex items-center justify-between w-full">
                                      <Badge className="bg-green-100 text-green-700 text-xs px-3 py-1">
                                        ✓ Applied: -{(item.coins || 0) * item.quantity} coins (₹{(item.coins || 0) * item.quantity})
                                      </Badge>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs text-red-600 hover:bg-red-50"
                                        onClick={() => setUsedCoinsPerItem(prev => ({...prev, [item.id]: false}))}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-3 text-xs bg-blue-600 text-white border-blue-600 hover:bg-blue-700 font-medium"
                                      onClick={() => setUsedCoinsPerItem(prev => ({...prev, [item.id]: true}))}
                                    >
                                      💰 Use {(item.coins || 0) * item.quantity} coins for ₹{(item.coins || 0) * item.quantity} off
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div className="bg-red-50 border border-red-200 rounded p-2">
                                  <p className="text-xs text-red-700">
                                    ⚠️ Need {(item.coins || 0) * item.quantity} coins for discount (You have {walletBalance} coins)
                                  </p>
                                  <p className="text-xs text-red-600 mt-1">
                                    Add more coins to your wallet to use this discount
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
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
                <div className="space-y-2">
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
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-700">
                      ⚠️ <strong>Important:</strong> Once you place this order, this coupon will be permanently used and cannot be reused, even if the order is cancelled later.
                    </p>
                  </div>
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



        {/* Pickup Point Selection */}
        {cartItems.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Select Pickup Point</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={getUserLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? '📍 Locating...' : '📍 Refresh Location'}
                </Button>
              </div>

              {!canDeliver && nearestDistance && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-600 text-lg">⚠️</span>
                    <span className="font-semibold text-red-800">Delivery Not Available</span>
                  </div>
                  <p className="text-sm text-red-700">
                    You are {nearestDistance}km away from the nearest pickup point. 
                    We only deliver within 1km radius of pickup points.
                  </p>
                </div>
              )}

              {pickupPoints.length > 0 ? (
                <div className="space-y-3">
                  {pickupPoints.map((point) => (
                    <div 
                      key={point.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPickupPoint?.id === point.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      } ${!canDeliver ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => canDeliver && setSelectedPickupPoint(point)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">{point.name}</span>
                            {point.distance !== null && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                point.distance <= 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {point.distance.toFixed(1)}km away
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">📍 {point.address}</p>
                          {point.contactPhone && (
                            <p className="text-sm text-gray-600 mb-1">📞 {point.contactPhone}</p>
                          )}
                          {point.timings && (
                            <p className="text-sm text-gray-600">🕒 {point.timings}</p>
                          )}
                        </div>
                        {selectedPickupPoint?.id === point.id && canDeliver && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📍</div>
                  <p className="text-gray-500 mb-2">No pickup points available</p>
                  <p className="text-sm text-gray-400">Please contact support for assistance</p>
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
                  <span>{totalPrice.toFixed(2)} ₹</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon?.value}%)</span>
                    <span>-{discount.toFixed(2)} ₹</span>
                  </div>
                )}

                {coinsDiscount > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-2">
                    <div className="flex justify-between items-center text-blue-700">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">₹</span>
                        </div>
                        <span className="font-medium">Coins Discount Applied</span>
                      </div>
                      <span className="font-bold">-₹{coinsDiscount.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      💰 You saved ₹{coinsDiscount} using {coinsDiscount} coins!
                    </p>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-base">
                  <span>Total Amount</span>
                  <span>{total.toFixed(2)} ₹</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium">Select Payment Method:</div>
                
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod === 'online' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedPaymentMethod('online')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💳</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Online Payment</p>
                        <p className="text-sm text-gray-600">Pay securely using UPI, Cards, Net Banking</p>
                      </div>
                      {selectedPaymentMethod === 'online' && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedPaymentMethod('cod')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💵</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay ₹{total.toFixed(2)} when your order arrives</p>
                      </div>
                      {selectedPaymentMethod === 'cod' && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  onClick={selectedPaymentMethod === 'online' ? handleOnlinePayment : handleCODOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {selectedPaymentMethod === 'online' ? '💳 Pay Online' : '💵 Place COD Order'} - ₹{total.toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />

    </div>
  )
}
