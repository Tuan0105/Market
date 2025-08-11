"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  CalendarIcon, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Eye,
  Bell,
  Search,
  Filter,
  BarChart3,
  PieChart,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  FileText
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Brush, Pie as RePie, PieChart as RePieChart, Cell } from "recharts"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

interface RevenueData {
  date: string
  amount: number
  transactionCount: number
  sourceBreakdown?: {
    [key: string]: {
  amount: number
  transactionCount: number
    }
  }
}

interface RevenueSource {
  id: string
  type: string
  transactionCount: number
  totalAmount: number
  percentage: number
}

interface DebtData {
  id: string
  stallCode: string
  merchantName: string
  phone: string
  totalDebt: number
  overdueDays: number
  zone: string
}

interface ReportsAnalyticsProps {
  onBack: () => void
}

export function ReportsAnalytics({ onBack }: ReportsAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("revenue")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [activeDateFilter, setActiveDateFilter] = useState<string>("")
  const [dateFromOpen, setDateFromOpen] = useState(false)
  const [dateToOpen, setDateToOpen] = useState(false)
  const [zoneFilter, setZoneFilter] = useState<string>("all")
  const [overdueFilter, setOverdueFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [selectedMerchant, setSelectedMerchant] = useState<DebtData | null>(null)
  const [isMerchantDetailModalOpen, setIsMerchantDetailModalOpen] = useState(false)
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false)

  // Revenue data
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [filteredRevenueData, setFilteredRevenueData] = useState<RevenueData[]>([])
  const [revenueSources, setRevenueSources] = useState<RevenueSource[]>([])
  const [selectedRevenueSource, setSelectedRevenueSource] = useState<string | null>(null)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [averagePerTransaction, setAveragePerTransaction] = useState(0)

  // Debt data
  const [debtData, setDebtData] = useState<DebtData[]>([])
  const [filteredDebtData, setFilteredDebtData] = useState<DebtData[]>([])
  const [totalDebt, setTotalDebt] = useState(0)
  const [totalDebtors, setTotalDebtors] = useState(0)
  const [totalOverdue, setTotalOverdue] = useState(0)
  // Debt table sorting & selection
  const [debtSortKey, setDebtSortKey] = useState<"totalDebt" | "overdueDays">("overdueDays")
  const [debtSortOrder, setDebtSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedDebtIds, setSelectedDebtIds] = useState<string[]>([])
  const [isBulkNotificationOpen, setIsBulkNotificationOpen] = useState(false)

  const { toast } = useToast()

  // Sample data
  useEffect(() => {
    // Sample revenue data - thêm dữ liệu cho nhiều ngày hơn với breakdown theo nguồn thu
    const sampleRevenueData: RevenueData[] = [
      { 
        date: "2025-07-15", 
        amount: 18000000, 
        transactionCount: 12,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 8100000, transactionCount: 5 },
          "Phí điện, nước": { amount: 5760000, transactionCount: 4 },
          "Phí vệ sinh": { amount: 2340000, transactionCount: 2 },
          "Phí gửi xe": { amount: 1080000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 720000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-16", 
        amount: 22000000, 
        transactionCount: 14,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 9900000, transactionCount: 6 },
          "Phí điện, nước": { amount: 7040000, transactionCount: 5 },
          "Phí vệ sinh": { amount: 2860000, transactionCount: 2 },
          "Phí gửi xe": { amount: 1320000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 880000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-17", 
        amount: 19000000, 
        transactionCount: 13,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 8550000, transactionCount: 5 },
          "Phí điện, nước": { amount: 6080000, transactionCount: 4 },
          "Phí vệ sinh": { amount: 2470000, transactionCount: 3 },
          "Phí gửi xe": { amount: 1140000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 760000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-18", 
        amount: 24000000, 
        transactionCount: 15,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 10800000, transactionCount: 7 },
          "Phí điện, nước": { amount: 7680000, transactionCount: 5 },
          "Phí vệ sinh": { amount: 3120000, transactionCount: 2 },
          "Phí gửi xe": { amount: 1440000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 960000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-19", 
        amount: 26000000, 
        transactionCount: 16,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 11700000, transactionCount: 7 },
          "Phí điện, nước": { amount: 8320000, transactionCount: 6 },
          "Phí vệ sinh": { amount: 3380000, transactionCount: 2 },
          "Phí gửi xe": { amount: 1560000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1040000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-20", 
        amount: 28000000, 
        transactionCount: 17,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 12600000, transactionCount: 8 },
          "Phí điện, nước": { amount: 8960000, transactionCount: 6 },
          "Phí vệ sinh": { amount: 3640000, transactionCount: 2 },
          "Phí gửi xe": { amount: 1680000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1120000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-21", 
        amount: 30000000, 
        transactionCount: 18,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 13500000, transactionCount: 8 },
          "Phí điện, nước": { amount: 9600000, transactionCount: 7 },
          "Phí vệ sinh": { amount: 3900000, transactionCount: 2 },
          "Phí gửi xe": { amount: 1800000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1200000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-22", 
        amount: 32000000, 
        transactionCount: 19,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 14400000, transactionCount: 9 },
          "Phí điện, nước": { amount: 10240000, transactionCount: 7 },
          "Phí vệ sinh": { amount: 4160000, transactionCount: 2 },
          "Phí gửi xe": { amount: 1920000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1280000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-23", 
        amount: 34000000, 
        transactionCount: 20,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 15300000, transactionCount: 9 },
          "Phí điện, nước": { amount: 10880000, transactionCount: 8 },
          "Phí vệ sinh": { amount: 4420000, transactionCount: 2 },
          "Phí gửi xe": { amount: 2040000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1360000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-24", 
        amount: 36000000, 
        transactionCount: 21,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 16200000, transactionCount: 10 },
          "Phí điện, nước": { amount: 11520000, transactionCount: 8 },
          "Phí vệ sinh": { amount: 4680000, transactionCount: 2 },
          "Phí gửi xe": { amount: 2160000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1440000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-25", 
        amount: 38000000, 
        transactionCount: 22,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 17100000, transactionCount: 10 },
          "Phí điện, nước": { amount: 12160000, transactionCount: 9 },
          "Phí vệ sinh": { amount: 4940000, transactionCount: 2 },
          "Phí gửi xe": { amount: 2280000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1520000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-26", 
        amount: 40000000, 
        transactionCount: 23,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 18000000, transactionCount: 11 },
          "Phí điện, nước": { amount: 12800000, transactionCount: 9 },
          "Phí vệ sinh": { amount: 5200000, transactionCount: 2 },
          "Phí gửi xe": { amount: 2400000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1600000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-27", 
        amount: 42000000, 
        transactionCount: 24,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 18900000, transactionCount: 11 },
          "Phí điện, nước": { amount: 13440000, transactionCount: 10 },
          "Phí vệ sinh": { amount: 5460000, transactionCount: 2 },
          "Phí gửi xe": { amount: 2520000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1680000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-28", 
        amount: 44000000, 
        transactionCount: 25,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 19800000, transactionCount: 12 },
          "Phí điện, nước": { amount: 14080000, transactionCount: 10 },
          "Phí vệ sinh": { amount: 5720000, transactionCount: 2 },
          "Phí gửi xe": { amount: 2640000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1760000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-29", 
        amount: 46000000, 
        transactionCount: 26,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 20700000, transactionCount: 12 },
          "Phí điện, nước": { amount: 14720000, transactionCount: 11 },
          "Phí vệ sinh": { amount: 5980000, transactionCount: 2 },
          "Phí gửi xe": { amount: 2760000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1840000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-30", 
        amount: 48000000, 
        transactionCount: 27,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 21600000, transactionCount: 13 },
          "Phí điện, nước": { amount: 15360000, transactionCount: 11 },
          "Phí vệ sinh": { amount: 6240000, transactionCount: 2 },
          "Phí gửi xe": { amount: 2880000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1920000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-07-31", 
        amount: 50000000, 
        transactionCount: 28,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 22500000, transactionCount: 13 },
          "Phí điện, nước": { amount: 16000000, transactionCount: 12 },
          "Phí vệ sinh": { amount: 6500000, transactionCount: 2 },
          "Phí gửi xe": { amount: 3000000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 2000000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-08-01", 
        amount: 25000000, 
        transactionCount: 15,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 11250000, transactionCount: 7 },
          "Phí điện, nước": { amount: 8000000, transactionCount: 5 },
          "Phí vệ sinh": { amount: 3250000, transactionCount: 2 },
          "Phí gửi xe": { amount: 1500000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1000000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-08-02", 
        amount: 32000000, 
        transactionCount: 18,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 14400000, transactionCount: 9 },
          "Phí điện, nước": { amount: 10240000, transactionCount: 7 },
          "Phí vệ sinh": { amount: 4160000, transactionCount: 1 },
          "Phí gửi xe": { amount: 1920000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1280000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-08-03", 
        amount: 28000000, 
        transactionCount: 16,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 12600000, transactionCount: 8 },
          "Phí điện, nước": { amount: 8960000, transactionCount: 6 },
          "Phí vệ sinh": { amount: 3640000, transactionCount: 1 },
          "Phí gửi xe": { amount: 1680000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1120000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-08-04", 
        amount: 35000000, 
        transactionCount: 20,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 15750000, transactionCount: 10 },
          "Phí điện, nước": { amount: 11200000, transactionCount: 8 },
          "Phí vệ sinh": { amount: 4550000, transactionCount: 1 },
          "Phí gửi xe": { amount: 2100000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1400000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-08-05", 
        amount: 40000000, 
        transactionCount: 22,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 18000000, transactionCount: 11 },
          "Phí điện, nước": { amount: 12800000, transactionCount: 9 },
          "Phí vệ sinh": { amount: 5200000, transactionCount: 1 },
          "Phí gửi xe": { amount: 2400000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1600000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-08-06", 
        amount: 38000000, 
        transactionCount: 21,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 17100000, transactionCount: 10 },
          "Phí điện, nước": { amount: 12160000, transactionCount: 8 },
          "Phí vệ sinh": { amount: 4940000, transactionCount: 2 },
          "Phí gửi xe": { amount: 2280000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1520000, transactionCount: 0 }
        }
      },
      { 
        date: "2025-08-07", 
        amount: 42000000, 
        transactionCount: 23,
        sourceBreakdown: {
          "Phí mặt bằng": { amount: 18900000, transactionCount: 11 },
          "Phí điện, nước": { amount: 13440000, transactionCount: 9 },
          "Phí vệ sinh": { amount: 5460000, transactionCount: 2 },
          "Phí gửi xe": { amount: 2520000, transactionCount: 1 },
          "Phí quảng cáo": { amount: 1680000, transactionCount: 0 }
        }
      },
    ]

    const sampleRevenueSources: RevenueSource[] = [
      { id: "1", type: "Phí mặt bằng", transactionCount: 85, totalAmount: 120000000, percentage: 45 },
      { id: "2", type: "Phí điện, nước", transactionCount: 65, totalAmount: 85000000, percentage: 32 },
      { id: "3", type: "Phí vệ sinh", transactionCount: 45, totalAmount: 35000000, percentage: 13 },
      { id: "4", type: "Phí gửi xe", transactionCount: 30, totalAmount: 15000000, percentage: 6 },
      { id: "5", type: "Phí quảng cáo", transactionCount: 15, totalAmount: 10000000, percentage: 4 },
    ]

    const sampleDebtData: DebtData[] = [
      {
        id: "1",
        stallCode: "A05",
        merchantName: "Nguyễn Thị Lan",
        phone: "0901234567",
        totalDebt: 5500000,
        overdueDays: 15,
        zone: "Khu A - Thực phẩm tươi"
      },
      {
        id: "2",
        stallCode: "B12",
        merchantName: "Lê Văn Bình",
        phone: "0912345678",
        totalDebt: 3200000,
        overdueDays: 0,
        zone: "Khu B - Thực phẩm khô"
      },
      {
        id: "3",
        stallCode: "C08",
        merchantName: "Phạm Thị Cúc",
        phone: "0923456789",
        totalDebt: 7800000,
        overdueDays: 25,
        zone: "Khu C - Quần áo & Phụ kiện"
      },
      {
        id: "4",
        stallCode: "D03",
        merchantName: "Trần Văn Đức",
        phone: "0934567890",
        totalDebt: 4200000,
        overdueDays: 8,
        zone: "Khu D - Đồ gia dụng"
      },
      {
        id: "5",
        stallCode: "E07",
        merchantName: "Nguyễn Văn Tuyết",
        phone: "0945678901",
        totalDebt: 6500000,
        overdueDays: 35,
        zone: "Khu E - Đồ điện tử"
      },
      {
        id: "6",
        stallCode: "F02",
        merchantName: "Hoàng Thị Hoa",
        phone: "0956789012",
        totalDebt: 3800000,
        overdueDays: 0,
        zone: "Khu F - Đồ thủ công"
      },
      {
        id: "7",
        stallCode: "G08",
        merchantName: "Vũ Văn Nam",
        phone: "0967890123",
        totalDebt: 9200000,
        overdueDays: 42,
        zone: "Khu G - Đồ ăn nhanh"
      },
      {
        id: "8",
        stallCode: "H15",
        merchantName: "Đỗ Thị Minh",
        phone: "0978901234",
        totalDebt: 2800000,
        overdueDays: 5,
        zone: "Khu H - Đồ uống"
      },
    ]

    setRevenueData(sampleRevenueData)
    setFilteredRevenueData(sampleRevenueData)
    setDebtData(sampleDebtData)
    setFilteredDebtData(sampleDebtData)

    // Calculate totals
    const totalRev = sampleRevenueData.reduce((sum, item) => sum + item.amount, 0)
    const totalTrans = sampleRevenueData.reduce((sum, item) => sum + item.transactionCount, 0)
    setTotalRevenue(totalRev)
    setTotalTransactions(totalTrans)
    setAveragePerTransaction(totalTrans > 0 ? totalRev / totalTrans : 0)

    const totalDebtAmount = sampleDebtData.reduce((sum, item) => sum + item.totalDebt, 0)
    const totalDebtorsCount = sampleDebtData.length
    const totalOverdueAmount = sampleDebtData
      .filter(item => item.overdueDays > 0)
      .reduce((sum, item) => sum + item.totalDebt, 0)
    
    setTotalDebt(totalDebtAmount)
    setTotalDebtors(totalDebtorsCount)
    setTotalOverdue(totalOverdueAmount)

    // Calculate initial revenue sources
    const sourceMap = new Map<string, { amount: number; transactionCount: number }>()
    
    sampleRevenueData.forEach(item => {
      if (item.sourceBreakdown) {
        Object.entries(item.sourceBreakdown).forEach(([sourceType, data]) => {
          if (sourceMap.has(sourceType)) {
            const existing = sourceMap.get(sourceType)!
            sourceMap.set(sourceType, {
              amount: existing.amount + data.amount,
              transactionCount: existing.transactionCount + data.transactionCount
            })
          } else {
            sourceMap.set(sourceType, {
              amount: data.amount,
              transactionCount: data.transactionCount
            })
          }
        })
      }
    })

    const initialRevenueSources: RevenueSource[] = Array.from(sourceMap.entries()).map(([type, data], index) => ({
      id: (index + 1).toString(),
      type,
      transactionCount: data.transactionCount,
      totalAmount: data.amount,
      percentage: totalRev > 0 ? Math.round((data.amount / totalRev) * 100) : 0
    }))

    setRevenueSources(initialRevenueSources)
  }, [])

  const handleQuickDateFilter = (filterType: string) => {
    const today = new Date()
    let fromDate: Date
    let filterName: string
    
    switch (filterType) {
      case "week":
        fromDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        filterName = "week"
        break
      case "month":
        fromDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        filterName = "month"
        break
      case "quarter":
        fromDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
        filterName = "quarter"
        break
      case "year":
        fromDate = new Date(today.getFullYear(), 0, 1) // Start of year
        filterName = "year"
        break
      default:
        return
    }
    
    setDateFrom(fromDate)
    setDateTo(today)
    setActiveDateFilter(filterName)
  }

  const handleClearDateFilter = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
    setActiveDateFilter("")
  }

  const handleManualDateChange = () => {
    setActiveDateFilter("")
  }

  const handleRevenueSourceClick = (sourceType: string) => {
    if (selectedRevenueSource === sourceType) {
      setSelectedRevenueSource(null) // Clear filter if clicking the same source
    } else {
      setSelectedRevenueSource(sourceType)
    }
  }

  const applyRevenueFilters = () => {
    let filtered = [...revenueData]

    if (dateFrom || dateTo) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date + 'T00:00:00')
        const fromDate = dateFrom ? new Date(dateFrom.getTime()) : null
        const toDate = dateTo ? new Date(dateTo.getTime()) : null

        if (fromDate && toDate) {
          // Set time to end of day for toDate
          toDate.setHours(23, 59, 59, 999)
          return itemDate >= fromDate && itemDate <= toDate
        } else if (fromDate) {
          return itemDate >= fromDate
        } else if (toDate) {
          // Set time to end of day for toDate
          toDate.setHours(23, 59, 59, 999)
          return itemDate <= toDate
        }
        return true
      })
    }

    // Apply cross-filtering based on selected revenue source
    if (selectedRevenueSource) {
      // First, filter out dates that don't have data for the selected source
      filtered = filtered.filter(item => 
        item.sourceBreakdown && item.sourceBreakdown[selectedRevenueSource]
      )
      
      // Then, update the data to show only the selected source's data
      filtered = filtered.map(item => {
        const sourceData = item.sourceBreakdown![selectedRevenueSource]
        return {
          ...item,
          amount: sourceData.amount,
          transactionCount: sourceData.transactionCount
        }
      })
    }

    setFilteredRevenueData(filtered)

    // Recalculate totals based on filtered data
    const totalRev = filtered.reduce((sum, item) => sum + item.amount, 0)
    const totalTrans = filtered.reduce((sum, item) => sum + item.transactionCount, 0)
    setTotalRevenue(totalRev)
    setTotalTransactions(totalTrans)
    setAveragePerTransaction(totalTrans > 0 ? totalRev / totalTrans : 0)

    // Recalculate revenue sources based on filtered data
    const sourceMap = new Map<string, { amount: number; transactionCount: number }>()
    
    filtered.forEach(item => {
      if (item.sourceBreakdown) {
        Object.entries(item.sourceBreakdown).forEach(([sourceType, data]) => {
          if (sourceMap.has(sourceType)) {
            const existing = sourceMap.get(sourceType)!
            sourceMap.set(sourceType, {
              amount: existing.amount + data.amount,
              transactionCount: existing.transactionCount + data.transactionCount
            })
          } else {
            sourceMap.set(sourceType, {
              amount: data.amount,
              transactionCount: data.transactionCount
            })
          }
        })
      }
    })

    const updatedRevenueSources: RevenueSource[] = Array.from(sourceMap.entries()).map(([type, data], index) => ({
      id: (index + 1).toString(),
      type,
      transactionCount: data.transactionCount,
      totalAmount: data.amount,
      percentage: totalRev > 0 ? Math.round((data.amount / totalRev) * 100) : 0
    }))

    setRevenueSources(updatedRevenueSources)
  }

  const handleExportExcel = () => {
    const fileName = activeTab === "revenue" 
      ? `bao-cao-thu-chi-${format(new Date(), "dd-MM-yyyy")}.csv`
      : `bao-cao-cong-no-${format(new Date(), "dd-MM-yyyy")}.csv`
    
    // Simulate Excel export
    const csvContent = activeTab === "revenue" 
      ? [
          "Loại Phí,Số lượng Giao dịch,Tổng Thu (VND),Tỷ trọng (%)",
          ...revenueSources.map(source => 
            `${source.type},${source.transactionCount},${source.totalAmount.toLocaleString()},${source.percentage}%`
          )
        ].join("\n")
      : [
          "Mã Gian hàng,Tên Tiểu thương,Số điện thoại,Tổng Nợ hiện tại (VND),Số ngày Quá hạn",
          ...filteredDebtData.map(debt => 
            `${debt.stallCode},"${debt.merchantName}",${debt.phone},${debt.totalDebt.toLocaleString()},${debt.overdueDays}`
          )
        ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewMerchantDetail = (merchant: DebtData) => {
    setSelectedMerchant(merchant)
    setIsMerchantDetailModalOpen(true)
  }

  const handleSendNotification = (merchant: DebtData) => {
    setSelectedMerchant(merchant)
    setIsNotificationModalOpen(true)
  }

  const handleSendNotificationConfirm = () => {
    // Simulate sending notification
    console.log("Sending notification to:", selectedMerchant)
    
    // Show success toast
    toast({
      title: "Gửi thông báo thành công!",
      description: `Đã gửi nhắc nợ cho ${selectedMerchant?.merchantName} (${selectedMerchant?.stallCode})`,
      variant: "success",
    })
    
    setIsNotificationModalOpen(false)
    setSelectedMerchant(null)
  }

  const handleViewPaymentHistory = () => {
    setIsPaymentHistoryModalOpen(true)
  }

  const handleExportMerchantReport = () => {
    // Simulate exporting report
    console.log("Exporting report for:", selectedMerchant)
    
    // Show success toast
    toast({
      title: "Xuất báo cáo thành công!",
      description: `Đã xuất báo cáo chi tiết cho ${selectedMerchant?.merchantName} (${selectedMerchant?.stallCode})`,
      variant: "success",
    })
  }

  const applyDebtFilters = () => {
    let filtered = [...debtData]

    // Zone filter
    if (zoneFilter !== "all") {
      filtered = filtered.filter(item => item.zone === zoneFilter)
    }

    // Overdue filter
    if (overdueFilter !== "all") {
      switch (overdueFilter) {
        case "not_overdue":
          filtered = filtered.filter(item => item.overdueDays === 0)
          break
        case "under_30":
          filtered = filtered.filter(item => item.overdueDays > 0 && item.overdueDays <= 30)
          break
        case "over_30":
          filtered = filtered.filter(item => item.overdueDays > 30)
          break
      }
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(item => 
        item.merchantName.toLowerCase().includes(term) ||
        item.stallCode.toLowerCase().includes(term)
      )
    }

    // Sorting
    const getSortValue = (item: DebtData): number => {
      return debtSortKey === "totalDebt" ? item.totalDebt : item.overdueDays
    }
    filtered.sort((a, b) => {
      const va = getSortValue(a)
      const vb = getSortValue(b)
      return debtSortOrder === "asc" ? va - vb : vb - va
    })

    setFilteredDebtData(filtered)
  }

  useEffect(() => {
    applyDebtFilters()
  }, [zoneFilter, overdueFilter, searchTerm, activeTab])

  // Re-apply sorting when sort state changes
  useEffect(() => {
    applyDebtFilters()
  }, [debtSortKey, debtSortOrder])

  const toggleDebtSort = (key: "totalDebt" | "overdueDays") => {
    if (debtSortKey === key) {
      setDebtSortOrder(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setDebtSortKey(key)
      setDebtSortOrder("desc")
    }
  }

  const allVisibleSelected = filteredDebtData.length > 0 && filteredDebtData.every(d => selectedDebtIds.includes(d.id))
  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedDebtIds(prev => prev.filter(id => !filteredDebtData.some(d => d.id === id)))
    } else {
      const visibleIds = filteredDebtData.map(d => d.id)
      setSelectedDebtIds(prev => Array.from(new Set([...prev, ...visibleIds])))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedDebtIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSendBulkNotifications = () => {
    if (selectedDebtIds.length === 0) return
    setIsBulkNotificationOpen(true)
  }

  useEffect(() => {
    applyRevenueFilters()
  }, [dateFrom, dateTo, revenueData, selectedRevenueSource])

  const getOverdueBadge = (days: number) => {
    if (days === 0) {
      return <Badge className="bg-green-100 text-green-800">Chưa quá hạn</Badge>
    } else if (days <= 30) {
      return <Badge className="bg-yellow-100 text-yellow-800">{days} ngày quá hạn</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800">{days} ngày quá hạn</Badge>
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
            <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
            <p className="text-gray-600">Phân tích tình hình tài chính và hoạt động của chợ</p>
          </div>
        </div>
        <Button onClick={handleExportExcel} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Xuất Excel
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Báo cáo Doanh thu
          </TabsTrigger>
          <TabsTrigger value="debt" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Báo cáo Công nợ
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Revenue Report */}
        <TabsContent value="revenue" className="space-y-6">
          {/* Date Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Bộ lọc thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              
                             {/* Quick Date Buttons */}
               <div className="flex flex-wrap gap-2">
                 <Button 
                   variant={activeDateFilter === "week" ? "default" : "outline"} 
                   size="sm" 
                   onClick={() => handleQuickDateFilter("week")}
                   className={activeDateFilter === "week" ? "bg-blue-600 text-white" : ""}
                 >
                   Tuần này
                 </Button>
                 <Button 
                   variant={activeDateFilter === "month" ? "default" : "outline"} 
                   size="sm" 
                   onClick={() => handleQuickDateFilter("month")}
                   className={activeDateFilter === "month" ? "bg-blue-600 text-white" : ""}
                 >
                   Tháng này
                 </Button>
                 <Button 
                   variant={activeDateFilter === "quarter" ? "default" : "outline"} 
                   size="sm" 
                   onClick={() => handleQuickDateFilter("quarter")}
                   className={activeDateFilter === "quarter" ? "bg-blue-600 text-white" : ""}
                 >
                   Quý này
                 </Button>
                 <Button 
                   variant={activeDateFilter === "year" ? "default" : "outline"} 
                   size="sm" 
                   onClick={() => handleQuickDateFilter("year")}
                   className={activeDateFilter === "year" ? "bg-blue-600 text-white" : ""}
                 >
                   Năm nay
                 </Button>
                 {(dateFrom || dateTo || activeDateFilter) && (
                   <Button 
                     variant="outline" 
                     size="sm" 
                     onClick={handleClearDateFilter}
                     className="text-red-600 border-red-600 hover:bg-red-50"
                   >
                     Xóa bộ lọc
                   </Button>
                 )}
               </div>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng Thu</p>
                    <p className="text-2xl font-bold text-green-600">
                      {totalRevenue.toLocaleString()} VND
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Số Giao dịch</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {totalTransactions} Giao dịch
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Trung bình/Giao dịch</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {averagePerTransaction.toLocaleString()} VND
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

                     {/* Revenue Trend Chart */}
           <Card>
             <CardHeader>
               <CardTitle>Xu hướng Doanh thu</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                                       <LineChart
                      data={filteredRevenueData}
                      margin={{
                       top: 5,
                       right: 30,
                       left: 20,
                       bottom: 5,
                     }}
                   >
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis 
                       dataKey="date" 
                       tickFormatter={(value) => format(new Date(value), "dd/MM")}
                       tick={{ fontSize: 12 }}
                     />
                     <YAxis 
                       tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                       tick={{ fontSize: 12 }}
                     />
                     <Tooltip 
                       formatter={(value: number) => [`${value.toLocaleString()} VND`, "Doanh thu"]}
                       labelFormatter={(label) => `Ngày ${format(new Date(label), "dd/MM/yyyy")}`}
                     />
                     <Line 
                       type="monotone" 
                       dataKey="amount" 
                       stroke="#10b981" 
                       strokeWidth={3}
                       dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                       activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                     />
                     <Brush 
                       dataKey="date" 
                       height={30} 
                       stroke="#10b981"
                       tickFormatter={(value) => format(new Date(value), "dd/MM")}
                     />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             </CardContent>
                      </Card>
 
           {/* Transaction Count Chart */}
           <Card>
             <CardHeader>
               <CardTitle>Số lượng Giao dịch theo ngày</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                                       <BarChart
                      data={filteredRevenueData}
                      margin={{
                       top: 5,
                       right: 30,
                       left: 20,
                       bottom: 5,
                     }}
                   >
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis 
                       dataKey="date" 
                       tickFormatter={(value) => format(new Date(value), "dd/MM")}
                       tick={{ fontSize: 12 }}
                     />
                     <YAxis 
                       tick={{ fontSize: 12 }}
                     />
                     <Tooltip 
                       formatter={(value: number) => [value, "Số giao dịch"]}
                       labelFormatter={(label) => `Ngày ${format(new Date(label), "dd/MM/yyyy")}`}
                     />
                     <Bar 
                       dataKey="transactionCount" 
                       fill="#3b82f6" 
                       radius={[4, 4, 0, 0]}
                     />
                     <Brush 
                       dataKey="date" 
                       height={30} 
                       stroke="#3b82f6"
                       tickFormatter={(value) => format(new Date(value), "dd/MM")}
                     />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </CardContent>
           </Card>
 
           {/* Revenue Sources Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
              <CardTitle>Phân tích Nguồn thu</CardTitle>
                {selectedRevenueSource && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedRevenueSource(null)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Xóa bộ lọc nguồn thu
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại Phí
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng Giao dịch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng Thu (VND)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tỷ trọng
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {revenueSources.map((source, index) => (
                      <tr 
                        key={source.id} 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedRevenueSource === source.type ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => handleRevenueSourceClick(source.type)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                          {source.type}
                            {selectedRevenueSource === source.type && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">Đang lọc</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {source.transactionCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {source.totalAmount.toLocaleString()} VND
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${source.percentage}%` }}
                              ></div>
                            </div>
                            <span>{source.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Debt Report */}
        <TabsContent value="debt" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Bộ lọc & Tìm kiếm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
                  <Select value={zoneFilter} onValueChange={setZoneFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khu vực" />
                    </SelectTrigger>
                                         <SelectContent>
                       <SelectItem value="all">Tất cả khu vực</SelectItem>
                       <SelectItem value="Khu A - Thực phẩm tươi">Khu A - Thực phẩm tươi</SelectItem>
                       <SelectItem value="Khu B - Thực phẩm khô">Khu B - Thực phẩm khô</SelectItem>
                       <SelectItem value="Khu C - Quần áo & Phụ kiện">Khu C - Quần áo & Phụ kiện</SelectItem>
                       <SelectItem value="Khu D - Đồ gia dụng">Khu D - Đồ gia dụng</SelectItem>
                       <SelectItem value="Khu E - Đồ điện tử">Khu E - Đồ điện tử</SelectItem>
                       <SelectItem value="Khu F - Đồ thủ công">Khu F - Đồ thủ công</SelectItem>
                       <SelectItem value="Khu G - Đồ ăn nhanh">Khu G - Đồ ăn nhanh</SelectItem>
                       <SelectItem value="Khu H - Đồ uống">Khu H - Đồ uống</SelectItem>
                     </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ quá hạn</label>
                  <Select value={overdueFilter} onValueChange={setOverdueFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mức độ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="not_overdue">Chưa tới hạn</SelectItem>
                      <SelectItem value="under_30">Quá hạn dưới 30 ngày</SelectItem>
                      <SelectItem value="over_30">Quá hạn trên 30 ngày</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Tên tiểu thương, mã gian hàng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng Công nợ</p>
                    <p className="text-2xl font-bold text-red-600">
                      {totalDebt.toLocaleString()} VND
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Số Tiểu thương đang nợ</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {totalDebtors} Tiểu thương
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nợ quá hạn</p>
                    <p className="text-2xl font-bold text-red-600">
                      {totalOverdue.toLocaleString()} VND
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Debt Overview Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie: Debt by Zone */}
            <Card>
              <CardHeader>
                <CardTitle>Tỷ trọng công nợ theo khu vực</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Tooltip formatter={(value: number) => [`${value.toLocaleString()} VND`, "Công nợ"]} />
                      <RePie
                        data={Object.entries(
                          filteredDebtData.reduce((acc: Record<string, number>, item) => {
                            acc[item.zone] = (acc[item.zone] || 0) + item.totalDebt
                            return acc
                          }, {})
                        ).map(([zone, amount]) => ({ name: zone, value: amount }))}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        label={entry => `${Math.round((entry.value as number) / Math.max(1, filteredDebtData.reduce((s, i)=> s + i.totalDebt, 0)) * 100)}%`}
                      >
                        {Object.entries(
                          filteredDebtData.reduce((acc: Record<string, number>, item) => {
                            acc[item.zone] = (acc[item.zone] || 0) + item.totalDebt
                            return acc
                          }, {})
                        ).map(([zone], index) => (
                          <Cell key={zone} fill={["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#a3e635"][index % 8]} />
                        ))}
                      </RePie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Horizontal Bar: Top 5 Debtors */}
            <Card>
              <CardHeader>
                <CardTitle>Top 5 tiểu thương có công nợ cao nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[...filteredDebtData]
                        .sort((a, b) => b.totalDebt - a.totalDebt)
                        .slice(0, 5)
                        .map(item => ({
                          name: `${item.merchantName} (${item.stallCode})`,
                          value: item.totalDebt
                        }))}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`} />
                      <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: number) => [`${value.toLocaleString()} VND`, "Công nợ"]} />
                      <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 4, 4]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Debt Details Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
              <CardTitle>Chi tiết Công nợ</CardTitle>
                <Button onClick={handleSendBulkNotifications} disabled={selectedDebtIds.length === 0} className="bg-red-600 hover:bg-red-700">
                  Gửi nhắc nợ hàng loạt ({selectedDebtIds.length})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Checkbox checked={allVisibleSelected} onCheckedChange={toggleSelectAllVisible} />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã Gian hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên Tiểu thương
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số điện thoại
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => toggleDebtSort("totalDebt")}
                      >
                        Tổng Nợ hiện tại (VND)
                        {debtSortKey === "totalDebt" && (
                          <span className="ml-1 text-gray-400">{debtSortOrder === "asc" ? "▲" : "▼"}</span>
                        )}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={() => toggleDebtSort("overdueDays")}
                      >
                        Số ngày Quá hạn
                        {debtSortKey === "overdueDays" && (
                          <span className="ml-1 text-gray-400">{debtSortOrder === "asc" ? "▲" : "▼"}</span>
                        )}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDebtData.map((debt, index) => (
                      <tr key={debt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Checkbox checked={selectedDebtIds.includes(debt.id)} onCheckedChange={() => toggleSelectOne(debt.id)} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {debt.stallCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {debt.merchantName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {debt.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {debt.totalDebt.toLocaleString()} VND
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getOverdueBadge(debt.overdueDays)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewMerchantDetail(debt)}
                              className="p-1"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendNotification(debt)}
                              className="p-1"
                            >
                              <Bell className="w-4 h-4" />
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
          {/* Bulk Notification Dialog */}
          <Dialog open={isBulkNotificationOpen} onOpenChange={setIsBulkNotificationOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gửi nhắc nợ hàng loạt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Bạn sắp gửi nhắc nợ tới {selectedDebtIds.length} tiểu thương.</p>
                <div className="max-h-40 overflow-auto bg-gray-50 rounded p-2 text-sm">
                  <ul className="list-disc pl-5">
                    {filteredDebtData.filter(d => selectedDebtIds.includes(d.id)).map(d => (
                      <li key={d.id}>{d.merchantName} ({d.stallCode}) - {d.totalDebt.toLocaleString()} VND</li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsBulkNotificationOpen(false)}>Hủy</Button>
                  <Button className="bg-red-600 hover:bg-red-700" onClick={() => { 
                    console.log("Bulk notify: ", selectedDebtIds); 
                    
                    // Show success toast
                    toast({
                      title: "Gửi nhắc nợ hàng loạt thành công!",
                      description: `Đã gửi thông báo nhắc nợ cho ${selectedDebtIds.length} tiểu thương`,
                      variant: "success",
                    })
                    
                    setIsBulkNotificationOpen(false); 
                  }}>
                    Gửi nhắc nợ
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>

             {/* Date From Calendar Modal */}
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
                 handleManualDateChange()
               }}
               locale={vi}
               className="rounded-md border"
             />
           </div>
         </DialogContent>
       </Dialog>

       {/* Date To Calendar Modal */}
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
                 handleManualDateChange()
               }}
               locale={vi}
               className="rounded-md border"
             />
           </div>
         </DialogContent>
       </Dialog>

       {/* Notification Modal */}
       <Dialog open={isNotificationModalOpen} onOpenChange={setIsNotificationModalOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Gửi thông báo Nhắc nợ</DialogTitle>
           </DialogHeader>
           {selectedMerchant && (
             <div className="space-y-4">
               <div className="p-4 bg-gray-50 rounded-lg">
                 <p className="text-sm text-gray-600 mb-2">Gửi đến:</p>
                 <p className="font-medium">{selectedMerchant.merchantName}</p>
                 <p className="text-sm text-gray-500">{selectedMerchant.stallCode} - {selectedMerchant.phone}</p>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung thông báo</label>
                 <div className="p-3 bg-gray-50 rounded-lg text-sm">
                   <p>Kính gửi {selectedMerchant.merchantName},</p>
                   <p className="mt-2">
                     Ban Quản lý Chợ xin thông báo quý khách đang có khoản nợ: 
                     <strong className="text-red-600"> {selectedMerchant.totalDebt.toLocaleString()} VND</strong>
                   </p>
                   {selectedMerchant.overdueDays > 0 && (
                     <p className="mt-2 text-red-600">
                       Đã quá hạn {selectedMerchant.overdueDays} ngày. Vui lòng thanh toán sớm để tránh bị đình chỉ hoạt động.
                     </p>
                   )}
                   <p className="mt-2">Trân trọng,<br/>Ban Quản lý Chợ</p>
                 </div>
               </div>
               
               <div className="flex justify-end gap-2">
                 <Button variant="outline" onClick={() => setIsNotificationModalOpen(false)}>
                   Hủy
                 </Button>
                 <Button onClick={handleSendNotificationConfirm}>
                   Gửi thông báo
                 </Button>
               </div>
             </div>
           )}
         </DialogContent>
       </Dialog>

               {/* Merchant Detail Modal */}
        <Dialog open={isMerchantDetailModalOpen} onOpenChange={setIsMerchantDetailModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Chi tiết Tiểu thương
              </DialogTitle>
            </DialogHeader>
            {selectedMerchant && (
              <div className="space-y-6">
                {/* Header Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-l-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{selectedMerchant.merchantName}</h3>
                    <Badge className="bg-blue-100 text-blue-800">{selectedMerchant.stallCode}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{selectedMerchant.zone}</p>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Tên tiểu thương:</span>
                      <span className="font-medium">{selectedMerchant.merchantName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Số điện thoại:</span>
                      <span className="font-medium">{selectedMerchant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Khu vực:</span>
                      <span className="font-medium">{selectedMerchant.zone}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-600">Tổng nợ:</span>
                      <span className="font-bold text-lg text-red-600">{selectedMerchant.totalDebt.toLocaleString()} VND</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Ngày quá hạn:</span>
                      <span className="font-medium text-orange-600">{selectedMerchant.overdueDays} ngày</span>
                    </div>
                                         <div className="flex items-center gap-2">
                       <CalendarIcon className="w-4 h-4 text-gray-500" />
                       <span className="text-sm text-gray-600">Trạng thái:</span>
                       <Badge className={selectedMerchant.overdueDays > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                         {selectedMerchant.overdueDays > 0 ? "Quá hạn" : "Đang hoạt động"}
                       </Badge>
                     </div>
                  </div>
                </div>

                {/* Debt Breakdown */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Chi tiết công nợ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Phí mặt bằng</div>
                      <div className="font-bold text-lg text-red-600">
                        {Math.round(selectedMerchant.totalDebt * 0.6).toLocaleString()} VND
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Phí điện, nước</div>
                      <div className="font-bold text-lg text-orange-600">
                        {Math.round(selectedMerchant.totalDebt * 0.25).toLocaleString()} VND
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Phí vệ sinh</div>
                      <div className="font-bold text-lg text-yellow-600">
                        {Math.round(selectedMerchant.totalDebt * 0.15).toLocaleString()} VND
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" className="flex-1" onClick={handleViewPaymentHistory}>
                    <FileText className="w-4 h-4 mr-2" />
                    Xem lịch sử thanh toán
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleExportMerchantReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Xuất báo cáo chi tiết
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment History Sheet */}
        <Sheet open={isPaymentHistoryModalOpen} onOpenChange={setIsPaymentHistoryModalOpen}>
          <SheetContent side="right" className="w-[800px] overflow-y-auto p-0">
            <SheetHeader className="space-y-4 pb-6 border-b p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <SheetTitle className="text-xl font-bold">
                    Lịch sử thanh toán - {selectedMerchant?.merchantName}
                  </SheetTitle>
                  <p className="text-sm text-gray-600">
                    Chi tiết các lần thanh toán và thống kê
                  </p>
                </div>
              </div>
            </SheetHeader>
            {selectedMerchant && (
              <div className="p-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-l-green-500">
                    <div className="text-sm text-gray-600">Tổng đã thanh toán</div>
                    <div className="font-bold text-lg text-green-600">45,200,000 VND</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-500">
                    <div className="text-sm text-gray-600">Số lần thanh toán</div>
                    <div className="font-bold text-lg text-blue-600">24 lần</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-l-orange-500">
                    <div className="text-sm text-gray-600">Lần thanh toán gần nhất</div>
                    <div className="font-bold text-lg text-orange-600">15/07/2025</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-l-purple-500">
                    <div className="text-sm text-gray-600">Trung bình/lần</div>
                    <div className="font-bold text-lg text-purple-600">1,883,333 VND</div>
                  </div>
                </div>

                {/* Payment History Table */}
                <div>
                  <h4 className="font-medium mb-3">Chi tiết các lần thanh toán</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày thanh toán</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Loại phí</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số tiền</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phương thức</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">15/07/2025</td>
                          <td className="px-4 py-3 text-sm">Phí mặt bằng</td>
                          <td className="px-4 py-3 text-sm font-medium">2,500,000 VND</td>
                          <td className="px-4 py-3 text-sm">Chuyển khoản</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-green-100 text-green-800">Thành công</Badge>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">10/07/2025</td>
                          <td className="px-4 py-3 text-sm">Phí điện, nước</td>
                          <td className="px-4 py-3 text-sm font-medium">1,200,000 VND</td>
                          <td className="px-4 py-3 text-sm">Tiền mặt</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-green-100 text-green-800">Thành công</Badge>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">05/07/2025</td>
                          <td className="px-4 py-3 text-sm">Phí vệ sinh</td>
                          <td className="px-4 py-3 text-sm font-medium">800,000 VND</td>
                          <td className="px-4 py-3 text-sm">Chuyển khoản</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-green-100 text-green-800">Thành công</Badge>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">01/07/2025</td>
                          <td className="px-4 py-3 text-sm">Phí mặt bằng</td>
                          <td className="px-4 py-3 text-sm font-medium">2,500,000 VND</td>
                          <td className="px-4 py-3 text-sm">Tiền mặt</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-green-100 text-green-800">Thành công</Badge>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">25/06/2025</td>
                          <td className="px-4 py-3 text-sm">Phí điện, nước</td>
                          <td className="px-4 py-3 text-sm font-medium">1,500,000 VND</td>
                          <td className="px-4 py-3 text-sm">Chuyển khoản</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-green-100 text-green-800">Thành công</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Chart */}
                <div>
                  <h4 className="font-medium mb-3">Biểu đồ thanh toán theo tháng</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { month: "T3", amount: 4500000 },
                        { month: "T4", amount: 5200000 },
                        { month: "T5", amount: 4800000 },
                        { month: "T6", amount: 6100000 },
                        { month: "T7", amount: 4520000 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${(Number(value) / 1000000).toFixed(1)}M VND`} />
                        <Bar dataKey="amount" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsPaymentHistoryModalOpen(false)}>
                    Đóng
                  </Button>
                  <Button onClick={() => {
                    toast({
                      title: "Xuất lịch sử thành công!",
                      description: `Đã xuất lịch sử thanh toán cho ${selectedMerchant.merchantName}`,
                      variant: "success",
                    })
                  }}>
                    <Download className="w-4 h-4 mr-2" />
                    Xuất báo cáo
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
    </div>
  )
} 