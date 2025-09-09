"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2, Home, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

export default function AddressesPage() {
  const { user } = useAuth()
  const [addressList, setAddressList] = useState([
    {
      id: 1,
      type: "home",
      label: "Home",
      name: user?.name || "User",
      address: user?.address || "No address provided",
      city: "",
      phone: user?.phone || "",
      isDefault: true,
    }
  ])

  const deleteAddress = (id: number) => {
    setAddressList((addresses) => addresses.filter((addr) => addr.id !== id))
  }

  const setAsDefault = (id: number) => {
    setAddressList((addresses) =>
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
  }

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
          <h1 className="text-lg font-semibold">Your Addresses</h1>
          <Link href="/addresses/add">
            <Button variant="ghost" size="icon">
              <Plus className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Add New Address */}
        <Link href="/addresses/add">
          <Card className="border-dashed border-2 hover:border-secondary transition-colors">
            <CardContent className="p-6 text-center">
              <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-medium text-foreground">Add New Address</p>
              <p className="text-sm text-muted-foreground">Add a new delivery address</p>
            </CardContent>
          </Card>
        </Link>

        {/* Address List */}
        <div className="space-y-3">
          {addressList.map((address) => (
            <Card key={address.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {address.type === "home" ? (
                          <Home className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Building className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.label}</span>
                          {address.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground">{user?.name || address.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link href={`/addresses/edit/${address.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteAddress(address.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{user?.address || address.address}</p>
                    <p>{address.city}</p>
                    <p>{user?.phone || address.phone}</p>
                  </div>

                  {!address.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => setAsDefault(address.id)}>
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
