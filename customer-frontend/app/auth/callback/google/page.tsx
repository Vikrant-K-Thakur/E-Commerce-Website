"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function GoogleCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("Processing...")

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          setStatus("Authentication failed. Redirecting...")
          setTimeout(() => router.push('/auth/login'), 2000)
          return
        }

        if (!code) {
          setStatus("No authorization code received. Redirecting...")
          setTimeout(() => router.push('/auth/login'), 2000)
          return
        }

        setStatus("Authenticating with Google...")

        // Exchange code for tokens
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        })

        const result = await response.json()

        if (result.success) {
          setStatus("Login successful! Redirecting...")
          localStorage.setItem('user', JSON.stringify(result.user))
          localStorage.setItem('token', result.token)
          
          setTimeout(() => router.push('/'), 1000)
        } else {
          setStatus("Authentication failed. Redirecting...")
          setTimeout(() => router.push('/auth/login'), 2000)
        }
      } catch (error) {
        console.error('Google callback error:', error)
        setStatus("Authentication failed. Redirecting...")
        setTimeout(() => router.push('/auth/login'), 2000)
      }
    }

    handleGoogleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-lg text-muted-foreground">{status}</p>
      </div>
    </div>
  )
}