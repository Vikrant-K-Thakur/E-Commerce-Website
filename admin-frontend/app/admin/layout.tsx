"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import AdminNav from "../../components/AdminNav"
import MobileDrawer from "../../components/MobileDrawer"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // ✅ If on login page → show only login content (no sidebar, no header)
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  // ✅ For all other admin pages → show sidebar + content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top bar + drawer */}
      <MobileDrawer />

      <div className="mx-auto max-w-[1400px]">
        <div className="flex">
          {/* Static left sidebar on laptop/desktop */}
          <aside className="hidden lg:block w-72 shrink-0 border-r bg-white min-h-screen">
            <div className="h-14 border-b px-4 flex items-center gap-2">
              <img src="/logo.jpg" alt="Logo" className="h-8 w-auto" />
              <span className="text-sm font-semibold text-gray-900">Admin</span>
            </div>
            <div className="p-3">
              <AdminNav />
            </div>
          </aside>

          {/* Content area */}
          <main className="flex-1 min-w-0">
            <div className="p-4 lg:p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
