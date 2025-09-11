"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Gift, Ticket, Bell, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function RewardsPage() {
  const [couponCode, setCouponCode] = useState("")
  const [isRedeeming, setIsRedeeming] = useState(false)
  const { toast } = useToast()

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive"
      })
      return
    }

    setIsRedeeming(true)
    // TODO: API call to redeem coupon will be added later
    setTimeout(() => {
      setIsRedeeming(false)
      toast({
        title: "Coupon Redeemed!",
        description: "Your coupon has been successfully applied",
      })
      setCouponCode("")
    }, 2000)
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="coupons">Redeem Coupons</TabsTrigger>
            <TabsTrigger value="notifications">Reward Notifications</TabsTrigger>
          </TabsList>

          {/* Coupon Redemption Tab */}
          <TabsContent value="coupons" className="space-y-6 mt-6">
            {/* Coupon Redemption Card */}
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-0">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <Ticket className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-foreground">Redeem Coupon Code</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your coupon code below to redeem special offers and discounts
                    </p>
                  </div>
                  
                  <div className="space-y-3 max-w-sm mx-auto">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="text-center font-mono text-lg"
                    />
                    
                    <Button 
                      onClick={handleRedeemCoupon}
                      disabled={isRedeeming || !couponCode.trim()}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isRedeeming ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Redeeming...
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4 mr-2" />
                          Redeem Coupon
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How it Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">How Coupon Redemption Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Get Coupon Code</p>
                      <p className="text-xs text-muted-foreground">Receive coupon codes from admin or promotional campaigns</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Enter Code</p>
                      <p className="text-xs text-muted-foreground">Type or paste your coupon code in the field above</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Enjoy Rewards</p>
                      <p className="text-xs text-muted-foreground">Your discount or reward will be applied to your account</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reward Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            {/* Notifications Header */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Reward Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Stay updated with special rewards and offers from our admin team
                </p>
              </CardContent>
            </Card>

            {/* Sample Notifications - These will be replaced with real data later */}
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">Welcome Bonus</p>
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Congratulations! You've received a welcome bonus for joining our platform.
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Gift className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">Special Offer</p>
                        <Badge variant="outline" className="text-xs">Pending</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        You have a special discount waiting! Check your coupons section.
                      </p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">Reward Expiring Soon</p>
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Your reward expires in 3 days. Don't forget to use it!
                      </p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Empty State Message */}
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="font-medium text-foreground mb-2">No New Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  When admin sends you rewards or special offers, they'll appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  )
}
