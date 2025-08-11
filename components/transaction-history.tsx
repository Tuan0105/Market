"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ArrowLeft, CalendarIcon, Download, Eye, Filter, Printer, Search, X } from "lucide-react"
import { useEffect, useState } from "react"

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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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
        transactionCode: "GD-20250804-002",
        timestamp: new Date("2025-08-04T08:45:00"),
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
      {
        id: "6",
        transactionCode: "GD-20250803-001",
        timestamp: new Date("2025-08-03T16:20:00"),
        merchantName: "Hoàng Thị Mai",
        stallCode: "E07",
        paymentDescription: "Thanh toán phí mặt bằng và điện, nước T08/2025",
        amount: 4200000,
        paymentMethod: "Chuyển khoản",
        status: "Thành công",
        collectedBy: "Lê Văn Minh",
        invoices: [
          { id: "INV-082025-E07", type: "Phí mặt bằng", amount: 3500000 },
          { id: "INV-DN-082025-E07", type: "Phí điện, nước", amount: 700000 }
        ],
        debtBefore: 4200000,
        debtAfter: 0
      },
      {
        id: "7",
        transactionCode: "GD-20250803-002",
        timestamp: new Date("2025-08-03T14:30:00"),
        merchantName: "Vũ Văn Hùng",
        stallCode: "F02",
        paymentDescription: "Thanh toán phí mặt bằng T08/2025",
        amount: 2800000,
        paymentMethod: "QR Code",
        status: "Thành công",
        collectedBy: "Phạm Thị Nga",
        invoices: [
          { id: "INV-082025-F02", type: "Phí mặt bằng", amount: 2800000 }
        ],
        debtBefore: 2800000,
        debtAfter: 0
      },
      {
        id: "8",
        transactionCode: "GD-20250802-001",
        timestamp: new Date("2025-08-02T11:45:00"),
        merchantName: "Đỗ Thị Hương",
        stallCode: "G11",
        paymentDescription: "Thanh toán phí điện, nước T08/2025",
        amount: 650000,
        paymentMethod: "Tiền mặt",
        status: "Thất bại",
        invoices: [
          { id: "INV-DN-082025-G11", type: "Phí điện, nước", amount: 650000 }
        ],
        debtBefore: 650000,
        debtAfter: 650000
      },
      {
        id: "9",
        transactionCode: "GD-20250802-002",
        timestamp: new Date("2025-08-02T10:15:00"),
        merchantName: "Lý Văn Thành",
        stallCode: "H08",
        paymentDescription: "Thanh toán phí mặt bằng T08/2025",
        amount: 3200000,
        paymentMethod: "Chuyển khoản",
        status: "Đang xử lý",
        invoices: [
          { id: "INV-082025-H08", type: "Phí mặt bằng", amount: 3200000 }
        ],
        debtBefore: 3200000,
        debtAfter: 3200000
      },
      {
        id: "10",
        transactionCode: "GD-20250801-001",
        timestamp: new Date("2025-08-01T15:20:00"),
        merchantName: "Nguyễn Thị Lan",
        stallCode: "A05",
        paymentDescription: "Thanh toán phí điện, nước T08/2025",
        amount: 500000,
        paymentMethod: "Tiền mặt",
        status: "Thành công",
        collectedBy: "Trần Văn An",
        invoices: [
          { id: "INV-DN-082025-A05-2", type: "Phí điện, nước", amount: 500000 }
        ],
        debtBefore: 500000,
        debtAfter: 0
      },
      {
        id: "11",
        transactionCode: "GD-20250731-001",
        timestamp: new Date("2025-07-31T13:10:00"),
        merchantName: "Trần Văn Đức",
        stallCode: "D03",
        paymentDescription: "Thanh toán phí mặt bằng T07/2025",
        amount: 4000000,
        paymentMethod: "Tiền mặt",
        status: "Thành công",
        collectedBy: "Nguyễn Thị Hoa",
        invoices: [
          { id: "INV-072025-D03", type: "Phí mặt bằng", amount: 4000000 }
        ],
        debtBefore: 4000000,
        debtAfter: 0
      },
      {
        id: "12",
        transactionCode: "GD-20250730-001",
        timestamp: new Date("2025-07-30T09:30:00"),
        merchantName: "Lê Văn Bình",
        stallCode: "B12",
        paymentDescription: "Thanh toán phí mặt bằng và điện, nước T07/2025",
        amount: 3800000,
        paymentMethod: "QR Code",
        status: "Thành công",
        collectedBy: "Lê Văn Minh",
        invoices: [
          { id: "INV-072025-B12", type: "Phí mặt bằng", amount: 3000000 },
          { id: "INV-DN-072025-B12", type: "Phí điện, nước", amount: 800000 }
        ],
        debtBefore: 3800000,
        debtAfter: 0
      },
      {
        id: "13",
        transactionCode: "GD-20250729-001",
        timestamp: new Date("2025-07-29T16:45:00"),
        merchantName: "Phạm Thị Cúc",
        stallCode: "C08",
        paymentDescription: "Thanh toán phí mặt bằng T07/2025",
        amount: 2500000,
        paymentMethod: "Chuyển khoản",
        status: "Thành công",
        collectedBy: "Phạm Thị Nga",
        invoices: [
          { id: "INV-072025-C08", type: "Phí mặt bằng", amount: 2500000 }
        ],
        debtBefore: 2500000,
        debtAfter: 0
      },
      {
        id: "14",
        transactionCode: "GD-20250728-001",
        timestamp: new Date("2025-07-28T11:20:00"),
        merchantName: "Hoàng Thị Mai",
        stallCode: "E07",
        paymentDescription: "Thanh toán phí điện, nước T07/2025",
        amount: 700000,
        paymentMethod: "Tiền mặt",
        status: "Thất bại",
        invoices: [
          { id: "INV-DN-072025-E07", type: "Phí điện, nước", amount: 700000 }
        ],
        debtBefore: 700000,
        debtAfter: 700000
      },
      {
        id: "15",
        transactionCode: "GD-20250727-001",
        timestamp: new Date("2025-07-27T14:15:00"),
        merchantName: "Vũ Văn Hùng",
        stallCode: "F02",
        paymentDescription: "Thanh toán phí mặt bằng T07/2025",
        amount: 2800000,
        paymentMethod: "QR Code",
        status: "Thành công",
        collectedBy: "Trần Văn An",
        invoices: [
          { id: "INV-072025-F02", type: "Phí mặt bằng", amount: 2800000 }
        ],
        debtBefore: 2800000,
        debtAfter: 0
      },
      {
        id: "16",
        transactionCode: "GD-20250726-001",
        timestamp: new Date("2025-07-26T10:30:00"),
        merchantName: "Đỗ Thị Hương",
        stallCode: "G11",
        paymentDescription: "Thanh toán phí mặt bằng và điện, nước T07/2025",
        amount: 3150000,
        paymentMethod: "Chuyển khoản",
        status: "Thành công",
        collectedBy: "Nguyễn Thị Hoa",
        invoices: [
          { id: "INV-072025-G11", type: "Phí mặt bằng", amount: 2500000 },
          { id: "INV-DN-072025-G11", type: "Phí điện, nước", amount: 650000 }
        ],
        debtBefore: 3150000,
        debtAfter: 0
      },
      {
        id: "17",
        transactionCode: "GD-20250725-001",
        timestamp: new Date("2025-07-25T15:45:00"),
        merchantName: "Lý Văn Thành",
        stallCode: "H08",
        paymentDescription: "Thanh toán phí mặt bằng T07/2025",
        amount: 3200000,
        paymentMethod: "Tiền mặt",
        status: "Đang xử lý",
        invoices: [
          { id: "INV-072025-H08", type: "Phí mặt bằng", amount: 3200000 }
        ],
        debtBefore: 3200000,
        debtAfter: 3200000
      },
      {
        id: "18",
        transactionCode: "GD-20250724-001",
        timestamp: new Date("2025-07-24T12:20:00"),
        merchantName: "Nguyễn Văn Tuyết",
        stallCode: "D04",
        paymentDescription: "Thanh toán phí điện, nước T07/2025",
        amount: 1000000,
        paymentMethod: "QR Code",
        status: "Thành công",
        collectedBy: "Lê Văn Minh",
        invoices: [
          { id: "INV-DN-072025-D04", type: "Phí điện, nước", amount: 1000000 }
        ],
        debtBefore: 1000000,
        debtAfter: 0
      },
      {
        id: "19",
        transactionCode: "GD-20250723-001",
        timestamp: new Date("2025-07-23T09:15:00"),
        merchantName: "Nguyễn Thị Lan",
        stallCode: "A05",
        paymentDescription: "Thanh toán phí mặt bằng T07/2025",
        amount: 5000000,
        paymentMethod: "Tiền mặt",
        status: "Thành công",
        collectedBy: "Trần Văn An",
        invoices: [
          { id: "INV-072025-A05", type: "Phí mặt bằng", amount: 5000000 }
        ],
        debtBefore: 5000000,
        debtAfter: 0
      },
      {
        id: "20",
        transactionCode: "GD-20250722-001",
        timestamp: new Date("2025-07-22T16:30:00"),
        merchantName: "Lê Văn Bình",
        stallCode: "B12",
        paymentDescription: "Thanh toán phí điện, nước T07/2025",
        amount: 800000,
        paymentMethod: "Chuyển khoản",
        status: "Thành công",
        collectedBy: "Phạm Thị Nga",
        invoices: [
          { id: "INV-DN-072025-B12", type: "Phí điện, nước", amount: 800000 }
        ],
        debtBefore: 800000,
        debtAfter: 0
      }
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
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Thành công</Badge>
      case "Thất bại":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Thất bại</Badge>
      case "Đang xử lý":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang xử lý</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Hàm tính toán các trang hiển thị
  const getVisiblePageNumbers = () => {
    const pages: number[] = []
    
    if (totalPages <= 5) {
      // Nếu tổng số trang <= 5, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Nếu tổng số trang > 5
      if (currentPage <= 3) {
        // Hiển thị 5 trang đầu
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
      } else if (currentPage >= totalPages - 2) {
        // Hiển thị 5 trang cuối
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Hiển thị 2 trang trước, trang hiện tại, 2 trang sau
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i)
        }
      }
    }
    
    return pages
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
                  <SelectItem value="Hoàng Thị Mai">Hoàng Thị Mai</SelectItem>
                  <SelectItem value="Vũ Văn Hùng">Vũ Văn Hùng</SelectItem>
                  <SelectItem value="Đỗ Thị Hương">Đỗ Thị Hương</SelectItem>
                  <SelectItem value="Lý Văn Thành">Lý Văn Thành</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">T</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thành công</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredTransactions.filter(t => t.status === "Thành công").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredTransactions.filter(t => t.status === "Đang xử lý").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-sm">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thất bại</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredTransactions.filter(t => t.status === "Thất bại").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-semibold text-sm">✗</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">
          Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} trong tổng số {filteredTransactions.length} giao dịch
          {filteredTransactions.length !== transactions.length && ` (đã lọc từ ${transactions.length} giao dịch)`}
        </p>
        <div className="text-sm text-gray-600">
          Tổng tiền: <span className="font-semibold text-green-600">
            {filteredTransactions
              .filter(t => t.status === "Thành công")
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()} VND
          </span>
        </div>
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền (VND)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình thức
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewDetail(transaction)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.transactionCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(transaction.timestamp, "HH:mm dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-semibold">{transaction.merchantName}</div>
                        <div className="text-gray-500 text-xs">{transaction.stallCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {transaction.paymentDescription}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                      {transaction.amount.toLocaleString()} VND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewDetail(transaction)
                          }}
                          className="p-1 hover:bg-blue-100"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePrintReceipt(transaction)
                          }}
                          className="p-1 hover:bg-green-100"
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">
            Trang {currentPage} của {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(parseInt(value))
                setCurrentPage(1) // Reset về trang đầu khi thay đổi số lượng
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">mục/trang</span>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            
            {/* First page */}
            {currentPage > 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                className="w-8 h-8 p-0"
              >
                1
              </Button>
            )}
            
            {/* Ellipsis after first page */}
            {currentPage > 4 && <span className="text-gray-500">...</span>}
            
            {/* Page numbers around current page */}
            {getVisiblePageNumbers().map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
            
            {/* Ellipsis before last page */}
            {currentPage < totalPages - 3 && <span className="text-gray-500">...</span>}
            
            {/* Last page */}
            {currentPage < totalPages - 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                className="w-8 h-8 p-0"
              >
                {totalPages}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        )}
      </div>

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
            <div className="space-y-6">
              {/* Header with Logo */}
              <div className="text-center border-b pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <h2 className="text-xl font-bold text-blue-600">S-Chợ</h2>
                </div>
                <h2 className="text-2xl font-bold">BIÊN LAI THU TIỀN</h2>
                <p className="text-gray-600">Chợ Trung tâm Lạng Sơn</p>
                <p className="text-sm text-gray-500">Quản lý chợ truyền thống</p>
              </div>
              
              {/* Transaction Details - Table Layout */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-right w-32">Mã giao dịch:</span>
                    <span className="font-semibold flex-1 ml-4">{selectedTransaction.transactionCode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-right w-32">Ngày giờ:</span>
                    <span className="font-semibold flex-1 ml-4">{format(selectedTransaction.timestamp, "HH:mm dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-right w-32">Tiểu thương:</span>
                    <span className="font-semibold flex-1 ml-4">{selectedTransaction.merchantName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-right w-32">Gian hàng:</span>
                    <span className="font-semibold flex-1 ml-4">{selectedTransaction.stallCode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-right w-32">Người thu:</span>
                    <span className="font-semibold flex-1 ml-4">{selectedTransaction.collectedBy || "Hệ thống"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-right w-32">Hình thức:</span>
                    <span className="font-semibold flex-1 ml-4">{selectedTransaction.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-right w-32">Trạng thái:</span>
                    <span className="flex-1 ml-4">
                      {getStatusBadge(selectedTransaction.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 text-center">CHI TIẾT THANH TOÁN</h3>
                <div className="space-y-3">
                  {selectedTransaction.invoices.map((invoice) => (
                    <div key={invoice.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{invoice.type}</div>
                        <div className="text-gray-600 text-xs">{invoice.id}</div>
                      </div>
                      <span className="font-semibold">{invoice.amount.toLocaleString()} VND</span>
                    </div>
                  ))}
                  <div className="border-t-2 border-gray-300 pt-3">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>TỔNG CỘNG:</span>
                      <span className="text-blue-600">{selectedTransaction.amount.toLocaleString()} VND</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t pt-4 text-center">
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium">Cảm ơn quý khách đã thanh toán!</p>
                  <p>Mọi thắc mắc vui lòng liên hệ Ban Quản lý Chợ</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Biên lai này có giá trị pháp lý và được lưu trữ trong hệ thống
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700">
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