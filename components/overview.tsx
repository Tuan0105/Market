"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertTriangle, Clock, Building2, Send, FileText, Eye, Calendar, User, Phone, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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
      color: "text-green-600",
      chart: (
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revenueGradient)" strokeWidth={2} />
            <Tooltip 
              formatter={(value: number) => [`${(value / 1000000000).toFixed(1)} tỷ VND`, "Doanh thu"]}
              labelFormatter={(label) => `Tháng ${label}`}
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    },
    {
      title: "Số tiểu thương hoạt động",
      value: "248",
      change: "+3",
      color: "text-blue-600",
      chart: (
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={merchantData}>
            <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Tooltip 
              formatter={(value: number) => [value, "Tiểu thương hoạt động"]}
              labelFormatter={(label) => `Tháng ${label}`}
            />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    {
      title: "Số gian hàng đang hoạt động",
      value: "248",
      change: "+5",
      color: "text-orange-600",
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
            <Bar dataKey="active" fill="#f97316" radius={[2, 2, 0, 0]} />
            <Tooltip 
              formatter={(value: number) => [value, "Gian hàng hoạt động"]}
              labelFormatter={(label) => `Khu ${label}`}
            />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    {
      title: "Tỷ lệ thu phí",
      value: "94.2%",
      change: "+2.1%",
      color: "text-purple-600",
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
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan Hệ thống</h1>
        <p className="text-gray-600 mt-2">Quản lý hoạt động chợ truyền thống</p>
      </div>

      {/* Stats Grid with Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.color} mt-1`}>{stat.change} so với tháng trước</p>
              <div className="mt-4">
                {stat.chart}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Smart Widgets - Thay thế Thao tác nhanh */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Công nợ quá hạn cần xử lý */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Top 5 Công nợ quá hạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueDebts.map((debt, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{debt.name}</span>
                    <Badge variant="outline" className="text-xs">{debt.stallCode}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-red-600">{formatCurrency(debt.amount)}</span>
                    <span className="text-xs text-red-500 font-medium">{debt.daysOverdue} ngày quá hạn</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs"
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
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-500" />
              Hợp đồng hết hạn trong 30 ngày tới
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expiringContracts.map((contract, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{contract.name}</span>
                    <Badge variant="outline" className="text-xs">{contract.stallCode}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-orange-600 font-medium">Hết hạn: {formatDate(contract.expiryDate)}</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs"
                  onClick={() => handleViewContract(contract)}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Xem HĐ
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Widget 3: Thống kê Nhanh Tình trạng Mặt bằng */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-blue-500" />
              Tình trạng Mặt bằng
            </CardTitle>
          </CardHeader>
          <CardContent>
                         <div className="flex items-center justify-center mb-4">
               <ResponsiveContainer width={250} height={250}>
                 <PieChart>
                   <Pie
                     data={stallStatusData}
                     cx="50%"
                     cy="50%"
                     innerRadius={50}
                     outerRadius={100}
                     paddingAngle={2}
                     dataKey="value"
                   >
                     {stallStatusData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip formatter={(value: number) => [value, "Gian hàng"]} />
                 </PieChart>
               </ResponsiveContainer>
             </div>
            <div className="space-y-2">
              {stallStatusData.map((status, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span>{status.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{status.value} gian</span>
                    <span className="text-gray-500 text-xs">
                      ({((status.value / 263) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Các giao dịch và thông báo mới nhất</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg">
                  <span className="text-lg">💳</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ghi nhận thanh toán từ gian hàng A01 - Nguyễn Thị Lan</p>
                  <p className="text-sm text-gray-500">10 phút trước</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">5,000,000 VND</p>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Thành công</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg">
                  <span className="text-lg">🔔</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Gửi thông báo 'Quy định mới về giờ hoạt động' đến 150 tiểu thương</p>
                  <p className="text-sm text-gray-500">25 phút trước</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Thành công</span>
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
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border-l-4 border-l-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{selectedContract.name}</h3>
                  <Badge className="bg-orange-100 text-orange-800">Sắp hết hạn</Badge>
                </div>
                <p className="text-sm text-gray-600">Gian hàng: {selectedContract.stallCode} - {selectedContract.zone}</p>
              </div>

              {/* Contract Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Tiểu thương:</span>
                    <span className="font-medium">{selectedContract.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Số điện thoại:</span>
                    <span className="font-medium">{selectedContract.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Khu vực:</span>
                    <span className="font-medium">{selectedContract.zone}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Ngày bắt đầu:</span>
                    <span className="font-medium">{formatDate(selectedContract.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Ngày hết hạn:</span>
                    <span className="font-medium text-red-600">{formatDate(selectedContract.expiryDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <Badge className="bg-green-100 text-green-800">Đang hoạt động</Badge>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Thông tin tài chính</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Phí thuê hàng tháng</div>
                    <div className="font-bold text-lg text-green-600">{formatCurrency(selectedContract.monthlyFee)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Tiền đặt cọc</div>
                    <div className="font-bold text-lg text-blue-600">{formatCurrency(selectedContract.deposit)}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Tải PDF
                </Button>
                <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
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