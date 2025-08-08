"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, MessageSquare, Users, Send, CheckCircle, AlertCircle, Eye } from "lucide-react"

interface NotificationCreatorProps {
  onBack: () => void
}

type Step = "compose" | "preview" | "confirmation"

interface Zone {
  id: string
  name: string
  merchantCount: number
}

export function NotificationCreator({ onBack }: NotificationCreatorProps) {
  const [currentStep, setCurrentStep] = useState<Step>("compose")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [sendToAll, setSendToAll] = useState(false)
  const [selectedZones, setSelectedZones] = useState<string[]>([])
  const [error, setError] = useState("")
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const zones: Zone[] = [
    { id: "A", name: "Khu A - Thực phẩm tươi sống", merchantCount: 85 },
    { id: "B", name: "Khu B - Thực phẩm khô", merchantCount: 65 },
    { id: "C", name: "Khu C - Quần áo & Phụ kiện", merchantCount: 45 },
    { id: "D", name: "Khu D - Đồ gia dụng", merchantCount: 53 },
  ]

  const calculateRecipientCount = () => {
    if (sendToAll) {
      return zones.reduce((total, zone) => total + zone.merchantCount, 0)
    }
    return selectedZones.reduce((total, zoneId) => {
      const zone = zones.find((z) => z.id === zoneId)
      return total + (zone?.merchantCount || 0)
    }, 0)
  }

  const handleZoneSelection = (zoneId: string, checked: boolean) => {
    if (checked) {
      setSelectedZones([...selectedZones, zoneId])
    } else {
      setSelectedZones(selectedZones.filter((id) => id !== zoneId))
    }
  }

  const handleProceedToPreview = () => {
    setError("")

    if (!title.trim()) {
      setError("Tiêu đề không được để trống")
      return
    }

    if (!content.trim()) {
      setError("Nội dung không được để trống")
      return
    }

    if (!sendToAll && selectedZones.length === 0) {
      setError("Vui lòng chọn người nhận")
      return
    }

    setShowPreviewDialog(true)
  }

  const handleSendNotification = () => {
    setShowPreviewDialog(false)
    setCurrentStep("confirmation")
    setIsSuccess(true)
  }

  const renderComposeStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Soạn Thông báo
          </CardTitle>
          <CardDescription>Tạo thông báo mới để gửi đến tiểu thương</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề thông báo *</Label>
            <Input
              id="title"
              placeholder="Ví dụ: Thông báo về giờ hoạt động mới"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung thông báo *</Label>
            <Textarea
              id="content"
              placeholder="Nhập nội dung thông báo chi tiết..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">{content.length}/1000 ký tự</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Chọn Người nhận
          </CardTitle>
          <CardDescription>Chọn khu vực hoặc gửi đến tất cả tiểu thương</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="send-all"
              checked={sendToAll}
              onCheckedChange={(checked) => {
                setSendToAll(checked as boolean)
                if (checked) {
                  setSelectedZones([])
                }
              }}
            />
            <Label htmlFor="send-all" className="font-medium">
              Gửi đến tất cả tiểu thương
            </Label>
            <Badge variant="outline" className="ml-2">
              {zones.reduce((total, zone) => total + zone.merchantCount, 0)} người
            </Badge>
          </div>

          {!sendToAll && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Hoặc chọn khu vực cụ thể:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {zones.map((zone) => (
                  <div key={zone.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={zone.id}
                      checked={selectedZones.includes(zone.id)}
                      onCheckedChange={(checked) => handleZoneSelection(zone.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={zone.id} className="font-medium cursor-pointer">
                        {zone.name}
                      </Label>
                      <p className="text-sm text-gray-600">{zone.merchantCount} tiểu thương</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-medium text-blue-900">Tổng số người nhận: {calculateRecipientCount()} tiểu thương</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack}>
              Hủy bỏ
            </Button>
            <Button onClick={handleProceedToPreview} className="bg-blue-600 hover:bg-blue-700">
              <Eye className="w-4 h-4 mr-2" />
              Xem trước & Gửi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderConfirmationStep = () => (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle className="text-green-600">Gửi Thông báo Thành công!</CardTitle>
        <CardDescription>Thông báo đã được gửi đến {calculateRecipientCount()} tiểu thương</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-gray-900">{title}</p>
          <p className="text-gray-600">đã được gửi thành công</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Thời gian gửi:</span>
            <span className="font-medium">{new Date().toLocaleString("vi-VN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số người nhận:</span>
            <span className="font-medium">{calculateRecipientCount()} tiểu thương</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Trạng thái:</span>
            <Badge className="bg-green-100 text-green-800">Đã gửi</Badge>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep("compose")
              setTitle("")
              setContent("")
              setSendToAll(false)
              setSelectedZones([])
              setIsSuccess(false)
            }}
          >
            Tạo thông báo mới
          </Button>
          <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
            Về trang chủ
          </Button>
        </div>
      </CardContent>
    </Card>
  )

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
          <h1 className="text-2xl font-bold text-gray-900">Tạo Thông báo</h1>
          <p className="text-gray-600">Tạo và gửi thông báo đến tiểu thương</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 py-4">
        {[
          { key: "compose", label: "Soạn thông báo", step: 1 },
          { key: "preview", label: "Xem trước", step: 2 },
          { key: "confirmation", label: "Hoàn thành", step: 3 },
        ].map((item, index) => (
          <div key={item.key} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === item.key
                  ? "bg-blue-600 text-white"
                  : ["compose", "preview"].indexOf(currentStep) > ["compose", "preview"].indexOf(item.key)
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {item.step}
            </div>
            <span
              className={`ml-2 text-sm ${currentStep === item.key ? "text-blue-600 font-medium" : "text-gray-600"}`}
            >
              {item.label}
            </span>
            {index < 2 && <div className="w-8 h-px bg-gray-300 mx-4" />}
          </div>
        ))}
      </div>

      {currentStep === "compose" && renderComposeStep()}
      {currentStep === "confirmation" && renderConfirmationStep()}

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xem trước Thông báo</DialogTitle>
            <DialogDescription>Đây là cách thông báo sẽ hiển thị trên ứng dụng của tiểu thương</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Mobile App Preview */}
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Ban Quản lý Chợ</p>
                    <p className="text-xs text-gray-500">{new Date().toLocaleString("vi-VN")}</p>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Thông báo này sẽ được gửi đến {calculateRecipientCount()} tiểu thương.</strong>
              </p>
              <p className="text-sm text-blue-700 mt-1">Bạn có chắc chắn không?</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Chỉnh sửa
            </Button>
            <Button onClick={handleSendNotification} className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4 mr-2" />
              Gửi ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
