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

  // Load wishlist from database when user logs in
  useEffect(() => {
    if (user?.email) {
      loadWishlistFromDB()
    } else {
      setItems([])
    }
  }, [user?.email])

  // Save wishlist to database whenever items change
  useEffect(() => {
    if (user?.email && items.length >= 0) {
      saveWishlistToDB()
    }
  }, [items, user?.email])

  const loadWishlistFromDB = async () => {
    if (!user?.email) return
    try {
      const response = await fetch(`/api/wishlist?email=${user.email}`)
      const result = await response.json()
      if (result.success) {
        setItems(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error)
    }
  }

  const saveWishlistToDB = async () => {
    if (!user?.email) return
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          wishlistItems: items
        })
      })
    } catch (error) {
      console.error('Failed to save wishlist:', error)
    }
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