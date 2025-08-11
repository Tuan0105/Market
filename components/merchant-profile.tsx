"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStallData } from "@/lib/stall-data-context"
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  FileText,
  Filter,
  Home,
  Mail,
  MapPin,
  Phone,
  Plus,
  Receipt,
  Save,
  Search,
  SortAsc,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react"
import { useState } from "react"

interface MerchantProfileProps {
  onBack: () => void
}

interface Merchant {
  id: string
  name: string
  stallId: string
  phone: string
  email: string
  address: string
  zone: string
  contractId: string
  contractStartDate: string
  contractEndDate: string
  status: "active" | "inactive" | "suspended"
  totalDebt: number
  monthlyRent: number
  joinDate: string
}

interface Transaction {
  id: string
  date: string
  type: string
  amount: number
  status: "paid" | "unpaid" | "partial"
  description: string
  paymentMethod?: string
}

export function MerchantProfile({ onBack }: MerchantProfileProps) {
  const { stalls, transactions, invoices } = useStallData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [error, setError] = useState("")
  const [isAddMerchantSheetOpen, setIsAddMerchantSheetOpen] = useState(false)
  const [isEditMerchantModalOpen, setIsEditMerchantModalOpen] = useState(false)
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null)
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [transactionSearchQuery, setTransactionSearchQuery] = useState("")
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<"all" | "paid" | "unpaid" | "partial">("all")
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<"all" | "rent" | "deposit" | "penalty" | "other">("all")
  const [transactionDateFilter, setTransactionDateFilter] = useState<"all" | "today" | "week" | "month" | "year">("all")
  
  // New filter states
  const [searchType, setSearchType] = useState<"all" | "name" | "stallId" | "phone">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "suspended">("all")
  const [zoneFilter, setZoneFilter] = useState<"all" | "A" | "B" | "C" | "D">("all")
  const [sortBy, setSortBy] = useState<"name" | "joinDate" | "debt" | "stallId">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [newMerchant, setNewMerchant] = useState({
    name: "",
    stallId: "",
    phone: "",
    email: "",
    address: "",
    zone: "",
    monthlyRent: 0,
    contractStartDate: "",
    contractEndDate: "",
    status: "active" as const
  })

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Validation function
  const validateField = (fieldName: string, value: string | number) => {
    const errors = { ...validationErrors }
    
    switch (fieldName) {
      case "name":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors.name = "Tên tiểu thương là bắt buộc"
        } else {
          delete errors.name
        }
        break
      case "stallId":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors.stallId = "Mã gian hàng là bắt buộc"
        } else if (merchants.some(m => m.stallId === value)) {
          errors.stallId = "Mã gian hàng đã tồn tại"
        } else {
          delete errors.stallId
        }
        break
      case "phone":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors.phone = "Số điện thoại là bắt buộc"
        } else if (typeof value === "string" && !/^[0-9]{10,11}$/.test(value.replace(/\s/g, ""))) {
          errors.phone = "Số điện thoại không hợp lệ (10-11 số)"
        } else {
          delete errors.phone
        }
        break
      case "address":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors.address = "Địa chỉ thường trú là bắt buộc"
        } else {
          delete errors.address
        }
        break
      case "zone":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors.zone = "Khu vực kinh doanh là bắt buộc"
        } else {
          delete errors.zone
        }
        break
      case "monthlyRent":
        if (!value || value === 0) {
          errors.monthlyRent = "Phí thuê hàng tháng là bắt buộc"
        } else if (typeof value === "number" && value < 0) {
          errors.monthlyRent = "Phí thuê không được âm"
        } else {
          delete errors.monthlyRent
        }
        break
      case "contractStartDate":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors.contractStartDate = "Ngày bắt đầu hợp đồng là bắt buộc"
        } else {
          delete errors.contractStartDate
        }
        break
      case "contractEndDate":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors.contractEndDate = "Ngày kết thúc hợp đồng là bắt buộc"
        } else if (newMerchant.contractStartDate && new Date(value as string) <= new Date(newMerchant.contractStartDate)) {
          errors.contractEndDate = "Ngày kết thúc phải sau ngày bắt đầu"
        } else {
          delete errors.contractEndDate
        }
        break
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validate all fields and show all errors at once
  const validateAllFields = () => {
    const fields = ["name", "stallId", "phone", "address", "zone", "monthlyRent", "contractStartDate", "contractEndDate"]
    const newErrors: Record<string, string> = {}
    
    fields.forEach(field => {
      const value = newMerchant[field as keyof typeof newMerchant]
      
      switch (field) {
        case "name":
          if (!value || (typeof value === "string" && value.trim() === "")) {
            newErrors.name = "Tên tiểu thương là bắt buộc"
          }
          break
        case "stallId":
          if (!value || (typeof value === "string" && value.trim() === "")) {
            newErrors.stallId = "Mã gian hàng là bắt buộc"
          } else if (merchants.some(m => m.stallId === value)) {
            newErrors.stallId = "Mã gian hàng đã tồn tại"
          }
          break
        case "phone":
          if (!value || (typeof value === "string" && value.trim() === "")) {
            newErrors.phone = "Số điện thoại là bắt buộc"
          } else if (typeof value === "string" && !/^[0-9]{10,11}$/.test(value.replace(/\s/g, ""))) {
            newErrors.phone = "Số điện thoại không hợp lệ (10-11 số)"
          }
          break
        case "address":
          if (!value || (typeof value === "string" && value.trim() === "")) {
            newErrors.address = "Địa chỉ thường trú là bắt buộc"
          }
          break
        case "zone":
          if (!value || (typeof value === "string" && value.trim() === "")) {
            newErrors.zone = "Khu vực kinh doanh là bắt buộc"
          }
          break
        case "monthlyRent":
          if (!value || value === 0) {
            newErrors.monthlyRent = "Phí thuê hàng tháng là bắt buộc"
          } else if (typeof value === "number" && value < 0) {
            newErrors.monthlyRent = "Phí thuê không được âm"
          }
          break
        case "contractStartDate":
          if (!value || (typeof value === "string" && value.trim() === "")) {
            newErrors.contractStartDate = "Ngày bắt đầu hợp đồng là bắt buộc"
          }
          break
        case "contractEndDate":
          if (!value || (typeof value === "string" && value.trim() === "")) {
            newErrors.contractEndDate = "Ngày kết thúc hợp đồng là bắt buộc"
          } else if (newMerchant.contractStartDate && new Date(value as string) <= new Date(newMerchant.contractStartDate)) {
            newErrors.contractEndDate = "Ngày kết thúc phải sau ngày bắt đầu"
          }
          break
      }
    })
    
    // Set all errors at once
    setValidationErrors(newErrors)
    
    // Return true if no errors
    return Object.keys(newErrors).length === 0
  }

  // Convert stalls to merchants format
  const merchants: Merchant[] = stalls
    .filter(stall => stall.merchantName && stall.status === "occupied")
    .map(stall => ({
      id: stall.id,
      name: stall.merchantName,
      stallId: stall.code,
      phone: stall.phone || "",
      email: stall.email || "",
      address: stall.address || "",
      zone: stall.category === "food" ? "Khu A - Thực phẩm tươi sống" :
            stall.category === "spices" ? "Khu B - Thực phẩm khô" :
            stall.category === "clothing" ? "Khu C - Quần áo & Phụ kiện" :
            stall.category === "beverages" ? "Khu E - Đồ uống & Giải khát" :
            "Khu D - Gia vị",
      contractId: `HD-${stall.contractStartDate?.split('-')[0] || '2024'}-${stall.id.padStart(3, '0')}`,
      contractStartDate: stall.contractStartDate || "",
      contractEndDate: stall.contractEndDate || "",
      status: stall.status === "occupied" ? "active" : 
              stall.status === "expiring" ? "suspended" : "inactive",
      totalDebt: stall.currentDebt || 0,
      monthlyRent: stall.monthlyRent,
      joinDate: stall.contractStartDate || "",
    }))

    // Convert transactions and invoices to the format expected by this component
  const merchantTransactions: Record<string, Transaction[]> = {}
  
  // Add transactions (paid)
  transactions.forEach(transaction => {
    const stall = stalls.find(s => s.code === transaction.stallCode)
    if (stall) {
      if (!merchantTransactions[stall.id]) {
        merchantTransactions[stall.id] = []
      }
      
      merchantTransactions[stall.id].push({
        id: transaction.id,
        date: transaction.timestamp.toISOString().split('T')[0],
        type: transaction.paymentDescription.includes("mặt bằng") ? "rent" :
              transaction.paymentDescription.includes("điện") ? "electricity" :
              transaction.paymentDescription.includes("vệ sinh") ? "sanitation" : "other",
        amount: transaction.amount,
        status: transaction.status === "Thành công" ? "paid" : "unpaid",
        description: transaction.paymentDescription,
        paymentMethod: transaction.paymentMethod,
      })
    }
  })

  // Add unpaid invoices
  invoices.forEach(invoice => {
    const stall = stalls.find(s => s.code === invoice.stallCode)
    if (stall && invoice.status === "unpaid") {
      if (!merchantTransactions[stall.id]) {
        merchantTransactions[stall.id] = []
      }
      
      merchantTransactions[stall.id].push({
        id: invoice.id,
        date: invoice.dueDate,
        type: invoice.feeType.includes("mặt bằng") ? "rent" :
              invoice.feeType.includes("điện") ? "electricity" :
              invoice.feeType.includes("vệ sinh") ? "sanitation" : "other",
        amount: invoice.amount,
        status: "unpaid",
        description: invoice.description || invoice.feeType,
        paymentMethod: undefined,
      })
    }
  })


  const handleSearch = () => {
    setError("")
    const filteredAndSorted = getFilteredAndSortedMerchants()
    const found = filteredAndSorted.find(
      (m) => {
        if (searchType === "all") {
          return m.stallId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 m.phone.toLowerCase().includes(searchQuery.toLowerCase())
        } else if (searchType === "name") {
          return m.name.toLowerCase().includes(searchQuery.toLowerCase())
        } else if (searchType === "stallId") {
          return m.stallId.toLowerCase().includes(searchQuery.toLowerCase())
        } else if (searchType === "phone") {
          return m.phone.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return false
      }
    )

    if (found) {
      setSelectedMerchant(found)
    } else {
      setError("Không tìm thấy tiểu thương")
    }
  }

  const getFilteredAndSortedMerchants = () => {
    let filtered = merchants.filter(merchant => {
      // Filter by status
      if (statusFilter !== "all" && merchant.status !== statusFilter) return false
      
      // Filter by zone
      if (zoneFilter !== "all" && !merchant.zone.toLowerCase().includes(`khu ${zoneFilter.toLowerCase()}`)) return false
      
      return true
    })

    // Sort merchants
    filtered.sort((a, b) => {
      let aValue: string | number = ""
      let bValue: string | number = ""
      
      switch (sortBy) {
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "joinDate":
          aValue = new Date(a.joinDate).getTime()
          bValue = new Date(b.joinDate).getTime()
          break
        case "debt":
          aValue = a.totalDebt
          bValue = b.totalDebt
          break
        case "stallId":
          aValue = a.stallId
          bValue = b.stallId
          break
      }
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

    return filtered
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Tạm ngưng</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>
      case "unpaid":
        return <Badge className="bg-red-100 text-red-800">Chưa thanh toán</Badge>
      case "partial":
        return <Badge className="bg-orange-100 text-orange-800">Thanh toán một phần</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getFilteredTransactions = (merchantId: string) => {
    const transactions = merchantTransactions[merchantId] || []
    
    return transactions.filter((transaction) => {
      // Lọc theo từ khóa tìm kiếm
      const matchesSearch = 
        transaction.description.toLowerCase().includes(transactionSearchQuery.toLowerCase()) ||
        transaction.type.toLowerCase().includes(transactionSearchQuery.toLowerCase()) ||
        (transaction.paymentMethod && transaction.paymentMethod.toLowerCase().includes(transactionSearchQuery.toLowerCase()))
      
      // Lọc theo trạng thái
      const matchesStatus = transactionStatusFilter === "all" || transaction.status === transactionStatusFilter
      
      // Lọc theo loại giao dịch
      const matchesType = transactionTypeFilter === "all" || transaction.type.toLowerCase().includes(transactionTypeFilter)
      
      // Lọc theo ngày
      const transactionDate = new Date(transaction.date)
      const today = new Date()
      let matchesDate = true
      
      switch (transactionDateFilter) {
        case "today":
          // So sánh ngày tháng năm (bỏ qua giờ phút giây)
          const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
          const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
          matchesDate = transactionDate >= todayStart && transactionDate <= todayEnd
          break
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = transactionDate >= weekAgo
          break
        case "month":
          const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1) // Đầu tháng hiện tại
          matchesDate = transactionDate >= monthAgo
          break
        case "year":
          const yearStart = new Date(today.getFullYear(), 0, 1) // Đầu năm hiện tại
          matchesDate = transactionDate >= yearStart
          break
        default:
          matchesDate = true
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate
    })
  }

  const renderSearchSection = () => {
    const filteredMerchants = getFilteredAndSortedMerchants()
    
    return (
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            Tìm kiếm & Quản lý Tiểu thương
          </CardTitle>
          <CardDescription>Tìm kiếm, lọc và sắp xếp danh sách tiểu thương</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Advanced Search */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="search" className="text-sm font-medium">Tìm kiếm</Label>
                <div className="flex gap-2 mt-1">
                  <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="name">Tên</SelectItem>
                      <SelectItem value="stallId">Mã gian</SelectItem>
                      <SelectItem value="phone">SĐT</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="search"
                    placeholder={
                      searchType === "name" ? "Nhập tên tiểu thương..." :
                      searchType === "stallId" ? "Nhập mã gian hàng..." :
                      searchType === "phone" ? "Nhập số điện thoại..." :
                      "Tìm theo tên, mã gian hàng, SĐT..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                    <Search className="w-4 h-4 mr-2" />
                    Tìm
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Sắp xếp theo</Label>
                <div className="flex gap-1 mt-1">
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Tên A-Z</SelectItem>
                      <SelectItem value="stallId">Mã gian</SelectItem>
                      <SelectItem value="joinDate">Ngày tham gia</SelectItem>
                      <SelectItem value="debt">Công nợ</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="shrink-0"
                  >
                    <SortAsc className={`w-4 h-4 ${sortOrder === "desc" ? "rotate-180" : ""} transition-transform`} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Lọc:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <div className="flex gap-1">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                    className={statusFilter === "all" ? "bg-blue-600 text-white" : ""}
                  >
                    Tất cả
                  </Button>
                  <Button
                    variant={statusFilter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("active")}
                    className={statusFilter === "active" ? "bg-green-600 text-white" : ""}
                  >
                    Hoạt động
                  </Button>
                  <Button
                    variant={statusFilter === "suspended" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("suspended")}
                    className={statusFilter === "suspended" ? "bg-red-600 text-white" : ""}
                  >
                    Tạm ngừng
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Khu vực:</span>
                <div className="flex gap-1">
                  <Button
                    variant={zoneFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setZoneFilter("all")}
                    className={zoneFilter === "all" ? "bg-blue-600 text-white" : ""}
                  >
                    Tất cả
                  </Button>
                  {["A", "B", "C", "D"].map(zone => (
                    <Button
                      key={zone}
                      variant={zoneFilter === zone ? "default" : "outline"}
                      size="sm"
                      onClick={() => setZoneFilter(zone as any)}
                      className={zoneFilter === zone ? "bg-purple-600 text-white" : ""}
                    >
                      Khu {zone}
                    </Button>
                  ))}
                </div>
              </div>

              {(statusFilter !== "all" || zoneFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all")
                    setZoneFilter("all")
                  }}
                  className="ml-auto"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Tổng số</p>
                    <p className="text-2xl font-bold text-blue-700">{filteredMerchants.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Hoạt động</p>
                    <p className="text-2xl font-bold text-green-700">
                      {filteredMerchants.filter(m => m.status === "active").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-red-600">Có công nợ</p>
                    <p className="text-2xl font-bold text-red-700">
                      {filteredMerchants.filter(m => m.totalDebt > 0).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-600">Tổng công nợ</p>
                    <p className="text-lg font-bold text-orange-700">
                      {(filteredMerchants.reduce((sum, m) => sum + m.totalDebt, 0) / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Merchant List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h4 className="font-semibold text-gray-900">Danh sách tiểu thương ({filteredMerchants.length})</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedMerchants.length === filteredMerchants.length && filteredMerchants.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMerchants(filteredMerchants.map(m => m.id))
                      } else {
                        setSelectedMerchants([])
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Chọn tất cả</span>
                </div>
              </div>
              {selectedMerchants.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Đã chọn {selectedMerchants.length} tiểu thương
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa đã chọn
                  </Button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMerchants.map((merchant) => (
                <Card
                  key={merchant.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-gray-50 ${
                    selectedMerchants.includes(merchant.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedMerchants.includes(merchant.id)}
                        onChange={(e) => {
                          e.stopPropagation()
                          if (e.target.checked) {
                            setSelectedMerchants([...selectedMerchants, merchant.id])
                          } else {
                            setSelectedMerchants(selectedMerchants.filter(id => id !== merchant.id))
                          }
                        }}
                        className="mt-1 rounded"
                      />
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          setSearchQuery(merchant.stallId)
                          setSelectedMerchant(merchant)
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-900">{merchant.name}</p>
                              <p className="text-sm text-gray-600">#{merchant.stallId}</p>
                            </div>
                            {getStatusBadge(merchant.status)}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">{merchant.zone}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Phí/tháng: {formatCurrency(merchant.monthlyRent)}</span>
                              {merchant.totalDebt > 0 && (
                                <span className="text-red-600 font-medium">Nợ: {formatCurrency(merchant.totalDebt)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredMerchants.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">Không tìm thấy tiểu thương nào</p>
                <p className="text-sm text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderMerchantProfile = () => {
    if (!selectedMerchant) return null

    const transactions = merchantTransactions[selectedMerchant.id] || []
    const unpaidTransactions = transactions.filter((t) => t.status === "unpaid")

    return (
      <div className="space-y-6">
        {/* Basic Info Card - Cải thiện layout */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  {selectedMerchant.name}
                </CardTitle>
                <CardDescription className="text-base mt-1">Mã gian hàng: #{selectedMerchant.stallId}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedMerchant.status)}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingMerchant({ ...selectedMerchant })
                    setIsEditMerchantModalOpen(true)
                  }}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Tối ưu layout thành 2 cột thay vì 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    Thông tin liên hệ
                  </h4>
                  <div className="space-y-4 pl-7">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Số điện thoại</p>
                        <p className="font-medium">{selectedMerchant.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Địa chỉ</p>
                        <p className="font-medium">{selectedMerchant.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Khu vực</p>
                        <p className="font-medium">{selectedMerchant.zone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    Thông tin Hợp đồng & Tài chính
                  </h4>
                  <div className="space-y-4 pl-7">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Mã hợp đồng</p>
                        <p className="font-medium">{selectedMerchant.contractId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Thời hạn hợp đồng</p>
                        <p className="font-medium">
                          {new Date(selectedMerchant.contractStartDate).toLocaleDateString("vi-VN")} -{" "}
                          {new Date(selectedMerchant.contractEndDate).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Phí thuê hàng tháng</p>
                        <p className="font-bold text-lg text-green-600">{formatCurrency(selectedMerchant.monthlyRent)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Tổng công nợ</p>
                        <p
                          className={`font-bold text-lg ${selectedMerchant.totalDebt > 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {formatCurrency(selectedMerchant.totalDebt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs - Modern Design */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-0">
            <Tabs defaultValue="transactions" className="w-full">
              <div className="border-b border-gray-200">
                <TabsList className="w-full justify-start bg-transparent border-0 p-0">
                  <TabsTrigger 
                    value="transactions" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent hover:text-blue-600 transition-colors px-6 py-3"
                  >
                    Lịch sử Giao dịch
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unpaid" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-600 data-[state=active]:text-red-600 rounded-none border-b-2 border-transparent hover:text-red-600 transition-colors px-6 py-3"
                  >
                    Hóa đơn Chưa thanh toán
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contract" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none border-b-2 border-transparent hover:text-purple-600 transition-colors px-6 py-3"
                  >
                    Chi tiết Hợp đồng
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="transactions" className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Lịch sử Giao dịch</h3>
                    <Badge variant="outline">
                      {getFilteredTransactions(selectedMerchant.id).length} giao dịch
                    </Badge>
                  </div>

                  {/* Bộ lọc và tìm kiếm */}
                  <div className="space-y-4">
                    {/* Tìm kiếm */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Tìm kiếm theo mô tả, loại giao dịch, phương thức..."
                        value={transactionSearchQuery}
                        onChange={(e) => setTransactionSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Bộ lọc */}
                    <div className="space-y-4">
                      {/* Lọc theo trạng thái */}
                      <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Trạng thái</Label>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={transactionStatusFilter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionStatusFilter("all")}
                            className={transactionStatusFilter === "all" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                          >
                            Tất cả
                          </Button>
                          <Button
                            variant={transactionStatusFilter === "paid" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionStatusFilter("paid")}
                            className={transactionStatusFilter === "paid" ? "bg-green-600 text-white hover:bg-green-700" : ""}
                          >
                            Đã thanh toán
                          </Button>
                          <Button
                            variant={transactionStatusFilter === "unpaid" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionStatusFilter("unpaid")}
                            className={transactionStatusFilter === "unpaid" ? "bg-red-600 text-white hover:bg-red-700" : ""}
                          >
                            Chưa thanh toán
                          </Button>
                          <Button
                            variant={transactionStatusFilter === "partial" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionStatusFilter("partial")}
                            className={transactionStatusFilter === "partial" ? "bg-orange-600 text-white hover:bg-orange-700" : ""}
                          >
                            Một phần
                          </Button>
                        </div>
                      </div>

                      {/* Lọc theo loại giao dịch */}
                      <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Loại giao dịch</Label>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={transactionTypeFilter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionTypeFilter("all")}
                            className={transactionTypeFilter === "all" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                          >
                            Tất cả
                          </Button>
                          <Button
                            variant={transactionTypeFilter === "rent" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionTypeFilter("rent")}
                            className={transactionTypeFilter === "rent" ? "bg-purple-600 text-white hover:bg-purple-700" : ""}
                          >
                            Tiền thuê
                          </Button>
                          <Button
                            variant={transactionTypeFilter === "deposit" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionTypeFilter("deposit")}
                            className={transactionTypeFilter === "deposit" ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""}
                          >
                            Tiền cọc
                          </Button>
                          <Button
                            variant={transactionTypeFilter === "penalty" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionTypeFilter("penalty")}
                            className={transactionTypeFilter === "penalty" ? "bg-red-600 text-white hover:bg-red-700" : ""}
                          >
                            Tiền phạt
                          </Button>
                          <Button
                            variant={transactionTypeFilter === "other" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionTypeFilter("other")}
                            className={transactionTypeFilter === "other" ? "bg-gray-600 text-white hover:bg-gray-700" : ""}
                          >
                            Khác
                          </Button>
                        </div>
                      </div>

                      {/* Lọc theo thời gian */}
                      <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Thời gian</Label>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={transactionDateFilter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionDateFilter("all")}
                            className={transactionDateFilter === "all" ? "bg-blue-600 text-white hover:bg-blue-700 font-medium" : ""}
                          >
                            Tất cả
                          </Button>
                          <Button
                            variant={transactionDateFilter === "today" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionDateFilter("today")}
                            className={transactionDateFilter === "today" ? "bg-blue-600 text-white hover:bg-blue-700 font-medium" : ""}
                          >
                            Hôm nay
                          </Button>
                          <Button
                            variant={transactionDateFilter === "week" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionDateFilter("week")}
                            className={transactionDateFilter === "week" ? "bg-blue-600 text-white hover:bg-blue-700 font-medium" : ""}
                          >
                            Tuần này
                          </Button>
                          <Button
                            variant={transactionDateFilter === "month" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionDateFilter("month")}
                            className={transactionDateFilter === "month" ? "bg-blue-600 text-white hover:bg-blue-700 font-medium" : ""}
                          >
                            Tháng này
                          </Button>
                          <Button
                            variant={transactionDateFilter === "year" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTransactionDateFilter("year")}
                            className={transactionDateFilter === "year" ? "bg-blue-600 text-white hover:bg-blue-700 font-medium" : ""}
                          >
                            Năm nay
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Nút reset bộ lọc */}
                    {(transactionSearchQuery || transactionStatusFilter !== "all" || transactionTypeFilter !== "all" || transactionDateFilter !== "all") && (
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setTransactionSearchQuery("")
                            setTransactionStatusFilter("all")
                            setTransactionTypeFilter("all")
                            setTransactionDateFilter("all")
                          }}
                        >
                          Xóa bộ lọc
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Danh sách giao dịch - Thêm hover effects */}
                  <div className="space-y-3">
                    {getFilteredTransactions(selectedMerchant.id).length > 0 ? (
                      getFilteredTransactions(selectedMerchant.id).map((transaction) => (
                        <div 
                          key={transaction.id} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                              <Receipt className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <div>
                              <p className="font-semibold group-hover:text-blue-700 transition-colors">{transaction.description}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(transaction.date).toLocaleDateString("vi-VN")} • {transaction.type}
                              </p>
                              {transaction.paymentMethod && (
                                <p className="text-sm text-gray-500">Phương thức: {transaction.paymentMethod}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatCurrency(transaction.amount)}</p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">Không tìm thấy giao dịch nào phù hợp với bộ lọc</p>
                        <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="unpaid" className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Hóa đơn Chưa thanh toán</h3>
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      {unpaidTransactions.length} hóa đơn
                    </Badge>
                  </div>

                  {unpaidTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {unpaidTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50"
                        >
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-600">
                                Hạn thanh toán: {new Date(transaction.date).toLocaleDateString("vi-VN")}
                              </p>
                              <p className="text-sm text-red-600">
                                Quá hạn{" "}
                                {Math.floor(
                                  (new Date().getTime() - new Date(transaction.date).getTime()) / (1000 * 60 * 60 * 24),
                                )}{" "}
                                ngày
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-600">{formatCurrency(transaction.amount)}</p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-gray-600">Không có hóa đơn chưa thanh toán</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="contract" className="p-6">
                <div className="space-y-6">
                  <h3 className="font-medium">Chi tiết Hợp đồng</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-600">Mã hợp đồng</Label>
                        <p className="font-medium">{selectedMerchant.contractId}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Ngày bắt đầu</Label>
                        <p className="font-medium">
                          {new Date(selectedMerchant.contractStartDate).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Ngày kết thúc</Label>
                        <p className="font-medium">
                          {new Date(selectedMerchant.contractEndDate).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-600">Khu vực</Label>
                        <p className="font-medium">{selectedMerchant.zone}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Phí thuê hàng tháng</Label>
                        <p className="font-medium">{formatCurrency(selectedMerchant.monthlyRent)}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Ngày gia nhập</Label>
                        <p className="font-medium">{new Date(selectedMerchant.joinDate).toLocaleDateString("vi-VN")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Thời hạn hợp đồng</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Hợp đồng còn lại{" "}
                      {Math.floor(
                        (new Date(selectedMerchant.contractEndDate).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      ngày
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={selectedMerchant ? () => setSelectedMerchant(null) : onBack}
            variant="ghost"
            size="icon"
            className="h-10 w-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedMerchant ? `Hồ sơ ${selectedMerchant.name}` : "Hồ sơ Tiểu thương"}
            </h1>
            <p className="text-gray-600">
              {selectedMerchant ? "Xem thông tin chi tiết và lịch sử giao dịch" : "Xem thông tin chi tiết và lịch sử giao dịch"}
            </p>
          </div>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddMerchantSheetOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Tiểu thương mới
        </Button>
      </div>

      {!selectedMerchant ? renderSearchSection() : renderMerchantProfile()}

      {selectedMerchant && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setSelectedMerchant(null)}>
            Tìm kiếm tiểu thương khác
          </Button>
        </div>
      )}

      {/* Add Merchant Sheet - Side Panel */}
      <Sheet open={isAddMerchantSheetOpen} onOpenChange={setIsAddMerchantSheetOpen}>
        <SheetContent side="right" className="overflow-y-auto p-0">
          <SheetHeader className="space-y-4 pb-6 border-b p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <SheetTitle className="text-xl font-bold">Thêm Tiểu thương mới</SheetTitle>
                  <SheetDescription>
                    Điền đầy đủ thông tin để tạo hồ sơ tiểu thương mới
                  </SheetDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsAddMerchantSheetOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="p-6 space-y-8">
            {/* Thông tin cá nhân */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Tên tiểu thương <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={newMerchant.name}
                    onChange={(e) => setNewMerchant({...newMerchant, name: e.target.value})}
                    onBlur={() => validateField("name", newMerchant.name)}
                    placeholder="Nhập họ và tên đầy đủ..."
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.name ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.name}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stallId" className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    Mã gian hàng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stallId"
                    value={newMerchant.stallId}
                    onChange={(e) => setNewMerchant({...newMerchant, stallId: e.target.value})}
                    onBlur={() => validateField("stallId", newMerchant.stallId)}
                    placeholder="VD: A01, B02, C15..."
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.stallId ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {validationErrors.stallId && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.stallId}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={newMerchant.phone}
                    onChange={(e) => setNewMerchant({...newMerchant, phone: e.target.value})}
                    onBlur={() => validateField("phone", newMerchant.phone)}
                    placeholder="0901 234 567"
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.phone ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.phone}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email (Tùy chọn)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMerchant.email}
                    onChange={(e) => setNewMerchant({...newMerchant, email: e.target.value})}
                    placeholder="example@gmail.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="lg:col-span-2 space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-500" />
                    Địa chỉ thường trú <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={newMerchant.address}
                    onChange={(e) => setNewMerchant({...newMerchant, address: e.target.value})}
                    onBlur={() => validateField("address", newMerchant.address)}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.address ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Thông tin kinh doanh */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Building2 className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Thông tin kinh doanh</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="zone" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Khu vực kinh doanh <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newMerchant.zone}
                    onValueChange={(value) => {
                      setNewMerchant({...newMerchant, zone: value})
                      validateField("zone", value)
                    }}
                  >
                    <SelectTrigger className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.zone ? "border-red-500 focus:ring-red-500" : ""
                    }`}>
                      <SelectValue placeholder="Chọn khu vực kinh doanh..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Khu A - Thực phẩm tươi sống">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Khu A - Thực phẩm tươi sống
                        </div>
                      </SelectItem>
                      <SelectItem value="Khu B - Thực phẩm khô">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          Khu B - Thực phẩm khô
                        </div>
                      </SelectItem>
                      <SelectItem value="Khu C - Quần áo & Phụ kiện">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          Khu C - Quần áo & Phụ kiện
                        </div>
                      </SelectItem>
                      <SelectItem value="Khu D - Đồ uống & Thức ăn nhanh">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          Khu D - Đồ uống & Thức ăn nhanh
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.zone && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.zone}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    Trạng thái hoạt động
                  </Label>
                  <Select
                    value={newMerchant.status}
                    onValueChange={(value) => setNewMerchant({...newMerchant, status: value as any})}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Đang hoạt động
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          Không hoạt động
                        </div>
                      </SelectItem>
                      <SelectItem value="suspended">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          Tạm ngưng
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Thông tin hợp đồng & tài chính */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <CreditCard className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Thông tin hợp đồng & tài chính</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent" className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    Phí thuê/tháng (VND) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={newMerchant.monthlyRent}
                    onChange={(e) => setNewMerchant({...newMerchant, monthlyRent: parseInt(e.target.value) || 0})}
                    onBlur={() => validateField("monthlyRent", newMerchant.monthlyRent)}
                    placeholder="5,000,000"
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.monthlyRent ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {validationErrors.monthlyRent ? (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.monthlyRent}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {newMerchant.monthlyRent ? new Intl.NumberFormat("vi-VN").format(newMerchant.monthlyRent) + " VND" : "Nhập số tiền"}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contractStart" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Ngày bắt đầu HĐ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contractStart"
                    type="date"
                    value={newMerchant.contractStartDate}
                    onChange={(e) => setNewMerchant({...newMerchant, contractStartDate: e.target.value})}
                    onBlur={() => validateField("contractStartDate", newMerchant.contractStartDate)}
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.contractStartDate ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {validationErrors.contractStartDate && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.contractStartDate}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contractEnd" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Ngày kết thúc HĐ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contractEnd"
                    type="date"
                    value={newMerchant.contractEndDate}
                    onChange={(e) => setNewMerchant({...newMerchant, contractEndDate: e.target.value})}
                    onBlur={() => validateField("contractEndDate", newMerchant.contractEndDate)}
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.contractEndDate ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {validationErrors.contractEndDate && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.contractEndDate}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Contract Duration Display */}
              {newMerchant.contractStartDate && newMerchant.contractEndDate && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Thời hạn hợp đồng:</span>
                    <span>
                      {Math.ceil(
                        (new Date(newMerchant.contractEndDate).getTime() - new Date(newMerchant.contractStartDate).getTime()) / 
                        (1000 * 60 * 60 * 24)
                      )} ngày
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="text-red-500">*</span> Các trường bắt buộc
              </p>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddMerchantSheetOpen(false)
                    setNewMerchant({
                      name: "",
                      stallId: "",
                      phone: "",
                      email: "",
                      address: "",
                      zone: "",
                      monthlyRent: 0,
                      contractStartDate: "",
                      contractEndDate: "",
                      status: "active"
                    })
                    setValidationErrors({})
                  }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy bỏ
                </Button>
                <Button 
                  onClick={() => {
                    // Validation với inline errors
                    if (!validateAllFields()) {
                      return // Errors will be shown inline
                    }

                    // Thêm logic lưu tiểu thương mới
                    const newMerchantData: Merchant = {
                      id: String(merchants.length + 1),
                      name: newMerchant.name,
                      stallId: newMerchant.stallId,
                      phone: newMerchant.phone,
                      email: newMerchant.email,
                      address: newMerchant.address,
                      zone: newMerchant.zone,
                      contractId: `HD-${new Date().getFullYear()}-${String(merchants.length + 1).padStart(3, '0')}`,
                      contractStartDate: newMerchant.contractStartDate,
                      contractEndDate: newMerchant.contractEndDate,
                      status: newMerchant.status,
                      totalDebt: 0,
                      monthlyRent: newMerchant.monthlyRent,
                      joinDate: newMerchant.contractStartDate,
                    }
                    
                    // Note: Cannot add new merchants as data is read-only from context
                    
                    // Reset form and clear errors
                    setNewMerchant({
                      name: "",
                      stallId: "",
                      phone: "",
                      email: "",
                      address: "",
                      zone: "",
                      monthlyRent: 0,
                      contractStartDate: "",
                      contractEndDate: "",
                      status: "active"
                    })
                    setValidationErrors({})
                    
                    setIsAddMerchantSheetOpen(false)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Tạo hồ sơ tiểu thương
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Merchant Modal */}
      <Dialog open={isEditMerchantModalOpen} onOpenChange={setIsEditMerchantModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin tiểu thương</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tên tiểu thương</Label>
                <Input
                  value={editingMerchant?.name || ""}
                  onChange={(e) => setEditingMerchant(editingMerchant ? {...editingMerchant, name: e.target.value} : null)}
                  placeholder="Nhập tên tiểu thương..."
                />
              </div>
              <div>
                <Label>Mã gian hàng</Label>
                <Input
                  value={editingMerchant?.stallId || ""}
                  onChange={(e) => setEditingMerchant(editingMerchant ? {...editingMerchant, stallId: e.target.value} : null)}
                  placeholder="VD: A01, B02..."
                />
              </div>
              <div>
                <Label>Số điện thoại</Label>
                <Input
                  value={editingMerchant?.phone || ""}
                  onChange={(e) => setEditingMerchant(editingMerchant ? {...editingMerchant, phone: e.target.value} : null)}
                  placeholder="Nhập số điện thoại..."
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editingMerchant?.email || ""}
                  onChange={(e) => setEditingMerchant(editingMerchant ? {...editingMerchant, email: e.target.value} : null)}
                  placeholder="Nhập email..."
                />
              </div>
              <div className="md:col-span-2">
                <Label>Địa chỉ</Label>
                <Input
                  value={editingMerchant?.address || ""}
                  onChange={(e) => setEditingMerchant(editingMerchant ? {...editingMerchant, address: e.target.value} : null)}
                  placeholder="Nhập địa chỉ..."
                />
              </div>
              <div>
                <Label>Khu vực</Label>
                <Input
                  value={editingMerchant?.zone || ""}
                  onChange={(e) => setEditingMerchant(editingMerchant ? {...editingMerchant, zone: e.target.value} : null)}
                  placeholder="VD: Khu A - Thực phẩm..."
                />
              </div>
              <div>
                <Label>Phí thuê hàng tháng (VND)</Label>
                <Input
                  type="number"
                  value={editingMerchant?.monthlyRent || 0}
                  onChange={(e) => setEditingMerchant(editingMerchant ? {...editingMerchant, monthlyRent: parseInt(e.target.value) || 0} : null)}
                  placeholder="Nhập phí thuê..."
                />
              </div>
              <div>
                <Label>Ngày bắt đầu hợp đồng</Label>
                <Input
                  type="date"
                  value={editingMerchant?.contractStartDate || ""}
                  onChange={(e) => setEditingMerchant(editingMerchant ? {...editingMerchant, contractStartDate: e.target.value} : null)}
                />
              </div>
              <div>
                <Label>Ngày kết thúc hợp đồng</Label>
                <Input
                  type="date"
                  value={editingMerchant?.contractEndDate || ""}
                  onChange={(e) => setEditingMerchant(editingMerchant ? {...editingMerchant, contractEndDate: e.target.value} : null)}
                />
              </div>
              <div>
                <Label>Trạng thái</Label>
                <Select
                  value={editingMerchant?.status || "active"}
                  onValueChange={(value) => setEditingMerchant(editingMerchant ? {...editingMerchant, status: value as any} : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="suspended">Tạm ngưng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditMerchantModalOpen(false)
                  setEditingMerchant(null)
                }}
              >
                Hủy
              </Button>
              <Button 
                onClick={() => {
                  if (editingMerchant && editingMerchant.name && editingMerchant.stallId) {
                    // Note: Cannot update merchants as data is read-only from context
                    // const updatedMerchants = merchants.map(merchant => 
                    //   merchant.id === editingMerchant.id ? editingMerchant : merchant
                    // )
                    // setMerchants(updatedMerchants)
                    
                    // Cập nhật selectedMerchant nếu đang xem tiểu thương này
                    if (selectedMerchant && selectedMerchant.id === editingMerchant.id) {
                      setSelectedMerchant(editingMerchant)
                    }
                    
                    setIsEditMerchantModalOpen(false)
                    setEditingMerchant(null)
                  }
                }}
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Xác nhận xóa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa {selectedMerchants.length} tiểu thương đã chọn? 
              Hành động này không thể hoàn tác.
            </p>
            
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-700 font-medium">Tiểu thương sẽ bị xóa:</p>
              <div className="mt-2 space-y-1">
                {merchants
                  .filter(merchant => selectedMerchants.includes(merchant.id))
                  .map(merchant => (
                    <div key={merchant.id} className="text-sm text-red-600">
                      • {merchant.name} - {merchant.stallId}
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteModalOpen(false)
                }}
              >
                Hủy
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  // Note: Cannot delete merchants as data is read-only from context
                  // const updatedMerchants = merchants.filter(
                  //   merchant => !selectedMerchants.includes(merchant.id)
                  // )
                  // setMerchants(updatedMerchants)
                  
                  // Reset selected merchants và selected merchant nếu bị xóa
                  setSelectedMerchants([])
                  if (selectedMerchant && selectedMerchants.includes(selectedMerchant.id)) {
                    setSelectedMerchant(null)
                  }
                  
                  setIsDeleteModalOpen(false)
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa vĩnh viễn
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
