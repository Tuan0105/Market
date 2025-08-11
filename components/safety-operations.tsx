"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import {
    AlertTriangle,
    ArrowLeft,
    Bell,
    Calendar as CalendarIcon,
    Download,
    Edit,
    Eye,
    Filter,
    Plus,
    Search,
    Trash2,
    Upload,
    Video
} from "lucide-react"
import { useState } from "react"

interface InspectionSchedule {
  id: string
  name: string
  type: "PCCC" | "VSATTP" | "Vệ sinh chung"
  startDate: Date
  endDate: Date
  scope: string[]
  content: string
  responsible: string
  status: "Sắp diễn ra" | "Đã hoãn" | "Đã hoàn thành"
}

interface InspectionRecord {
  id: string
  name: string
  date: Date
  type: "PCCC" | "VSATTP" | "Vệ sinh chung"
  scope: string
  result: "Đạt" | "Không đạt" | "Cần khắc phục"
  responsible: string
  attachments: string[]
  stalls: StallInspection[]
}

interface StallInspection {
  stallCode: string
  merchantName: string
  result: "Đạt" | "Không đạt" | "Cần khắc phục"
  notes: string
}

interface SecurityDevice {
  id: string
  code: string
  location: string
  type: string
  status: "Hoạt động" | "Mất kết nối" | "Cần bảo trì"
  lastMaintenance: Date
  expiryDate?: Date
}

// Dữ liệu mẫu
const sampleSchedules: InspectionSchedule[] = [
  {
    id: "1",
    name: "Kiểm tra PCCC định kỳ Quý 3/2025",
    type: "PCCC",
    startDate: new Date("2025-09-15"),
    endDate: new Date("2025-09-20"),
    scope: ["Toàn chợ"],
    content: "Kiểm tra hệ thống báo cháy, bình chữa cháy, lối thoát hiểm",
    responsible: "Nguyễn Văn An",
    status: "Sắp diễn ra"
  },
  {
    id: "2",
    name: "Kiểm tra VSATTP tháng 8/2025",
    type: "VSATTP",
    startDate: new Date("2025-08-25"),
    endDate: new Date("2025-08-30"),
    scope: ["Khu A", "Khu B"],
    content: "Kiểm tra vệ sinh khu vực chế biến, bảo quản thực phẩm",
    responsible: "Trần Thị Bình",
    status: "Sắp diễn ra"
  }
]

const sampleRecords: InspectionRecord[] = [
  {
    id: "1",
    name: "Kiểm tra PCCC Quý 2/2025",
    date: new Date("2025-06-15"),
    type: "PCCC",
    scope: "Toàn chợ",
    result: "Đạt",
    responsible: "Nguyễn Văn An",
    attachments: ["bien-ban-pccc-q2-2025.pdf", "anh-chup-pccc-001.jpg"],
    stalls: [
      { stallCode: "A01", merchantName: "Nguyễn Thị Lan", result: "Đạt", notes: "" },
      { stallCode: "B03", merchantName: "Trần Văn Minh", result: "Không đạt", notes: "Bình chữa cháy hết hạn" },
      { stallCode: "C05", merchantName: "Lê Văn Hùng", result: "Đạt", notes: "" },
      { stallCode: "D02", merchantName: "Phạm Thị Mai", result: "Đạt", notes: "" }
    ]
  },
  {
    id: "2",
    name: "Kiểm tra VSATTP tháng 7/2025",
    date: new Date("2025-07-20"),
    type: "VSATTP",
    scope: "Khu A, Khu B",
    result: "Cần khắc phục",
    responsible: "Trần Thị Bình",
    attachments: ["bien-ban-vsattp-t7-2025.pdf", "anh-khu-che-bien-001.jpg", "anh-khu-che-bien-002.jpg"],
    stalls: [
      { stallCode: "A03", merchantName: "Vũ Văn Nam", result: "Không đạt", notes: "Khu vực chế biến không đảm bảo vệ sinh" },
      { stallCode: "A07", merchantName: "Đỗ Thị Hương", result: "Không đạt", notes: "Thiếu găng tay bảo hộ" },
      { stallCode: "B01", merchantName: "Lý Văn Thành", result: "Đạt", notes: "" },
      { stallCode: "B08", merchantName: "Hoàng Thị Mai", result: "Cần khắc phục", notes: "Cần bổ sung nắp đậy thực phẩm" }
    ]
  },
  {
    id: "3",
    name: "Kiểm tra vệ sinh chung tháng 8/2025",
    date: new Date("2025-08-10"),
    type: "Vệ sinh chung",
    scope: "Toàn chợ",
    result: "Đạt",
    responsible: "Nguyễn Văn An",
    attachments: ["bien-ban-ve-sinh-t8-2025.pdf"],
    stalls: [
      { stallCode: "A02", merchantName: "Trần Văn Sơn", result: "Đạt", notes: "" },
      { stallCode: "A05", merchantName: "Nguyễn Thị Hoa", result: "Đạt", notes: "" },
      { stallCode: "B04", merchantName: "Lê Văn Dũng", result: "Đạt", notes: "" },
      { stallCode: "C01", merchantName: "Phạm Văn Tú", result: "Đạt", notes: "" },
      { stallCode: "D03", merchantName: "Vũ Thị Lan", result: "Đạt", notes: "" }
    ]
  },
  {
    id: "4",
    name: "Kiểm tra PCCC đột xuất tháng 8/2025",
    date: new Date("2025-08-25"),
    type: "PCCC",
    scope: "Khu C",
    result: "Không đạt",
    responsible: "Trần Thị Bình",
    attachments: ["bien-ban-pccc-dot-xuat-t8-2025.pdf", "anh-loi-thoat-hiem-001.jpg"],
    stalls: [
      { stallCode: "C02", merchantName: "Đặng Văn Hải", result: "Không đạt", notes: "Lối thoát hiểm bị chặn" },
      { stallCode: "C06", merchantName: "Bùi Thị Nga", result: "Không đạt", notes: "Bình chữa cháy không đạt tiêu chuẩn" },
      { stallCode: "C08", merchantName: "Nguyễn Văn Tuấn", result: "Đạt", notes: "" }
    ]
  }
]

const sampleCameras: SecurityDevice[] = [
  {
    id: "1",
    code: "CAM-001",
    location: "Cổng chính",
    type: "Camera IP",
    status: "Hoạt động",
    lastMaintenance: new Date("2025-07-01")
  },
  {
    id: "2",
    code: "CAM-002",
    location: "Hành lang khu B",
    type: "Camera Dome",
    status: "Mất kết nối",
    lastMaintenance: new Date("2025-06-15")
  }
]

const sampleFireExtinguishers: SecurityDevice[] = [
  {
    id: "1",
    code: "FE-001",
    location: "Khu A - Tầng 1",
    type: "Bình bột ABC",
    status: "Hoạt động",
    lastMaintenance: new Date("2025-07-01"),
    expiryDate: new Date("2026-07-01")
  },
  {
    id: "2",
    code: "FE-002",
    location: "Khu B - Tầng 2",
    type: "Bình CO2",
    status: "Cần bảo trì",
    lastMaintenance: new Date("2025-05-15"),
    expiryDate: new Date("2025-11-15")
  }
]

export function SafetyOperations({ onBack }: { onBack: () => void }) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("schedule")
  const [schedules, setSchedules] = useState<InspectionSchedule[]>(sampleSchedules)
  const [records, setRecords] = useState<InspectionRecord[]>(sampleRecords)
  const [cameras, setCameras] = useState<SecurityDevice[]>(sampleCameras)
  const [fireExtinguishers, setFireExtinguishers] = useState<SecurityDevice[]>(sampleFireExtinguishers)
  
  // States cho sheet tạo lịch kiểm tra
  const [showScheduleSheet, setShowScheduleSheet] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<InspectionSchedule | null>(null)
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    type: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    scope: [] as string[],
    content: "",
    responsible: ""
  })

  // States cho trang chi tiết hồ sơ
  const [currentView, setCurrentView] = useState<"main" | "record-detail">("main")
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null)

  // States cho modal thêm thiết bị
  const [showDeviceModal, setShowDeviceModal] = useState(false)
  const [deviceType, setDeviceType] = useState<"camera" | "fire-extinguisher">("camera")
  const [newDevice, setNewDevice] = useState({
    code: "",
    location: "",
    type: "",
    expiryDate: undefined as Date | undefined
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Sắp diễn ra":
        return <Badge className="bg-blue-100 text-blue-800">Sắp diễn ra</Badge>
      case "Đã hoãn":
        return <Badge className="bg-yellow-100 text-yellow-800">Đã hoãn</Badge>
      case "Đã hoàn thành":
        return <Badge className="bg-green-100 text-green-800">Đã hoàn thành</Badge>
      case "Đạt":
        return <Badge className="bg-green-100 text-green-800">Đạt</Badge>
      case "Không đạt":
        return <Badge className="bg-red-100 text-red-800">Không đạt</Badge>
      case "Cần khắc phục":
        return <Badge className="bg-orange-100 text-orange-800">Cần khắc phục</Badge>
      case "Hoạt động":
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
      case "Mất kết nối":
        return <Badge className="bg-red-100 text-red-800">Mất kết nối</Badge>
      case "Cần bảo trì":
        return <Badge className="bg-yellow-100 text-yellow-800">Cần bảo trì</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleCreateSchedule = () => {
    if (newSchedule.name && newSchedule.type && newSchedule.startDate && newSchedule.endDate) {
      const schedule: InspectionSchedule = {
        id: editingSchedule ? editingSchedule.id : Date.now().toString(),
        name: newSchedule.name,
        type: newSchedule.type as "PCCC" | "VSATTP" | "Vệ sinh chung",
        startDate: newSchedule.startDate,
        endDate: newSchedule.endDate,
        scope: newSchedule.scope,
        content: newSchedule.content,
        responsible: newSchedule.responsible,
        status: editingSchedule ? editingSchedule.status : "Sắp diễn ra"
      }
      
      if (editingSchedule) {
        // Cập nhật lịch kiểm tra hiện có
        setSchedules(schedules.map(s => s.id === editingSchedule.id ? schedule : s))
        toast({
          title: "Cập nhật thành công!",
          description: `Đã cập nhật lịch kiểm tra "${schedule.name}"`,
          variant: "default",
        })
      } else {
        // Tạo lịch kiểm tra mới
        setSchedules([...schedules, schedule])
        toast({
          title: "Tạo thành công!",
          description: `Đã tạo lịch kiểm tra "${schedule.name}"`,
          variant: "default",
        })
      }
      
      setShowScheduleSheet(false)
      setEditingSchedule(null)
      setNewSchedule({
        name: "",
        type: "",
        startDate: undefined,
        endDate: undefined,
        scope: [],
        content: "",
        responsible: ""
      })
    }
  }

  const handleEditSchedule = (schedule: InspectionSchedule) => {
    setEditingSchedule(schedule)
    setNewSchedule({
      name: schedule.name,
      type: schedule.type,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      scope: schedule.scope,
      content: schedule.content,
      responsible: schedule.responsible
    })
    setShowScheduleSheet(true)
  }

  const handleCancelSchedule = (scheduleId: string) => {
    setSchedules(schedules.map(s => 
      s.id === scheduleId ? { ...s, status: "Đã hoãn" as const } : s
    ))
  }

  const handleDeleteSchedule = (schedule: InspectionSchedule) => {
    setDeleteTarget({ type: "schedule", id: schedule.id, name: schedule.name })
    setShowDeleteConfirmModal(true)
  }

  // States cho các modal
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [selectedStall, setSelectedStall] = useState<{stallCode: string, merchantName: string, result: string, notes: string} | null>(null)
  const [reminderContent, setReminderContent] = useState("")
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState<SecurityDevice | null>(null)
  const [showEditDeviceModal, setShowEditDeviceModal] = useState(false)
  const [editingDevice, setEditingDevice] = useState<SecurityDevice | null>(null)
  const [deviceEditType, setDeviceEditType] = useState<"camera" | "fire-extinguisher">("camera")
  
  // States cho modal xác nhận xóa
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{type: "camera" | "fire-extinguisher" | "schedule", id: string, name: string} | null>(null)
  
  // States cho modal xem chi tiết lịch kiểm tra
  const [showScheduleDetailModal, setShowScheduleDetailModal] = useState(false)
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<Date | null>(null)

  const handleSendReminder = (stallCode: string, merchantName: string, result: string, notes: string) => {
    setSelectedStall({ stallCode, merchantName, result, notes })
    // Tạo nội dung nhắc nhở dựa trên kết quả kiểm tra
    let content = ""
    if (result === "Không đạt") {
      content = `Gian hàng ${stallCode} - ${merchantName} cần khắc phục ngay các vấn đề sau:\n\n${notes}\n\nVui lòng khắc phục trong thời gian sớm nhất và báo cáo lại cho Ban Quản Lý.`
    } else if (result === "Cần khắc phục") {
      content = `Gian hàng ${stallCode} - ${merchantName} cần khắc phục các vấn đề sau:\n\n${notes}\n\nVui lòng khắc phục và báo cáo lại cho Ban Quản Lý.`
    }
    setReminderContent(content)
    setShowReminderModal(true)
  }

  const handleViewCamera = (camera: SecurityDevice) => {
    setSelectedCamera(camera)
    setShowCameraModal(true)
  }

  const handleEditCamera = (camera: SecurityDevice) => {
    setEditingDevice(camera)
    setDeviceEditType("camera")
    setShowEditDeviceModal(true)
  }

  const handleDeleteCamera = (camera: SecurityDevice) => {
    setDeleteTarget({ type: "camera", id: camera.id, name: camera.code })
    setShowDeleteConfirmModal(true)
  }

  const handleEditFireExtinguisher = (fireExt: SecurityDevice) => {
    setEditingDevice(fireExt)
    setDeviceEditType("fire-extinguisher")
    setShowEditDeviceModal(true)
  }

  const handleDeleteFireExtinguisher = (fireExt: SecurityDevice) => {
    setDeleteTarget({ type: "fire-extinguisher", id: fireExt.id, name: fireExt.code })
    setShowDeleteConfirmModal(true)
  }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === "camera") {
        setCameras(cameras.filter(c => c.id !== deleteTarget.id))
        toast({
          title: "Xóa thành công!",
          description: `Đã xóa camera ${deleteTarget.name}`,
          variant: "default",
        })
      } else if (deleteTarget.type === "fire-extinguisher") {
        setFireExtinguishers(fireExtinguishers.filter(f => f.id !== deleteTarget.id))
        toast({
          title: "Xóa thành công!",
          description: `Đã xóa bình chữa cháy ${deleteTarget.name}`,
          variant: "default",
        })
      } else if (deleteTarget.type === "schedule") {
        setSchedules(schedules.filter(s => s.id !== deleteTarget.id))
        toast({
          title: "Xóa thành công!",
          description: `Đã xóa lịch kiểm tra ${deleteTarget.name}`,
          variant: "default",
        })
      }
      setShowDeleteConfirmModal(false)
      setDeleteTarget(null)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const schedulesOnDate = schedules.filter(schedule => 
        date >= schedule.startDate && date <= schedule.endDate
      )
      if (schedulesOnDate.length > 0) {
        setSelectedScheduleDate(date)
        setShowScheduleDetailModal(true)
      }
    }
  }

  const handleUpdateDevice = () => {
    if (editingDevice && deviceEditType === "camera") {
      setCameras(cameras.map(c => c.id === editingDevice.id ? editingDevice : c))
    } else if (editingDevice && deviceEditType === "fire-extinguisher") {
      setFireExtinguishers(fireExtinguishers.map(f => f.id === editingDevice.id ? editingDevice : f))
    }
    setShowEditDeviceModal(false)
    setEditingDevice(null)
  }

  const handleCreateDevice = () => {
    if (newDevice.code && newDevice.location && newDevice.type) {
      const device: SecurityDevice = {
        id: Date.now().toString(),
        code: newDevice.code,
        location: newDevice.location,
        type: newDevice.type,
        status: "Hoạt động",
        lastMaintenance: new Date(),
        expiryDate: newDevice.expiryDate
      }
      
      if (deviceType === "camera") {
        setCameras([...cameras, device])
      } else {
        setFireExtinguishers([...fireExtinguishers, device])
      }
      
      setShowDeviceModal(false)
      setNewDevice({
        code: "",
        location: "",
        type: "",
        expiryDate: undefined
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      {currentView === "main" && (
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
              <h1 className="text-2xl font-bold text-gray-900">Quản lý An toàn & Vận hành</h1>
              <p className="text-gray-600">Quản lý kiểm tra, hồ sơ và hệ thống an ninh</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      {currentView === "main" && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Lịch kiểm tra</TabsTrigger>
          <TabsTrigger value="records">Hồ sơ kiểm tra</TabsTrigger>
          <TabsTrigger value="security">Hệ thống An ninh</TabsTrigger>
        </TabsList>

        {/* Tab 1: Lịch kiểm tra */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lịch kiểm tra</h2>
            <Sheet open={showScheduleSheet} onOpenChange={setShowScheduleSheet}>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Lập lịch kiểm tra mới
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[600px] sm:w-[540px] flex flex-col">
                <SheetHeader className="pb-6 flex-shrink-0">
                  <SheetTitle>{editingSchedule ? "Chỉnh sửa lịch kiểm tra" : "Tạo lịch kiểm tra mới"}</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-6">
                  <div className="space-y-6 pb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Tên đợt kiểm tra</label>
                    <Input
                      placeholder="VD: Kiểm tra PCCC định kỳ Quý 3/2025"
                      value={newSchedule.name}
                      onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Loại hình kiểm tra</label>
                      <Select value={newSchedule.type} onValueChange={(value) => setNewSchedule({...newSchedule, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại hình" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PCCC">PCCC</SelectItem>
                          <SelectItem value="VSATTP">VSATTP</SelectItem>
                          <SelectItem value="Vệ sinh chung">Vệ sinh chung</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Người phụ trách</label>
                      <Input
                        placeholder="Tên người phụ trách"
                        value={newSchedule.responsible}
                        onChange={(e) => setNewSchedule({...newSchedule, responsible: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                      <Calendar
                        mode="single"
                        selected={newSchedule.startDate}
                        onSelect={(date) => setNewSchedule({...newSchedule, startDate: date})}
                        className="rounded-md border p-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                      <Calendar
                        mode="single"
                        selected={newSchedule.endDate}
                        onSelect={(date) => setNewSchedule({...newSchedule, endDate: date})}
                        className="rounded-md border p-3"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Phạm vi</label>
                    <div className="space-y-3 pl-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={newSchedule.scope.includes("Toàn chợ")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewSchedule({...newSchedule, scope: ["Toàn chợ"]})
                            } else {
                              setNewSchedule({...newSchedule, scope: newSchedule.scope.filter(s => s !== "Toàn chợ")})
                            }
                          }}
                        />
                        <label className="text-sm font-medium">Toàn chợ</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={newSchedule.scope.includes("Khu A")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewSchedule({...newSchedule, scope: [...newSchedule.scope, "Khu A"]})
                            } else {
                              setNewSchedule({...newSchedule, scope: newSchedule.scope.filter(s => s !== "Khu A")})
                            }
                          }}
                        />
                        <label className="text-sm font-medium">Khu A</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={newSchedule.scope.includes("Khu B")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewSchedule({...newSchedule, scope: [...newSchedule.scope, "Khu B"]})
                            } else {
                              setNewSchedule({...newSchedule, scope: newSchedule.scope.filter(s => s !== "Khu B")})
                            }
                          }}
                        />
                        <label className="text-sm font-medium">Khu B</label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nội dung kiểm tra</label>
                    <Textarea
                      placeholder="Ghi các đầu mục cần kiểm tra..."
                      value={newSchedule.content}
                      onChange={(e) => setNewSchedule({...newSchedule, content: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                </div>
                <div className="flex-shrink-0 px-6 py-4 border-t bg-white">
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => {
                      setShowScheduleSheet(false)
                      setEditingSchedule(null)
                      setNewSchedule({
                        name: "",
                        type: "",
                        startDate: undefined,
                        endDate: undefined,
                        scope: [],
                        content: "",
                        responsible: ""
                      })
                    }}>
                      Hủy
                    </Button>
                    <Button onClick={handleCreateSchedule}>
                      {editingSchedule ? "Cập nhật" : "Lưu lại"}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Calendar và danh sách */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Lịch kiểm tra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={new Date()}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  modifiers={{
                    hasSchedule: (date) => {
                      return schedules.some(schedule => 
                        date >= schedule.startDate && date <= schedule.endDate
                      )
                    }
                  }}
                  modifiersStyles={{
                    hasSchedule: {
                      backgroundColor: "#3b82f6",
                      color: "white",
                      fontWeight: "bold"
                    }
                  }}
                />
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">Chú thích:</p>
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>Có lịch kiểm tra</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Click vào ngày có màu xanh để xem chi tiết lịch kiểm tra
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Danh sách lịch kiểm tra */}
            <Card>
              <CardHeader>
                <CardTitle>Lịch kiểm tra sắp tới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{schedule.name}</h3>
                        {getStatusBadge(schedule.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Loại: {schedule.type}</p>
                        <p>Thời gian: {format(schedule.startDate, "dd/MM/yyyy")} - {format(schedule.endDate, "dd/MM/yyyy")}</p>
                        <p>Phạm vi: {schedule.scope.join(", ")}</p>
                        <p>Phụ trách: {schedule.responsible}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditSchedule(schedule)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Sửa
                        </Button>
                        {schedule.status === "Sắp diễn ra" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-orange-600"
                            onClick={() => handleCancelSchedule(schedule.id)}
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Hoãn
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteSchedule(schedule)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Hồ sơ kiểm tra */}
        <TabsContent value="records" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Hồ sơ kiểm tra</h2>
          </div>

          {/* Bộ lọc */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Bộ lọc & Tìm kiếm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại hình</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="PCCC">PCCC</SelectItem>
                      <SelectItem value="VSATTP">VSATTP</SelectItem>
                      <SelectItem value="Vệ sinh chung">Vệ sinh chung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kết quả</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả kết quả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="Đạt">Đạt</SelectItem>
                      <SelectItem value="Không đạt">Không đạt</SelectItem>
                      <SelectItem value="Cần khắc phục">Cần khắc phục</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Tên đợt kiểm tra, mã gian hàng..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="this-month">Tháng này</SelectItem>
                      <SelectItem value="last-month">Tháng trước</SelectItem>
                      <SelectItem value="this-quarter">Quý này</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bảng hồ sơ */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách hồ sơ kiểm tra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Tên đợt kiểm tra</th>
                      <th className="text-left py-3 px-4 font-medium">Ngày thực hiện</th>
                      <th className="text-left py-3 px-4 font-medium">Loại hình</th>
                      <th className="text-left py-3 px-4 font-medium">Phạm vi</th>
                      <th className="text-center py-3 px-4 font-medium">Kết quả</th>
                      <th className="text-center py-3 px-4 font-medium">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{record.name}</td>
                        <td className="py-3 px-4">{format(record.date, "dd/MM/yyyy")}</td>
                        <td className="py-3 px-4">{record.type}</td>
                        <td className="py-3 px-4">{record.scope}</td>
                        <td className="py-3 px-4 text-center">{getStatusBadge(record.result)}</td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedRecord(record)
                              setCurrentView("record-detail")
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Hệ thống An ninh */}
        <TabsContent value="security" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Hệ thống An ninh</h2>
          </div>

          <Tabs defaultValue="cameras" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cameras">Danh sách Camera</TabsTrigger>
              <TabsTrigger value="fire-extinguishers">Danh sách Bình chữa cháy</TabsTrigger>
            </TabsList>

            {/* Tab Camera */}
            <TabsContent value="cameras" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Quản lý Camera</h3>
                <Dialog open={showDeviceModal} onOpenChange={setShowDeviceModal}>
                  <DialogTrigger asChild>
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => setDeviceType("camera")}
                    >
                      <Plus className="w-4 h-4" />
                      Thêm Camera mới
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm Camera mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mã Camera</label>
                        <Input
                          placeholder="VD: CAM-001"
                          value={newDevice.code}
                          onChange={(e) => setNewDevice({...newDevice, code: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí lắp đặt</label>
                        <Input
                          placeholder="VD: Cổng chính"
                          value={newDevice.location}
                          onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Loại camera</label>
                        <Input
                          placeholder="VD: Camera IP, Camera Dome"
                          value={newDevice.type}
                          onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDeviceModal(false)}>
                          Hủy
                        </Button>
                        <Button onClick={handleCreateDevice}>
                          Thêm
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Mã Camera</th>
                          <th className="text-left py-3 px-4 font-medium">Vị trí lắp đặt</th>
                          <th className="text-left py-3 px-4 font-medium">Loại camera</th>
                          <th className="text-center py-3 px-4 font-medium">Trạng thái</th>
                          <th className="text-left py-3 px-4 font-medium">Ngày bảo trì gần nhất</th>
                          <th className="text-center py-3 px-4 font-medium">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cameras.map((camera) => (
                          <tr key={camera.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{camera.code}</td>
                            <td className="py-3 px-4">{camera.location}</td>
                            <td className="py-3 px-4">{camera.type}</td>
                            <td className="py-3 px-4 text-center">{getStatusBadge(camera.status)}</td>
                            <td className="py-3 px-4">{format(camera.lastMaintenance, "dd/MM/yyyy")}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => handleViewCamera(camera)}
                                  title="Xem trực tiếp"
                                >
                                  <Video className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => handleEditCamera(camera)}
                                  title="Chỉnh sửa"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-600"
                                  onClick={() => handleDeleteCamera(camera)}
                                  title="Xóa camera"
                                >
                                  <Trash2 className="w-4 h-4" />
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
            </TabsContent>

            {/* Tab Bình chữa cháy */}
            <TabsContent value="fire-extinguishers" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Quản lý Bình chữa cháy</h3>
                <Dialog open={showDeviceModal} onOpenChange={setShowDeviceModal}>
                  <DialogTrigger asChild>
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => setDeviceType("fire-extinguisher")}
                    >
                      <Plus className="w-4 h-4" />
                      Thêm Bình mới
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm Bình chữa cháy mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mã số</label>
                        <Input
                          placeholder="VD: FE-001"
                          value={newDevice.code}
                          onChange={(e) => setNewDevice({...newDevice, code: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí đặt</label>
                        <Input
                          placeholder="VD: Khu A - Tầng 1"
                          value={newDevice.location}
                          onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Loại bình</label>
                        <Input
                          placeholder="VD: Bình bột ABC, Bình CO2"
                          value={newDevice.type}
                          onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hạn sử dụng</label>
                        <Calendar
                          mode="single"
                          selected={newDevice.expiryDate}
                          onSelect={(date) => setNewDevice({...newDevice, expiryDate: date})}
                          className="rounded-md border"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDeviceModal(false)}>
                          Hủy
                        </Button>
                        <Button onClick={handleCreateDevice}>
                          Thêm
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Mã số</th>
                          <th className="text-left py-3 px-4 font-medium">Vị trí đặt</th>
                          <th className="text-left py-3 px-4 font-medium">Loại bình</th>
                          <th className="text-left py-3 px-4 font-medium">Ngày sản xuất</th>
                          <th className="text-left py-3 px-4 font-medium">Hạn sử dụng</th>
                          <th className="text-center py-3 px-4 font-medium">Trạng thái</th>
                          <th className="text-center py-3 px-4 font-medium">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fireExtinguishers.map((fireExt) => (
                          <tr key={fireExt.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{fireExt.code}</td>
                            <td className="py-3 px-4">{fireExt.location}</td>
                            <td className="py-3 px-4">{fireExt.type}</td>
                            <td className="py-3 px-4">{format(fireExt.lastMaintenance, "dd/MM/yyyy")}</td>
                            <td className="py-3 px-4">
                              {fireExt.expiryDate && format(fireExt.expiryDate, "dd/MM/yyyy")}
                            </td>
                            <td className="py-3 px-4 text-center">{getStatusBadge(fireExt.status)}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => handleEditFireExtinguisher(fireExt)}
                                  title="Chỉnh sửa"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-600"
                                  onClick={() => handleDeleteFireExtinguisher(fireExt)}
                                  title="Xóa bình chữa cháy"
                                >
                                  <Trash2 className="w-4 h-4" />
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
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
      )}

      {/* Trang chi tiết hồ sơ */}
      {currentView === "record-detail" && selectedRecord && (
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setCurrentView("main")}
                variant="ghost"
                size="icon"
                className="h-10 w-10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chi tiết Hồ sơ kiểm tra</h1>
                <p className="text-gray-600">{selectedRecord.name}</p>
              </div>
            </div>
          </div>

          {/* Thông tin chung */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên đợt kiểm tra:</span>
                  <span className="font-medium">{selectedRecord.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày thực hiện:</span>
                  <span className="font-medium">{format(selectedRecord.date, "dd/MM/yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại hình:</span>
                  <span className="font-medium">{selectedRecord.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phạm vi:</span>
                  <span className="font-medium">{selectedRecord.scope}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kết quả & File đính kèm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kết quả chung:</span>
                  <span>{getStatusBadge(selectedRecord.result)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Người thực hiện:</span>
                  <span className="font-medium">{selectedRecord.responsible}</span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-2">File đính kèm:</span>
                  <div className="space-y-2">
                    {selectedRecord.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{file}</span>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Tải xuống
                        </Button>
                      </div>
                    ))}
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Thêm file đính kèm
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Danh sách gian hàng */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách gian hàng đã kiểm tra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Mã gian hàng</th>
                      <th className="text-left py-3 px-4 font-medium">Tên tiểu thương</th>
                      <th className="text-center py-3 px-4 font-medium">Kết quả</th>
                      <th className="text-left py-3 px-4 font-medium">Ghi chú</th>
                      <th className="text-center py-3 px-4 font-medium">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecord.stalls.map((stall, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{stall.stallCode}</td>
                        <td className="py-3 px-4">{stall.merchantName}</td>
                        <td className="py-3 px-4 text-center">{getStatusBadge(stall.result)}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{stall.notes}</td>
                                                  <td className="py-3 px-4 text-center">
                            {(stall.result === "Không đạt" || stall.result === "Cần khắc phục") && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSendReminder(stall.stallCode, stall.merchantName, stall.result, stall.notes)}
                              >
                                <Bell className="w-4 h-4 mr-1" />
                                Gửi nhắc nhở
                              </Button>
                            )}
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Gửi nhắc nhở */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gửi nhắc nhở</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Gửi nhắc nhở đến:</p>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Gian hàng: {selectedStall?.stallCode}</p>
              <p className="text-gray-600">Tiểu thương: {selectedStall?.merchantName}</p>
              <p className="text-gray-600">Kết quả kiểm tra: {selectedStall?.result}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Nội dung nhắc nhở:</label>
              <Textarea 
                value={reminderContent}
                onChange={(e) => setReminderContent(e.target.value)}
                placeholder="Nhập nội dung nhắc nhở..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowReminderModal(false)
                setSelectedStall(null)
                setReminderContent("")
              }}>
                Hủy
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Gửi nhắc nhở thành công!",
                  description: `Đã gửi nhắc nhở đến gian hàng ${selectedStall?.stallCode} - ${selectedStall?.merchantName}`,
                  variant: "default",
                })
                setShowReminderModal(false)
                setSelectedStall(null)
                setReminderContent("")
              }}>
                Gửi nhắc nhở
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Xem Camera */}
      <Dialog open={showCameraModal} onOpenChange={setShowCameraModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Xem trực tiếp Camera</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">Camera: {selectedCamera?.code}</p>
              <p className="text-gray-600">Vị trí: {selectedCamera?.location}</p>
              <p className="text-gray-600">Trạng thái: {selectedCamera?.status}</p>
            </div>
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Video className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p>Stream video từ camera {selectedCamera?.code}</p>
                <p className="text-sm text-gray-400">Đang kết nối...</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowCameraModal(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Chỉnh sửa thiết bị */}
      <Dialog open={showEditDeviceModal} onOpenChange={setShowEditDeviceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deviceEditType === "camera" ? "Chỉnh sửa Camera" : "Chỉnh sửa Bình chữa cháy"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mã số</label>
              <Input 
                value={editingDevice?.code || ""}
                onChange={(e) => setEditingDevice(editingDevice ? {...editingDevice, code: e.target.value} : null)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vị trí</label>
              <Input 
                value={editingDevice?.location || ""}
                onChange={(e) => setEditingDevice(editingDevice ? {...editingDevice, location: e.target.value} : null)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Loại</label>
              <Input 
                value={editingDevice?.type || ""}
                onChange={(e) => setEditingDevice(editingDevice ? {...editingDevice, type: e.target.value} : null)}
              />
            </div>
            {deviceEditType === "fire-extinguisher" && (
              <div>
                <label className="block text-sm font-medium mb-2">Hạn sử dụng</label>
                <Calendar
                  mode="single"
                  selected={editingDevice?.expiryDate}
                  onSelect={(date) => setEditingDevice(editingDevice ? {...editingDevice, expiryDate: date} : null)}
                  className="rounded-md border"
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowEditDeviceModal(false)
                setEditingDevice(null)
              }}>
                Hủy
              </Button>
              <Button onClick={handleUpdateDevice}>
                Cập nhật
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Xác nhận xóa */}
      <Dialog open={showDeleteConfirmModal} onOpenChange={setShowDeleteConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Bạn có chắc chắn muốn xóa {deleteTarget?.type === "camera" ? "camera" : deleteTarget?.type === "fire-extinguisher" ? "bình chữa cháy" : "lịch kiểm tra"} này?</p>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-medium text-red-800">
                {deleteTarget?.type === "camera" ? "Camera" : deleteTarget?.type === "fire-extinguisher" ? "Bình chữa cháy" : "Lịch kiểm tra"}: {deleteTarget?.name}
              </p>
              <p className="text-red-600 text-sm mt-1">
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowDeleteConfirmModal(false)
                setDeleteTarget(null)
              }}>
                Hủy
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
              >
                Xóa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Xem chi tiết lịch kiểm tra */}
      <Dialog open={showScheduleDetailModal} onOpenChange={setShowScheduleDetailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lịch kiểm tra ngày {selectedScheduleDate && format(selectedScheduleDate, "dd/MM/yyyy")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedScheduleDate && schedules
              .filter(schedule => selectedScheduleDate >= schedule.startDate && selectedScheduleDate <= schedule.endDate)
              .map((schedule) => (
                <div key={schedule.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{schedule.name}</h3>
                    {getStatusBadge(schedule.status)}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Loại:</span> {schedule.type}</p>
                    <p><span className="font-medium">Thời gian:</span> {format(schedule.startDate, "dd/MM/yyyy")} - {format(schedule.endDate, "dd/MM/yyyy")}</p>
                    <p><span className="font-medium">Phạm vi:</span> {schedule.scope.join(", ")}</p>
                    <p><span className="font-medium">Phụ trách:</span> {schedule.responsible}</p>
                    {schedule.content && (
                      <p><span className="font-medium">Nội dung:</span> {schedule.content}</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowScheduleDetailModal(false)
                        handleEditSchedule(schedule)
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Chỉnh sửa
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => {
                        setShowScheduleDetailModal(false)
                        handleDeleteSchedule(schedule)
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            {selectedScheduleDate && schedules.filter(schedule => 
              selectedScheduleDate >= schedule.startDate && selectedScheduleDate <= schedule.endDate
            ).length === 0 && (
              <p className="text-gray-500 text-center py-4">Không có lịch kiểm tra nào trong ngày này</p>
            )}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowScheduleDetailModal(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
