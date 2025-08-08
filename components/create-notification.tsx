"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Send, Users, Bell } from "lucide-react"

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
  const [scheduledTime, setScheduledTime] = useState("")

  const zones = [
    { id: "zone-a", name: "Khu A" },
    { id: "zone-b", name: "Khu B" },
    { id: "zone-c", name: "Khu C" },
    { id: "zone-d", name: "Khu D" }
  ]

  const merchants = [
    { id: "merchant-1", name: "Nguyễn Thị Lan", zone: "Khu A" },
    { id: "merchant-2", name: "Trần Văn Minh", zone: "Khu B" },
    { id: "merchant-3", name: "Lê Thị Hoa", zone: "Khu A" },
    { id: "merchant-4", name: "Phạm Văn Dũng", zone: "Khu C" }
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

  const handleSend = () => {
    // Simulate sending notification
    console.log("Sending notification:", {
      title,
      content,
      targetType,
      selectedZones,
      selectedMerchants,
      priority,
      scheduledTime
    })
    
    // Reset form
    setTitle("")
    setContent("")
    setTargetType("all")
    setSelectedZones([])
    setSelectedMerchants([])
    setPriority("normal")
    setScheduledTime("")
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Nội dung thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề thông báo</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề thông báo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  placeholder="Nhập nội dung thông báo chi tiết..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Mức độ ưu tiên</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
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
                
                <div>
                  <Label htmlFor="scheduledTime">Lên lịch gửi (tùy chọn)</Label>
                  <Input
                    id="scheduledTime"
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Đối tượng nhận
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Loại đối tượng</Label>
                <Select value={targetType} onValueChange={setTargetType}>
                  <SelectTrigger>
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
                <div>
                  <Label>Chọn khu vực</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {zones.map((zone) => (
                      <div key={zone.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={zone.id}
                          checked={selectedZones.includes(zone.id)}
                          onCheckedChange={() => handleZoneToggle(zone.id)}
                        />
                        <Label htmlFor={zone.id} className="text-sm">{zone.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {targetType === "specific" && (
                <div>
                  <Label>Chọn tiểu thương</Label>
                  <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
                    {merchants.map((merchant) => (
                      <div key={merchant.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={merchant.id}
                          checked={selectedMerchants.includes(merchant.id)}
                          onCheckedChange={() => handleMerchantToggle(merchant.id)}
                        />
                        <Label htmlFor={merchant.id} className="text-sm">
                          {merchant.name} - {merchant.zone}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Xem trước</CardTitle>
            </CardHeader>
            <CardContent>
              {title || content ? (
                <div className="space-y-3">
                  {title && (
                    <div>
                      <p className="font-medium text-gray-900">{title}</p>
                    </div>
                  )}
                  {content && (
                    <div>
                      <p className="text-sm text-gray-600">{content}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Mức độ: {priority}</span>
                    {scheduledTime && (
                      <span>• Lên lịch: {new Date(scheduledTime).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nhập nội dung để xem trước</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tổng số người nhận:</span>
                  <span className="font-medium">
                    {targetType === "all" && "150"}
                    {targetType === "zones" && selectedZones.length > 0 && `${selectedZones.length * 35}`}
                    {targetType === "specific" && selectedMerchants.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Khu vực:</span>
                  <span className="font-medium">
                    {targetType === "all" && "Tất cả"}
                    {targetType === "zones" && selectedZones.map(id => zones.find(z => z.id === id)?.name).join(", ")}
                    {targetType === "specific" && "Cụ thể"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack}>
          Hủy
        </Button>
        <Button onClick={handleSend} disabled={!title || !content}>
          <Send className="w-4 h-4 mr-2" />
          Gửi thông báo
        </Button>
      </div>
    </div>
  )
} 