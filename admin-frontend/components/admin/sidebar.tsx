"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  Settings,
  Megaphone,
  FileText,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Add Product", href: "/admin/add-product", icon: Package },
  { name: "Product Reviews", href: "/admin/product-reviews", icon: MessageSquare, badge: true },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Promotions", href: "/admin/promotions", icon: Megaphone },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [newReviewsCount, setNewReviewsCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    fetchNewReviewsCount()
    const interval = setInterval(fetchNewReviewsCount, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchNewReviewsCount = async () => {
    try {
      const response = await fetch('/api/reviews')
      const result = await response.json()
      if (result.success) {
        const newCount = result.data.filter((review: any) => review.isNew).length
        setNewReviewsCount(newCount)
      }
    } catch (error) {
      console.error('Failed to fetch reviews count:', error)
    }
  }

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-semibold text-gray-900">logo</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const showBadge = item.badge && item.name === "Product Reviews" && newReviewsCount > 0
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                isActive ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-gray-700 hover:bg-gray-100",
                collapsed && "justify-center",
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
              {showBadge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {newReviewsCount > 99 ? '99+' : newReviewsCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-600 truncate">john.doe@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
