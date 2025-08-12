"use client"

import { CreateNotification } from "@/components/create-notification"
import { DigitalMarketMap } from "@/components/digital-market-map"
import { FeeConfiguration } from "@/components/fee-configuration"
import { InvoiceManagement } from "@/components/invoice-management"
import { MerchantProfile } from "@/components/merchant-profile"
import { Overview } from "@/components/overview"
import { PaymentRecording } from "@/components/payment-recording"
import { ReportsAnalytics } from "@/components/reports-analytics"
import { SafetyOperations } from "@/components/safety-operations"
import { StallManagement } from "@/components/stall-management"
import { TransactionHistory } from "@/components/transaction-history"
import { Button } from "@/components/ui/button"
import { UserDashboard } from "@/components/user-dashboard"
import { StallDataProvider } from "@/lib/stall-data-context"
import { Bell, Building2, Calculator, CreditCard, DollarSign, FileText, HomeIcon, LogOut, MapPin, Menu, PieChart, Receipt, Shield, Store, UserCheck, X } from "lucide-react"
import { useState } from "react"

type ActiveView = 
  | "overview" 
  | "create-notification" 
  | "merchant-profile" 
  | "stall-management" 
  | "transaction-history"
  | "payment-recording"
  | "reports-analytics"
  | "invoice-management"
  | "fee-configuration"
  | "digital-market-map"
  | "safety-operations"

interface DashboardProps {
  userRole: "admin" | "user" | null
  userData: any
  onLogout: () => void
}

export function Dashboard({ userRole, userData, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<ActiveView>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [financeOpen, setFinanceOpen] = useState(false)
  const [stallManagementOpen, setStallManagementOpen] = useState(false)

  // If user role is "user", show user dashboard
  if (userRole === "user") {
    return <UserDashboard userData={userData} onLogout={onLogout} />
  }

  // Admin dashboard
  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <Overview onBack={() => setActiveView("overview")} />
      case "create-notification":
        return <CreateNotification onBack={() => setActiveView("overview")} />
      case "merchant-profile":
        return <MerchantProfile onBack={() => setActiveView("overview")} />
      case "stall-management":
        return <StallManagement onBack={() => setActiveView("overview")} />
      case "transaction-history":
        return <TransactionHistory onBack={() => setActiveView("overview")} />
      case "payment-recording":
        return <PaymentRecording onBack={() => setActiveView("overview")} />
      case "reports-analytics":
        return <ReportsAnalytics onBack={() => setActiveView("overview")} />
      case "invoice-management":
        return <InvoiceManagement onBack={() => setActiveView("overview")} />
      case "fee-configuration":
        return <FeeConfiguration onBack={() => setActiveView("overview")} />
      case "digital-market-map":
        return <DigitalMarketMap onBack={() => setActiveView("overview")} />
      case "safety-operations":
        return <SafetyOperations onBack={() => setActiveView("overview")} />
      default:
        return <Overview onBack={() => setActiveView("overview")} />
    }
  }

  return (
    <StallDataProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LS-Chợ</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="mt-6 px-4">
            <div className="space-y-2">
              {/* Tổng quan */}
              <Button
                variant={activeView === "overview" ? "default" : "ghost"}
                className="w-full justify-start group"
                onClick={() => setActiveView("overview")}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white mr-3 group-hover:scale-110 transition-transform">
                  <HomeIcon className="w-4 h-4" />
                </div>
                Tổng quan
              </Button>

              {/* Tạo thông báo */}
              <Button
                variant={activeView === "create-notification" ? "default" : "ghost"}
                className="w-full justify-start group"
                onClick={() => setActiveView("create-notification")}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white mr-3 group-hover:scale-110 transition-transform">
                  <Bell className="w-4 h-4" />
                </div>
                Tạo thông báo
              </Button>

              {/* Hồ sơ Tiểu thương */}
              <Button
                variant={activeView === "merchant-profile" ? "default" : "ghost"}
                className="w-full justify-start group"
                onClick={() => setActiveView("merchant-profile")}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white mr-3 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-4 h-4" />
                </div>
                Hồ sơ Tiểu thương
              </Button>

              {/* Tài chính - Collapsible */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-between group"
                  onClick={() => setFinanceOpen(!financeOpen)}
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mr-3 group-hover:scale-110 transition-transform">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    Tài chính
                  </div>
                  <span className={`transform transition-transform ${financeOpen ? 'rotate-180' : ''}`}>▾</span>
                </Button>
                {financeOpen && (
                  <div className="ml-8 space-y-1">
                    <Button
                      variant={activeView === "payment-recording" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start group"
                      onClick={() => setActiveView("payment-recording")}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 text-white mr-2 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-3 h-3" />
                      </div>
                      Ghi nhận thanh toán
                    </Button>
                    <Button
                      variant={activeView === "transaction-history" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start group"
                      onClick={() => setActiveView("transaction-history")}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mr-2 group-hover:scale-110 transition-transform">
                        <Receipt className="w-3 h-3" />
                      </div>
                      Lịch sử giao dịch
                    </Button>
                    <Button
                      variant={activeView === "invoice-management" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start group"
                      onClick={() => setActiveView("invoice-management")}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-cyan-600 text-white mr-2 group-hover:scale-110 transition-transform">
                        <FileText className="w-3 h-3" />
                      </div>
                      Quản lý hóa đơn
                    </Button>
                    <Button
                      variant={activeView === "fee-configuration" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start group"
                      onClick={() => setActiveView("fee-configuration")}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-amber-600 text-white mr-2 group-hover:scale-110 transition-transform">
                        <Calculator className="w-3 h-3" />
                      </div>
                      Cấu hình phí
                    </Button>
                  </div>
                )}
              </div>

              {/* Quản lý gian hàng - Collapsible */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-between group"
                  onClick={() => setStallManagementOpen(!stallManagementOpen)}
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white mr-3 group-hover:scale-110 transition-transform">
                      <Building2 className="w-4 h-4" />
                    </div>
                    Quản lý gian hàng
                  </div>
                  <span className={`transform transition-transform ${stallManagementOpen ? 'rotate-180' : ''}`}>▾</span>
                </Button>
                {stallManagementOpen && (
                  <div className="ml-8 space-y-1">
                    <Button
                      variant={activeView === "stall-management" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start group"
                      onClick={() => setActiveView("stall-management")}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-red-500 to-red-600 text-white mr-2 group-hover:scale-110 transition-transform">
                        <Store className="w-3 h-3" />
                      </div>
                      Danh sách gian hàng
                    </Button>
                    <Button
                      variant={activeView === "digital-market-map" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start group"
                      onClick={() => setActiveView("digital-market-map")}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-green-600 text-white mr-2 group-hover:scale-110 transition-transform">
                        <MapPin className="w-3 h-3" />
                      </div>
                      Sơ đồ
                    </Button>
                  </div>
                )}
              </div>

              {/* Báo cáo & Phân tích */}
              <Button
                variant={activeView === "reports-analytics" ? "default" : "ghost"}
                className="w-full justify-start group"
                onClick={() => setActiveView("reports-analytics")}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 text-white mr-3 group-hover:scale-110 transition-transform">
                  <PieChart className="w-4 h-4" />
                </div>
                Báo cáo & Phân tích
              </Button>

              {/* An toàn & Vận hành */}
              <Button
                variant={activeView === "safety-operations" ? "default" : "ghost"}
                className="w-full justify-start group"
                onClick={() => setActiveView("safety-operations")}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white mr-3 group-hover:scale-110 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
                An toàn & Vận hành
              </Button>
            </div>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="outline"
              className="w-full group hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
              onClick={onLogout}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-red-500 to-red-600 text-white mr-2 group-hover:scale-110 transition-transform">
                <LogOut className="w-3 h-3" />
              </div>
              Đăng xuất
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="bg-white shadow-sm border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-semibold text-gray-900">
                  {activeView === "overview" && "Tổng quan"}
                  {activeView === "create-notification" && "Tạo thông báo"}
                  {activeView === "merchant-profile" && "Hồ sơ Tiểu thương"}
                  {activeView === "stall-management" && "Quản lý Gian hàng"}
                  {activeView === "transaction-history" && "Lịch sử Giao dịch"}
                  {activeView === "reports-analytics" && "Báo cáo & Phân tích"}
                  {activeView === "invoice-management" && "Quản lý Hóa đơn"}
                  {activeView === "fee-configuration" && "Cấu hình Phí"}
                  {activeView === "digital-market-map" && "Sơ đồ"}
                  {activeView === "safety-operations" && "An toàn & Vận hành"}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Xin chào, {userData?.name || "Admin"}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </StallDataProvider>
  )
}
