"use client"

import { Dashboard } from "@/components/dashboard"
import { Login } from "@/components/login"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle,
  FileText,
  Globe,
  MapPin,
  Play,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap
} from "lucide-react"
import { useState } from "react"

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null)
  const [userData, setUserData] = useState<any>(null)

  const handleLoginSuccess = (role: "admin" | "user", data: any) => {
    setIsAuthenticated(true)
    setUserRole(role)
    setUserData(data)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    setUserData(null)
    setShowLogin(false)
  }

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return <Dashboard userRole={userRole} userData={userData} onLogout={handleLogout} />
  }

  // If showing login, show login component
  if (showLogin) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LS-Chợ</h1>
                <p className="text-sm text-gray-600">Giải pháp quản lý chợ truyền thống</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setShowLogin(true)}>
                Xem Demo
              </Button>
              <Button onClick={() => setShowLogin(true)}>
                Trải nghiệm ngay
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-orange-100 text-orange-800 hover:bg-orange-100">
            <Zap className="w-4 h-4 mr-2" />
            Bản Demo - Sẵn sàng triển khai
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Giải pháp quản lý chợ truyền thống
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
              {" "}cho Lạng Sơn
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            Hệ thống quản lý toàn diện được thiết kế đặc biệt cho các chợ truyền thống 
            tại tỉnh Lạng Sơn, giúp tối ưu hóa vận hành và nâng cao hiệu quả kinh doanh.
          </p>
          <p className="text-lg text-blue-600 font-medium mb-8">
            <Target className="w-5 h-5 inline mr-2" />
            Được phát triển bởi Viettel - Sẵn sàng triển khai tại Lạng Sơn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => setShowLogin(true)} className="text-lg px-8 py-6">
              Xem Demo ngay
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Play className="w-5 h-5 mr-2" />
              Video giới thiệu
            </Button>
          </div>
        </div>
      </section>

      {/* Why Lang Son Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn Lạng Sơn?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lạng Sơn có tiềm năng lớn để trở thành điểm sáng trong chuyển đổi số 
              quản lý chợ truyền thống tại Việt Nam
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vị trí chiến lược</h3>
              <p className="text-gray-600">Cửa ngõ thương mại quan trọng với Trung Quốc</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hệ thống chợ phát triển</h3>
              <p className="text-gray-600">Nhiều chợ truyền thống lớn cần số hóa</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tiềm năng tăng trưởng</h3>
              <p className="text-gray-600">Nhu cầu số hóa quản lý cao</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cộng đồng tiểu thương</h3>
              <p className="text-gray-600">Đông đảo tiểu thương cần hỗ trợ</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Viettel Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Được phát triển bởi Viettel
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel) - Đơn vị tiên phong 
              trong chuyển đổi số và phát triển các giải pháp công nghệ cho chính phủ điện tử.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hơn 20 năm kinh nghiệm</h3>
              <p className="text-gray-600">Là đơn vị tiên phong trong lĩnh vực viễn thông và công nghệ thông tin</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phục vụ hàng triệu người</h3>
              <p className="text-gray-600">Cung cấp dịch vụ cho hàng triệu khách hàng trên toàn quốc</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hiện diện toàn cầu</h3>
              <p className="text-gray-600">Hoạt động tại nhiều quốc gia với các giải pháp công nghệ tiên tiến</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hệ thống được thiết kế với những tính năng hiện đại, 
              đáp ứng mọi nhu cầu quản lý chợ truyền thống tại Lạng Sơn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quản lý Gian hàng */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Quản lý Gian hàng</CardTitle>
                <CardDescription>
                  Quản lý thông tin gian hàng, tiểu thương và sơ đồ bố trí một cách trực quan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Sơ đồ gian hàng tương tác
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Hồ sơ tiểu thương chi tiết
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Quản lý hợp đồng thuê
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Tài chính */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Quản lý Tài chính</CardTitle>
                <CardDescription>
                  Theo dõi thu chi, quản lý hóa đơn và báo cáo tài chính chi tiết
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Lịch sử giao dịch đầy đủ
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Tạo và quản lý hóa đơn
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Báo cáo thu chi theo thời gian
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* An toàn & Vận hành */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">An toàn & Vận hành</CardTitle>
                <CardDescription>
                  Đảm bảo an toàn PCCC, VSATTP và quản lý hệ thống an ninh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Lịch kiểm tra định kỳ
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Hồ sơ kiểm tra chi tiết
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Quản lý camera và thiết bị
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Thông báo */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Hệ thống Thông báo</CardTitle>
                <CardDescription>
                  Gửi thông báo, nhắc nhở và cập nhật thông tin cho tiểu thương
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Thông báo đa kênh
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Lịch trình tự động
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Theo dõi trạng thái gửi
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Báo cáo */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Báo cáo & Phân tích</CardTitle>
                <CardDescription>
                  Báo cáo chi tiết, biểu đồ trực quan và phân tích dữ liệu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Dashboard tổng quan
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Báo cáo xuất Excel/PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Phân tích xu hướng
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Cấu hình */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                  <MapPin className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle className="text-xl">Cấu hình Hệ thống</CardTitle>
                <CardDescription>
                  Tùy chỉnh cấu hình phí, thông báo và thiết lập hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Cấu hình phí linh hoạt
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Quản lý thông báo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Thiết lập bảo mật
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lợi ích khi đầu tư
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Đầu tư vào hệ thống quản lý chợ truyền thống sẽ mang lại những lợi ích 
              thiết thực cho chính quyền và cộng đồng Lạng Sơn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tăng hiệu quả quản lý</h3>
              <p className="text-gray-600">Giảm 70% thời gian xử lý thủ tục, tăng 50% hiệu quả thu phí</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tăng nguồn thu</h3>
              <p className="text-gray-600">Tối ưu hóa thu phí, giảm thất thu, tăng 30% nguồn thu ngân sách</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Đảm bảo an toàn</h3>
              <p className="text-gray-600">Giám sát 24/7, phát hiện sớm rủi ro, đảm bảo an toàn PCCC</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hỗ trợ tiểu thương</h3>
              <p className="text-gray-600">Tạo môi trường kinh doanh thuận lợi, hỗ trợ tiểu thương phát triển</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Chuyển đổi số</h3>
              <p className="text-gray-600">Góp phần thúc đẩy chuyển đổi số, nâng cao hình ảnh tỉnh</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tiên phong</h3>
              <p className="text-gray-600">Trở thành tỉnh tiên phong trong quản lý chợ truyền thống số hóa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-blue-600">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Tiềm năng thị trường Lạng Sơn
            </h2>
            <p className="text-xl text-red-100">
              Thống kê về hệ thống chợ truyền thống và tiểu thương tại Lạng Sơn
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-red-100">Chợ truyền thống</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">15,000+</div>
              <div className="text-red-100">Tiểu thương</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">25,000+</div>
              <div className="text-red-100">Gian hàng</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-red-100">Tỷ đồng/năm</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sẵn sàng đầu tư vào tương lai?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Hãy là tỉnh tiên phong trong chuyển đổi số quản lý chợ truyền thống. 
            Viettel sẵn sàng đồng hành cùng Lạng Sơn trong hành trình này.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => setShowLogin(true)} className="text-lg px-8 py-6">
              Xem Demo chi tiết
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Liên hệ tư vấn đầu tư
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">LS-Chợ</h3>
                  <p className="text-sm text-gray-400">Giải pháp quản lý chợ truyền thống</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Giải pháp quản lý chợ truyền thống và tiểu thương được thiết kế đặc biệt 
                cho tỉnh Lạng Sơn, sẵn sàng triển khai và mang lại hiệu quả cao.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tính năng</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Quản lý Gian hàng</li>
                <li>Tài chính & Báo cáo</li>
                <li>An toàn & Vận hành</li>
                <li>Hệ thống Thông báo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Hướng dẫn sử dụng</li>
                <li>Video demo</li>
                <li>FAQ</li>
                <li>Liên hệ hỗ trợ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: support@viettel.com.vn</li>
                <li>Hotline: 1800-1168</li>
                <li>Địa chỉ: Tập đoàn Viettel, Hà Nội</li>
                <li>Website: www.viettel.com.vn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 LS-Chợ. Tất cả quyền được bảo lưu. | Phát triển bởi Tập đoàn Viettel</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
