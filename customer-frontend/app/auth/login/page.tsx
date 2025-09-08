"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, Apple, Facebook } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="NXTFIT Clothing" width={40} height={40} className="rounded-lg" />
          <span className="text-xl font-bold text-foreground">NXTFIT</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Log in or sign up</h1>
          </div>

          {/* Country/Region Selector */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Country/Region</label>
            <Select defaultValue="us">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">🇺🇸 United States (+1)</SelectItem>
                <SelectItem value="uk">🇬🇧 United Kingdom (+44)</SelectItem>
                <SelectItem value="ca">🇨🇦 Canada (+1)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Login Method Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setLoginMethod("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                loginMethod === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                loginMethod === "phone" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone
            </button>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              {loginMethod === "email" ? "Email address" : "Phone number"}
            </label>
            <Input
              type={loginMethod === "email" ? "email" : "tel"}
              placeholder={loginMethod === "email" ? "Enter your email" : "Enter your phone number"}
              className="w-full"
            />
          </div>

          {/* Continue Button */}
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Continue</Button>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">or</span>
          </div>

          {/* Social Login Options */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full flex items-center gap-3 bg-transparent">
              <Mail className="w-5 h-5" />
              Continue with Email
            </Button>

            <Button variant="outline" className="w-full flex items-center gap-3 bg-transparent">
              <Apple className="w-5 h-5" />
              Continue with Apple
            </Button>

            <Button variant="outline" className="w-full flex items-center gap-3 bg-transparent">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button variant="outline" className="w-full flex items-center gap-3 bg-transparent">
              <Facebook className="w-5 h-5" />
              Continue with Facebook
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-secondary underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-secondary underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
