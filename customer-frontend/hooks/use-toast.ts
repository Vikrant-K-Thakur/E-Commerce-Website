"use client"

import { useState } from "react"

interface Toast {
  id: string
  title: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description }: Omit<Toast, 'id'>) => {
    const newToast = { id: Date.now().toString(), title, description }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id))
    }, 3000)
  }

  return { toast, toasts }
}
