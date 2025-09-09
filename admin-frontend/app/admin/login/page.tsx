"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { setAuthCookie, validateLogin } from "../../../lib/auth"

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const params = useSearchParams()
  const redirect = params.get("redirect") || "/admin/dashboard"

  function handleLogin() {
    setError(null)
    setIsLoading(true)

    setTimeout(() => {
      const ok = validateLogin(username.trim(), password)
      if (!ok) {
        setError("Invalid username or password")
        setIsLoading(false)
        return
      }
      setAuthCookie()
      window.location.href = redirect
    }, 500)
  }

  useEffect(() => {
    const el = document.getElementById("username") as HTMLInputElement | null
    el?.focus()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <img src="/logo.jpg" alt="Logo" className="h-8 w-auto brightness-0 invert" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Admin Login
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            Welcome back! Please sign in to continue
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="pl-10 pr-12 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}