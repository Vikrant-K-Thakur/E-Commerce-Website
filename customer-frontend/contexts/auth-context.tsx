"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { saveCustomer, getCustomer } from "@/lib/database"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  avatar?: string
  password?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, phone?: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  googleLogin: () => void
  updateProfile: (data: { name?: string; phone?: string; address?: string }) => Promise<void>
  logout: () => void
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // Check for existing session and restore from database
    const savedUser = localStorage.getItem("nxtfit_user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      // Refresh user data from database
      refreshUserData(userData.email)
    }
    setIsLoading(false)

    // Listen for storage events (for Google login callback)
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem("nxtfit_user")
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const refreshUserData = async (email: string) => {
    const dbUser = await getCustomer(email)
    if (dbUser) {
      const updatedUser = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        address: dbUser.address,
        avatar: "/placeholder.svg?height=40&width=40",
      }
      setUser(updatedUser)
      localStorage.setItem("nxtfit_user", JSON.stringify(updatedUser))
    }
  }

  const login = async (email: string, password: string, phone?: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get existing user from database
    const existingUser = await getCustomer(email)
    
    if (existingUser && existingUser.password && existingUser.password !== password) {
      setIsLoading(false)
      throw new Error('Invalid password')
    }

    const userData = existingUser ? {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      phone: existingUser.phone || phone,
      address: existingUser.address,
      avatar: "/placeholder.svg?height=40&width=40",
    } : {
      id: Date.now().toString(),
      name: "User",
      email: email,
      phone: phone,
      avatar: "/placeholder.svg?height=40&width=40",
    }

    // Save user with password for future logins
    await saveCustomer({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      password: password
    })

    setUser(userData)
    localStorage.setItem("nxtfit_user", JSON.stringify(userData))
    setShowAuthModal(false)
    setIsLoading(false)
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = await getCustomer(email)
    if (existingUser) {
      setIsLoading(false)
      throw new Error('User already exists')
    }

    const userData = {
      id: Date.now().toString(),
      name: name,
      email: email,
      phone: phone,
      avatar: "/placeholder.svg?height=40&width=40",
    }

    await saveCustomer({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: password
    })

    setUser(userData)
    localStorage.setItem("nxtfit_user", JSON.stringify(userData))
    setShowAuthModal(false)
    setIsLoading(false)
  }

  const updateProfile = async (data: { name?: string; phone?: string; address?: string }) => {
    if (!user) return
    
    const updatedUser = { ...user, ...data }
    
    await saveCustomer({
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address
    })
    
    setUser(updatedUser)
    localStorage.setItem("nxtfit_user", JSON.stringify(updatedUser))
  }

  const googleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/google`
    const scope = 'openid email profile'
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`
    
    window.location.href = googleAuthUrl
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("nxtfit_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        updateProfile,
        googleLogin,
        logout,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
