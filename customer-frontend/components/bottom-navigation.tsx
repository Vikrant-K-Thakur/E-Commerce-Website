"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingCart, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

const navItems = [
  { href: "/", icon: Home, label: "Home", requireAuth: false },
  { href: "/shirts", icon: Search, label: "Explore", requireAuth: false },
  { href: "/cart", icon: ShoppingCart, label: "Cart", requireAuth: true },
  { href: "/wishlist", icon: Heart, label: "Wishlist", requireAuth: true },
  { href: "/profile", icon: User, label: "Profile", requireAuth: true },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { totalItems: cartCount } = useCart()
  const { items: wishlistItems } = useWishlist()

  const getItemCount = (href: string) => {
    if (href === "/cart") return cartCount
    if (href === "/wishlist") return wishlistItems.length
    return 0
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border z-50 sm:hidden">
      <nav className="flex items-center justify-around py-1">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = pathname === item.href

          if (item.requireAuth && !user) {
            return (
              <AuthGuard key={item.href}>
                <div
                  className={cn(
                    "flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors cursor-pointer",
                    "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <div className="relative">
                    <IconComponent className="w-5 h-5" />
                    {(item.href === "/cart" || item.href === "/wishlist") && getItemCount(item.href) > 0 && (
                      <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                        {getItemCount(item.href)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </AuthGuard>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors",
                isActive ? "text-secondary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="relative">
                <IconComponent className="w-5 h-5" />
                {(item.href === "/cart" || item.href === "/wishlist") && getItemCount(item.href) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                    {getItemCount(item.href)}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
