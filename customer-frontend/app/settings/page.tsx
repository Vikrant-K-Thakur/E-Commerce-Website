"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Sun, Shield, HelpCircle, Info, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/contexts/auth-context"

export default function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications")
    const savedEmailNotifications = localStorage.getItem("emailNotifications")
    const savedPushNotifications = localStorage.getItem("pushNotifications")
    const savedDarkMode = localStorage.getItem("darkMode")
    const savedLanguage = localStorage.getItem("language")

    if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications))
    if (savedEmailNotifications !== null) setEmailNotifications(JSON.parse(savedEmailNotifications))
    if (savedPushNotifications !== null) setPushNotifications(JSON.parse(savedPushNotifications))
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode))
    if (savedLanguage) setLanguage(savedLanguage)
  }, [])

  const handleNotificationChange = (value: boolean) => {
    setNotifications(value)
    localStorage.setItem("notifications", JSON.stringify(value))
  }

  const handleEmailNotificationChange = (value: boolean) => {
    setEmailNotifications(value)
    localStorage.setItem("emailNotifications", JSON.stringify(value))
  }

  const handlePushNotificationChange = (value: boolean) => {
    setPushNotifications(value)
    localStorage.setItem("pushNotifications", JSON.stringify(value))
  }

  const handleDarkModeChange = (value: boolean) => {
    setDarkMode(value)
    localStorage.setItem("darkMode", JSON.stringify(value))
    if (value) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    localStorage.setItem("language", value)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Settings */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Account Email</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email || "Not logged in"}
              </p>
            </div>

            <div>
              <p className="font-medium">Account Name</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.name || "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">All Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive order updates and promotions
                </p>
              </div>
              <Switch checked={notifications} onCheckedChange={handleNotificationChange} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get updates via email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={handleEmailNotificationChange}
                disabled={!notifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get instant mobile alerts
                </p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={handlePushNotificationChange}
                disabled={!notifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Switch to dark theme</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={handleDarkModeChange} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your preferred language
                </p>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/orders">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div>
                  <p className="font-medium">Order History</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View your past orders</p>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180 text-gray-500 dark:text-gray-400" />
              </div>
            </Link>

            <Link href="/wallet">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div>
                  <p className="font-medium">Wallet & Coins</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your wallet balance
                  </p>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180 text-gray-500 dark:text-gray-400" />
              </div>
            </Link>

            <Link href="/addresses">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div>
                  <p className="font-medium">Saved Addresses</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage delivery addresses
                  </p>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180 text-gray-500 dark:text-gray-400" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <div className="space-y-2">
                <p className="font-medium text-blue-900 dark:text-blue-200">Contact Support</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Get help with your orders and queries
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">📞</span>
                  </div>
                  <a
                    href="tel:+919876543210"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    +91 98765 43210
                  </a>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Available: Mon-Sat, 9 AM - 6 PM
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div>
                <p className="font-medium">FAQ</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Frequently asked questions</p>
              </div>
              <ArrowLeft className="w-4 h-4 rotate-180 text-gray-500 dark:text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div>
                <p className="font-medium">Privacy Policy</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">How we protect your data</p>
              </div>
              <ArrowLeft className="w-4 h-4 rotate-180 text-gray-500 dark:text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div>
                <p className="font-medium">Terms of Service</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">App usage terms</p>
              </div>
              <ArrowLeft className="w-4 h-4 rotate-180 text-gray-500 dark:text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              App Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">App Version</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">1.0.0</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-medium">Last Updated</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dec 2024</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  )
}
