"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  UserCheck,
  UserPlus,
  Coins,
  Search,
  Plus,
  Eye,
  Ban,
  Percent,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Loader2,
  Gift,
} from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  coinBalance: number
  status: string
  orderHistory: number
  joinDate: string
  address?: string
}

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showRewardDialog, setShowRewardDialog] = useState(false)
  const [rewardType, setRewardType] = useState("discount")
  const [rewardValue, setRewardValue] = useState("")
  const [rewardTitle, setRewardTitle] = useState("")
  const [rewardDescription, setRewardDescription] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [sendingReward, setSendingReward] = useState(false)
  const [showOrdersDialog, setShowOrdersDialog] = useState(false)
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const itemsPerPage = 5

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customers')
      const result = await response.json()
      if (result.success) {
        setCustomers(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  )

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

  const handleStatusChange = (customerId: string, newStatus: string) => {
    // TODO: Implement status change logic
    console.log(`Changing customer ${customerId} status to ${newStatus}`)
  }

  const handleSendDiscount = (customerId: string) => {
    // TODO: Implement discount sending logic
    console.log(`Sending discount to customer ${customerId}`)
  }

  const fetchCustomerOrders = async (customerEmail: string) => {
    setLoadingOrders(true)
    try {
      const response = await fetch(`/api/orders?email=${customerEmail}`)
      const result = await response.json()
      if (result.success) {
        setSelectedCustomerOrders(result.data)
        setShowOrdersDialog(true)
      }
    } catch (error) {
      console.error('Failed to fetch customer orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const sendReward = async () => {
    if (!rewardValue || !rewardTitle || !rewardDescription || !selectedCustomer) {
      alert('Please fill in all fields')
      return
    }
    
    setSendingReward(true)
    
    try {
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendReward',
          type: rewardType,
          value: parseFloat(rewardValue),
          title: rewardTitle,
          description: rewardDescription,
          customerEmail: selectedCustomer,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(result.message || 'Reward sent successfully!')
        setShowRewardDialog(false)
        setRewardValue("")
        setRewardTitle("")
        setRewardDescription("")
        setSelectedCustomer("")
        setRewardType("discount")
      } else {
        alert('Error: ' + (result.error || 'Failed to send reward'))
      }
    } catch (error) {
      console.error('Failed to send reward:', error)
      alert('Network error: Failed to send reward')
    } finally {
      setSendingReward(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage your customers, view their activity, and track loyalty programs.</p>
        </div>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-3xl font-bold text-gray-900">{customers.filter(c => c.status === 'Active').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-3xl font-bold text-gray-900">{customers.filter(c => {
                  const joinDate = new Date(c.joinDate)
                  const now = new Date()
                  return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
                }).length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rupee Balance</p>
                <p className="text-3xl font-bold text-gray-900">{customers.reduce((total, c) => total + c.coinBalance, 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>Search customers by name, email, or phone number.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Gift className="w-4 h-4 mr-2" />
                    Send Rewards
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Send Reward to Customers</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Customer</Label>
                      <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Customers</SelectItem>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.email}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Reward Type</Label>
                      <Select value={rewardType} onValueChange={setRewardType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discount">Discount (%)</SelectItem>
                          <SelectItem value="coins">Gift ₹</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Value</Label>
                      <Input
                        type="number"
                        value={rewardValue}
                        onChange={(e) => setRewardValue(e.target.value)}
                        placeholder={rewardType === 'discount' ? 'Enter percentage' : 'Enter amount(₹) '}
                      />
                    </div>
                    
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={rewardTitle}
                        onChange={(e) => setRewardTitle(e.target.value)}
                        placeholder="Reward title"
                      />
                    </div>
                    
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={rewardDescription}
                        onChange={(e) => setRewardDescription(e.target.value)}
                        placeholder="Reward description"
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      onClick={sendReward} 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={!rewardValue || !rewardTitle || !rewardDescription || !selectedCustomer || sendingReward}
                    >
                      {sendingReward ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4 mr-2" />
                          Send Reward
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Customer Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading customers...</span>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">NAME</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">EMAIL</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PHONE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">RUPEE BALANCE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STATUS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ORDER HISTORY</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{customer.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{customer.email}</td>
                        <td className="py-4 px-4 text-gray-600">{customer.phone}</td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">{customer.coinBalance.toLocaleString()} ₹</span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={customer.status === "Active" ? "default" : "destructive"}
                            className={customer.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                          >
                            {customer.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="link" className="p-0 h-auto text-blue-600">
                            {customer.orderHistory} orders
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of{" "}
              {filteredCustomers.length} customers
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Orders Dialog */}
      <Dialog open={showOrdersDialog} onOpenChange={setShowOrdersDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Order History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading orders...</span>
              </div>
            ) : selectedCustomerOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders found for this customer
              </div>
            ) : (
              selectedCustomerOrders.map((order) => (
                <Card key={order.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.orderId}</h3>
                        <p className="text-sm text-gray-600">{order.orderDate} at {order.orderTime}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={order.status === 'delivered' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'}
                          className={order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {order.status}
                        </Badge>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{order.total} ₹</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg'
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity} × {item.price} ₹</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">{(item.quantity * item.price)} ₹</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
