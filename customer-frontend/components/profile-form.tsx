"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Save, X, Lock, Mail } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function ProfileForm() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  
  // Change Password States
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordStep, setPasswordStep] = useState(1) // 1: Enter passwords, 2: Enter OTP
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    await updateProfile(formData)
    setIsEditing(false)
    setIsLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || ''
    })
    setIsEditing(false)
  }

  const handleSendOTP = async () => {
    // For forgot password, only validate new password fields
    if (isForgotPassword) {
      if (!passwordData.newPassword || !passwordData.confirmPassword) {
        alert('Please fill new password fields')
        return
      }
    } else {
      // For change password, validate all fields including current password
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        alert('Please fill all password fields')
        return
      }
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long')
      return
    }

    setPasswordLoading(true)
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isForgotPassword ? 'forgotPassword' : 'sendOTP',
          email: user?.email,
          currentPassword: isForgotPassword ? undefined : passwordData.currentPassword
        })
      })

      const result = await response.json()
      if (result.success) {
        setOtpSent(true)
        setPasswordStep(2)
        alert('OTP sent to your email! Please check your inbox.')
      } else {
        alert(result.error || 'Failed to send OTP')
      }
    } catch (error) {
      alert('Failed to send OTP. Please try again.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.otp) {
      alert('Please enter the OTP')
      return
    }

    setPasswordLoading(true)
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'changePassword',
          email: user?.email,
          newPassword: passwordData.newPassword,
          otp: passwordData.otp
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('Password changed successfully!')
        handleCloseChangePassword()
      } else {
        alert(result.error || 'Failed to change password')
      }
    } catch (error) {
      alert('Failed to change password. Please try again.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleCloseChangePassword = () => {
    setShowChangePassword(false)
    setPasswordStep(1)
    setIsForgotPassword(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      otp: ''
    })
    setOtpSent(false)
  }

  const handleForgotPassword = () => {
    setIsForgotPassword(true)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      otp: ''
    })
  }

  if (!user) return null

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            className="w-16 h-16 rounded-full bg-muted"
          />
          <div className="flex-1 space-y-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Name"
                  className="h-8"
                />
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Phone"
                  className="h-8"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.phone || 'No phone number'}</p>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isLoading}
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          </Button>
        </div>

        {isEditing && (
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Enter your address"
              rows={3}
            />
          </div>
        )}
        
        {!isEditing && user.address && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <label className="text-sm font-medium text-muted-foreground">Address</label>
            <p className="text-sm mt-1">{user.address}</p>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-transparent"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-transparent"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-transparent"
                onClick={() => setShowChangePassword(true)}
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </>
          )}
        </div>
      </CardContent>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              {isForgotPassword ? 'Reset Password' : 'Change Password'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {passwordStep === 1 ? (
              // Step 1: Enter passwords
              <>
                {!isForgotPassword && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                    />
                  </div>
                )}
                
                {isForgotPassword && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-700">
                      You'll receive an OTP on your email to reset your password.
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>
                
                {!isForgotPassword && (
                  <div className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleForgotPassword}
                      className="text-blue-600"
                    >
                      Forgot your current password?
                    </Button>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  {isForgotPassword ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsForgotPassword(false)}
                      className="flex-1"
                    >
                      Back to Change Password
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={handleCloseChangePassword}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    onClick={handleSendOTP}
                    disabled={passwordLoading}
                    className="flex-1"
                  >
                    {passwordLoading ? 'Sending...' : (isForgotPassword ? 'Send Reset OTP' : 'Send OTP')}
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
                    {isForgotPassword 
                      ? 'We\'ve sent a password reset OTP to your email address. Please check your inbox.' 
                      : 'We\'ve sent a 6-digit OTP to your email address. Please check your inbox.'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter OTP</label>
                  <Input
                    type="text"
                    value={passwordData.otp}
                    onChange={(e) => setPasswordData({...passwordData, otp: e.target.value})}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setPasswordStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="flex-1"
                  >
                    {passwordLoading ? (isForgotPassword ? 'Resetting...' : 'Changing...') : (isForgotPassword ? 'Reset Password' : 'Change Password')}
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSendOTP}
                    disabled={passwordLoading}
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
    </Card>
  )
}