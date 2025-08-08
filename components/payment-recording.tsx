"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Search, Receipt, AlertCircle, CheckCircle, Printer } from "lucide-react"

interface PaymentRecordingProps {
  onBack: () => void
}

type Step = "search" | "input" | "verification" | "confirmation"

interface Merchant {
  id: string
  name: string
  stallId: string
  phone: string
  totalDebt: number
}

interface Invoice {
  id: string
  type: string
  amount: number
  dueDate: string
  status: "unpaid" | "partial" | "paid"
  description: string
}

export function PaymentRecording({ onBack }: PaymentRecordingProps) {
  const [currentStep, setCurrentStep] = useState<Step>("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])
  const [error, setError] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Sample data
  const merchants: Merchant[] = [
    {
      id: "1",
      name: "Nguyễn Thị Lan",
      stallId: "A01",
      phone: "0901234567",
      totalDebt: 8200000,
    },
    {
      id: "2",
      name: "Trần Văn Hùng",
      stallId: "B12",
      phone: "0912345678",
      totalDebt: 5500000,
    },
    {
      id: "3",
      name: "Lê Thị Mai",
      stallId: "C05",
      phone: "0923456789",
      totalDebt: 3200000,
    },
  ]

  const invoices: Record<string, Invoice[]> = {
    "1": [
      {
        id: "INV-082025-A01-001",
        type: "Phí mặt bằng",
        amount: 5000000,
        dueDate: "2025-08-15",
        status: "unpaid",
        description: "Phí thuê mặt bằng tháng 8/2025",
      },
      {
        id: "INV-082025-A01-002",
        type: "Phí điện",
        amount: 1200000,
        dueDate: "2025-08-20",
        status: "unpaid",
        description: "Tiền điện tháng 7/2025",
      },
      {
        id: "INV-082025-A01-003",
        type: "Phí vệ sinh",
        amount: 2000000,
        dueDate: "2025-08-25",
        status: "unpaid",
        description: "Phí vệ sinh môi trường tháng 8/2025",
      },
    ],
    "2": [
      {
        id: "INV-082025-B12-001",
        type: "Phí mặt bằng",
        amount: 3500000,
        dueDate: "2025-08-10",
        status: "unpaid",
        description: "Phí thuê mặt bằng tháng 8/2025",
      },
      {
        id: "INV-082025-B12-002",
        type: "Phí điện",
        amount: 2000000,
        dueDate: "2025-08-15",
        status: "unpaid",
        description: "Tiền điện tháng 7/2025",
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
      setCurrentStep("input")
    } else {
      setError("Không tìm thấy tiểu thương")
    }
  }

  const handleInvoiceSelection = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId])
    } else {
      setSelectedInvoices(selectedInvoices.filter((id) => id !== invoiceId))
    }
  }

  const calculateTotalAmount = () => {
    if (!selectedMerchant) return 0
    const merchantInvoices = invoices[selectedMerchant.id] || []
    return selectedInvoices.reduce((total, invoiceId) => {
      const invoice = merchantInvoices.find((inv) => inv.id === invoiceId)
      return total + (invoice?.amount || 0)
    }, 0)
  }

  const handleProceedToVerification = () => {
    setError("")

    if (selectedInvoices.length === 0) {
      setError("Vui lòng chọn ít nhất một hóa đơn")
      return
    }

    if (!paymentAmount || Number.parseFloat(paymentAmount) <= 0) {
      setError("Số tiền không hợp lệ")
      return
    }

    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán")
      return
    }

    setCurrentStep("verification")
  }

  const handleConfirmPayment = () => {
    setShowConfirmDialog(false)
    setCurrentStep("confirmation")
    setIsSuccess(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND"
  }

  const renderSearchStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Tìm kiếm Tiểu thương
        </CardTitle>
        <CardDescription>Nhập mã gian hàng hoặc tên tiểu thương để bắt đầu ghi nhận thanh toán</CardDescription>
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
          <h4 className="font-medium mb-3">Gợi ý tìm kiếm:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {merchants.map((merchant) => (
              <Card
                key={merchant.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSearchQuery(merchant.stallId)
                  setSelectedMerchant(merchant)
                  setCurrentStep("input")
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{merchant.name}</p>
                      <p className="text-sm text-gray-600">Gian hàng: {merchant.stallId}</p>
                    </div>
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      {formatCurrency(merchant.totalDebt)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderInputStep = () => {
    if (!selectedMerchant) return null

    const merchantInvoices = invoices[selectedMerchant.id] || []
    const totalSelectedAmount = calculateTotalAmount()

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Tiểu thương</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Tên tiểu thương</Label>
                <p className="font-medium">{selectedMerchant.name}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Mã gian hàng</Label>
                <p className="font-medium">{selectedMerchant.stallId}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Số điện thoại</Label>
                <p className="font-medium">{selectedMerchant.phone}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Tổng công nợ</Label>
                <p className="font-medium text-red-600">{formatCurrency(selectedMerchant.totalDebt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chọn Hóa đơn cần thanh toán</CardTitle>
            <CardDescription>Chọn một hoặc nhiều hóa đơn để ghi nhận thanh toán</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {merchantInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={invoice.id}
                    checked={selectedInvoices.includes(invoice.id)}
                    onCheckedChange={(checked) => handleInvoiceSelection(invoice.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Label htmlFor={invoice.id} className="font-medium cursor-pointer">
                          {invoice.description}
                        </Label>
                        <p className="text-sm text-gray-600">Mã HĐ: {invoice.id}</p>
                        <p className="text-sm text-gray-600">
                          Hạn thanh toán: {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          {invoice.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedInvoices.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">
                  Tổng số tiền cần thanh toán: {formatCurrency(totalSelectedAmount)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin Thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền thanh toán</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Nhập số tiền"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Phương thức thanh toán</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Tiền mặt</SelectItem>
                    <SelectItem value="transfer">Chuyển khoản</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Ngày thanh toán</Label>
              <Input id="date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep("search")}>
                Quay lại
              </Button>
              <Button onClick={handleProceedToVerification} className="bg-blue-600 hover:bg-blue-700">
                Xem trước & Xác nhận
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderVerificationStep = () => {
    if (!selectedMerchant) return null

    const merchantInvoices = invoices[selectedMerchant.id] || []
    const selectedInvoiceDetails = selectedInvoices
      .map((id) => merchantInvoices.find((inv) => inv.id === id))
      .filter(Boolean)
    const totalAmount = Number.parseFloat(paymentAmount) || 0
    const totalInvoiceAmount = calculateTotalAmount()
    const remainingDebt = Math.max(0, selectedMerchant.totalDebt - totalAmount)

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Xác nhận Thông tin Thanh toán
          </CardTitle>
          <CardDescription>Vui lòng kiểm tra lại thông tin trước khi xác nhận</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Thông tin Tiểu thương</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên:</span>
                  <span className="font-medium">{selectedMerchant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã gian hàng:</span>
                  <span className="font-medium">{selectedMerchant.stallId}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Thông tin Thanh toán</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium">{paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày thanh toán:</span>
                  <span className="font-medium">{new Date(paymentDate).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Hóa đơn được thanh toán</h4>
            <div className="space-y-2">
              {selectedInvoiceDetails.map((invoice) => (
                <div key={invoice?.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">{invoice?.description}</span>
                  <span className="font-medium text-sm">{formatCurrency(invoice?.amount || 0)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Công nợ còn lại:</span>
              <span className={remainingDebt > 0 ? "text-red-600" : "text-green-600"}>
                {formatCurrency(remainingDebt)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setCurrentStep("input")}>
              Chỉnh sửa
            </Button>
            <Button onClick={() => setShowConfirmDialog(true)} className="bg-green-600 hover:bg-green-700">
              Xác nhận Thanh toán
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderConfirmationStep = () => {
    if (!selectedMerchant) return null

    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Thanh toán Thành công!</CardTitle>
          <CardDescription>Đã ghi nhận thanh toán thành công cho gian hàng {selectedMerchant.stallId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(Number.parseFloat(paymentAmount) || 0)}</p>
            <p className="text-gray-600">đã được ghi nhận vào hệ thống</p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Printer className="w-4 h-4" />
              In biên lai
            </Button>
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-6 space-y-6">
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
          <h1 className="text-2xl font-bold text-gray-900">Ghi nhận Thanh toán</h1>
          <p className="text-gray-600">Ghi nhận thanh toán phí từ tiểu thương</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 py-4">
        {[
          { key: "search", label: "Tìm kiếm", step: 1 },
          { key: "input", label: "Nhập thông tin", step: 2 },
          { key: "verification", label: "Xác nhận", step: 3 },
          { key: "confirmation", label: "Hoàn thành", step: 4 },
        ].map((item, index) => {
          const steps = ["search", "input", "verification", "confirmation"]
          const currentStepIndex = steps.indexOf(currentStep)
          const itemStepIndex = steps.indexOf(item.key)
          
          let stepClass = "bg-gray-200 text-gray-600"
          if (currentStep === item.key) {
            stepClass = "bg-blue-600 text-white"
          } else if (currentStepIndex > itemStepIndex) {
            stepClass = "bg-green-600 text-white"
          }
          
          return (
            <div key={item.key} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${stepClass}`}
              >
                {item.step}
              </div>
              <span
                className={`ml-2 text-sm ${currentStep === item.key ? "text-blue-600 font-medium" : "text-gray-600"}`}
              >
                {item.label}
              </span>
              {index < 3 && <div className="w-8 h-px bg-gray-300 mx-4" />}
            </div>
          )
        })}
      </div>

      {currentStep === "search" && renderSearchStep()}
      {currentStep === "input" && renderInputStep()}
      {currentStep === "verification" && renderVerificationStep()}
      {currentStep === "confirmation" && renderConfirmationStep()}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Thanh toán</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn ghi nhận thanh toán này không? Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={handleConfirmPayment} className="bg-green-600 hover:bg-green-700">
              Xác nhận Thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
