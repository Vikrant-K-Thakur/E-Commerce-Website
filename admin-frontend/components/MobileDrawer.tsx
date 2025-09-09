"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import AdminNav from "./AdminNav"

export default function MobileDrawer() {
  const [open, setOpen] = useState(false)

  // Lock body scroll while drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* Top bar visible only on mobile */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-7 w-auto" />
            <span className="text-sm font-semibold text-gray-900">Admin</span>
          </div>
          <div className="w-8" />
        </div>
      </div>

      {/* Drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      {/* Drawer panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r shadow-lg transform transition-transform duration-300 lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-label="Navigation"
      >
        <div className="flex items-center justify-between px-4 h-14 border-b">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-7 w-auto" />
            <span className="text-sm font-semibold text-gray-900">Admin Menu</span>
          </div>
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-3">
          <AdminNav onNavigate={() => setOpen(false)} />
        </div>
      </aside>
    </>
  )
}
