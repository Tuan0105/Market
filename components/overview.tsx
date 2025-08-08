"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, Building2, Calendar, Clock, DollarSign, FileText, MapPin, Percent, Phone, Send, Store, TrendingDown, TrendingUp, User, Users } from "lucide-react"
import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

interface OverviewProps {
  onBack: () => void
}

export function Overview({ onBack }: OverviewProps) {
  const { toast } = useToast()
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<any>(null)

  // Dữ liệu biểu đồ doanh thu
  const revenueData = [
    { month: "T1", revenue: 1800000000 },
    { month: "T2", revenue: 1950000000 },
    { month: "T3", revenue: 2100000000 },
    { month: "T4", revenue: 2200000000 },
    { month: "T5", revenue: 2300000000 },
    { month: "T6", revenue: 2400000000 },
    { month: "T7", revenue: 2350000000 },
    { month: "T8", revenue: 2450000000 },
  ]

  // Dữ liệu biểu đồ tiểu thương
  const merchantData = [
    { month: "T1", active: 220, total: 250 },
    { month: "T2", active: 225, total: 250 },
    { month: "T3", active: 230, total: 250 },
    { month: "T4", active: 235, total: 250 },
    { month: "T5", active: 240, total: 250 },
    { month: "T6", active: 242, total: 250 },
    { month: "T7", active: 245, total: 250 },
    { month: "T8", active: 248, total: 250 },
  ]

  // Dữ liệu biểu đồ tỷ lệ thu phí
  const feeCollectionData = [
    { month: "T1", rate: 88.5 },
    { month: "T2", rate: 89.2 },
    { month: "T3", rate: 90.1 },
    { month: "T4", rate: 91.3 },
    { month: "T5", rate: 92.8 },
    { month: "T6", rate: 93.5 },
    { month: "T7", rate: 93.8 },
    { month: "T8", rate: 94.2 },
  ]

  // Dữ liệu công nợ quá hạn
  const overdueDebts = [
    { name: "Nguyễn Văn B", stallCode: "B02", amount: 15200000, daysOverdue: 45 },
    { name: "Trần Thị C", stallCode: "C03", amount: 12800000, daysOverdue: 38 },
    { name: "Lê Văn D", stallCode: "A05", amount: 9800000, daysOverdue: 32 },
    { name: "Phạm Thị E", stallCode: "B04", amount: 7500000, daysOverdue: 28 },
    { name: "Hoàng Văn F", stallCode: "C01", amount: 6200000, daysOverdue: 25 },
  ]

  // Dữ liệu hợp đồng sắp hết hạn
  const expiringContracts = [
    { 
      name: "Nguyễn Thị G", 
      stallCode: "A03", 
      expiryDate: "2025-08-25",
      startDate: "2024-08-25",
      phone: "0901234567",
      zone: "Khu A - Thực phẩm tươi sống",
      monthlyFee: 8000000,
      deposit: 16000000,
      status: "active"
    },
    { 
      name: "Trần Văn H", 
      stallCode: "B01", 
      expiryDate: "2025-08-28",
      startDate: "2024-08-28",
      phone: "0901234568",
      zone: "Khu B - Rau củ quả",
      monthlyFee: 7500000,
      deposit: 15000000,
      status: "active"
    },
    { 
      name: "Lê Thị I", 
      stallCode: "C02", 
      expiryDate: "2025-09-02",
      startDate: "2024-09-02",
      phone: "0901234569",
      zone: "Khu C - Hỗn hợp",
      monthlyFee: 7000000,
      deposit: 14000000,
      status: "active"
    },
    { 
      name: "Phạm Văn J", 
      stallCode: "A06", 
      expiryDate: "2025-09-05",
      startDate: "2024-09-05",
      phone: "0901234570",
      zone: "Khu A - Thực phẩm tươi sống",
      monthlyFee: 8000000,
      deposit: 16000000,
      status: "active"
    },
    { 
      name: "Hoàng Thị K", 
      stallCode: "B03", 
      expiryDate: "2025-09-08",
      startDate: "2024-09-08",
      phone: "0901234571",
      zone: "Khu B - Rau củ quả",
      monthlyFee: 7500000,
      deposit: 15000000,
      status: "active"
    },
  ]

  // Dữ liệu tình trạng mặt bằng
  const stallStatusData = [
    { name: "Đang cho thuê", value: 248, color: "#10b981" },
    { name: "Còn trống", value: 10, color: "#6b7280" },
    { name: "Đang sửa chữa", value: 5, color: "#f59e0b" },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  // Hàm xử lý gửi nhắc nợ
  const handleSendReminder = (debt: any) => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Đã gửi nhắc nợ thành công!",
        description: `Nhắc nợ đã được gửi đến ${debt.name} (${debt.stallCode})`,
        variant: "success"
      })
    }, 1000)

    // Hiển thị loading state
    toast({
      title: "Đang gửi nhắc nợ...",
      description: `Gửi nhắc nợ đến ${debt.name}`,
      variant: "default"
    })
  }

  // Hàm xử lý xem hợp đồng
  const handleViewContract = (contract: any) => {
    setSelectedContract(contract)
    setIsContractModalOpen(true)
  }

  const stats = [
    {
      title: "Tổng doanh thu tháng",
      value: "2,450,000,000 VND",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      chart: (
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revenueGradient)" strokeWidth={3} />
            <Tooltip 
              formatter={(value: number) => [`${(value / 1000000000).toFixed(1)} tỷ VND`, "Doanh thu"]}
              labelFormatter={(label) => `Tháng ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    },
    {
      title: "Số tiểu thương hoạt động",
      value: "248",
      change: "+3",
      changeType: "positive",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      chart: (
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={merchantData}>
            <Line 
              type="monotone" 
              dataKey="active" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
            />
            <Tooltip 
              formatter={(value: number) => [value, "Tiểu thương hoạt động"]}
              labelFormatter={(label) => `Tháng ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      title: "Số gian hàng đang hoạt động",
      value: "248",
      change: "+5",
      changeType: "positive",
      icon: Store,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      chart: (
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={[
            { zone: "Khu A", active: 45, total: 50 },
            { zone: "Khu B", active: 38, total: 40 },
            { zone: "Khu C", active: 42, total: 45 },
            { zone: "Khu D", active: 35, total: 38 },
            { zone: "Khu E", active: 28, total: 30 },
            { zone: "Khu F", active: 30, total: 32 },
            { zone: "Khu G", active: 30, total: 28 }
          ]}>
            <Bar dataKey="active" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Tooltip 
              formatter={(value: number) => [value, "Gian hàng hoạt động"]}
              labelFormatter={(label) => `Khu ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    {
      title: "Tỷ lệ thu phí",
      value: "94.2%",
      change: "+2.1%",
      changeType: "positive",
      icon: Percent,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      chart: (
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={feeCollectionData}>
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, "Tỷ lệ thu phí"]}
              labelFormatter={(label) => `Tháng ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
  ]

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan Hệ thống</h1>
        <p className="text-gray-600 mt-2">Quản lý hoạt động chợ truyền thống</p>
      </div>

      {/* Stats Grid with Charts - Cải thiện với icons và màu sắc */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                <div className="flex items-center gap-1 mb-4">
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <p className={`text-sm font-medium ${stat.color}`}>
                    {stat.change} so với tháng trước
                  </p>
                </div>
                <div className="mt-4">
                  {stat.chart}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Smart Widgets - Cải thiện với shadows và micro-interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Công nợ quá hạn cần xử lý */}
        <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              Top 5 Công nợ quá hạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueDebts.map((debt, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 cursor-pointer group/item"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{debt.name}</span>
                    <Badge variant="outline" className="text-xs border-red-200 text-red-700">#{debt.stallCode}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-red-600">{formatCurrency(debt.amount)}</span>
                    <span className="text-xs text-red-500 font-medium bg-red-100 px-2 py-0.5 rounded-full">
                      {debt.daysOverdue} ngày quá hạn
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs border-red-200 text-red-700 hover:bg-red-600 hover:text-white transition-colors"
                  onClick={() => handleSendReminder(debt)}
                >
                  <Send className="w-3 h-3 mr-1" />
                  Gửi nhắc nợ
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Widget 2: Hợp đồng sắp hết hạn */}
        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
              Hợp đồng hết hạn trong 30 ngày tới
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expiringContracts.map((contract, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all duration-200 cursor-pointer group/item"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{contract.name}</span>
                    <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">#{contract.stallCode}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-orange-600 font-bold">Hết hạn: {formatDate(contract.expiryDate)}</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs border-orange-200 text-orange-700 hover:bg-orange-600 hover:text-white transition-colors"
                  onClick={() => handleViewContract(contract)}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Xem HĐ
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Widget 3: Thống kê Nhanh Tình trạng Mặt bằng - Cải thiện với Progress Bar */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Building2 className="w-4 h-4 text-blue-500" />
              </div>
              Tình trạng Mặt bằng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress Bar cho tổng quan */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Tỷ lệ lấp đầy</span>
                  <span className="text-sm font-bold text-blue-600">94.3%</span>
                </div>
                <Progress value={94.3} className="h-3" />
                <div className="text-xs text-gray-500 text-center">
                  Đang cho thuê: 248 / 263 gian hàng
                </div>
              </div>

              {/* Chi tiết từng trạng thái */}
              <div className="space-y-3">
                {stallStatusData.map((status, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ backgroundColor: status.color }}
                      ></div>
                      <span className="font-medium text-sm">{status.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{status.value}</span>
                      <span className="text-gray-500 text-xs">
                        ({((status.value / 263) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities - Cải thiện với micro-interactions */}
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <Clock className="w-4 h-4 text-gray-600" />
            </div>
            Hoạt động gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Các giao dịch và thông báo mới nhất</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md">
                  <span className="text-lg">💳</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Ghi nhận thanh toán từ gian hàng A01 - Nguyễn Thị Lan</p>
                  <p className="text-sm text-gray-500">10 phút trước</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-lg">5,000,000 VND</p>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Thành công</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md">
                  <span className="text-lg">🔔</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Gửi thông báo 'Quy định mới về giờ hoạt động' đến 150 tiểu thương</p>
                  <p className="text-sm text-gray-500">25 phút trước</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Thành công</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Detail Modal */}
      <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Chi tiết Hợp đồng
            </DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border-l-4 border-l-orange-500 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{selectedContract.name}</h3>
                  <Badge className="bg-orange-100 text-orange-800 font-medium">Sắp hết hạn</Badge>
                </div>
                <p className="text-sm text-gray-600">Gian hàng: {selectedContract.stallCode} - {selectedContract.zone}</p>
              </div>

              {/* Contract Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Tiểu thương:</span>
                    <span className="font-semibold">{selectedContract.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Số điện thoại:</span>
                    <span className="font-semibold">{selectedContract.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Khu vực:</span>
                    <span className="font-semibold">{selectedContract.zone}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Ngày bắt đầu:</span>
                    <span className="font-semibold">{formatDate(selectedContract.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Ngày hết hạn:</span>
                    <span className="font-bold text-red-600">{formatDate(selectedContract.expiryDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <Badge className="bg-green-100 text-green-800 font-medium">Đang hoạt động</Badge>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Thông tin tài chính</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600">Phí thuê hàng tháng</div>
                    <div className="font-bold text-lg text-green-600">{formatCurrency(selectedContract.monthlyFee)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600">Tiền đặt cọc</div>
                    <div className="font-bold text-lg text-blue-600">{formatCurrency(selectedContract.deposit)}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1 hover:bg-gray-50 transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Tải PDF
                </Button>
                <Button className="flex-1 bg-orange-600 hover:bg-orange-700 transition-colors">
                  <Calendar className="w-4 h-4 mr-2" />
                  Gia hạn hợp đồng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 