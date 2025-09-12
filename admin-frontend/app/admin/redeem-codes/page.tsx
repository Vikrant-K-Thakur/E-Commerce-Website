"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Gift,
  Percent,
  Coins,
  Calendar,
  Users,
  Copy,
  Check
} from "lucide-react"

interface RedeemCode {
  id: string
  code: string
  type: string
  value: number
  title: string
  description: string
  validityDays: number
  usageLimit: number
  usedCount: number
  isActive: boolean
  created_at: string
  expires_at: string
}

export default function RedeemCodesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [redeemCodes, setRedeemCodes] = useState<RedeemCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [creating, setCreating] = useState(false)
  const [copiedCode, setCopiedCode] = useState("")

  // Form states
  const [codeType, setCodeType] = useState("discount")
  const [codeValue, setCodeValue] = useState("")
  const [codeTitle, setCodeTitle] = useState("")
  const [codeDescription, setCodeDescription] = useState("")
  const [validityDays, setValidityDays] = useState("30")
  const [usageLimit, setUsageLimit] = useState("100")

  const itemsPerPage = 8

  useEffect(() => {
    fetchRedeemCodes()
  }, [])

  const fetchRedeemCodes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/redeem-codes')
      const result = await response.json()
      if (result.success) {
        setRedeemCodes(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch redeem codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const createRedeemCode = async () => {
    if (!codeValue || !codeTitle || !codeDescription) {
      alert('Please fill in all fields')
      return
    }

    setCreating(true)

    try {
      const code = generateRandomCode()
      const response = await fetch('/api/redeem-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          code,
          type: codeType,
          value: parseFloat(codeValue),
          title: codeTitle,
          description: codeDescription,
          validityDays: parseInt(validityDays),
          usageLimit: parseInt(usageLimit)
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('Redeem code created successfully!')
        setShowCreateDialog(false)
        resetForm()
        fetchRedeemCodes()
      } else {
        alert('Error: ' + (result.error || 'Failed to create redeem code'))
      }
    } catch (error) {
      console.error('Failed to create redeem code:', error)
      alert('Network error: Failed to create redeem code')
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setCodeType("discount")
    setCodeValue("")
    setCodeTitle("")
    setCodeDescription("")
    setValidityDays("30")
    setUsageLimit("100")
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(""), 2000)
  }

  const toggleCodeStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/redeem-codes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle',
          id,
          isActive: !isActive
        })
      })

      if (response.ok) {
        fetchRedeemCodes()
      }
    } catch (error) {
      console.error('Failed to toggle code status:', error)
    }
  }

  const filteredCodes = redeemCodes.filter(
    (code) =>
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCodes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCodes = filteredCodes.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Redeem Codes Management</h1>
          <p className="text-gray-600 mt-1">Create and manage discount codes and coin rewards for customers.</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Codes</p>
                <p className="text-3xl font-bold text-gray-900">{redeemCodes.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Codes</p>
                <p className="text-3xl font-bold text-gray-900">{redeemCodes.filter(c => c.isActive).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                <p className="text-3xl font-bold text-gray-900">{redeemCodes.reduce((sum, c) => sum + c.usedCount, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired Codes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {redeemCodes.filter(c => new Date(c.expires_at) < new Date()).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Create */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Redeem Codes</CardTitle>
              <CardDescription>Manage discount codes and coin rewards for your customers.</CardDescription>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Redeem Code</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Code Type</Label>
                    <Select value={codeType} onValueChange={setCodeType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discount">Discount (%)</SelectItem>
                        <SelectItem value="coins">Gift Coins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Value</Label>
                    <Input
                      type="number"
                      value={codeValue}
                      onChange={(e) => setCodeValue(e.target.value)}
                      placeholder={codeType === 'discount' ? 'Enter percentage' : 'Enter coins amount'}
                    />
                  </div>
                  
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={codeTitle}
                      onChange={(e) => setCodeTitle(e.target.value)}
                      placeholder="Code title"
                    />
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={codeDescription}
                      onChange={(e) => setCodeDescription(e.target.value)}
                      placeholder="Code description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Validity (Days)</Label>
                      <Input
                        type="number"
                        value={validityDays}
                        onChange={(e) => setValidityDays(e.target.value)}
                        placeholder="30"
                      />
                    </div>
                    
                    <div>
                      <Label>Usage Limit</Label>
                      <Input
                        type="number"
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value)}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={createRedeemCode} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={creating}
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        Create Code
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search codes by code or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Codes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading codes...</span>
              </div>
            ) : paginatedCodes.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No redeem codes found
              </div>
            ) : (
              paginatedCodes.map((code) => {
                const isExpired = new Date(code.expires_at) < new Date()
                return (
                  <Card key={code.id} className={`border ${isExpired ? 'border-red-200 bg-red-50/50' : code.isActive ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-full ${
                            code.type === 'discount' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {code.type === 'discount' ? (
                              <Percent className="w-4 h-4 text-green-600" />
                            ) : (
                              <Coins className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <Badge variant={isExpired ? "destructive" : code.isActive ? "default" : "secondary"}>
                            {isExpired ? "Expired" : code.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {code.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(code.code)}
                            >
                              {copiedCode === code.code ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <h3 className="font-semibold text-sm">{code.title}</h3>
                          <p className="text-xs text-gray-600 line-clamp-2">{code.description}</p>
                        </div>

                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>Value:</span>
                            <span className="font-medium">
                              {code.type === 'discount' ? `${code.value}% OFF` : `${code.value} Coins`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Used:</span>
                            <span>{code.usedCount}/{code.usageLimit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expires:</span>
                            <span>{new Date(code.expires_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => toggleCodeStatus(code.id, code.isActive)}
                          >
                            {code.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCodes.length)} of{" "}
                {filteredCodes.length} codes
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}