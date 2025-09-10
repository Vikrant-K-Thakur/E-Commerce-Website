"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user?.email) {
      loadWishlist()
    } else {
      setItems([])
    }
  }, [user?.email])

  useEffect(() => {
    if (user?.email && items.length >= 0) {
      saveWishlist()
    }
  }, [items, user?.email])

  const loadWishlist = () => {
    if (!user?.email) return
    const saved = localStorage.getItem(`wishlist_${user.email}`)
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }

  const saveWishlist = () => {
    if (!user?.email) return
    localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(items))
  }

  const addToWishlist = (item: WishlistItem) => {
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev
      return [...prev, item]
    })
  }

  const removeFromWishlist = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const isInWishlist = (id: string) => {
    return items.some(item => item.id === id)
  }

  const clearWishlist = () => {
    setItems([])
  }

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}