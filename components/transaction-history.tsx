"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, Download, Eye, Printer, Filter, X, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface Transaction {
  id: string
  transactionCode: string
  timestamp: Date
  merchantName: string
  stallCode: string
  paymentDescription: string
  amount: number
  paymentMethod: "Tiền mặt" | "Chuyển khoản" | "QR Code"
  status: "Thành công" | "Thất bại" | "Đang xử lý"
  collectedBy?: string
  invoices: Invoice[]
  debtBefore: number
  debtAfter: number
}

interface Invoice {
  id: string
  type: string
  amount: number
}

interface TransactionHistoryProps {
  onBack: () => void
}

export function TransactionHistory({ onBack }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  
  // Filter states
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string[]>([])
  const [merchantFilter, setMerchantFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeDateFilter, setActiveDateFilter] = useState<string>("")
  const [dateFromOpen, setDateFromOpen] = useState(false)
  const [dateToOpen, setDateToOpen] = useState(false)

  // Sample data
  useEffect(() => {
    const sampleTransactions: Transaction[] = [
      {
        id: "1",
        transactionCode: "GD-20250805-001",
        timestamp: new Date("2025-08-05T10:30:00"),
        merchantName: "Nguyễn Thị Lan",
        stallCode: "A05",
        paymentDescription: "Thanh toán phí mặt bằng và điện, nước T08/2025",
        amount: 5500000,
        paymentMethod: "Tiền mặt",
        status: "Thành công",
        collectedBy: "Trần Văn An",
        invoices: [
          { id: "INV-082025-A05", type: "Phí mặt bằng", amount: 5000000 },
          { id: "INV-DN-082025-A05", type: "Phí điện, nước", amount: 500000 }
        ],
        debtBefore: 5500000,
        debtAfter: 0
      },
      {
        id: "2",
        transactionCode: "GD-20250805-002",
        timestamp: new Date("2025-08-05T11:15:00"),
        merchantName: "Lê Văn Bình",
        stallCode: "B12",
        paymentDescription: "Thanh toán phí mặt bằng T08/2025",
        amount: 3000000,
        paymentMethod: "Chuyển khoản",
        status: "Thành công",
        collectedBy: "Nguyễn Thị Hoa",
        invoices: [
          { id: "INV-082025-B12", type: "Phí mặt bằng", amount: 3000000 }
        ],
        debtBefore: 3000000,
        debtAfter: 0
      },
      {
        id: "3",
        transactionCode: "GD-20250805-003",
        timestamp: new Date("2025-08-05T14:20:00"),
        merchantName: "Phạm Thị Cúc",
        stallCode: "C08",
        paymentDescription: "Thanh toán phí điện, nước T08/2025",
        amount: 800000,
        paymentMethod: "QR Code",
        status: "Đang xử lý",
        invoices: [
          { id: "INV-DN-082025-C08", type: "Phí điện, nước", amount: 800000 }
        ],
        debtBefore: 800000,
        debtAfter: 0
      },
      {
        id: "4",
        transactionCode: "GD-20250804-001",
        timestamp: new Date("2025-08-04T09:45:00"),
        merchantName: "Trần Văn Đức",
        stallCode: "D03",
        paymentDescription: "Thanh toán phí mặt bằng T08/2025",
        amount: 4000000,
        paymentMethod: "Tiền mặt",
        status: "Thất bại",
        invoices: [
          { id: "INV-082025-D03", type: "Phí mặt bằng", amount: 4000000 }
        ],
        debtBefore: 4000000,
        debtAfter: 4000000
      },
      {
        id: "5",
        transactionCode: "GD-20250804-001",
        timestamp: new Date("2025-08-07T08:45:00"),
        merchantName: "Nguyễn Văn Tuyết",
        stallCode: "D04",
        paymentDescription: "Thanh toán phí mặt bằng T08/2025",
        amount: 1000000,
        paymentMethod: "Tiền mặt",
        status: "Thành công",
        invoices: [
          { id: "INV-082025-D04", type: "Phí mặt bằng", amount: 1000000 }
        ],
        debtBefore: 1000000,
        debtAfter: 0
      },
    ]
    setTransactions(sampleTransactions)
    setFilteredTransactions(sampleTransactions)
  }, [])

  // Filter functions
  const applyFilters = () => {
    let filtered = [...transactions]

    // Date filter
    if (dateFrom) {
      filtered = filtered.filter(t => t.timestamp >= dateFrom)
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo)
      endOfDay.setHours(23, 59, 59, 999)
      filtered = filtered.filter(t => t.timestamp <= endOfDay)
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(t => statusFilter.includes(t.status))
    }

    // Payment method filter
    if (paymentMethodFilter.length > 0) {
      filtered = filtered.filter(t => paymentMethodFilter.includes(t.paymentMethod))
    }

    // Merchant filter
    if (merchantFilter && merchantFilter !== "all") {
      filtered = filtered.filter(t => t.merchantName === merchantFilter)
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(t => 
        t.merchantName.toLowerCase().includes(term) ||
        t.stallCode.toLowerCase().includes(term) ||
        t.transactionCode.toLowerCase().includes(term)
      )
    }

    setFilteredTransactions(filtered)
  }

  useEffect(() => {
    // Nếu không có filter nào thì hiển thị tất cả giao dịch
    if (!dateFrom && !dateTo && statusFilter.length === 0 && paymentMethodFilter.length === 0 && merchantFilter === "all" && !searchTerm) {
      setFilteredTransactions(transactions)
    } else {
      applyFilters()
    }
  }, [dateFrom, dateTo, statusFilter, paymentMethodFilter, merchantFilter, searchTerm, transactions])

  const handleQuickDateFilter = (days: number) => {
    const today = new Date()
    let fromDate: Date
    let filterType: string
    
    if (days === 0) {
      // Hôm nay - chỉ lấy ngày hôm nay
      fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      filterType = "today"
    } else {
      // X ngày qua
      fromDate = new Date()
      fromDate.setDate(today.getDate() - days)
      filterType = days === 7 ? "week" : "custom"
    }
    
    setDateFrom(fromDate)
    setDateTo(today)
    setActiveDateFilter(filterType)
  }

  const handleExportExcel = () => {
    // Simulate Excel export
    const csvContent = [
      "Mã Giao dịch,Thời gian,Tiểu thương,Gian hàng,Nội dung,Số tiền,Hình thức,Trạng thái",
      ...filteredTransactions.map(t => 
        `${t.transactionCode},${format(t.timestamp, "dd/MM/yyyy HH:mm")},"${t.merchantName}",${t.stallCode},"${t.paymentDescription}",${t.amount.toLocaleString()},${t.paymentMethod},${t.status}`
      )
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `lich-su-giao-dich-${format(new Date(), "dd-MM-yyyy")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailModalOpen(true)
  }

  const handlePrintReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsPrintModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Thành công":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Thành công</Badge>
      case "Thất bại":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Thất bại</Badge>
      case "Đang xử lý":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang xử lý</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử Giao dịch</h1>
            <p className="text-gray-600">Quản lý và tra cứu toàn bộ giao dịch thanh toán</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Bộ lọc & Tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal"
                onClick={() => setDateFromOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Chọn ngày"}
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal"
                onClick={() => setDateToOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "dd/MM/yyyy") : "Chọn ngày"}
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <Select
                value={statusFilter.join(",")}
                onValueChange={(value) => setStatusFilter(value ? value.split(",") : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Thành công">Thành công</SelectItem>
                  <SelectItem value="Thất bại">Thất bại</SelectItem>
                  <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức</label>
              <Select
                value={paymentMethodFilter.join(",")}
                onValueChange={(value) => setPaymentMethodFilter(value ? value.split(",") : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hình thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                  <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                  <SelectItem value="QR Code">QR Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiểu thương</label>
              <Select
                value={merchantFilter}
                onValueChange={setMerchantFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tiểu thương" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tiểu thương</SelectItem>
                  <SelectItem value="Nguyễn Thị Lan">Nguyễn Thị Lan</SelectItem>
                  <SelectItem value="Lê Văn Bình">Lê Văn Bình</SelectItem>
                  <SelectItem value="Phạm Thị Cúc">Phạm Thị Cúc</SelectItem>
                  <SelectItem value="Trần Văn Đức">Trần Văn Đức</SelectItem>
                  <SelectItem value="Nguyễn Văn Tuyết">Nguyễn Văn Tuyết</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Date Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeDateFilter === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickDateFilter(0)}
              className={activeDateFilter === "today" ? "bg-blue-600 text-white hover:bg-blue-700 font-medium" : ""}
            >
              Hôm nay
            </Button>
            <Button
              variant={activeDateFilter === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickDateFilter(7)}
              className={activeDateFilter === "week" ? "bg-blue-600 text-white hover:bg-blue-700 font-medium" : ""}
            >
              7 ngày qua
            </Button>
            <Button
              variant={activeDateFilter === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const now = new Date()
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
                setDateFrom(firstDay)
                setDateTo(now)
                setActiveDateFilter("month")
              }}
              className={activeDateFilter === "month" ? "bg-blue-600 text-white hover:bg-blue-700 font-medium" : ""}
            >
              Tháng này
            </Button>
            <Button
              variant={activeDateFilter === "prevMonth" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const now = new Date()
                const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
                const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
                setDateFrom(firstDayPrevMonth)
                setDateTo(lastDayPrevMonth)
                setActiveDateFilter("prevMonth")
              }}
              className={activeDateFilter === "prevMonth" ? "bg-blue-600 text-white hover:bg-blue-700 font-medium" : ""}
            >
              Tháng trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDateFrom(undefined)
                setDateTo(undefined)
                setStatusFilter([])
                setPaymentMethodFilter([])
                                 setMerchantFilter("all")
                setSearchTerm("")
                setActiveDateFilter("")
              }}
            >
              <X className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </Button>
          </div>

          {/* Search and Export */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm theo Tên tiểu thương, Mã gian hàng, Mã giao dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleExportExcel} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Xuất Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Hiển thị {filteredTransactions.length} giao dịch
          {filteredTransactions.length !== transactions.length && ` (trong tổng số ${transactions.length})`}
        </p>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã Giao dịch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiểu thương / Gian hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nội dung Thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền (VND)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình thức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.transactionCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(transaction.timestamp, "HH:mm dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{transaction.merchantName}</div>
                        <div className="text-gray-500">{transaction.stallCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {transaction.paymentDescription}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.amount.toLocaleString()} VND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(transaction)}
                          className="p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrintReceipt(transaction)}
                          className="p-1"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết Giao dịch</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Thông tin Giao dịch</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã GD:</span>
                      <span className="font-medium">{selectedTransaction.transactionCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời gian:</span>
                      <span className="font-medium">{format(selectedTransaction.timestamp, "HH:mm dd/MM/yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-medium">{selectedTransaction.amount.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hình thức:</span>
                      <span className="font-medium">{selectedTransaction.paymentMethod}</span>
                    </div>
                    {selectedTransaction.collectedBy && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Người thu:</span>
                        <span className="font-medium">{selectedTransaction.collectedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Thông tin Tiểu thương</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tên:</span>
                      <span className="font-medium">{selectedTransaction.merchantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã gian hàng:</span>
                      <span className="font-medium">{selectedTransaction.stallCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoices */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Chi tiết Hóa đơn</h3>
                <div className="space-y-2">
                  {selectedTransaction.invoices.map((invoice) => (
                    <div key={invoice.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{invoice.id}</div>
                        <div className="text-gray-600 text-sm">{invoice.type}</div>
                      </div>
                      <div className="font-semibold">{invoice.amount.toLocaleString()} VND</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Debt Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Thông tin Công nợ</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Công nợ trước giao dịch</div>
                    <div className="font-semibold text-lg">{selectedTransaction.debtBefore.toLocaleString()} VND</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Công nợ sau giao dịch</div>
                    <div className="font-semibold text-lg">{selectedTransaction.debtAfter.toLocaleString()} VND</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Modal */}
      <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>In Biên lai</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold">BIÊN LAI THU TIỀN</h2>
                <p className="text-gray-600">Chợ Trung tâm</p>
              </div>
              
              <div className="border-t border-b py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Mã giao dịch:</strong> {selectedTransaction.transactionCode}</p>
                    <p><strong>Ngày giờ:</strong> {format(selectedTransaction.timestamp, "HH:mm dd/MM/yyyy")}</p>
                    <p><strong>Tiểu thương:</strong> {selectedTransaction.merchantName}</p>
                    <p><strong>Gian hàng:</strong> {selectedTransaction.stallCode}</p>
                  </div>
                  <div>
                    <p><strong>Người thu:</strong> {selectedTransaction.collectedBy || "Hệ thống"}</p>
                    <p><strong>Hình thức:</strong> {selectedTransaction.paymentMethod}</p>
                    <p><strong>Trạng thái:</strong> {selectedTransaction.status}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Chi tiết thanh toán:</h3>
                <div className="space-y-2">
                  {selectedTransaction.invoices.map((invoice) => (
                    <div key={invoice.id} className="flex justify-between">
                      <span>{invoice.type} - {invoice.id}</span>
                      <span>{invoice.amount.toLocaleString()} VND</span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Tổng cộng:</span>
                      <span>{selectedTransaction.amount.toLocaleString()} VND</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>Cảm ơn quý khách đã thanh toán!</p>
                <p>Mọi thắc mắc vui lòng liên hệ Ban Quản lý Chợ</p>
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" />
                  In biên lai
                </Button>
                <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Date From Filter Dialog */}
      <Dialog open={dateFromOpen} onOpenChange={setDateFromOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chọn ngày bắt đầu</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={(date) => {
                setDateFrom(date)
                setDateFromOpen(false)
                setActiveDateFilter("")
              }}
              locale={vi}
              className="rounded-md border"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Date To Filter Dialog */}
      <Dialog open={dateToOpen} onOpenChange={setDateToOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chọn ngày kết thúc</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={(date) => {
                setDateTo(date)
                setDateToOpen(false)
                setActiveDateFilter("")
              }}
              locale={vi}
              className="rounded-md border"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 