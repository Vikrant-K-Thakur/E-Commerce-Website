"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Truck, CreditCard, Wallet, Smartphone, Building, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const addresses = [
  {
    id: 1,
    name: "Alice Johnson",
    address: "123 Main Street, Apt 4B",
    city: "Springfield, IL 62704",
    phone: "+1 (555) 123-4567",
    isDefault: true,
  },
  {
    id: 2,
    name: "Alice Johnson",
    address: "456 Oak Avenue",
    city: "Otherville, NY 10001",
    phone: "+1 (555) 987-6543",
    isDefault: false,
  },
]

const deliveryOptions = [
  {
    id: "standard",
    name: "Standard Delivery",
    time: "5-7 business days",
    price: 0,
    description: "Free",
  },
  {
    id: "express",
    name: "Express Delivery",
    time: "Express by 2 business days",
    price: 14.5,
    description: "$14.50",
  },
  {
    id: "same-day",
    name: "Same Day Delivery",
    time: "Same day delivery",
    price: 29.0,
    description: "$29.00",
  },
]

const paymentMethods = [
  { id: "payme", name: "Payme Wallet", icon: Wallet },
  { id: "google-pay", name: "Google Pay", icon: Smartphone },
  { id: "phonepe", name: "Phone's Wallet", icon: Smartphone },
  { id: "cards", name: "Cards", icon: CreditCard },
  { id: "credit-card", name: "Credit Card", icon: CreditCard },
  { id: "debit-card", name: "Debit Card", icon: CreditCard },
  { id: "upi", name: "UPI", icon: Smartphone },
  { id: "jio-app", name: "Jio App", icon: Smartphone },
  { id: "net-banking", name: "Net Banking", icon: Building },
  { id: "cod", name: "Cash on Delivery", icon: Building },
]

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState("1")
  const [selectedDelivery, setSelectedDelivery] = useState("standard")
  const [selectedPayment, setSelectedPayment] = useState("")

  const subtotal = 1120.7
  const shipping = selectedDelivery === "standard" ? 0 : selectedDelivery === "express" ? 14.5 : 29.0
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Checkout</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Delivery Address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4" />
              Delivery Address
              <Button variant="ghost" size="sm" className="ml-auto text-secondary">
                Change
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-3">
                  <RadioGroupItem value={address.id.toString()} id={address.id.toString()} className="mt-1" />
                  <Label htmlFor={address.id.toString()} className="flex-1 cursor-pointer">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{address.name}</span>
                        {address.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{address.address}</p>
                      <p className="text-sm text-muted-foreground">{address.city}</p>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
              + Add New Address
            </Button>
          </CardContent>
        </Card>

        {/* Delivery Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="w-4 h-4" />
              Delivery Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery}>
              {deliveryOptions.map((option) => (
                <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="cursor-pointer">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option.name}</span>
                          {option.id === "express" && (
                            <Badge variant="destructive" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{option.time}</p>
                      </div>
                    </Label>
                  </div>
                  <span className="font-medium text-sm">{option.description}</span>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="w-4 h-4" />
              Payment Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon
                  return (
                    <div key={method.id} className="relative">
                      <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                      <Label
                        htmlFor={method.id}
                        className="flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer peer-checked:border-secondary peer-checked:bg-secondary/5 hover:bg-muted/50 transition-colors"
                      >
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                        <span className="text-xs font-medium text-center">{method.name}</span>
                      </Label>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Cash on Delivery */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Cash on Delivery</span>
              <span className="text-sm text-muted-foreground">₹0 Cash on Delivery</span>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Total Amount</h3>
              <Button variant="ghost" size="sm" className="text-secondary">
                View Price Details
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal (3 items)</span>
                <span>S$ {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `S$ ${shipping.toFixed(2)}`}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-base">
                <span>Total Amount</span>
                <span>S$ {total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 bg-background border-t p-4">
        <Button
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          disabled={!selectedPayment}
        >
          <div className="flex items-center justify-between w-full">
            <span>Proceed to Pay</span>
            <span>S$ {total.toFixed(2)}</span>
          </div>
        </Button>
      </div>
    </div>
  )
}
