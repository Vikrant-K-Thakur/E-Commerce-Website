"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, fallback, requireAuth = true }: AuthGuardProps) {
  const { user, setShowAuthModal } = useAuth()

  if (requireAuth && !user) {
    return (
      <div onClick={() => setShowAuthModal(true)} className="cursor-pointer">
        {fallback || children}
      </div>
    )
  }

  return <>{children}</>
}
