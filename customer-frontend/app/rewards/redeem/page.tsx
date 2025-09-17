"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Gift, Percent, ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const rewardTiers = [
  {
    id: 1,
    title: "$5 Off Your Order",
    description: "Get $5 discount on orders over $25",
    coins: 500,
    value: 5,
    icon: Percent,
    available: true,
    popular: false,
  },
  {
    id: 2,
    title: "$10 Off Your Order",
    description: "Get $10 discount on orders over $50",
    coins: 1000,
    value: 10,
    icon: Percent,
    available: true,
    popular: true,
  },
  {
    id: 3,
    title: "$25 Off Your Order",
    description: "Get $25 discount on orders over $100",
    coins: 2500,
    value: 25,
    icon: Percent,
    available: false,
    popular: false,
  },
  {
    id: 4,
    title: "Free Shipping",
    description: "Free shipping on any order",
    coins: 300,
    value: 8.99,
    icon: ShoppingBag,
    available: true,
    popular: false,
  },
  {
    id: 5,
    title: "Premium Member (1 Month)",
    description: "Access to exclusive deals and early sales",
    coins: 1500,
    value: 15,
    icon: Star,
    available: true,
    popular: false,
  },
]

export default function RedeemPage() {
  const [userCoins] = useState(2350)

  const canRedeem = (requiredCoins: number) => userCoins >= requiredCoins

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/rewards">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Redeem Rewards</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Balance */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-0">
          <CardContent className="p-4 text-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Available money(₹)</p>
              <p className="text-2xl font-bold text-primary">{userCoins}</p>
            </div>
          </CardContent>
        </Card>

        {/* Redemption Info */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-foreground">How Redemption Works</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• ₹ are automatically applied as discounts at checkout</p>
              <p>• 10 = ₹1 discount value</p>
              <p>• Rewards can be combined with other offers</p>
              <p>• Redeemed rewards expire after 30 days</p>
            </div>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Available Rewards</h2>

          {rewardTiers.map((reward) => {
            const IconComponent = reward.icon
            const canRedeemReward = canRedeem(reward.coins)

            return (
              <Card
                key={reward.id}
                className={`relative overflow-hidden ${
                  !canRedeemReward ? "opacity-60" : "hover:shadow-md transition-shadow"
                }`}
              >
                {reward.popular && (
                  <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-bl-lg">
                    Popular
                  </div>
                )}

                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">{reward.title}</h3>
                        <p className="text-sm text-muted-foreground text-pretty">{reward.description}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {reward.coins} ₹
                        </Badge>
                        <span className="text-sm text-muted-foreground">(${reward.value} value)</span>
                      </div>

                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={!canRedeemReward}
                      >
                        {canRedeemReward ? "Redeem Now" : `Need ${reward.coins - userCoins} more ₹`}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Earn More Section */}
        <Card>
          <CardContent className="p-4 text-center space-y-3">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto" />
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Need More rupee(₹)?</h3>
              <p className="text-sm text-muted-foreground">
                Keep shopping and completing activities to earn more ₹
              </p>
            </div>
            <Link href="/rewards">
              <Button variant="outline">View Earning Opportunities</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
