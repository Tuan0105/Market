"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  LogOut, 
  User, 
  Building2, 
  FileText, 
  CreditCard, 
  Bell, 
  Settings,
  History,
  MessageSquare,
  QrCode,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Receipt,
  Send,
  Upload,
  MapPin
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface UserDashboardProps {
  userData: any
  onLogout: () => void
}

export function UserDashboard({ userData, onLogout }: UserDashboardProps) {
  const { toast } = useToast()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const [isDebtDetailModalOpen, setIsDebtDetailModalOpen] = useState(false)
  const [isAllNotificationsModalOpen, setIsAllNotificationsModalOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isMarketMapModalOpen, setIsMarketMapModalOpen] = useState(false)
  const [feedbackTitle, setFeedbackTitle] = useState("")
  const [feedbackContent, setFeedbackContent] = useState("")

  // Sample data for merchant
  const merchantData = {
    name: "Nguyễn Thị Lan",
    stallCode: "A01",
    zone: "Khu A - Thực phẩm tươi sống",
    phone: "0901234567",
    contractEndDate: "2025-12-31"
  }

  const currentDebt = {
    total: 10500000,
    dueDate: "2025-08-15",
    breakdown: [
      { name: "Phí mặt bằng", amount: 8000000 },
      { name: "Phí vệ sinh", amount: 500000 },
      { name: "Tiền điện", amount: 2000000 }
    ]
  }

  const notifications = [
    {
      id: 1,
      title: "Thông báo Lịch phun thuốc khử trùng toàn chợ",
      date: "2025-08-10",
      description: "Chợ sẽ tiến hành phun thuốc khử trùng vào ngày 15/08/2025 từ 22:00 - 02:00. Vui lòng che đậy hàng hóa và không có mặt tại chợ trong thời gian này."
    },
    {
      id: 2,
      title: "Cập nhật Quy định về giờ hoạt động",
      date: "2025-08-08",
      description: "Từ ngày 01/09/2025, chợ sẽ mở cửa từ 04:00 - 20:00. Các gian hàng phải tuân thủ giờ giấc nghiêm ngặt."
    },
    {
      id: 3,
      title: "Thông báo về việc bảo trì hệ thống điện",
      date: "2025-08-05",
      description: "Hệ thống điện sẽ được bảo trì vào ngày 12/08/2025 từ 02:00 - 06:00. Có thể mất điện trong thời gian này."
    },
    {
      id: 4,
      title: "Thông báo về việc thu phí vệ sinh môi trường",
      date: "2025-08-03",
      description: "Từ tháng 9/2025, phí vệ sinh môi trường sẽ được tính thêm 200,000 VND/tháng. Vui lòng chuẩn bị thanh toán."
    },
    {
      id: 5,
      title: "Thông báo về việc kiểm tra an toàn thực phẩm",
      date: "2025-08-01",
      description: "Ban quản lý sẽ tiến hành kiểm tra an toàn thực phẩm vào ngày 20/08/2025. Các gian hàng thực phẩm cần chuẩn bị giấy tờ liên quan."
    },
    {
      id: 6,
      title: "Thông báo về việc cập nhật hệ thống thanh toán",
      date: "2025-07-28",
      description: "Hệ thống thanh toán điện tử sẽ được cập nhật từ ngày 01/08/2025. Vui lòng cập nhật ứng dụng để sử dụng tính năng mới."
    }
  ]

  const paymentHistory = [
    {
      id: "PAY-001",
      date: "2025-07-15",
      amount: 8500000,
      status: "success",
      description: "Thanh toán phí tháng 7/2025"
    },
    {
      id: "PAY-002", 
      date: "2025-06-15",
      amount: 8200000,
      status: "success",
      description: "Thanh toán phí tháng 6/2025"
    },
    {
      id: "PAY-003",
      date: "2025-05-15", 
      amount: 8000000,
      status: "success",
      description: "Thanh toán phí tháng 5/2025"
    }
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

  const handlePayment = () => {
    setIsPaymentModalOpen(true)
  }

  const handleSubmitFeedback = () => {
    if (!feedbackTitle.trim() || !feedbackContent.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive"
      })
      return
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: "Phản ánh của bạn đã được gửi đi. Chúng tôi sẽ phản hồi sớm nhất!",
        variant: "success"
      })
      setIsFeedbackModalOpen(false)
      setFeedbackTitle("")
      setFeedbackContent("")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">S-Chợ</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">{merchantData.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Chào mừng, {merchantData.name}!</h1>
          <p className="text-gray-600 mt-1">
            Gian hàng: {merchantData.stallCode} ({merchantData.zone})
          </p>
        </div>

        {/* Current Debt Card - Most Important */}
        <Card className="mb-6 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              Công nợ cần thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-800 mb-2">
                {formatCurrency(currentDebt.total)}
              </div>
              <p className="text-sm text-orange-700 mb-4">
                Hạn nộp: {formatDate(currentDebt.dueDate)}
              </p>
              <Button 
                size="lg" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                onClick={handlePayment}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Thanh toán Ngay
              </Button>
            </div>
            <div className="text-center">
              <button 
                className="text-sm text-orange-600 hover:text-orange-800 underline"
                onClick={() => setIsDebtDetailModalOpen(true)}
              >
                Xem chi tiết công nợ &gt;
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Thông báo từ Ban Quản lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <span className="text-sm text-gray-500">{formatDate(notification.date)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                </div>
              ))}
              <div className="text-center pt-2">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                  onClick={() => setIsAllNotificationsModalOpen(true)}
                >
                  Xem tất cả thông báo &gt;
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle>Truy cập Nhanh</CardTitle>
          </CardHeader>
          <CardContent>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <Button
                 variant="outline"
                 className="h-20 flex flex-col gap-2"
                 onClick={() => setIsHistoryModalOpen(true)}
               >
                 <History className="w-6 h-6" />
                 <span className="text-xs">Lịch sử Thanh toán</span>
               </Button>
               <Button
                 variant="outline"
                 className="h-20 flex flex-col gap-2"
                 onClick={() => setIsContractModalOpen(true)}
               >
                 <FileText className="w-6 h-6" />
                 <span className="text-xs">Hợp đồng của tôi</span>
               </Button>
               <Button
                 variant="outline"
                 className="h-20 flex flex-col gap-2"
                 onClick={() => setIsMarketMapModalOpen(true)}
               >
                 <MapPin className="w-6 h-6" />
                 <span className="text-xs">Sơ đồ Chợ</span>
               </Button>
               <Button
                 variant="outline"
                 className="h-20 flex flex-col gap-2"
                 onClick={() => setIsFeedbackModalOpen(true)}
               >
                 <MessageSquare className="w-6 h-6" />
                 <span className="text-xs">Gửi Phản ánh</span>
               </Button>
               <Button
                 variant="outline"
                 className="h-20 flex flex-col gap-2"
                 onClick={() => setIsAccountModalOpen(true)}
               >
                 <Settings className="w-6 h-6" />
                 <span className="text-xs">Tài khoản</span>
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Xác nhận Thanh toán
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Chi tiết thanh toán:</h4>
              {currentDebt.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name}:</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Tổng cộng:</span>
                <span className="text-lg">{formatCurrency(currentDebt.total)}</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <QrCode className="w-32 h-32 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Dùng ứng dụng Ngân hàng hoặc Ví điện tử để quét mã QR và hoàn tất thanh toán
                </p>
              </div>
              
              <div className="text-left space-y-2 text-sm">
                <p><strong>Chuyển khoản thủ công:</strong></p>
                <p>Số tài khoản: 1234567890</p>
                <p>Tên chủ tài khoản: BAN QUAN LY CHO</p>
                <p>Nội dung: {merchantData.stallCode} - {merchantData.name}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsPaymentModalOpen(false)}
              >
                Hủy
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Thanh toán thành công!",
                    description: "Giao dịch của bạn đã được xử lý. Vui lòng chờ xác nhận.",
                    variant: "success"
                  })
                  setIsPaymentModalOpen(false)
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Xác nhận
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment History Modal */}
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Lịch sử Thanh toán
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(payment.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                    <Badge className="bg-green-100 text-green-800">Thành công</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Gửi Phản ánh
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback-title">Tiêu đề phản ánh</Label>
              <Input
                id="feedback-title"
                placeholder="VD: Bóng đèn bị hỏng, Vòi nước bị rò rỉ..."
                value={feedbackTitle}
                onChange={(e) => setFeedbackTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="feedback-content">Nội dung chi tiết</Label>
              <Textarea
                id="feedback-content"
                placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label>Hình ảnh (tùy chọn)</Label>
              <Button variant="outline" className="w-full mt-2">
                <Upload className="w-4 h-4 mr-2" />
                Tải lên hình ảnh
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsFeedbackModalOpen(false)}
              >
                Hủy
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSubmitFeedback}
              >
                <Send className="w-4 h-4 mr-2" />
                Gửi đi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contract Modal */}
      <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Hợp đồng của tôi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Mã gian hàng</Label>
                <p className="font-medium">{merchantData.stallCode}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Khu vực</Label>
                <p className="font-medium">{merchantData.zone}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Ngày hết hạn hợp đồng</Label>
                <p className="font-medium">{formatDate(merchantData.contractEndDate)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Số điện thoại</Label>
                <p className="font-medium">{merchantData.phone}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Điều khoản hợp đồng:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Phí thuê mặt bằng: 8,000,000 VND/tháng</li>
                <li>• Phí vệ sinh: 500,000 VND/tháng</li>
                <li>• Tiền điện tính theo đồng hồ</li>
                <li>• Thanh toán trước ngày 15 hàng tháng</li>
              </ul>
            </div>
          </div>
                 </DialogContent>
       </Dialog>

       {/* Debt Detail Modal */}
       <Dialog open={isDebtDetailModalOpen} onOpenChange={setIsDebtDetailModalOpen}>
         <DialogContent className="max-w-2xl">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <DollarSign className="w-5 h-5" />
               Chi tiết Công nợ
             </DialogTitle>
           </DialogHeader>
           <div className="space-y-6">
             <div className="bg-orange-50 p-4 rounded-lg">
               <h4 className="font-medium text-orange-800 mb-2">Tổng quan</h4>
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                   <span className="text-gray-600">Tổng nợ:</span>
                   <p className="font-bold text-lg text-orange-800">{formatCurrency(currentDebt.total)}</p>
                 </div>
                 <div>
                   <span className="text-gray-600">Hạn thanh toán:</span>
                   <p className="font-medium text-orange-800">{formatDate(currentDebt.dueDate)}</p>
                 </div>
               </div>
             </div>

             <div>
               <h4 className="font-medium mb-3">Chi tiết từng khoản phí:</h4>
               <div className="space-y-3">
                 {currentDebt.breakdown.map((item, index) => (
                   <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                     <div>
                       <p className="font-medium">{item.name}</p>
                       <p className="text-sm text-gray-500">Tháng 8/2025</p>
                     </div>
                     <div className="text-right">
                       <p className="font-bold text-lg">{formatCurrency(item.amount)}</p>
                       <Badge className="bg-red-100 text-red-800">Chưa thanh toán</Badge>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             <div className="bg-blue-50 p-4 rounded-lg">
               <h4 className="font-medium text-blue-800 mb-2">Lịch sử thanh toán gần đây</h4>
               <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                   <span>Tháng 7/2025:</span>
                   <span className="font-medium text-green-600">Đã thanh toán</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Tháng 6/2025:</span>
                   <span className="font-medium text-green-600">Đã thanh toán</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Tháng 5/2025:</span>
                   <span className="font-medium text-green-600">Đã thanh toán</span>
                 </div>
               </div>
             </div>

             <div className="flex gap-2">
               <Button 
                 variant="outline" 
                 className="flex-1"
                 onClick={() => setIsDebtDetailModalOpen(false)}
               >
                 Đóng
               </Button>
               <Button 
                 className="flex-1 bg-orange-600 hover:bg-orange-700"
                 onClick={() => {
                   setIsDebtDetailModalOpen(false)
                   setIsPaymentModalOpen(true)
                 }}
               >
                 <CreditCard className="w-4 h-4 mr-2" />
                 Thanh toán ngay
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>

       {/* All Notifications Modal */}
       <Dialog open={isAllNotificationsModalOpen} onOpenChange={setIsAllNotificationsModalOpen}>
         <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <Bell className="w-5 h-5" />
               Tất cả Thông báo từ Ban Quản lý
             </DialogTitle>
           </DialogHeader>
           <div className="space-y-4">
             {notifications.map((notification) => (
               <div key={notification.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                 <div className="flex items-start justify-between mb-3">
                   <h4 className="font-medium text-gray-900">{notification.title}</h4>
                   <div className="flex items-center gap-2">
                     <span className="text-sm text-gray-500">{formatDate(notification.date)}</span>
                     {notification.id <= 3 && (
                       <Badge className="bg-blue-100 text-blue-800">Mới</Badge>
                     )}
                   </div>
                 </div>
                 <p className="text-sm text-gray-600 leading-relaxed">{notification.description}</p>
                 <div className="mt-3 pt-3 border-t">
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                     <span>📢 Thông báo chính thức</span>
                     <span>•</span>
                     <span>Ban Quản lý Chợ</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </DialogContent>
       </Dialog>

       {/* Account Modal */}
       <Dialog open={isAccountModalOpen} onOpenChange={setIsAccountModalOpen}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <Settings className="w-5 h-5" />
               Quản lý Tài khoản
             </DialogTitle>
           </DialogHeader>
           <div className="space-y-6">
             <div>
               <h4 className="font-medium mb-3">Thông tin cá nhân</h4>
               <div className="space-y-3">
                 <div>
                   <Label className="text-sm text-gray-600">Họ và tên</Label>
                   <p className="font-medium">{merchantData.name}</p>
                 </div>
                 <div>
                   <Label className="text-sm text-gray-600">Số điện thoại</Label>
                   <p className="font-medium">{merchantData.phone}</p>
                 </div>
                 <div>
                   <Label className="text-sm text-gray-600">Mã gian hàng</Label>
                   <p className="font-medium">{merchantData.stallCode}</p>
                 </div>
                 <div>
                   <Label className="text-sm text-gray-600">Khu vực</Label>
                   <p className="font-medium">{merchantData.zone}</p>
                 </div>
               </div>
             </div>

             <div className="border-t pt-4">
               <h4 className="font-medium mb-3">Bảo mật</h4>
               <div className="space-y-3">
                 <Button variant="outline" className="w-full justify-start">
                   <User className="w-4 h-4 mr-2" />
                   Đổi mật khẩu
                 </Button>
                 <Button variant="outline" className="w-full justify-start">
                   <Bell className="w-4 h-4 mr-2" />
                   Cài đặt thông báo
                 </Button>
                 <Button variant="outline" className="w-full justify-start">
                   <FileText className="w-4 h-4 mr-2" />
                   Tải xuống dữ liệu cá nhân
                 </Button>
               </div>
             </div>

             <div className="border-t pt-4">
               <h4 className="font-medium mb-3">Hỗ trợ</h4>
               <div className="space-y-3">
                 <Button variant="outline" className="w-full justify-start">
                   <MessageSquare className="w-4 h-4 mr-2" />
                   Liên hệ hỗ trợ
                 </Button>
                 <Button variant="outline" className="w-full justify-start">
                   <FileText className="w-4 h-4 mr-2" />
                   Hướng dẫn sử dụng
                 </Button>
                 <Button variant="outline" className="w-full justify-start">
                   <Settings className="w-4 h-4 mr-2" />
                   Cài đặt ứng dụng
                 </Button>
               </div>
             </div>

             <div className="flex gap-2">
               <Button 
                 variant="outline" 
                 className="flex-1"
                 onClick={() => setIsAccountModalOpen(false)}
               >
                 Đóng
               </Button>
               <Button 
                 variant="destructive"
                 className="flex-1"
                 onClick={onLogout}
               >
                 <LogOut className="w-4 h-4 mr-2" />
                 Đăng xuất
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>

               {/* Market Map Modal */}
        <Dialog open={isMarketMapModalOpen} onOpenChange={setIsMarketMapModalOpen}>
          <DialogContent className="max-w-[98vw] w-[98vw] max-h-[98vh] h-[98vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <MapPin className="w-5 h-5" />
               Sơ đồ Chợ - Vị trí gian hàng của bạn
             </DialogTitle>
           </DialogHeader>
           <div className="space-y-6">
             {/* User's Stall Highlight */}
             <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
               <h4 className="font-medium text-blue-800 mb-2">Gian hàng của bạn</h4>
               <div className="flex items-center gap-3">
                 <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                 <div>
                   <p className="font-medium">{merchantData.stallCode} - {merchantData.name}</p>
                   <p className="text-sm text-blue-600">{merchantData.zone}</p>
                 </div>
               </div>
             </div>

                           {/* Market Map */}
              <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-8 lg:p-12">
                <div className="relative">
                  {/* Market Layout */}
                  <div className="grid grid-cols-1 gap-8 lg:gap-12">
                                         {/* Zone A - Food */}
                     <div className="bg-green-500 rounded-lg p-6 lg:p-8 text-white shadow-lg relative min-h-[280px] lg:min-h-[320px]">
                       <div className="text-center mb-6">
                         <h3 className="font-bold text-xl lg:text-2xl">Khu A</h3>
                         <p className="text-sm lg:text-base opacity-90">Thực phẩm tươi sống</p>
                       </div>
                                                                       <div className="grid grid-cols-2 gap-3 lg:gap-4">
                          <div className={`bg-white bg-opacity-20 rounded p-4 lg:p-5 text-center text-xs lg:text-sm relative ${merchantData.stallCode === 'A01' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}>
                            <div className="font-bold text-sm lg:text-base">A01</div>
                            <div className="opacity-90 text-xs leading-tight">Nguyễn Thị Lan</div>
                            {merchantData.stallCode === 'A01' && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-400 rounded-full"></div>
                            )}
                          </div>
                          <div className="bg-gray-300 bg-opacity-30 rounded p-4 lg:p-5 text-center text-xs lg:text-sm">
                            <div className="font-bold text-sm lg:text-base">A02</div>
                            <div className="opacity-90 text-xs leading-tight">Còn trống</div>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded p-4 lg:p-5 text-center text-xs lg:text-sm">
                            <div className="font-bold text-sm lg:text-base">A03</div>
                            <div className="opacity-90 text-xs leading-tight">Trần Văn Minh</div>
                          </div>
                          <div className="bg-gray-300 bg-opacity-30 rounded p-4 lg:p-5 text-center text-xs lg:text-sm">
                            <div className="font-bold text-sm lg:text-base">A04</div>
                            <div className="opacity-90 text-xs leading-tight">Còn trống</div>
                          </div>
                        </div>
                    </div>

                                         {/* Zone B - Vegetables */}
                     <div className="bg-lime-500 rounded-lg p-6 lg:p-8 text-white shadow-lg min-h-[280px] lg:min-h-[320px]">
                       <div className="text-center mb-6">
                         <h3 className="font-bold text-xl lg:text-2xl">Khu B</h3>
                         <p className="text-sm lg:text-base opacity-90">Rau củ quả</p>
                       </div>
                                                                       <div className="grid grid-cols-2 gap-3 lg:gap-4">
                          <div className="bg-white bg-opacity-20 rounded p-4 lg:p-5 text-center text-xs lg:text-sm">
                            <div className="font-bold text-sm lg:text-base">B01</div>
                            <div className="opacity-90 text-xs break-words">Trần Văn Hùng</div>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded p-4 lg:p-5 text-center text-xs lg:text-sm">
                            <div className="font-bold text-sm lg:text-base">B02</div>
                            <div className="opacity-90 text-xs break-words">Lê Thị Mai</div>
                          </div>
                          <div className="bg-gray-300 bg-opacity-30 rounded p-4 lg:p-5 text-center text-xs lg:text-sm">
                            <div className="font-bold text-sm lg:text-base">B03</div>
                            <div className="opacity-90 text-xs break-words">Còn trống</div>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded p-4 lg:p-5 text-center text-xs lg:text-sm">
                            <div className="font-bold text-sm lg:text-base">B04</div>
                            <div className="opacity-90 text-xs break-words">Phạm Văn Nam</div>
                          </div>
                        </div>
                    </div>

                                         {/* Zone C - Mixed */}
                     <div className="bg-blue-500 rounded-lg p-6 lg:p-8 text-white shadow-lg min-h-[280px] lg:min-h-[320px]">
                       <div className="text-center mb-6">
                         <h3 className="font-bold text-xl lg:text-2xl">Khu C</h3>
                         <p className="text-sm lg:text-base opacity-90">Hỗn hợp</p>
                       </div>
                                                                       <div className="grid grid-cols-2 gap-3 lg:gap-4">
                          <div className="bg-gray-300 bg-opacity-30 rounded p-4 lg:p-5 text-center text-xs lg:text-sm">
                            <div className="font-bold text-sm lg:text-base">C01</div>
                            <div className="opacity-90 text-xs break-words">Còn trống</div>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded p-4 lg:p-5 text-center text-xs lg:text-sm">
                            <div className="font-bold text-sm lg:text-base">C02</div>
                            <div className="opacity-90 text-xs break-words">Phạm Văn Nam</div>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded p-4 lg:p-5 text-center text-xs lg:text-sm">
                            <div className="font-bold text-sm lg:text-base">C03</div>
                            <div className="opacity-90 text-xs break-words">Lê Thị Hoa</div>
                          </div>
                          <div className="bg-gray-300 bg-opacity-30 rounded p-4 lg:p-5 text-center text-xs lg:text-sm">
                            <div className="font-bold text-sm lg:text-base">C04</div>
                            <div className="opacity-90 text-xs break-words">Còn trống</div>
                          </div>
                        </div>
                    </div>
                  </div>

                                                      {/* Legend */}
                   <div className="mt-8 flex flex-wrap justify-center gap-4 lg:gap-6 text-sm lg:text-base">
                     <div className="flex items-center gap-3">
                       <div className="w-4 h-4 lg:w-5 lg:h-5 bg-green-500 rounded"></div>
                       <span>Khu A - Thực phẩm</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-4 h-4 lg:w-5 lg:h-5 bg-lime-500 rounded"></div>
                       <span>Khu B - Rau củ</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-4 h-4 lg:w-5 lg:h-5 bg-blue-500 rounded"></div>
                       <span>Khu C - Hỗn hợp</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gray-300 rounded"></div>
                       <span>Còn trống</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-4 h-4 lg:w-5 lg:h-5 bg-blue-400 rounded-full"></div>
                       <span>Gian hàng của bạn</span>
                    </div>
                  </div>
               </div>
             </div>

             {/* Market Info */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-white p-4 rounded-lg border">
                 <h4 className="font-medium mb-2">Thông tin chợ</h4>
                 <div className="space-y-1 text-sm">
                   <p><span className="font-medium">Tổng số gian hàng:</span> 12</p>
                   <p><span className="font-medium">Đang cho thuê:</span> 8</p>
                   <p><span className="font-medium">Còn trống:</span> 4</p>
                 </div>
               </div>
               <div className="bg-white p-4 rounded-lg border">
                 <h4 className="font-medium mb-2">Giờ hoạt động</h4>
                 <div className="space-y-1 text-sm">
                   <p><span className="font-medium">Mở cửa:</span> 04:00</p>
                   <p><span className="font-medium">Đóng cửa:</span> 20:00</p>
                   <p><span className="font-medium">Ngày nghỉ:</span> Không</p>
                 </div>
               </div>
               <div className="bg-white p-4 rounded-lg border">
                 <h4 className="font-medium mb-2">Liên hệ</h4>
                 <div className="space-y-1 text-sm">
                   <p><span className="font-medium">Ban quản lý:</span> 0901234567</p>
                   <p><span className="font-medium">Bảo vệ:</span> 0901234568</p>
                   <p><span className="font-medium">Cấp cứu:</span> 115</p>
                 </div>
               </div>
             </div>

             <div className="flex justify-center">
               <Button 
                 variant="outline"
                 onClick={() => setIsMarketMapModalOpen(false)}
               >
                 Đóng
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </div>
   )
} 