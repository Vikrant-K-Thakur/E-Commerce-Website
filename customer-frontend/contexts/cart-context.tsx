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
  size?: string
  productId?: string
  coins?: number
  codAvailable?: boolean
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, size?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string) => void
  updateSize: (id: string, oldSize: string | undefined, newSize: string) => void
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

  // Save cart to database whenever items change (but not on initial load)
  useEffect(() => {
    if (user?.email && items.length > 0) {
      saveCartToDB()
    }
  }, [items, user?.email])

  const loadCartFromDB = async () => {
    if (!user?.email) return
    try {
      const cartItems = await getCart(user.email)
      setItems(cartItems || [])
    } catch (error) {
      console.error('Failed to load cart:', error)
      setItems([])
    }
  }

  const saveCartToDB = async () => {
    if (!user?.email) return
    try {
      await saveCart(user.email, items)
    } catch (error) {
      console.error('Failed to save cart:', error)
    }
  }

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      // For items with size, check both id and size for uniqueness
      const existing = prev.find(item => 
        item.id === newItem.id && 
        (newItem.size ? item.size === newItem.size : !item.size)
      )
      let updatedItems
      if (existing) {
        updatedItems = prev.map(item =>
          item.id === newItem.id && 
          (newItem.size ? item.size === newItem.size : !item.size)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        updatedItems = [...prev, { ...newItem, quantity: 1 }]
      }
      
      // Immediately save to database
      if (user?.email) {
        saveCart(user.email, updatedItems).catch(console.error)
      }
      
      return updatedItems
    })
  }

  const removeItem = (id: string, size?: string) => {
    setItems(prev => {
      const updatedItems = prev.filter(item => 
        !(item.id === id && (size ? item.size === size : true))
      )
      
      // Immediately save to database
      if (user?.email) {
        saveCart(user.email, updatedItems).catch(console.error)
      }
      
      return updatedItems
    })
  }

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeItem(id, size)
      return
    }
    setItems(prev => {
      const updatedItems = prev.map(item =>
        item.id === id && (size ? item.size === size : true)
          ? { ...item, quantity } : item
      )
      
      // Immediately save to database
      if (user?.email) {
        saveCart(user.email, updatedItems).catch(console.error)
      }
      
      return updatedItems
    })
  }

  const updateSize = (id: string, oldSize: string | undefined, newSize: string) => {
    setItems(prev => {
      const updatedItems = prev.map(item =>
        item.id === id && item.size === oldSize
          ? { ...item, size: newSize }
          : item
      )
      
      // Immediately save to database
      if (user?.email) {
        saveCart(user.email, updatedItems).catch(console.error)
      }
      
      return updatedItems
    })
  }

  const clearCart = () => {
    setItems([])
    
    // Immediately save to database
    if (user?.email) {
      saveCart(user.email, []).catch(console.error)
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      addToCart: addItem,
      removeItem,
      updateQuantity,
      updateSize,
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