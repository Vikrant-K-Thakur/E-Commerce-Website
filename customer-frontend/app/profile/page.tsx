"use client"
import Link from "next/link"
import { Bell, Edit, ChevronRight, Wallet, MapPin, ShoppingBag, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"

const user = {
  name: "Maria Rodriguez",
  email: "maria.r@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "/placeholder.svg?height=80&width=80&text=MR",
}

const walletData = {
  balance: 2450.75,
  loyaltyCoins: 1280,
}

const recentOrders = [
  {
    id: "R001234",
    date: "2023-11-20",
    total: 85.0,
    status: "Delivered",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: "R001233",
    date: "2023-11-18",
    total: 120.5,
    status: "Processing",
    statusColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "R001232",
    date: "2023-11-15",
    total: 49.99,
    status: "Cancelled",
    statusColor: "bg-red-100 text-red-800",
  },
]

const menuItems = [
  { icon: Wallet, label: "Wallet & Rewards", href: "/wallet", badge: null },
  { icon: MapPin, label: "Your Addresses", href: "/addresses", badge: null },
  { icon: ShoppingBag, label: "Order History", href: "/orders", badge: null },
  { icon: Settings, label: "Settings", href: "/settings", badge: null },
]

export default function ProfilePage() {
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
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-16 h-16 rounded-full bg-muted"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              </div>
              <Button variant="ghost" size="icon">
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wallet & Rewards */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Wallet & Rewards</h3>
              <Link href="/wallet">
                <Button variant="ghost" size="sm" className="text-secondary">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-2xl font-bold text-foreground">${walletData.balance.toFixed(2)}</p>
                <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Top Up
                </Button>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Loyalty Coins</p>
                <p className="text-2xl font-bold text-primary">{walletData.loyaltyCoins}</p>
                <Button size="sm" variant="outline" className="border-primary text-primary bg-transparent">
                  Redeem
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
              {recentOrders.map((order) => (
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
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
