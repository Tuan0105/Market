"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Transaction, useStallData } from "@/lib/stall-data-context"
import { format } from "date-fns"
import { ArrowLeft, CalendarIcon, Download, Eye, Filter, Printer, Search, X } from "lucide-react"
import { useEffect, useState } from "react"

interface TransactionHistoryProps {
  onBack: () => void
}

export function TransactionHistory({ onBack }: TransactionHistoryProps) {
  const { transactions, setTransactions } = useStallData()
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Initialize filtered transactions when transactions change
  useEffect(() => {
    setFilteredTransactions(transactions)
  }, [transactions])

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
    if (statusFilter.length > 0 && !statusFilter.includes("all")) {
      filtered = filtered.filter(t => statusFilter.includes(t.status))
    }

    // Payment method filter
    if (paymentMethodFilter.length > 0 && !paymentMethodFilter.includes("all")) {
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
    // Reset về trang đầu khi áp dụng bộ lọc
    setCurrentPage(1)
    
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
        return <Badge className="bg-green-100 text-green-800">Thành công</Badge>
      case "Thất bại":
        return <Badge className="bg-red-100 text-red-800">Thất bại</Badge>
      case "Đang xử lý":
        return <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getVisiblePageNumbers = () => {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const current = currentPage
    const delta = 2

    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i)
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (current + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots.filter((item, index, array) => array.indexOf(item) === index)
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Calculate summary statistics
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
  const successCount = filteredTransactions.filter(t => t.status === "Thành công").length
  const failureCount = filteredTransactions.filter(t => t.status === "Thất bại").length
  const pendingCount = filteredTransactions.filter(t => t.status === "Đang xử lý").length

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
            <p className="text-gray-600">Quản lý và theo dõi tất cả giao dịch thanh toán</p>
          </div>
        </div>
        <Button onClick={handleExportExcel} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Xuất Excel
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">GD</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng tiền</p>
                <p className="text-2xl font-bold text-gray-900">{totalAmount.toLocaleString()}đ</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-medium">₫</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Thành công</p>
                <p className="text-2xl font-bold text-green-600">{successCount}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-medium">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Thất bại</p>
                <p className="text-2xl font-bold text-red-600">{failureCount}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-medium">✗</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Bộ lọc & Tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Từ ngày</label>
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setDateFromOpen(!dateFromOpen)}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Chọn ngày"}
                </Button>
                {dateFromOpen && (
                  <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(date) => {
                        setDateFrom(date)
                        setDateFromOpen(false)
                      }}
                      initialFocus
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Đến ngày</label>
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setDateToOpen(!dateToOpen)}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Chọn ngày"}
                </Button>
                {dateToOpen && (
                  <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={(date) => {
                        setDateTo(date)
                        setDateToOpen(false)
                      }}
                      initialFocus
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select
                value={statusFilter.join(",")}
                onValueChange={(value) => setStatusFilter(value ? value.split(",") : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Thành công">Thành công</SelectItem>
                  <SelectItem value="Thất bại">Thất bại</SelectItem>
                  <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hình thức thanh toán</label>
              <Select
                value={paymentMethodFilter.join(",")}
                onValueChange={(value) => setPaymentMethodFilter(value ? value.split(",") : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả hình thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                  <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                  <SelectItem value="QR Code">QR Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Date Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant={activeDateFilter === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickDateFilter(0)}
            >
              Hôm nay
            </Button>
            <Button
              variant={activeDateFilter === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickDateFilter(7)}
            >
              7 ngày qua
            </Button>
            <Button
              variant={activeDateFilter === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickDateFilter(30)}
            >
              30 ngày qua
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDateFrom(undefined)
                setDateTo(undefined)
                setActiveDateFilter("")
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo mã giao dịch, tên tiểu thương, gian hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Mã GD</th>
                  <th className="text-left py-3 px-4 font-medium">Thời gian</th>
                  <th className="text-left py-3 px-4 font-medium">Tiểu thương</th>
                  <th className="text-left py-3 px-4 font-medium">Gian hàng</th>
                  <th className="text-left py-3 px-4 font-medium">Nội dung</th>
                  <th className="text-right py-3 px-4 font-medium">Số tiền</th>
                  <th className="text-center py-3 px-4 font-medium">Hình thức</th>
                  <th className="text-center py-3 px-4 font-medium">Trạng thái</th>
                  <th className="text-center py-3 px-4 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetail(transaction)}>
                    <td className="py-3 px-4 font-medium">{transaction.transactionCode}</td>
                    <td className="py-3 px-4">{format(transaction.timestamp, "dd/MM/yyyy HH:mm")}</td>
                    <td className="py-3 px-4">{transaction.merchantName}</td>
                    <td className="py-3 px-4">{transaction.stallCode}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {transaction.paymentDescription}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {transaction.amount.toLocaleString()}đ
                    </td>
                    <td className="py-3 px-4 text-center">{transaction.paymentMethod}</td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(transaction.status)}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewDetail(transaction)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePrintReceipt(transaction)
                          }}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Hiển thị</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">
                  từ {startIndex + 1} đến {Math.min(endIndex, filteredTransactions.length)} trong tổng số {filteredTransactions.length} giao dịch
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                
                {getVisiblePageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-sm text-gray-500">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page as number)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết Giao dịch</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-medium">{selectedTransaction.transactionCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">{format(selectedTransaction.timestamp, "dd/MM/yyyy HH:mm")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiểu thương:</span>
                    <span className="font-medium">{selectedTransaction.merchantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gian hàng:</span>
                    <span className="font-medium">{selectedTransaction.stallCode}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-medium text-lg text-green-600">{selectedTransaction.amount.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hình thức:</span>
                    <span className="font-medium">{selectedTransaction.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span>{getStatusBadge(selectedTransaction.status)}</span>
                  </div>
                  {selectedTransaction.collectedBy && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thu bởi:</span>
                      <span className="font-medium">{selectedTransaction.collectedBy}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Nội dung thanh toán</h3>
                <p className="text-gray-700">{selectedTransaction.paymentDescription}</p>
              </div>

              {/* Invoice Details */}
              <div>
                <h3 className="font-semibold mb-3">Chi tiết hóa đơn</h3>
                <div className="space-y-2">
                  {selectedTransaction.invoices.map((invoice, index) => (
                    <div key={index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{invoice.type}</span>
                      <span className="font-medium">{invoice.amount.toLocaleString()}đ</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Debt Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">Nợ trước</div>
                  <div className="text-lg font-bold text-blue-800">{selectedTransaction.debtBefore.toLocaleString()}đ</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">Nợ sau</div>
                  <div className="text-lg font-bold text-green-800">{selectedTransaction.debtAfter.toLocaleString()}đ</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Receipt Modal */}
      <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>In Phiếu Thu</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-bold text-lg mb-2">PHIẾU THU TIỀN</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Mã giao dịch:</strong> {selectedTransaction.transactionCode}</p>
                  <p><strong>Ngày:</strong> {format(selectedTransaction.timestamp, "dd/MM/yyyy HH:mm")}</p>
                  <p><strong>Tiểu thương:</strong> {selectedTransaction.merchantName}</p>
                  <p><strong>Gian hàng:</strong> {selectedTransaction.stallCode}</p>
                  <p><strong>Số tiền:</strong> {selectedTransaction.amount.toLocaleString()}đ</p>
                  <p><strong>Hình thức:</strong> {selectedTransaction.paymentMethod}</p>
                  {selectedTransaction.collectedBy && (
                    <p><strong>Thu bởi:</strong> {selectedTransaction.collectedBy}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => {
                  window.print()
                  setIsPrintModalOpen(false)
                }}>
                  In phiếu
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 