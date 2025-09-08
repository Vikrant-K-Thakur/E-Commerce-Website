"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, Bell, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

  return (
    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
      {/* Logo - visible on larger screens */}
      <Link href="/" className="hidden sm:block shrink-0">
        <img src="/images/logo.png" alt="NXTFIT" className="h-8 w-auto" />
      </Link>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for products or brands..."
          className="pl-10 pr-4 bg-muted/50 border-0 focus-visible:ring-1 text-sm sm:text-base"
        />
      </div>

      <AuthGuard>
        <Button variant="ghost" size="icon" className="shrink-0">
          <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </AuthGuard>

      <AuthGuard>
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="shrink-0 relative">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
        </Link>
      </AuthGuard>

      {/* User avatar - visible on larger screens */}
      {user ? (
        <Link href="/profile" className="hidden sm:block">
          <Button variant="ghost" size="icon" className="shrink-0">
            <img
              src={user.avatar || "/placeholder.svg?height=32&width=32"}
              alt={user.name}
              className="w-6 h-6 rounded-full"
            />
          </Button>
        </Link>
      ) : (
        <AuthGuard>
          <Button variant="ghost" size="icon" className="hidden sm:block shrink-0">
            <User className="w-5 h-5" />
          </Button>
        </AuthGuard>
      )}
    </div>
  )
}
