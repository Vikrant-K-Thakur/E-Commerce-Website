"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Shirt, ShoppingCart, Heart, User, Star, Gift, Bell } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "View All Products", href: "/shirts", icon: Shirt },
]

const baseUserNavigation = [
  { name: "Cart", href: "/cart", icon: ShoppingCart, type: "cart" },
  { name: "Wishlist", href: "/wishlist", icon: Heart, type: "wishlist" },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Rewards", href: "/rewards", icon: Star },
  { name: "Notifications", href: "/notifications", icon: Bell, type: "notifications" },
] as Array<{ name: string; href: string; icon: any; type?: string; badge?: string }>

export function DesktopSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { totalItems: cartCount } = useCart()
  const { items: wishlistItems } = useWishlist()
  const [notificationCount, setNotificationCount] = useState(0)
  const [rewardCount, setRewardCount] = useState(0)

  useEffect(() => {
    if (user?.email) {
      fetchNotificationCount()
      fetchRewardCount()
    }
    
    const handleNotificationUpdate = () => {
      if (user?.email) {
        fetchNotificationCount()
        fetchRewardCount()
      }
    }
    
    window.addEventListener('notificationUpdate', handleNotificationUpdate)
    return () => window.removeEventListener('notificationUpdate', handleNotificationUpdate)
  }, [user?.email])

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

  const fetchRewardCount = async () => {
    if (!user?.email) return
    
    try {
      const response = await fetch(`/api/rewards?email=${user.email}`)
      const result = await response.json()
      if (result.success) {
        const unreadCount = result.data.filter((reward: any) => !reward.isRead).length
        setRewardCount(unreadCount)
      }
    } catch (error) {
      console.error('Failed to fetch reward count:', error)
    }
  }

  const userNavigation = baseUserNavigation.map(item => {
    if (item.type === "cart" && cartCount > 0) {
      return { ...item, badge: cartCount.toString() }
    }
    if (item.type === "wishlist" && wishlistItems.length > 0) {
      return { ...item, badge: wishlistItems.length.toString() }
    }
    if (item.type === "notifications" && notificationCount > 0) {
      return { ...item, badge: notificationCount > 9 ? '9+' : notificationCount.toString() }
    }
    if (item.name === "Rewards" && rewardCount > 0) {
      return { ...item, badge: rewardCount > 9 ? '9+' : rewardCount.toString() }
    }
    return item
  })

  return (
    <>
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.png" alt="NXTFIT" className="w-8 h-8" />
              <span className="text-xl font-bold text-sidebar-foreground">NXTFIT Clothing</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">Browse</h3>
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* User Navigation */}
            <AuthGuard>
              <div>
                <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
                  Account
                </h3>
                <nav className="space-y-1">
                  {userNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </AuthGuard>

            {/* Promo Card */}
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Special Offer</span>
                </div>
                <p className="text-xs text-muted-foreground">Get 20% off on premium shirts this week!</p>
                <Link href="/?category=premium">
                  <Button size="sm" className="w-full">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
