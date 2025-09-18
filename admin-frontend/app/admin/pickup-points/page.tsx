"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Phone,
  Clock,
  Loader2,
} from "lucide-react"

interface PickupPoint {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  contactPhone: string
  timings: string
  isActive: boolean
  created_at: string
}

export default function PickupPointsManagement() {
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingPoint, setEditingPoint] = useState<PickupPoint | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    contactPhone: '',
    timings: '',
    isActive: true
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPickupPoints()
  }, [])

  const fetchPickupPoints = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pickup-points')
      const result = await response.json()
      if (result.success) {
        setPickupPoints(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch pickup points:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.latitude || !formData.longitude) {
      alert('Please fill all required fields')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/pickup-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingPoint ? 'update' : 'create',
          id: editingPoint?.id,
          ...formData
        })
      })

      const result = await response.json()
      if (result.success) {
        fetchPickupPoints()
        handleCloseDialog()
        alert(editingPoint ? 'Pickup point updated successfully!' : 'Pickup point created successfully!')
      } else {
        alert(result.error || 'Operation failed')
      }
    } catch (error) {
      alert('Operation failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (point: PickupPoint) => {
    setEditingPoint(point)
    setFormData({
      name: point.name,
      address: point.address,
      latitude: point.latitude.toString(),
      longitude: point.longitude.toString(),
      contactPhone: point.contactPhone,
      timings: point.timings,
      isActive: point.isActive
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pickup point?')) return

    try {
      const response = await fetch('/api/pickup-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      })

      const result = await response.json()
      if (result.success) {
        fetchPickupPoints()
        alert('Pickup point deleted successfully!')
      } else {
        alert(result.error || 'Delete failed')
      }
    } catch (error) {
      alert('Delete failed. Please try again.')
    }
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setEditingPoint(null)
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      contactPhone: '',
      timings: '',
      isActive: true
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pickup Points Management</h1>
          <p className="text-gray-600 mt-1">Manage delivery pickup locations for customers.</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Pickup Point
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPoint ? 'Edit Pickup Point' : 'Add New Pickup Point'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., VIT College Main Gate"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Address *</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Full address of pickup point"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude *</Label>
                  <Input
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    placeholder="12.9716"
                    type="number"
                    step="any"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitude *</Label>
                  <Input
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    placeholder="77.5946"
                    type="number"
                    step="any"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  placeholder="+91 9876543210"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Timings</Label>
                <Input
                  value={formData.timings}
                  onChange={(e) => setFormData({...formData, timings: e.target.value})}
                  placeholder="9:00 AM - 6:00 PM"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label>Active</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleCloseDialog} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingPoint ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingPoint ? 'Update' : 'Create'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pickup Points List */}
      <Card>
        <CardHeader>
          <CardTitle>Pickup Points ({pickupPoints.length})</CardTitle>
          <CardDescription>Manage all delivery pickup locations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading pickup points...</span>
            </div>
          ) : pickupPoints.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No pickup points added yet</p>
              <p className="text-sm text-gray-400">Add your first pickup point to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pickupPoints.map((point) => (
                <div key={point.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{point.name}</h3>
                        <Badge variant={point.isActive ? "default" : "secondary"}>
                          {point.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{point.address}</span>
                        </div>
                        
                        {point.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{point.contactPhone}</span>
                          </div>
                        )}
                        
                        {point.timings && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{point.timings}</span>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          Coordinates: {point.latitude}, {point.longitude}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(point)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(point.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}