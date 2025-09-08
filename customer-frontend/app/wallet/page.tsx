"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Clock, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const walletBalance = 1250.75
const quickAmounts = [25.0, 50.0, 100.0]

const transactions = [
  {
    id: 1,
    type: "credit",
    description: "Added Funds",
    amount: 100.0,
    date: "2023-11-20",
    time: "14:30",
    status: "completed",
  },
  {
    id: 2,
    type: "debit",
    description: "Order Payment - #R001234",
    amount: -85.0,
    date: "2023-11-19",
    time: "10:15",
    status: "completed",
  },
  {
    id: 3,
    type: "credit",
    description: "Refund - Order #R001230",
    amount: 45.99,
    date: "2023-11-18",
    time: "16:45",
    status: "completed",
  },
  {
    id: 4,
    type: "debit",
    description: "Order Payment - #R001233",
    amount: -120.5,
    date: "2023-11-17",
    time: "09:22",
    status: "completed",
  },
  {
    id: 5,
    type: "credit",
    description: "Added Funds",
    amount: 200.0,
    date: "2023-11-15",
    time: "11:30",
    status: "pending",
  },
]

export default function WalletPage() {
  const [addAmount, setAddAmount] = useState("")

  const handleQuickAmount = (amount: number) => {
    setAddAmount(amount.toFixed(2))
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
          <h1 className="text-lg font-semibold">Wallet</h1>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Balance */}
        <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-0">
          <CardContent className="p-6 text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-4xl font-bold text-foreground">${walletBalance.toFixed(2)}</p>
            </div>

            <div className="flex gap-3">
              <Link href="/wallet/add-funds" className="flex-1">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
              </Link>
              <Link href="/wallet/history" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  View History
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Add Funds */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Amount to Add</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(amount)}
                  className="text-xs"
                >
                  ${amount.toFixed(0)}
                </Button>
              ))}
            </div>

            <Button
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              disabled={!addAmount || Number.parseFloat(addAmount) <= 0}
            >
              Confirm Add Funds
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{transaction.date}</span>
                        <span>{transaction.time}</span>
                        {transaction.status === "pending" && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "credit" ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/wallet/history">
              <Button variant="ghost" className="w-full mt-4">
                View All Transactions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
