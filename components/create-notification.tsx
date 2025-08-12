"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, ArrowLeft, Bell, CheckCircle, Clock, Send, Smartphone, Users } from "lucide-react"
import { useState } from "react"

interface CreateNotificationProps {
  onBack: () => void
}

export function CreateNotification({ onBack }: CreateNotificationProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [targetType, setTargetType] = useState("all")
  const [selectedZones, setSelectedZones] = useState<string[]>([])
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([])
  const [priority, setPriority] = useState("normal")
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledTime, setScheduledTime] = useState("")

  const zones = [
    { id: "zone-a", name: "Khu A", count: 45 },
    { id: "zone-b", name: "Khu B", count: 38 },
    { id: "zone-c", name: "Khu C", count: 42 },
    { id: "zone-d", name: "Khu D", count: 35 }
  ]

  const merchants = [
    { id: "merchant-1", name: "Nguyễn Thị Lan", zone: "Khu A", phone: "0901234567" },
    { id: "merchant-2", name: "Trần Văn Minh", zone: "Khu B", phone: "0901234568" },
    { id: "merchant-3", name: "Lê Thị Hoa", zone: "Khu A", phone: "0901234569" },
    { id: "merchant-4", name: "Phạm Văn Dũng", zone: "Khu C", phone: "0901234570" },
    { id: "merchant-5", name: "Hoàng Thị Mai", zone: "Khu B", phone: "0901234571" },
    { id: "merchant-6", name: "Vũ Văn Nam", zone: "Khu D", phone: "0901234572" }
  ]

  const handleZoneToggle = (zoneId: string) => {
    setSelectedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    )
  }

  const handleMerchantToggle = (merchantId: string) => {
    setSelectedMerchants(prev => 
      prev.includes(merchantId) 
        ? prev.filter(id => id !== merchantId)
        : [...prev, merchantId]
    )
  }

  const getRecipientCount = () => {
    if (targetType === "all") return 150
    if (targetType === "zones") {
      return selectedZones.reduce((total, zoneId) => {
        const zone = zones.find(z => z.id === zoneId)
        return total + (zone?.count || 0)
      }, 0)
    }
    if (targetType === "specific") return selectedMerchants.length
    return 0
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200"
      case "high": return "bg-orange-100 text-orange-800 border-orange-200"
      case "normal": return "bg-blue-100 text-blue-800 border-blue-200"
      case "low": return "bg-gray-100 text-gray-800 border-gray-200"
      default: return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertTriangle className="w-4 h-4" />
      case "high": return <AlertTriangle className="w-4 h-4" />
      case "normal": return <Bell className="w-4 h-4" />
      case "low": return <Clock className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const handleSend = () => {
    // Simulate sending notification
    console.log("Sending notification:", {
      title,
      content,
      targetType,
      selectedZones,
      selectedMerchants,
      priority,
      isScheduled,
      scheduledTime
    })
    
    // Reset form
    setTitle("")
    setContent("")
    setTargetType("all")
    setSelectedZones([])
    setSelectedMerchants([])
    setPriority("normal")
    setIsScheduled(false)
    setScheduledTime("")
  }

  const recipientCount = getRecipientCount()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-gray-900">Tạo thông báo</h1>
          <p className="text-gray-600">Gửi thông báo đến tiểu thương</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
        {/* Form - Giới hạn chiều rộng */}
        <div className="lg:col-span-2">
          <div className="w-full space-y-6">
            {/* Đối tượng nhận */}
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  Đối tượng nhận
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Loại đối tượng</Label>
                  <Select value={targetType} onValueChange={setTargetType}>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả tiểu thương</SelectItem>
                      <SelectItem value="zones">Theo khu vực</SelectItem>
                      <SelectItem value="specific">Tiểu thương cụ thể</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {targetType === "zones" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Chọn khu vực</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {zones.map((zone) => (
                        <div 
                          key={zone.id} 
                          className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            selectedZones.includes(zone.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleZoneToggle(zone.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={zone.id}
                              checked={selectedZones.includes(zone.id)}
                              onCheckedChange={() => handleZoneToggle(zone.id)}
                            />
                            <div>
                              <Label htmlFor={zone.id} className="text-sm font-medium cursor-pointer">
                                {zone.name}
                              </Label>
                              <p className="text-xs text-gray-500">{zone.count} tiểu thương</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {targetType === "specific" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Chọn tiểu thương</Label>
                    <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3">
                      {merchants.map((merchant) => (
                        <div 
                          key={merchant.id} 
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedMerchants.includes(merchant.id)
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleMerchantToggle(merchant.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={merchant.id}
                              checked={selectedMerchants.includes(merchant.id)}
                              onCheckedChange={() => handleMerchantToggle(merchant.id)}
                            />
                            <div>
                              <Label htmlFor={merchant.id} className="text-sm font-medium cursor-pointer">
                                {merchant.name}
                              </Label>
                              <p className="text-xs text-gray-500">{merchant.zone} • {merchant.phone}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Nội dung thông báo */}
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  Nội dung thông báo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Tiêu đề thông báo</Label>
                  <Input
                    id="title"
                    placeholder="Nhập tiêu đề thông báo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium">Nội dung</Label>
                  <Textarea
                    id="content"
                    placeholder="Nhập nội dung thông báo chi tiết..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium">Mức độ ưu tiên</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Chọn mức độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Thấp</SelectItem>
                        <SelectItem value="normal">Bình thường</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                        <SelectItem value="urgent">Khẩn cấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Lên lịch gửi</Label>
                      <Switch
                        checked={isScheduled}
                        onCheckedChange={setIsScheduled}
                      />
                    </div>
                    <Input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      disabled={!isScheduled}
                      className={`transition-all duration-200 ${
                        isScheduled 
                          ? 'focus:ring-2 focus:ring-blue-500' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preview & Summary */}
        <div className="space-y-4">
          {/* Preview - WYSIWYG */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                Xem trước
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {title || content ? (
                <div className="space-y-4">
                  {/* Mobile notification preview */}
                  <div className="bg-gray-900 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Bell className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">LS-Chợ</span>
                      </div>
                      <span className="text-xs text-gray-400">Bây giờ</span>
                    </div>
                    {title && (
                      <h3 className="font-semibold text-sm mb-1">{title}</h3>
                    )}
                    {content && (
                      <p className="text-xs text-gray-300 leading-relaxed">{content}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-700">
                      <Badge className={`text-xs ${getPriorityColor(priority)}`}>
                        {getPriorityIcon(priority)}
                        <span className="ml-1">
                          {priority === "urgent" && "Khẩn cấp"}
                          {priority === "high" && "Cao"}
                          {priority === "normal" && "Bình thường"}
                          {priority === "low" && "Thấp"}
                        </span>
                      </Badge>
                      {isScheduled && scheduledTime && (
                        <span className="text-xs text-gray-400">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(scheduledTime).toLocaleString("vi-VN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Smartphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Nhập nội dung để xem trước</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
                Tóm tắt & Xác nhận
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Gửi đến:</span>
                  <span className="font-semibold text-sm">
                    {targetType === "all" && "Tất cả tiểu thương"}
                    {targetType === "zones" && `${selectedZones.length} khu vực`}
                    {targetType === "specific" && `${selectedMerchants.length} tiểu thương`}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tổng số người nhận:</span>
                  <span className="font-bold text-lg text-blue-600">{recipientCount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mức độ ưu tiên:</span>
                  <Badge className={`text-xs ${getPriorityColor(priority)}`}>
                    {getPriorityIcon(priority)}
                    <span className="ml-1">
                      {priority === "urgent" && "Khẩn cấp"}
                      {priority === "high" && "Cao"}
                      {priority === "normal" && "Bình thường"}
                      {priority === "low" && "Thấp"}
                    </span>
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Thời gian gửi:</span>
                  <span className="font-semibold text-sm">
                    {isScheduled && scheduledTime 
                      ? new Date(scheduledTime).toLocaleString("vi-VN")
                      : "Gửi ngay"
                    }
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  onClick={handleSend} 
                  disabled={!title || !content || recipientCount === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Gửi thông báo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack} className="hover:bg-gray-50 transition-colors">
          Hủy
        </Button>
      </div>
    </div>
  )
} 