"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { saveCart, getCart } from '@/lib/database'
import { useAuth } from './auth-context'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  // Load cart from database when user logs in
  useEffect(() => {
    if (user?.email) {
      loadCartFromDB()
    } else {
      setItems([])
    }
  }, [user?.email])

  // Save cart to database whenever items change
  useEffect(() => {
    if (user?.email && items.length >= 0) {
      saveCartToDB()
    }
  }, [items, user?.email])

  const loadCartFromDB = async () => {
    if (!user?.email) return
    const cartItems = await getCart(user.email)
    setItems(cartItems)
  }

  const saveCartToDB = async () => {
    if (!user?.email) return
    await saveCart(user.email, items)
  }

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === newItem.id)
      if (existing) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}