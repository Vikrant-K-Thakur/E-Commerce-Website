"use client"
import { useState, useEffect } from "react"
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
  { icon: Wallet, label: "Transaction History", href: "/wallet", badge: null },
  { icon: MapPin, label: "Your Addresses", href: "/addresses", badge: null },
  { icon: ShoppingBag, label: "Order History", href: "/orders", badge: null },
  { icon: Settings, label: "Settings", href: "/settings", badge: null },
]

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [coinBalance, setCoinBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    if (user?.email) {
      fetchWalletData()
      fetchNotificationCount()
    }
    
    const handleNotificationUpdate = () => {
      if (user?.email) {
        fetchNotificationCount()
      }
    }
    
    const handleWalletUpdate = () => {
      if (user?.email) {
        fetchWalletData()
      }
    }
    
    window.addEventListener('notificationUpdate', handleNotificationUpdate)
    window.addEventListener('walletUpdate', handleWalletUpdate)
    return () => {
      window.removeEventListener('notificationUpdate', handleNotificationUpdate)
      window.removeEventListener('walletUpdate', handleWalletUpdate)
    }
  }, [user?.email])

  const fetchWalletData = async () => {
    if (!user?.email) return
    
    try {
      const response = await fetch(`/api/wallet/add-funds?email=${user.email}`)
      const result = await response.json()
      if (result.success) {
        setCoinBalance(result.data.coinBalance || 0)
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotificationCount = async () => {
    if (!user?.email) return
    
    try {
      const response = await fetch(`/api/notifications?email=${user.email}`)
      const result = await response.json()
      if (result.success) {
        const unreadCount = result.data.filter((notification: any) => !notification.read).length
        setNotificationCount(unreadCount)
      }
    } catch (error) {
      console.error('Failed to fetch notification count:', error)
    }
  }

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
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
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
              <h3 className="font-semibold text-foreground">Wallet Balance</h3>
              <Link href="/wallet">
                <Button variant="ghost" size="sm" className="text-secondary">
                  View History
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Coin Balance</p>
                <p className="text-2xl font-bold text-foreground">{loading ? '...' : coinBalance} Coins</p>
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
