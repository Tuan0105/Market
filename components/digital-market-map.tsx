"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  MapPin, 
  ArrowLeft,
  Settings,
  Plus,
  Save,
  Edit,
  Trash2
} from "lucide-react"

interface DigitalMarketMapProps {
  onBack: () => void
}

interface MarketConfig {
  name: string
  floors: Floor[]
}

interface Floor {
  id: string
  name: string
  zones: Zone[]
}

interface Zone {
  id: string
  name: string
  category: string
  color: string
  stalls: Stall[]
}

interface Stall {
  id: string
  code: string
  x: number
  y: number
  width: number
  height: number
  merchantName: string
  businessType: string
  status: "occupied" | "vacant" | "expiring" | "maintenance"
  category: string
  monthlyRent: number
  area: number
  contractEndDate?: string
}

export function DigitalMarketMap({ onBack }: DigitalMarketMapProps) {
  const [isConfigMode, setIsConfigMode] = useState(true)
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isStallModalOpen, setIsStallModalOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<Zone | null>(null)
  const [zoom, setZoom] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showLegend, setShowLegend] = useState(true)
  const [selectedFloor, setSelectedFloor] = useState<string>("1")

  // Market configuration state
  const [marketConfig, setMarketConfig] = useState<MarketConfig>({
    name: "Chợ Trung Tâm",
    floors: [
      {
        id: "1",
        name: "Tầng 1",
        zones: [
          {
            id: "A",
            name: "Khu A - Thực phẩm tươi sống",
            category: "food",
            color: "#10b981",
            stalls: [
              { id: "A01", code: "A01", x: 80, y: 80, width: 40, height: 30, merchantName: "Nguyễn Thị Lan", businessType: "Thực phẩm tươi sống", status: "occupied", category: "food", monthlyRent: 5000000, area: 12, contractEndDate: "2025-12-31" },
              { id: "A02", code: "A02", x: 140, y: 80, width: 40, height: 30, merchantName: "", businessType: "", status: "vacant", category: "food", monthlyRent: 5500000, area: 12 },
            ]
          },
          {
            id: "B",
            name: "Khu B - Rau củ quả",
            category: "vegetables",
            color: "#84cc16",
            stalls: [
              { id: "B01", code: "B01", x: 430, y: 80, width: 35, height: 25, merchantName: "Nguyễn Thị Mai", businessType: "Rau củ quả", status: "occupied", category: "vegetables", monthlyRent: 3500000, area: 8, contractEndDate: "2025-11-30" },
            ]
          }
        ]
      }
    ]
  })

  // Update editingZone when marketConfig changes
  React.useEffect(() => {
    if (editingZone && isStallModalOpen) {
      const currentFloor = marketConfig.floors.find(f => 
        f.zones.some(z => z.id === editingZone.id)
      )
      const updatedZone = currentFloor?.zones.find(z => z.id === editingZone.id)
      if (updatedZone) {
        setEditingZone(updatedZone)
      }
    }
  }, [marketConfig, editingZone, isStallModalOpen])

  // Calculate automatic positioning for stalls within zone boundaries
  const calculateStallPosition = (zone: Zone, stallIndex: number) => {
    const stallWidth = 40
    const stallHeight = 30
    const gap = 8 // Reduced gap between stalls
    const padding = 15 // Reduced padding from zone edges
    
    // Get current floor data to calculate zone position correctly
    const currentFloor = marketConfig.floors.find(f => f.id === selectedFloor)
    const zones = currentFloor?.zones || []
    
    // Calculate zone position based on zone index (same logic as render)
    const zoneIndex = zones.indexOf(zone)
    const zonesPerRow = 3 // 3 zones per row
    const row = Math.floor(zoneIndex / zonesPerRow)
    const col = zoneIndex % zonesPerRow
    const zoneX = 50 + col * 350
    const zoneY = 50 + row * 250
    
    // Calculate how many stalls can fit in one row
    const availableWidth = 280 - 2 * padding // Zone width minus padding
    const stallsPerRow = Math.floor(availableWidth / (stallWidth + gap))
    
    // Position stalls horizontally in rows
    const stallRow = Math.floor(stallIndex / stallsPerRow)
    const stallCol = stallIndex % stallsPerRow
    
    const result = {
      x: zoneX + padding + stallCol * (stallWidth + gap),
      y: zoneY + 25 + stallRow * (stallHeight + gap), // +25 for zone name space
      width: stallWidth,
      height: stallHeight
    }
    
    return result
  }

  // Get current floor data with calculated positions
  const currentFloor = marketConfig.floors.find(f => f.id === selectedFloor)
  const zones = currentFloor?.zones || []

  const stalls = currentFloor?.zones.flatMap(zone => 
    zone.stalls.map((stall, index) => {
      const position = calculateStallPosition(zone, index)
      return {
        ...stall,
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height
      }
    })
  ) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied": return "bg-green-500"
      case "vacant": return "bg-gray-300"
      case "expiring": return "bg-orange-500"
      case "maintenance": return "bg-red-500"
      default: return "bg-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "occupied": return "Đang thuê"
      case "vacant": return "Còn trống"
      case "expiring": return "Sắp hết hạn"
      case "maintenance": return "Bảo trì"
      default: return "Không xác định"
    }
  }

  const filteredStalls = stalls.filter(stall => {
    const matchesSearch = 
      stall.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stall.merchantName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === "all" || stall.category === filterCategory
    const matchesStatus = filterStatus === "all" || stall.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleStallClick = (stall: Stall) => {
    setSelectedStall(stall)
    setIsDetailModalOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const handleSaveConfig = () => {
    console.log("Saving market config:", marketConfig)
    setIsConfigMode(false)
  }

  const handleAddFloor = () => {
    const newFloorId = (marketConfig.floors.length + 1).toString()
    const newFloor: Floor = {
      id: newFloorId,
      name: `Tầng ${newFloorId}`,
      zones: []
    }
    setMarketConfig({
      ...marketConfig,
      floors: [...marketConfig.floors, newFloor]
    })
  }

  const handleAddZone = (floorId: string) => {
    const floor = marketConfig.floors.find(f => f.id === floorId)
    if (!floor) return

    const zoneId = String.fromCharCode(65 + floor.zones.length)
    const newZone: Zone = {
      id: zoneId,
      name: `Khu ${zoneId} - Khu vực mới`,
      category: "food",
      color: "#10b981",
      stalls: []
    }

    const updatedFloors = marketConfig.floors.map(f => 
      f.id === floorId 
        ? { ...f, zones: [...f.zones, newZone] }
        : f
    )

    setMarketConfig({
      ...marketConfig,
      floors: updatedFloors
    })
  }

  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone)
    setIsStallModalOpen(true)
  }

  const handleAddStall = (zoneId: string, floorId: string) => {
    const floor = marketConfig.floors.find(f => f.id === floorId)
    const zone = floor?.zones.find(z => z.id === zoneId)
    if (!floor || !zone) return

    const newStallId = `${zoneId}${String(zone.stalls.length + 1).padStart(2, '0')}`
    const newStall: Stall = {
      id: newStallId,
      code: newStallId,
      x: 0, // Will be calculated automatically
      y: 0, // Will be calculated automatically
      width: 40,
      height: 30,
      merchantName: "",
      businessType: "",
      status: "vacant",
      category: zone.category,
      monthlyRent: 5000000,
      area: 12
    }

    const updatedFloors = marketConfig.floors.map(f => 
      f.id === floorId 
        ? {
            ...f,
            zones: f.zones.map(z => 
              z.id === zoneId 
                ? { ...z, stalls: [...z.stalls, newStall] }
                : z
            )
          }
        : f
    )

    setMarketConfig({
      ...marketConfig,
      floors: updatedFloors
    })

    // Scroll to the new stall after a short delay to ensure DOM is updated
    setTimeout(() => {
      const newStallElement = document.getElementById(`stall-${newStallId}`)
      if (newStallElement) {
        newStallElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }
    }, 100)
  }

  if (isConfigMode) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
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
              <h1 className="text-2xl font-bold text-gray-900">Cấu hình Sơ đồ Chợ</h1>
              <p className="text-gray-600">Thiết lập cấu trúc chợ và gian hàng</p>
            </div>
          </div>
          <Button
            onClick={handleSaveConfig}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Lưu và Xem sơ đồ
          </Button>
        </div>

        {/* Market Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Thông tin Chợ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marketName">Tên chợ</Label>
                <Input
                  id="marketName"
                  value={marketConfig.name}
                  onChange={(e) => setMarketConfig({...marketConfig, name: e.target.value})}
                  placeholder="Nhập tên chợ..."
                />
              </div>
              <div>
                <Label>Số tầng</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-600">{marketConfig.floors.length} tầng</span>
                  <Button
                    size="sm"
                    onClick={handleAddFloor}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm tầng
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floors Configuration */}
        <div className="space-y-4">
          {marketConfig.floors.map((floor) => (
            <Card key={floor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span>🏢</span>
                    {floor.name}
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => handleAddZone(floor.id)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm khu vực
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {floor.zones.map((zone) => (
                    <div key={zone.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: zone.color }}
                          ></div>
                          <span className="font-medium">{zone.name}</span>
                          <Badge variant="outline">{zone.stalls.length} gian hàng</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditZone(zone)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Quản lý gian hàng
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddStall(zone.id, floor.id)}
                            className="flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Thêm gian hàng
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Tên khu vực</Label>
                          <Input
                            value={zone.name}
                            onChange={(e) => {
                              const updatedFloors = marketConfig.floors.map(f => 
                                f.id === floor.id 
                                  ? {
                                      ...f,
                                      zones: f.zones.map(z => 
                                        z.id === zone.id 
                                          ? { ...z, name: e.target.value }
                                          : z
                                      )
                                    }
                                  : f
                              )
                              setMarketConfig({...marketConfig, floors: updatedFloors})
                            }}
                          />
                        </div>
                        <div>
                          <Label>Loại hàng</Label>
                          <Select
                            value={zone.category}
                            onValueChange={(value) => {
                              const updatedFloors = marketConfig.floors.map(f => 
                                f.id === floor.id 
                                  ? {
                                      ...f,
                                      zones: f.zones.map(z => 
                                        z.id === zone.id 
                                          ? { ...z, category: value }
                                          : z
                                      )
                                    }
                                  : f
                              )
                              setMarketConfig({...marketConfig, floors: updatedFloors})
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="food">Thực phẩm</SelectItem>
                              <SelectItem value="vegetables">Rau củ</SelectItem>
                              <SelectItem value="meat">Thịt</SelectItem>
                              <SelectItem value="seafood">Hải sản</SelectItem>
                              <SelectItem value="spices">Gia vị</SelectItem>
                              <SelectItem value="beverages">Đồ uống</SelectItem>
                              <SelectItem value="household">Gia dụng</SelectItem>
                              <SelectItem value="services">Dịch vụ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Màu sắc</Label>
                          <div className="flex gap-2 mt-2">
                            {["#10b981", "#84cc16", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#6b7280", "#ec4899"].map((color) => (
                              <button
                                key={color}
                                className={`w-6 h-6 rounded border-2 ${
                                  zone.color === color ? "border-gray-900" : "border-gray-300"
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  const updatedFloors = marketConfig.floors.map(f => 
                                    f.id === floor.id 
                                      ? {
                                          ...f,
                                          zones: f.zones.map(z => 
                                            z.id === zone.id 
                                              ? { ...z, color }
                                              : z
                                          )
                                        }
                                      : f
                                  )
                                  setMarketConfig({...marketConfig, floors: updatedFloors})
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {floor.zones.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có khu vực nào. Hãy thêm khu vực đầu tiên!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stall Management Modal */}
        <Dialog open={isStallModalOpen} onOpenChange={setIsStallModalOpen}>
          <DialogContent className="w-[95vw] h-[90vh] max-w-none overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Quản lý Gian hàng - {editingZone?.name}</DialogTitle>
            </DialogHeader>
            {editingZone && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-gray-600">
                    Tổng: {editingZone.stalls.length} gian hàng
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {
                      const floor = marketConfig.floors.find(f => 
                        f.zones.some(z => z.id === editingZone.id)
                      )
                      if (floor) {
                        handleAddStall(editingZone.id, floor.id)
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm gian hàng
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-8 p-6">
                  {editingZone.stalls.map((stall, index) => (
                    <div 
                      key={stall.id} 
                      id={`stall-${stall.id}`}
                      className="border-2 border-gray-200 rounded-lg p-6 w-[400px] bg-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg">{stall.code}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const floor = marketConfig.floors.find(f => 
                              f.zones.some(z => z.id === editingZone.id)
                            )
                            if (floor) {
                              const updatedFloors = marketConfig.floors.map(f => 
                                f.id === floor.id 
                                  ? {
                                      ...f,
                                      zones: f.zones.map(z => 
                                        z.id === editingZone.id 
                                          ? { ...z, stalls: z.stalls.filter(s => s.id !== stall.id) }
                                          : z
                                      )
                                    }
                                  : f
                              )
                              setMarketConfig({...marketConfig, floors: updatedFloors})
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <Label>Mã gian hàng</Label>
                          <Input
                            value={stall.code}
                            onChange={(e) => {
                              const floor = marketConfig.floors.find(f => 
                                f.zones.some(z => z.id === editingZone.id)
                              )
                              if (floor) {
                                const updatedFloors = marketConfig.floors.map(f => 
                                  f.id === floor.id 
                                    ? {
                                        ...f,
                                        zones: f.zones.map(z => 
                                          z.id === editingZone.id 
                                            ? {
                                                ...z,
                                                stalls: z.stalls.map(s => 
                                                  s.id === stall.id 
                                                    ? { ...s, code: e.target.value }
                                                    : s
                                                )
                                              }
                                            : z
                                        )
                                      }
                                    : f
                                )
                                setMarketConfig({...marketConfig, floors: updatedFloors})
                              }
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label>Diện tích (m²)</Label>
                          <Input
                            type="number"
                            value={stall.area}
                            onChange={(e) => {
                              const floor = marketConfig.floors.find(f => 
                                f.zones.some(z => z.id === editingZone.id)
                              )
                              if (floor) {
                                const updatedFloors = marketConfig.floors.map(f => 
                                  f.id === floor.id 
                                    ? {
                                        ...f,
                                        zones: f.zones.map(z => 
                                          z.id === editingZone.id 
                                            ? {
                                                ...z,
                                                stalls: z.stalls.map(s => 
                                                  s.id === stall.id 
                                                    ? { ...s, area: parseInt(e.target.value) || 0 }
                                                    : s
                                                )
                                              }
                                            : z
                                        )
                                      }
                                    : f
                                )
                                setMarketConfig({...marketConfig, floors: updatedFloors})
                              }
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label>Tiền thuê/tháng (VND)</Label>
                          <Input
                            type="number"
                            value={stall.monthlyRent}
                            onChange={(e) => {
                              const floor = marketConfig.floors.find(f => 
                                f.zones.some(z => z.id === editingZone.id)
                              )
                              if (floor) {
                                const updatedFloors = marketConfig.floors.map(f => 
                                  f.id === floor.id 
                                    ? {
                                        ...f,
                                        zones: f.zones.map(z => 
                                          z.id === editingZone.id 
                                            ? {
                                                ...z,
                                                stalls: z.stalls.map(s => 
                                                  s.id === stall.id 
                                                    ? { ...s, monthlyRent: parseInt(e.target.value) || 0 }
                                                    : s
                                                )
                                              }
                                            : z
                                        )
                                      }
                                    : f
                                )
                                setMarketConfig({...marketConfig, floors: updatedFloors})
                              }
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label>Tên tiểu thương</Label>
                          <Select
                            value={stall.merchantName || "none"}
                            onValueChange={(value) => {
                              const floor = marketConfig.floors.find(f => 
                                f.zones.some(z => z.id === editingZone.id)
                              )
                              if (floor) {
                                const updatedFloors = marketConfig.floors.map(f => 
                                  f.id === floor.id 
                                    ? {
                                        ...f,
                                        zones: f.zones.map(z => 
                                          z.id === editingZone.id 
                                            ? {
                                                ...z,
                                                stalls: z.stalls.map(s => 
                                                  s.id === stall.id 
                                                    ? { ...s, merchantName: value === "none" ? "" : value }
                                                    : s
                                                )
                                              }
                                            : z
                                        )
                                      }
                                    : f
                                )
                                setMarketConfig({...marketConfig, floors: updatedFloors})
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tiểu thương..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Chưa có tiểu thương</SelectItem>
                              <SelectItem value="Nguyễn Thị Lan">Nguyễn Thị Lan</SelectItem>
                              <SelectItem value="Trần Văn Hùng">Trần Văn Hùng</SelectItem>
                              <SelectItem value="Lê Thị Mai">Lê Thị Mai</SelectItem>
                              <SelectItem value="Phạm Văn Nam">Phạm Văn Nam</SelectItem>
                              <SelectItem value="Hoàng Thị Hoa">Hoàng Thị Hoa</SelectItem>
                              <SelectItem value="Vũ Đình Long">Vũ Đình Long</SelectItem>
                              <SelectItem value="Ngô Thị Bình">Ngô Thị Bình</SelectItem>
                              <SelectItem value="Đỗ Văn Minh">Đỗ Văn Minh</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Ngành hàng</Label>
                          <Input
                            value={stall.businessType}
                            onChange={(e) => {
                              const floor = marketConfig.floors.find(f => 
                                f.zones.some(z => z.id === editingZone.id)
                              )
                              if (floor) {
                                const updatedFloors = marketConfig.floors.map(f => 
                                  f.id === floor.id 
                                    ? {
                                        ...f,
                                        zones: f.zones.map(z => 
                                          z.id === editingZone.id 
                                            ? {
                                                ...z,
                                                stalls: z.stalls.map(s => 
                                                  s.id === stall.id 
                                                    ? { ...s, businessType: e.target.value }
                                                    : s
                                                )
                                              }
                                            : z
                                        )
                                      }
                                    : f
                                )
                                setMarketConfig({...marketConfig, floors: updatedFloors})
                              }
                            }}
                            placeholder="Nhập ngành hàng..."
                          />
                        </div>
                        
                        <div>
                          <Label>Ngày hết hạn hợp đồng</Label>
                          <Input
                            type="date"
                            value={stall.contractEndDate || ""}
                            onChange={(e) => {
                              const floor = marketConfig.floors.find(f => 
                                f.zones.some(z => z.id === editingZone.id)
                              )
                              if (floor) {
                                const updatedFloors = marketConfig.floors.map(f => 
                                  f.id === floor.id 
                                    ? {
                                        ...f,
                                        zones: f.zones.map(z => 
                                          z.id === editingZone.id 
                                            ? {
                                                ...z,
                                                stalls: z.stalls.map(s => 
                                                  s.id === stall.id 
                                                    ? { ...s, contractEndDate: e.target.value }
                                                    : s
                                                )
                                              }
                                            : z
                                        )
                                      }
                                    : f
                                )
                                setMarketConfig({...marketConfig, floors: updatedFloors})
                              }
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label>Trạng thái</Label>
                          <Select
                            value={stall.status}
                            onValueChange={(value) => {
                              const floor = marketConfig.floors.find(f => 
                                f.zones.some(z => z.id === editingZone.id)
                              )
                              if (floor) {
                                const updatedFloors = marketConfig.floors.map(f => 
                                  f.id === floor.id 
                                    ? {
                                        ...f,
                                        zones: f.zones.map(z => 
                                          z.id === editingZone.id 
                                            ? {
                                                ...z,
                                                stalls: z.stalls.map(s => 
                                                  s.id === stall.id 
                                                    ? { ...s, status: value as any }
                                                    : s
                                                )
                                              }
                                            : z
                                        )
                                      }
                                    : f
                                )
                                setMarketConfig({...marketConfig, floors: updatedFloors})
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="occupied">Đang thuê</SelectItem>
                              <SelectItem value="vacant">Còn trống</SelectItem>
                              <SelectItem value="expiring">Sắp hết hạn</SelectItem>
                              <SelectItem value="maintenance">Bảo trì</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsStallModalOpen(false)}>
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
            <h1 className="text-2xl font-bold text-gray-900">Sơ đồ Chợ số hóa</h1>
            <p className="text-gray-600">Bản đồ 2D trực quan quản lý gian hàng</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsConfigMode(true)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Cấu hình
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(1)}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Floor Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label>Tầng:</Label>
            <div className="flex gap-2">
              {marketConfig.floors.map((floor) => (
                <Button
                  key={floor.id}
                  variant={selectedFloor === floor.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFloor(floor.id)}
                >
                  {floor.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Điều khiển & Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm gian hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khu vực</SelectItem>
                <SelectItem value="food">Thực phẩm tươi sống</SelectItem>
                <SelectItem value="vegetables">Rau củ quả</SelectItem>
                <SelectItem value="meat">Thịt tươi</SelectItem>
                <SelectItem value="seafood">Hải sản</SelectItem>
                <SelectItem value="spices">Gia vị & Nước chấm</SelectItem>
                <SelectItem value="beverages">Đồ uống & Giải khát</SelectItem>
                <SelectItem value="household">Hàng gia dụng</SelectItem>
                <SelectItem value="services">Dịch vụ</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="occupied">Đang thuê</SelectItem>
                <SelectItem value="vacant">Còn trống</SelectItem>
                <SelectItem value="expiring">Sắp hết hạn</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowLegend(!showLegend)}
              className="flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              {showLegend ? "Ẩn" : "Hiện"} chú thích
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Market Map */}
      <Card>
        <CardContent className="p-6">
          <div className="relative overflow-auto bg-gray-50 rounded-lg border-2 border-gray-200" style={{ height: "600px" }}>
            <div 
              className="relative"
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: "top left"
              }}
            >
              {/* Market Zones - Frame, Name, and Stalls */}
                             {zones.map((zone) => {
                 // Calculate zone position based on zone index (horizontal layout)
                 const zoneIndex = zones.indexOf(zone)
                 const zonesPerRow = 3 // 3 zones per row
                 const row = Math.floor(zoneIndex / zonesPerRow)
                 const col = zoneIndex % zonesPerRow
                 const zoneX = 50 + col * 350
                 const zoneY = 50 + row * 250
                 
                 // Calculate dynamic zone size based on number of stalls
                 const stallsPerRow = Math.floor((280 - 30) / (40 + 8)) // Calculate stalls per row
                 const totalRows = Math.ceil(zone.stalls.length / stallsPerRow)
                 const zoneWidth = 280 // Fixed width
                 const zoneHeight = Math.max(140, 25 + 15 + totalRows * (30 + 8) + 16) // Dynamic height with padding
                
                return (
                                     <div
                     key={`zone-${zone.id}`}
                     className="absolute border-2 border-white shadow-lg rounded-lg overflow-hidden"
                     style={{
                       left: `${zoneX}px`,
                       top: `${zoneY}px`,
                       width: `${zoneWidth}px`,
                       height: `${zoneHeight}px`,
                       backgroundColor: zone.color,
                       zIndex: 5,
                       padding: "8px 0 8px 0", // Thêm padding trên dưới
                     }}
                   >
                                         {/* Zone Name inside frame, top */}
                     <div className="w-full h-6 flex flex-col items-center justify-center bg-opacity-80 mt-1" style={{backgroundColor: zone.color}}>
                       <div className="font-bold text-white leading-none text-sm">{zone.id}</div>
                       <div className="text-xs text-white opacity-90 leading-none">{zone.name.split(' - ')[1]}</div>
                     </div>
                    {/* Stalls in zone */}
                    {zone.stalls && Array.isArray(zone.stalls) && zone.stalls.length > 0 && zone.stalls.map((stall, idx) => {
                      const pos = calculateStallPosition(zone, idx)
                      return (
                        <div
                          key={stall.id}
                          className={`absolute border-2 border-white shadow-md rounded cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center text-white text-xs font-medium`}
                                                     style={{
                             left: `${pos.x - zoneX}px`,
                             top: `${pos.y - zoneY + 24}px`, // 24px là chiều cao tên khu (reduced)
                             width: `${pos.width}px`,
                             height: `${pos.height}px`,
                             zIndex: 10,
                           }}
                          onClick={() => handleStallClick(stall)}
                        >
                          <div className={`w-full h-full ${getStatusColor(stall.status)} rounded flex flex-col items-center justify-center p-1`}>
                            <div className="font-bold">{stall.code}</div>
                            {stall.merchantName && (
                              <div className="text-xs opacity-90 truncate w-full text-center">
                                {stall.merchantName}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      {showLegend && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Chú thích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Trạng thái gian hàng:</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm">Đang thuê</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span className="text-sm">Còn trống</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-sm">Sắp hết hạn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm">Bảo trì</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Khu vực:</h4>
                <div className="space-y-1">
                  {zones.map((zone) => (
                    <div key={zone.id} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: zone.color }}
                      ></div>
                      <span className="text-sm">{zone.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Thống kê:</h4>
                <div className="space-y-1 text-sm">
                  <div>Tổng gian hàng: {stalls.length}</div>
                  <div>Đang thuê: {stalls.filter(s => s.status === "occupied").length}</div>
                  <div>Còn trống: {stalls.filter(s => s.status === "vacant").length}</div>
                  <div>Sắp hết hạn: {stalls.filter(s => s.status === "expiring").length}</div>
                  <div>Bảo trì: {stalls.filter(s => s.status === "maintenance").length}</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Hướng dẫn:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>• Click vào gian hàng để xem chi tiết</div>
                  <div>• Sử dụng nút zoom để phóng to/thu nhỏ</div>
                  <div>• Dùng bộ lọc để tìm gian hàng cụ thể</div>
                  <div>• Màu sắc thể hiện trạng thái gian hàng</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết Gian hàng</DialogTitle>
          </DialogHeader>
          {selectedStall && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Thông tin cơ bản</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã gian hàng:</span>
                      <span className="font-medium">{selectedStall.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diện tích:</span>
                      <span className="font-medium">{selectedStall.area} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiền thuê/tháng:</span>
                      <span className="font-medium">{formatCurrency(selectedStall.monthlyRent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <Badge className={getStatusColor(selectedStall.status)}>
                        {getStatusText(selectedStall.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Thông tin thuê</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tên tiểu thương:</span>
                      <span className="font-medium">{selectedStall.merchantName || "Chưa có"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngành hàng:</span>
                      <span className="font-medium">{selectedStall.businessType || "Chưa có"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày hết hạn:</span>
                      <span className="font-medium">{formatDate(selectedStall.contractEndDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Đóng
                </Button>
                <Button>
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 