"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  User,
  Phone,
  MapPin,
  Calendar,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [error, setError] = useState("")
  const [isAddMerchantModalOpen, setIsAddMerchantModalOpen] = useState(false)
  const [isEditMerchantModalOpen, setIsEditMerchantModalOpen] = useState(false)
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null)
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [transactionSearchQuery, setTransactionSearchQuery] = useState("")
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<"all" | "paid" | "unpaid" | "partial">("all")
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<"all" | "rent" | "deposit" | "penalty" | "other">("all")
  const [transactionDateFilter, setTransactionDateFilter] = useState<"all" | "today" | "week" | "month" | "year">("all")
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

  // Sample data - chuyển thành state để có thể thêm mới
  const [merchants, setMerchants] = useState<Merchant[]>([
    {
      id: "1",
      name: "Nguyễn Thị Lan",
      stallId: "A01",
      phone: "0901234567",
      email: "nguyenthilan@email.com",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      zone: "Khu A - Thực phẩm tươi sống",
      contractId: "HD-2024-001",
      contractStartDate: "2024-01-15",
      contractEndDate: "2025-01-14",
      status: "active",
      totalDebt: 8200000,
      monthlyRent: 5000000,
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Trần Văn Hùng",
      stallId: "B12",
      phone: "0912345678",
      email: "tranvanhung@email.com",
      address: "456 Đường XYZ, Quận 3, TP.HCM",
      zone: "Khu B - Thực phẩm khô",
      contractId: "HD-2024-002",
      contractStartDate: "2024-02-01",
      contractEndDate: "2025-01-31",
      status: "active",
      totalDebt: 5500000,
      monthlyRent: 3500000,
      joinDate: "2024-02-01",
    },
    {
      id: "3",
      name: "Lê Thị Mai",
      stallId: "C05",
      phone: "0923456789",
      email: "lethimai@email.com",
      address: "789 Đường DEF, Quận 5, TP.HCM",
      zone: "Khu C - Quần áo & Phụ kiện",
      contractId: "HD-2024-003",
      contractStartDate: "2024-03-01",
      contractEndDate: "2025-02-28",
      status: "suspended",
      totalDebt: 3200000,
      monthlyRent: 2800000,
      joinDate: "2024-03-01",
    },
  ])

  const transactions: Record<string, Transaction[]> = {
    "1": [
      {
        id: "TXN-001",
        date: "2025-08-01",
        type: "Phí mặt bằng",
        amount: 5000000,
        status: "paid",
        description: "Phí thuê mặt bằng tháng 8/2025",
        paymentMethod: "Tiền mặt",
      },
      {
        id: "TXN-008",
        date: "2025-08-07",
        type: "Phí điện",
        amount: 800000,
        status: "paid",
        description: "Tiền điện tháng 8/2025",
        paymentMethod: "Chuyển khoản",
      },
      {
        id: "TXN-002",
        date: "2025-07-25",
        type: "Phí điện",
        amount: 1200000,
        status: "unpaid",
        description: "Tiền điện tháng 7/2025",
      },
      {
        id: "TXN-003",
        date: "2025-07-01",
        type: "Phí vệ sinh",
        amount: 2000000,
        status: "paid",
        description: "Phí vệ sinh môi trường tháng 7/2025",
        paymentMethod: "Chuyển khoản",
      },
    ],
    "2": [
      {
        id: "TXN-004",
        date: "2025-08-01",
        type: "Phí mặt bằng",
        amount: 3500000,
        status: "unpaid",
        description: "Phí thuê mặt bằng tháng 8/2025",
      },
      {
        id: "TXN-005",
        date: "2025-07-15",
        type: "Phí điện",
        amount: 2000000,
        status: "paid",
        description: "Tiền điện tháng 7/2025",
        paymentMethod: "Chuyển khoản",
      },
    ],
    "3": [
      {
        id: "TXN-006",
        date: "2025-08-01",
        type: "Phí mặt bằng",
        amount: 2800000,
        status: "unpaid",
        description: "Phí thuê mặt bằng tháng 8/2025",
      },
      {
        id: "TXN-007",
        date: "2025-07-20",
        type: "Phí vệ sinh",
        amount: 400000,
        status: "unpaid",
        description: "Phí vệ sinh môi trường tháng 7/2025",
      },
    ],
  }

  const handleSearch = () => {
    setError("")
    const found = merchants.find(
      (m) =>
        m.stallId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (found) {
      setSelectedMerchant(found)
    } else {
      setError("Không tìm thấy tiểu thương")
    }
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
    const merchantTransactions = transactions[merchantId] || []
    
    return merchantTransactions.filter((transaction) => {
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

  const renderSearchSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Tìm kiếm Tiểu thương
        </CardTitle>
        <CardDescription>Nhập mã gian hàng hoặc tên tiểu thương để xem hồ sơ chi tiết</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Mã gian hàng hoặc Tên tiểu thương</Label>
          <div className="flex gap-2">
            <Input
              id="search"
              placeholder="Ví dụ: A01 hoặc Nguyễn Thị Lan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-4">
              <h4 className="font-medium">Danh sách tiểu thương:</h4>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedMerchants.length === merchants.length && merchants.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMerchants(merchants.map(m => m.id))
                    } else {
                      setSelectedMerchants([])
                    }
                  }}
                  className="mr-2"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {merchants.map((merchant) => (
              <Card
                key={merchant.id}
                className={`cursor-pointer hover:bg-gray-50 ${
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
                      className="mt-1"
                    />
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        setSearchQuery(merchant.stallId)
                        setSelectedMerchant(merchant)
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{merchant.name}</p>
                          <p className="text-sm text-gray-600">Gian hàng: {merchant.stallId}</p>
                        </div>
                        {getStatusBadge(merchant.status)}
                      </div>
                      <p className="text-sm text-gray-600">{merchant.zone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderMerchantProfile = () => {
    if (!selectedMerchant) return null

    const merchantTransactions = transactions[selectedMerchant.id] || []
    const unpaidTransactions = merchantTransactions.filter((t) => t.status === "unpaid")

    return (
      <div className="space-y-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {selectedMerchant.name}
                </CardTitle>
                <CardDescription>Mã gian hàng: {selectedMerchant.stallId}</CardDescription>
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
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Thông tin liên hệ</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedMerchant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedMerchant.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Thông tin hợp đồng</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedMerchant.contractId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {new Date(selectedMerchant.contractStartDate).toLocaleDateString("vi-VN")} -{" "}
                      {new Date(selectedMerchant.contractEndDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Thông tin tài chính</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Phí thuê hàng tháng</p>
                    <p className="font-semibold">{formatCurrency(selectedMerchant.monthlyRent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng công nợ</p>
                    <p
                      className={`font-semibold ${selectedMerchant.totalDebt > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {formatCurrency(selectedMerchant.totalDebt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="transactions">Lịch sử Giao dịch</TabsTrigger>
                <TabsTrigger value="unpaid">Hóa đơn Chưa thanh toán</TabsTrigger>
                <TabsTrigger value="contract">Chi tiết Hợp đồng</TabsTrigger>
              </TabsList>

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

                  {/* Danh sách giao dịch */}
                  <div className="space-y-3">
                    {getFilteredTransactions(selectedMerchant.id).length > 0 ? (
                      getFilteredTransactions(selectedMerchant.id).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Receipt className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(transaction.date).toLocaleDateString("vi-VN")} • {transaction.type}
                              </p>
                              {transaction.paymentMethod && (
                                <p className="text-sm text-gray-500">Phương thức: {transaction.paymentMethod}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>Không tìm thấy giao dịch nào phù hợp với bộ lọc</p>
                        <p className="text-sm mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
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
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="h-10 w-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ Tiểu thương</h1>
            <p className="text-gray-600">Xem thông tin chi tiết và lịch sử giao dịch</p>
          </div>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddMerchantModalOpen(true)}
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

      {/* Add Merchant Modal */}
      <Dialog open={isAddMerchantModalOpen} onOpenChange={setIsAddMerchantModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm Tiểu thương mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tên tiểu thương</Label>
                <Input
                  value={newMerchant.name}
                  onChange={(e) => setNewMerchant({...newMerchant, name: e.target.value})}
                  placeholder="Nhập tên tiểu thương..."
                />
              </div>
              <div>
                <Label>Mã gian hàng</Label>
                <Input
                  value={newMerchant.stallId}
                  onChange={(e) => setNewMerchant({...newMerchant, stallId: e.target.value})}
                  placeholder="VD: A01, B02..."
                />
              </div>
              <div>
                <Label>Số điện thoại</Label>
                <Input
                  value={newMerchant.phone}
                  onChange={(e) => setNewMerchant({...newMerchant, phone: e.target.value})}
                  placeholder="0901234567"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newMerchant.email}
                  onChange={(e) => setNewMerchant({...newMerchant, email: e.target.value})}
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <Label>Địa chỉ</Label>
                <Input
                  value={newMerchant.address}
                  onChange={(e) => setNewMerchant({...newMerchant, address: e.target.value})}
                  placeholder="Nhập địa chỉ..."
                />
              </div>
              <div>
                <Label>Khu vực</Label>
                <Select
                  value={newMerchant.zone}
                  onValueChange={(value) => setNewMerchant({...newMerchant, zone: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khu vực..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Khu A - Thực phẩm tươi sống">Khu A - Thực phẩm tươi sống</SelectItem>
                    <SelectItem value="Khu B - Thực phẩm khô">Khu B - Thực phẩm khô</SelectItem>
                    <SelectItem value="Khu C - Gia vị">Khu C - Gia vị</SelectItem>
                    <SelectItem value="Khu D - Đồ uống">Khu D - Đồ uống</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Phí thuê/tháng (VND)</Label>
                <Input
                  type="number"
                  value={newMerchant.monthlyRent}
                  onChange={(e) => setNewMerchant({...newMerchant, monthlyRent: parseInt(e.target.value) || 0})}
                  placeholder="5000000"
                />
              </div>
              <div>
                <Label>Ngày bắt đầu hợp đồng</Label>
                <Input
                  type="date"
                  value={newMerchant.contractStartDate}
                  onChange={(e) => setNewMerchant({...newMerchant, contractStartDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Ngày kết thúc hợp đồng</Label>
                <Input
                  type="date"
                  value={newMerchant.contractEndDate}
                  onChange={(e) => setNewMerchant({...newMerchant, contractEndDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Trạng thái</Label>
                <Select
                  value={newMerchant.status}
                  onValueChange={(value) => setNewMerchant({...newMerchant, status: value as any})}
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
                  setIsAddMerchantModalOpen(false)
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
                }}
              >
                Hủy
              </Button>
                              <Button 
                  onClick={() => {
                    // Thêm logic lưu tiểu thương mới
                    if (newMerchant.name && newMerchant.stallId) {
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
                      
                      setMerchants([...merchants, newMerchantData])
                      
                      // Reset form
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
                      
                      setIsAddMerchantModalOpen(false)
                    }
                  }}
                >
                  Thêm tiểu thương
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                    // Cập nhật thông tin tiểu thương
                    const updatedMerchants = merchants.map(merchant => 
                      merchant.id === editingMerchant.id ? editingMerchant : merchant
                    )
                    setMerchants(updatedMerchants)
                    
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
                  // Xóa các tiểu thương đã chọn
                  const updatedMerchants = merchants.filter(
                    merchant => !selectedMerchants.includes(merchant.id)
                  )
                  setMerchants(updatedMerchants)
                  
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
