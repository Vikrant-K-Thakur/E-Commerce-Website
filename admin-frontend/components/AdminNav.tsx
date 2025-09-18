"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, Package, LineChart, Shield, LogOut, Shirt, Gift, MessageSquare } from "lucide-react"
import { clearAuthCookie } from "../lib/auth"

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: Package, badge: true },
  { href: "/admin/add-product", label: "Add Product", icon: Package },
  { href: "/admin/product-reviews", label: "Product Reviews", icon: MessageSquare, badge: true },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/redeem-codes", label: "Redeem Codes", icon: Gift },
  { href: "/admin/analytics", label: "Analytics", icon: LineChart },
  { href: "/admin/admins", label: "Admins", icon: Shield },
]

export default function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const [newReviewsCount, setNewReviewsCount] = useState(0)
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    fetchNewReviewsCount()
    fetchNewOrdersCount()
    const interval = setInterval(() => {
      fetchNewReviewsCount()
      fetchNewOrdersCount()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Reset orders count when visiting orders page
    if (pathname === '/admin/orders') {
      setNewOrdersCount(0)
      // Mark orders as viewed
      markOrdersAsViewed()
    }
  }, [pathname])

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

  const fetchNewOrdersCount = async () => {
    try {
      const response = await fetch('/api/orders?action=getNewCount')
      const result = await response.json()
      if (result.success) {
        setNewOrdersCount(result.count)
      }
    } catch (error) {
      console.error('Failed to fetch orders count:', error)
    }
  }

  const markOrdersAsViewed = async () => {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAsViewed' })
      })
    } catch (error) {
      console.error('Failed to mark orders as viewed:', error)
    }
  }

  return (
    <nav className="space-y-1">
      {/* Emphasize catalog scope */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium mb-2">
        <Shirt className="w-4 h-4" />
        <span>T-Shirts & Shirts only</span>
      </div>

      {links.map(({ href, label, icon: Icon, badge }) => {
        const active = pathname === href
        const showBadge = badge && ((label === "Product Reviews" && newReviewsCount > 0) || (label === "Orders" && newOrdersCount > 0))
        const badgeCount = label === "Product Reviews" ? newReviewsCount : newOrdersCount
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition relative
              ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {showBadge && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {badgeCount > 99 ? '99+' : badgeCount}
              </span>
            )}
          </Link>
        )
      })}

      <button
        onClick={() => {
          clearAuthCookie()
          window.location.href = "/admin/login"
        }}
        className="mt-4 flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </nav>
  )
}
