"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Megaphone, Plus, Edit, Trash2, MoreHorizontal, Percent, Users, Coins, ImageIcon, Settings } from "lucide-react"

const couponData = [
  {
    code: "SUMMER25",
    percentageOff: 25,
    usageLimit: 500,
    used: 342,
    status: "Active",
    expiryDate: "2024-08-31",
  },
  {
    code: "WELCOME10",
    percentageOff: 10,
    usageLimit: 1000,
    used: 756,
    status: "Active",
    expiryDate: "2024-12-31",
  },
  {
    code: "FREESHIP",
    percentageOff: 0,
    usageLimit: 200,
    used: 189,
    status: "Active",
    expiryDate: "2024-09-15",
    type: "Free Shipping",
  },
  {
    code: "SPRING15",
    percentageOff: 15,
    usageLimit: 300,
    used: 300,
    status: "Expired",
    expiryDate: "2024-06-30",
  },
  {
    code: "NEWUSER",
    percentageOff: 20,
    usageLimit: 500,
    used: 234,
    status: "Active",
    expiryDate: "2024-10-31",
  },
]

const bannerData = [
  {
    id: 1,
    title: "Summer Sale!",
    subtitle: "Up to 50% off on selected items",
    bgColor: "bg-gradient-to-r from-orange-400 to-red-500",
    textColor: "text-white",
    status: "Active",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Check out our latest collection",
    bgColor: "bg-gradient-to-r from-purple-400 to-pink-500",
    textColor: "text-white",
    status: "Active",
  },
  {
    id: 3,
    title: "Weekend Deal",
    subtitle: "Special offers this weekend only",
    bgColor: "bg-gradient-to-r from-green-400 to-blue-500",
    textColor: "text-white",
    status: "Draft",
  },
]

export default function PromotionsMarketing() {
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedCoupon, setSelectedCoupon] = useState("")
  const [loyaltyPointsPerDollar, setLoyaltyPointsPerDollar] = useState("10")
  const [redemptionValue, setRedemptionValue] = useState("0.01")
  const [selectedUser, setSelectedUser] = useState("")
  const [coinAdjustment, setCoinAdjustment] = useState("")

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        variant={status === "Active" ? "default" : status === "Expired" ? "destructive" : "secondary"}
        className={
          status === "Active"
            ? "bg-green-100 text-green-800"
            : status === "Expired"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
        }
      >
        {status}
      </Badge>
    )
  }

  const applyCoupon = () => {
    if (selectedCustomer && selectedCoupon) {
      console.log(`Applying coupon ${selectedCoupon} to customer ${selectedCustomer}`)
      // TODO: Implement coupon application logic
    }
  }

  const adjustUserCoins = () => {
    if (selectedUser && coinAdjustment) {
      console.log(`Adjusting ${coinAdjustment} coins for user ${selectedUser}`)
      // TODO: Implement coin adjustment logic
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions & Marketing Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage coupons, loyalty programs, and promotional campaigns.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Promotion
        </Button>
      </div>

      {/* Coupon & Discount Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-5 h-5" />
                Coupon & Discount Management
              </CardTitle>
              <CardDescription>Create and manage discount codes for your customers.</CardDescription>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Coupon
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">CODE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">DISCOUNT</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">USAGE LIMIT</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">USED</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STATUS</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {couponData.map((coupon, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{coupon.code}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">
                        {coupon.type === "Free Shipping" ? "Free Shipping" : `${coupon.percentageOff}%`}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{coupon.usageLimit.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{coupon.used.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(coupon.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Analytics</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate Coupon</DropdownMenuItem>
                            <DropdownMenuItem>Export Usage Data</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User-Specific Coupon Assignment & Loyalty Coin Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User-Specific Coupon Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User-Specific Coupon Assignment
            </CardTitle>
            <CardDescription>Assign coupons to specific customers or groups.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer-select" className="text-sm font-medium text-gray-700">
                Select Customer or Group
              </Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose customer or group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alice-smith">Alice Smith</SelectItem>
                  <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
                  <SelectItem value="vip-customers">VIP Customers Group</SelectItem>
                  <SelectItem value="new-customers">New Customers Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="coupon-select" className="text-sm font-medium text-gray-700">
                Select Coupon
              </Label>
              <Select value={selectedCoupon} onValueChange={setSelectedCoupon}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose coupon" />
                </SelectTrigger>
                <SelectContent>
                  {couponData
                    .filter((c) => c.status === "Active")
                    .map((coupon) => (
                      <SelectItem key={coupon.code} value={coupon.code}>
                        {coupon.code} - {coupon.type === "Free Shipping" ? "Free Shipping" : `${coupon.percentageOff}%`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={applyCoupon} className="w-full bg-blue-600 hover:bg-blue-700">
              Apply Coupon
            </Button>
          </CardContent>
        </Card>

        {/* Loyalty Coin Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Loyalty Coin Control
            </CardTitle>
            <CardDescription>Manage loyalty program settings and user rewards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="loyalty-settings" className="text-sm font-medium text-gray-700">
                Loyalty Program Settings
              </Label>
              <div className="mt-2 space-y-3">
                <div>
                  <Label htmlFor="points-per-dollar" className="text-xs text-gray-600">
                    Points per dollar spent
                  </Label>
                  <Input
                    id="points-per-dollar"
                    value={loyaltyPointsPerDollar}
                    onChange={(e) => setLoyaltyPointsPerDollar(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="redemption-value" className="text-xs text-gray-600">
                    Redemption Value ($ per point)
                  </Label>
                  <Input
                    id="redemption-value"
                    value={redemptionValue}
                    onChange={(e) => setRedemptionValue(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Settings className="w-4 h-4 mr-2" />
              Update Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Adjust User Coins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Adjust User Coins
          </CardTitle>
          <CardDescription>Manually adjust loyalty coins for specific users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="user-select" className="text-sm font-medium text-gray-700">
                Select User
              </Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alice-smith">Alice Smith (500 coins)</SelectItem>
                  <SelectItem value="bob-johnson">Bob Johnson (1200 coins)</SelectItem>
                  <SelectItem value="charlie-brown">Charlie Brown (150 coins)</SelectItem>
                  <SelectItem value="diana-prince">Diana Prince (800 coins)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="coin-adjustment" className="text-sm font-medium text-gray-700">
                Coin Adjustment (+/-)
              </Label>
              <Input
                id="coin-adjustment"
                placeholder="e.g., +100 or -50"
                value={coinAdjustment}
                onChange={(e) => setCoinAdjustment(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={adjustUserCoins} className="w-full bg-purple-600 hover:bg-purple-700">
                Adjust Coins
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banner Ads Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Banner Ads Management
              </CardTitle>
              <CardDescription>Create and manage promotional banners for your website.</CardDescription>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bannerData.map((banner) => (
              <div key={banner.id} className="space-y-3">
                <div className={`${banner.bgColor} ${banner.textColor} p-6 rounded-lg text-center`}>
                  <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                  <p className="text-sm opacity-90">{banner.subtitle}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">{getStatusBadge(banner.status)}</div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Homepage Promotions Setup */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                Homepage Promotions Setup
              </CardTitle>
              <CardDescription>Configure featured promotions and campaigns for your homepage.</CardDescription>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Promotion
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Featured Promotion */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Featured Promotion</h4>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Featured and Promotional Campaign!</h3>
                <p className="text-sm opacity-90">Special deals and exclusive offers</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Secondary Promotion */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Secondary Promotion</h4>
              <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Limited Time Offer!</h3>
                <p className="text-sm opacity-90">Don't miss out on these amazing deals</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
