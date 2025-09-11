"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Gift, Users, ShoppingBag, Calendar, FileText, Copy, Share, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { BottomNavigation } from "@/components/bottom-navigation"

const loyaltyData = {
  currentCoins: 2350,
  coinValue: 23.5, // $23.50 equivalent
  totalEarned: 5420,
  totalRedeemed: 3070,
}

const earningOpportunities = [
  {
    id: "shop",
    title: "Shop & Earn",
    description: "Get 1 coin for every $1 spent in store",
    icon: ShoppingBag,
    action: "Shop Now",
    coins: "1 coin per $1",
  },
  {
    id: "refer",
    title: "Refer a Friend",
    description: "Invite friends to join and earn 500 coins to share",
    icon: Users,
    action: "Invite Now",
    coins: "500 coins",
  },
  {
    id: "survey",
    title: "Complete Surveys",
    description: "Share your valuable feedback in surveys",
    icon: FileText,
    action: "Take Survey",
    coins: "50-200 coins",
  },
  {
    id: "birthday",
    title: "Birthday Bonus",
    description: "Enjoy a special gift of 200 coins to celebrate",
    icon: Calendar,
    action: "Claim Gift",
    coins: "200 coins",
  },
]

const recentTransactions = [
  {
    id: 1,
    type: "earned",
    description: "Purchase reward - Order #R001234",
    coins: 85,
    date: "2023-11-20",
    time: "14:30",
  },
  {
    id: 2,
    type: "redeemed",
    description: "Redeemed for discount",
    coins: -100,
    date: "2023-11-19",
    time: "10:15",
  },
  {
    id: 3,
    type: "earned",
    description: "Referral bonus - Friend joined",
    coins: 500,
    date: "2023-11-18",
    time: "16:45",
  },
  {
    id: 4,
    type: "earned",
    description: "Survey completion",
    coins: 150,
    date: "2023-11-17",
    time: "09:22",
  },
]

export default function RewardsPage() {
  const [referralCode] = useState("MARIA2024")
  const { toast } = useToast()

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    })
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
          <h1 className="text-lg font-semibold">Loyalty Rewards</h1>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Coins Balance */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-0">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-primary">{loyaltyData.currentCoins}</h2>
              <p className="text-sm text-muted-foreground">Current Coins (${loyaltyData.coinValue})</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-foreground">{loyaltyData.totalEarned}</p>
                <p className="text-xs text-muted-foreground">Total Earned</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-foreground">{loyaltyData.totalRedeemed}</p>
                <p className="text-xs text-muted-foreground">Total Redeemed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redeem Coins */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Redeem Your Coins</h3>
              <Button variant="outline" size="sm">
                <Gift className="w-4 h-4 mr-2" />
                View Rewards
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Your earned coins are automatically applied as discounts at checkout, or you can choose to save them for
              larger rewards.
            </p>

            <Link href="/rewards/redeem">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Learn more about redemption
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Ways to Earn More Coins */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ways to Earn More Coins</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {earningOpportunities.map((opportunity) => {
              const IconComponent = opportunity.icon
              return (
                <div key={opportunity.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/20 rounded-lg">
                      <IconComponent className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{opportunity.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {opportunity.coins}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground text-pretty">{opportunity.description}</p>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="shrink-0 bg-transparent">
                    {opportunity.action}
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Referral Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" />
              Refer Friends & Earn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Invite friends to join and both of you get 500 coins when they make their first purchase!
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Referral Code</label>
                <div className="flex gap-2">
                  <Input value={referralCode} readOnly className="flex-1" />
                  <Button variant="outline" size="icon" onClick={copyReferralCode}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Share className="w-4 h-4 mr-2" />
                Share with Friends
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="all">All History</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-3 mt-4">
                {recentTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{transaction.date}</span>
                        <span>{transaction.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === "earned" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "earned" ? "+" : ""}
                        {transaction.coins} coins
                      </p>
                    </div>
                  </div>
                ))}

                <Link href="/rewards/history">
                  <Button variant="ghost" className="w-full">
                    View All Transactions
                  </Button>
                </Link>
              </TabsContent>

              <TabsContent value="all" className="space-y-3 mt-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{transaction.date}</span>
                        <span>{transaction.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === "earned" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "earned" ? "+" : ""}
                        {transaction.coins} coins
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}
