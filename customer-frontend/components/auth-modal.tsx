"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Mail, Lock, User, Phone } from "lucide-react"

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, login, register, googleLogin, isLoading } = useAuth()
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", phone: "" })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1)
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: "", newPassword: "", confirmPassword: "", otp: "" })
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    try {
      await login(loginForm.email, loginForm.password)
      setSuccessMessage("Login successful!")
    } catch (error: any) {
      console.error("Login failed:", error)
      setErrorMessage(error.message || "Login failed. Please check your credentials.")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    try {
      await register(registerForm.name, registerForm.email, registerForm.password)
      setSuccessMessage("Account created successfully!")
    } catch (error: any) {
      console.error("Registration failed:", error)
      setErrorMessage(error.message || "Registration failed. Please try again.")
    }
  }

  const handleForgotPasswordSendOTP = async () => {
    if (!forgotPasswordData.email) {
      setErrorMessage("Please enter your email address")
      return
    }
    if (!forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword) {
      setErrorMessage("Please fill in both password fields")
      return
    }
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }
    if (forgotPasswordData.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long")
      return
    }

    setForgotPasswordLoading(true)
    setErrorMessage("")
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'forgotPassword',
          email: forgotPasswordData.email
        })
      })

      const result = await response.json()
      if (result.success) {
        setForgotPasswordStep(2)
        setSuccessMessage('OTP sent to your email! Please check your inbox.')
      } else {
        setErrorMessage(result.error || 'Failed to send OTP')
      }
    } catch (error) {
      setErrorMessage('Failed to send OTP. Please try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const handleForgotPasswordReset = async () => {
    if (!forgotPasswordData.otp) {
      setErrorMessage("Please enter the OTP")
      return
    }

    setForgotPasswordLoading(true)
    setErrorMessage("")
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'changePassword',
          email: forgotPasswordData.email,
          newPassword: forgotPasswordData.newPassword,
          otp: forgotPasswordData.otp
        })
      })

      const result = await response.json()
      if (result.success) {
        setSuccessMessage('Password reset successfully! You can now login with your new password.')
        handleCloseForgotPassword()
      } else {
        setErrorMessage(result.error || 'Failed to reset password')
      }
    } catch (error) {
      setErrorMessage('Failed to reset password. Please try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false)
    setForgotPasswordStep(1)
    setForgotPasswordData({ email: "", newPassword: "", confirmPassword: "", otp: "" })
    setErrorMessage("")
    setSuccessMessage("")
  }

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Welcome to NXTFIT</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            {/* Error/Success Messages */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent" onClick={googleLogin}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-6">
            {/* Error/Success Messages */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Reset Password
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Error/Success Messages */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}
            
            {forgotPasswordStep === 1 ? (
              // Step 1: Enter email and new password
              <>
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-blue-700">
                    Enter your email and new password. We'll send you an OTP to reset your password.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    value={forgotPasswordData.email}
                    onChange={(e) => setForgotPasswordData({...forgotPasswordData, email: e.target.value})}
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input
                    type="password"
                    value={forgotPasswordData.newPassword}
                    onChange={(e) => setForgotPasswordData({...forgotPasswordData, newPassword: e.target.value})}
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <Input
                    type="password"
                    value={forgotPasswordData.confirmPassword}
                    onChange={(e) => setForgotPasswordData({...forgotPasswordData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleCloseForgotPassword}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleForgotPasswordSendOTP}
                    disabled={forgotPasswordLoading}
                    className="flex-1"
                  >
                    {forgotPasswordLoading ? 'Sending...' : 'Send OTP'}
                  </Button>
                </div>
              </>
            ) : (
              // Step 2: Enter OTP
              <>
                <div className="text-center space-y-2">
                  <Mail className="w-12 h-12 mx-auto text-blue-500" />
                  <h3 className="font-medium">OTP Verification</h3>
                  <p className="text-sm text-gray-600">
                    We've sent a password reset OTP to your email address. Please check your inbox.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter OTP</label>
                  <Input
                    type="text"
                    value={forgotPasswordData.otp}
                    onChange={(e) => setForgotPasswordData({...forgotPasswordData, otp: e.target.value})}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setForgotPasswordStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleForgotPasswordReset}
                    disabled={forgotPasswordLoading}
                    className="flex-1"
                  >
                    {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleForgotPasswordSendOTP}
                    disabled={forgotPasswordLoading}
                    className="text-blue-600"
                  >
                    Didn't receive? Resend OTP
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
