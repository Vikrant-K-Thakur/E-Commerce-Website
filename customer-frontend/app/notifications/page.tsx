"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Package, Gift, Percent, Users, Settings, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notificationList, setNotificationList] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("new")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      fetchNotifications()
    }
  }, [user?.email])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/notifications?email=${user?.email}`)
      const result = await response.json()
      if (result.success) {
        setNotificationList(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', notificationId: id })
      })
      
      setNotificationList((notifications) =>
        notifications.map((notif) => (notif._id === id ? { ...notif, read: true } : notif)),
      )
      
      // Trigger a page reload to update counts in other components
      window.dispatchEvent(new Event('notificationUpdate'))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const deleteNotification = (id: string) => {
    setNotificationList((notifications) => notifications.filter((notif) => notif._id !== id))
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead', email: user?.email })
      })
      
      setNotificationList((notifications) => notifications.map((notif) => ({ ...notif, read: true })))
      
      // Trigger a page reload to update counts in other components
      window.dispatchEvent(new Event('notificationUpdate'))
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const filteredNotifications = notificationList.filter((notif) => {
    if (activeTab === "new") return !notif.read
    return true
  })

  const unreadCount = notificationList.filter((notif) => !notif.read).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Notifications</h1>
          <Link href="/notifications/settings">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Mark All Read */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {unreadCount} new notification{unreadCount !== 1 ? "s" : ""}
            </p>
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new" className="relative">
              New Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3 mt-4">
            {loading ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const IconComponent = notification.type === 'order' ? Package : Bell
                return (
                  <Card
                    key={notification._id}
                    className={`cursor-pointer transition-colors ${
                      !notification.read ? "bg-secondary/5 border-secondary/20" : ""
                    }`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            notification.type === "order"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <h3
                              className={`font-medium text-sm ${
                                !notification.read ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification._id)
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>

                          <p className="text-sm text-muted-foreground text-pretty">{notification.message}</p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                            {!notification.read && <div className="w-2 h-2 bg-secondary rounded-full"></div>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {activeTab === "new"
                    ? "You're all caught up! No new notifications."
                    : "No notifications in this category."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
