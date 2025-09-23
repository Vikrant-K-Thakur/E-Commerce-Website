"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Home, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

export default function AddAddressPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    label: "",
    type: "home",
    name: user?.name || "",
    address: "",
    city: "",
    phone: user?.phone || "",
    isDefault: false
  })

  const handleSave = async () => {
    if (!formData.label || !formData.name || !formData.address) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      // For now, we'll update the user's main address
      const response = await fetch('/api/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: user?.email,
          phone: formData.phone,
          address: formData.address
        })
      })

      const result = await response.json()
      if (result.success) {
        // Update user context with new address
        if (user) {
          const updatedUser = { 
            ...user, 
            name: formData.name,
            phone: formData.phone,
            address: formData.address 
          }
          localStorage.setItem('nxtfit_user', JSON.stringify(updatedUser))
          window.dispatchEvent(new Event('storage'))
        }
        
        alert('Address added successfully!')
        router.push('/addresses')
      } else {
        alert('Failed to add address. Please try again.')
      }
    } catch (error) {
      console.error('Failed to add address:', error)
      alert('Failed to add address. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/addresses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Add New Address</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Address Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address Type */}
            <div className="space-y-2">
              <Label>Address Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={formData.type === "home" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData({...formData, type: "home"})}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
                <Button
                  variant={formData.type === "work" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData({...formData, type: "work"})}
                  className="flex items-center gap-2"
                >
                  <Building className="w-4 h-4" />
                  Work
                </Button>
              </div>
            </div>

            {/* Address Label */}
            <div className="space-y-2">
              <Label>Address Label *</Label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                placeholder="e.g., Home, Office, etc."
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Complete Address *</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="House/Flat no., Building name, Street, Area"
                rows={3}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Enter city"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>

            {/* Save Button */}
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/addresses')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Address
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}