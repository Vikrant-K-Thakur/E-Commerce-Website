"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Save, X } from "lucide-react"
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
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Change Password
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}