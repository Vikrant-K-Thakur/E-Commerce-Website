"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Gift, Ticket, Bell, CheckCircle, AlertCircle, Clock, Coins, Percent, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/contexts/auth-context"

export default function RewardsPage() {
  const [couponCode, setCouponCode] = useState("")
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [popupType, setPopupType] = useState<'success' | 'error'>('success')
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.email) {
      fetchRewards()
    }
  }, [user?.email])

  const fetchRewards = async () => {
    if (!user?.email) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/rewards?email=${user.email}`)
      const result = await response.json()
      if (result.success) {
        setRewards(result.data)
        // Mark all rewards as read when viewing
        markRewardsAsRead()
      }
    } catch (error) {
      console.error('Failed to fetch rewards:', error)
    } finally {
      setLoading(false)
    }
  }

  const markRewardsAsRead = async () => {
    if (!user?.email) return
    
    try {
      await fetch('/api/rewards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          action: 'markAsRead'
        })
      })
      
      // Trigger notification update event
      window.dispatchEvent(new Event('notificationUpdate'))
    } catch (error) {
      console.error('Failed to mark rewards as read:', error)
    }
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return <Percent className="w-5 h-5 text-green-600" />
      case 'coins':
        return <Coins className="w-5 h-5 text-blue-600" />
      default:
        return <Gift className="w-5 h-5 text-orange-600" />
    }
  }

  const getRewardBadge = (reward: any) => {
    const isExpired = reward.expires_at && new Date(reward.expires_at) < new Date()
    if (isExpired) return <Badge variant="destructive" className="text-xs bg-red-100 text-red-800 border-red-200">Expired</Badge>
    if (!reward.isRead) return <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">New</Badge>
    return <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 border-gray-200">Read</Badge>
  }

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive"
      })
      return
    }

    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to redeem codes",
        variant: "destructive"
      })
      return
    }

    setIsRedeeming(true)

    try {
      const response = await fetch('/api/redeem-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'redeem',
          code: couponCode.trim().toUpperCase(),
          email: user.email
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setPopupType('success')
        setPopupMessage(result.message || 'Code redeemed successfully!')
        setShowPopup(true)
        setCouponCode("")
        
        // Refresh rewards for notification
        setTimeout(() => {
          fetchRewards()
        }, 1000)
        
        // Auto hide popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false)
        }, 3000)
      } else {
        setPopupType('error')
        setPopupMessage(result.error || 'Invalid or expired code')
        setShowPopup(true)
        
        // Auto hide popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to redeem code:', error)
      setPopupType('error')
      setPopupMessage(`Network error: ${error.message || 'Failed to redeem code'}`)
      setShowPopup(true)
      
      // Auto hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false)
      }, 3000)
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Rewards & Coupons</h1>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Tabs defaultValue="coupons" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="coupons" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Redeem Coupons</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Reward Notifications</TabsTrigger>
          </TabsList>

          {/* Coupon Redemption Tab */}
          <TabsContent value="coupons" className="space-y-6 mt-6">
            {/* Coupon Redemption Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Ticket className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Redeem Coupon Code</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Enter your coupon code below to redeem special offers and discounts on your next purchase
                    </p>
                  </div>
                  
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="relative">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="text-center font-mono text-lg h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <Star className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleRedeemCoupon}
                      disabled={isRedeeming || !couponCode.trim()}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                    >
                      {isRedeeming ? (
                        <>
                          <Clock className="w-5 h-5 mr-2 animate-spin" />
                          Redeeming...
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5 mr-2" />
                          Redeem Coupon
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How it Works */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">How Coupon Redemption Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Get Coupon Code</p>
                      <p className="text-sm text-gray-600">Receive coupon codes from admin or promotional campaigns</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Enter Code</p>
                      <p className="text-sm text-gray-600">Type or paste your coupon code in the field above</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-600">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Enjoy Rewards</p>
                      <p className="text-sm text-gray-600">Your discount or reward will be applied to your account</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reward Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6" onFocus={markRewardsAsRead}>
            {/* Notifications Header */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Bell className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reward Notifications</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Stay updated with special rewards and offers from our admin team
                </p>
              </CardContent>
            </Card>

            {/* Real Reward Notifications */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Clock className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600 font-medium">Loading rewards...</span>
                </div>
              ) : rewards.length > 0 ? (
                rewards.map((reward) => {
                  const isExpired = reward.expires_at && new Date(reward.expires_at) < new Date()
                  return (
                    <Card key={reward.id} className={`border shadow-sm transition-all duration-200 hover:shadow-md ${
                      isExpired ? 'border-red-200 bg-red-50/50' : 
                      !reward.isRead ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200'
                    }`}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                            reward.type === 'discount' ? 'bg-green-100 border-2 border-green-200' : 
                            reward.type === 'coins' ? 'bg-blue-100 border-2 border-blue-200' : 'bg-orange-100 border-2 border-orange-200'
                          }`}>
                            {getRewardIcon(reward.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 text-base leading-tight">{reward.title}</h3>
                              {getRewardBadge(reward)}
                            </div>
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                              {reward.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <p className="text-xs text-gray-500">
                                  {new Date(reward.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                reward.type === 'discount' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {reward.type === 'discount' ? `${reward.value}% OFF` : `${reward.value} ₹`}
                              </div>
                            </div>
                            {reward.expires_at && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className={`text-xs ${
                                  isExpired ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                  {isExpired ? 'Expired on' : 'Expires on'} {new Date(reward.expires_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">No Rewards Yet</h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      When admin sends you rewards or special offers, they'll appear here. Check back soon!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>


          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
      
      {/* Popup Message */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl ${
            popupType === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                popupType === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {popupType === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${
                  popupType === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {popupType === 'success' ? 'Success!' : 'Error!'}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {popupMessage}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPopup(false)}
                className="p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setShowPopup(false)}
                className={`${
                  popupType === 'success' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
