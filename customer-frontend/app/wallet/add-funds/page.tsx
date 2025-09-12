"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, IndianRupee, Coins, CreditCard, Smartphone, QrCode, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const quickAmounts = [100, 250, 500, 1000]
const conversionRate = 1 // 1 Rupee = 1 Coins

export default function AddFundsPage() {
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("upi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const coinsToReceive = amount ? Math.floor(parseFloat(amount) * conversionRate) : 0

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
  }

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      })
      return
    }

    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add funds",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)

    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/wallet/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // Razorpay expects amount in paise
          currency: 'INR'
        })
      })

      const orderResult = await orderResponse.json()

      if (!orderResult.success) {
        throw new Error(orderResult.error || 'Failed to create order')
      }

      // Razorpay checkout options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with your key
        amount: parseFloat(amount) * 100,
        currency: 'INR',
        name: 'Your E-Commerce Store',
        description: `Add ${coinsToReceive} Coins to Wallet`,
        order_id: orderResult.orderId,
        handler: async function (response: any) {
          // Payment successful
          try {
            const verifyResponse = await fetch('/api/wallet/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: user.email,
                amount: parseFloat(amount),
                coins: coinsToReceive,
                paymentMethod: selectedMethod
              })
            })

            const verifyResult = await verifyResponse.json()

            if (verifyResult.success) {
              setIsProcessing(false)
              setShowSuccess(true)
              
              toast({
                title: "Payment Successful!",
                description: `${coinsToReceive} coins added to your wallet`,
              })
              
              // Reset form after success
              setTimeout(() => {
                setShowSuccess(false)
                setAmount("")
              }, 3000)
            } else {
              throw new Error(verifyResult.error || 'Payment verification failed')
            }
          } catch (error) {
            setIsProcessing(false)
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was deducted",
              variant: "destructive"
            })
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email,
          contact: user.phone || ''
        },
        notes: {
          email: user.email,
          coins: coinsToReceive
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false)
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment",
              variant: "destructive"
            })
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      setIsProcessing(false)
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              {amount} coins has been added to your wallet
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Coins Received</p>
              <p className="text-2xl font-bold text-blue-600">{coinsToReceive} Coins</p>
            </div>
            <Link href="/wallet">
              <Button className="w-full" onClick={() => window.location.reload()}>
                Go to Wallet
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/wallet">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Add Funds</h1>
          <div></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Conversion Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Conversion Rate</p>
                  <p className="text-sm text-gray-600">₹1 = {conversionRate} Coins</p>
                </div>
              </div>
              <div className="text-right">
                <Coins className="w-8 h-8 text-purple-600 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enter Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Amount (coins)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-10 text-lg h-12"
                />
              </div>
            </div>

            {/* Quick Amounts */}
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(value)}
                  className="text-sm"
                >
                  {value} coins
                </Button>
              ))}
            </div>

            {/* Coins Preview */}
            {amount && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">You will receive:</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-700">{coinsToReceive} Coins</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div 
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedMethod('upi')}
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">UPI Payment</p>
                  <p className="text-sm text-gray-600">Pay using any UPI app</p>
                </div>
                {selectedMethod === 'upi' && (
                  <Badge className="ml-auto bg-blue-100 text-blue-700">Selected</Badge>
                )}
              </div>
            </div>

            <div 
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedMethod('card')}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Debit/Credit Card</p>
                  <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
                </div>
                {selectedMethod === 'card' && (
                  <Badge className="ml-auto bg-blue-100 text-blue-700">Selected</Badge>
                )}
              </div>
            </div>

            <div 
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'netbanking' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedMethod('netbanking')}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">Net Banking</p>
                  <p className="text-sm text-gray-600">All major banks supported</p>
                </div>
                {selectedMethod === 'netbanking' && (
                  <Badge className="ml-auto bg-blue-100 text-blue-700">Selected</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card className="bg-green-50 border border-green-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-800 mb-2">💰 Money Settlement Details</h3>
            <div className="space-y-1 text-sm text-green-700">
              <p><strong>Payment Gateway:</strong> Razorpay</p>
              <p><strong>Settlement Account:</strong> Your registered bank account with Razorpay</p>
              <p><strong>Settlement Time:</strong> T+2 working days (automatic)</p>
              <p><strong>Transaction Fee:</strong> 2% + GST (deducted automatically)</p>
            </div>
            <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
              💡 <strong>Note:</strong> Money will be automatically transferred to your Razorpay registered bank account after T+2 days
            </div>
          </CardContent>
        </Card>

        {/* Proceed Button */}
        <Button 
          onClick={handleAddFunds}
          disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <IndianRupee className="w-4 h-4 mr-2" />
              Pay {amount || "0"} & Get {coinsToReceive} Coins
            </>
          )}
        </Button>

        {/* Security Note */}
        <div className="text-center text-xs text-gray-500 px-4">
          <p>🔒 Your payment is secured with 256-bit SSL encryption</p>
          <p>Coins will be added to your wallet instantly after successful payment</p>
        </div>
      </div>
    </div>
  )
}