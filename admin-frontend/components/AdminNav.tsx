"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, Package, LineChart, Shield, LogOut, Shirt } from "lucide-react"
import { clearAuthCookie } from "../lib/auth"

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/customer", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: LineChart },
  { href: "/admin/admins", label: "Admins", icon: Shield },
]

export default function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {/* Emphasize catalog scope */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium mb-2">
        <Shirt className="w-4 h-4" />
        <span>T-Shirts & Shirts only</span>
      </div>

      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
              ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
          >
            <Icon className="w-4 h-4" />
            {label}
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
