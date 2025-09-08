"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Shirt, ShoppingCart, Heart, User, Search, Menu, X, Star, Gift, Bell } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "All Shirts", href: "/shirts", icon: Shirt },
  { name: "Search", href: "/search", icon: Search },
]

const userNavigation = [
  { name: "Cart", href: "/cart", icon: ShoppingCart, badge: "3" },
  { name: "Wishlist", href: "/wishlist", icon: Heart, badge: "5" },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Rewards", href: "/rewards", icon: Star },
  { name: "Notifications", href: "/notifications", icon: Bell, badge: "2" },
]

export function DesktopSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40 transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.png" alt="NXTFIT" className="w-8 h-8" />
              <span className="text-xl font-bold text-sidebar-foreground">NXTFIT</span>
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
                      onClick={() => setIsOpen(false)}
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
                        onClick={() => setIsOpen(false)}
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
                <Button size="sm" className="w-full">
                  Shop Now
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
