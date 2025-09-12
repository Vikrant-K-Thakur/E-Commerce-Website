"use client"
import Link from "next/link"
import { Bell, ChevronRight, Wallet, MapPin, ShoppingBag, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ProfileForm } from "@/components/profile-form"
import { useAuth } from "@/contexts/auth-context"



const walletData = {
  balance: 0,
}

const recentOrders: any[] = []

const menuItems = [
  { icon: Wallet, label: "Wallet & Rewards", href: "/wallet", badge: null },
  { icon: MapPin, label: "Your Addresses", href: "/addresses", badge: null },
  { icon: ShoppingBag, label: "Order History", href: "/orders", badge: null },
  { icon: Settings, label: "Settings", href: "/settings", badge: null },
]

export default function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">My Profile</h1>
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Info */}
        <ProfileForm />

        {/* Wallet & Rewards */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Wallet</h3>
              <Link href="/wallet">
                <Button variant="ghost" size="sm" className="text-secondary">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Coin Balance</p>
                <p className="text-2xl font-bold text-foreground">{walletData.balance} Coins</p>
                <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Add Coins
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Card className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Order History Preview */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Order History</h3>
              <Link href="/orders">
                <Button variant="ghost" size="sm" className="text-secondary">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Order ID</span>
                        <span className="text-sm text-muted-foreground">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Date: {order.date}</span>
                        <span>Total: ${order.total}</span>
                      </div>
                    </div>
                    <Badge className={order.statusColor}>{order.status}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent orders</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}
