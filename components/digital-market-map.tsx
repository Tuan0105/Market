"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  Trash2,
  Eye,
  ChevronUp,
  ChevronDown
} from "lucide-react"
import { StallManagementDetail } from "./stall-management-detail"
import { useStallData, Stall, Zone, Floor, MarketConfig } from "@/lib/stall-data-context"

interface DigitalMarketMapProps {
  onBack: () => void
  onNavigateToStallManagement?: (zone: Zone, floorId: string) => void
}

export function DigitalMarketMap({ onBack, onNavigateToStallManagement }: DigitalMarketMapProps) {
  const { 
    marketConfig, 
    setMarketConfig, 
    updateStallInZone, 
    deleteStallFromZone,
    syncStallData 
  } = useStallData()

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
  const [showLivePreview, setShowLivePreview] = useState(true)
  
  // New state for stall management detail page
  const [isStallManagementDetailOpen, setIsStallManagementDetailOpen] = useState(false)
  const [currentZone, setCurrentZone] = useState<Zone | null>(null)
  const [currentFloorId, setCurrentFloorId] = useState<string>("")

  // New state for map navigation
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 })
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // New state for tooltip
  const [tooltip, setTooltip] = useState<{
    show: boolean
    content: string
    x: number
    y: number
  }>({
    show: false,
    content: "",
    x: 0,
    y: 0
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
    if (onNavigateToStallManagement) {
      const floor = marketConfig.floors.find(f => 
        f.zones.some(z => z.id === zone.id)
      )
      if (floor) {
        onNavigateToStallManagement(zone, floor.id)
      }
    } else {
      // Navigate to detail page instead of modal
      const floor = marketConfig.floors.find(f => 
        f.zones.some(z => z.id === zone.id)
      )
      if (floor) {
        setCurrentZone(zone)
        setCurrentFloorId(floor.id)
        setIsStallManagementDetailOpen(true)
      }
    }
  }

  const handleUpdateZone = (updatedZone: Zone) => {
    const updatedFloors = marketConfig.floors.map(f => 
      f.id === currentFloorId 
        ? {
            ...f,
            zones: f.zones.map(z => 
              z.id === updatedZone.id 
                ? updatedZone
                : z
            )
          }
        : f
    )

    setMarketConfig({
      ...marketConfig,
      floors: updatedFloors
    })

    // Update current zone state
    setCurrentZone(updatedZone)
  }

  const handleBackFromStallManagement = () => {
    setIsStallManagementDetailOpen(false)
    setCurrentZone(null)
    setCurrentFloorId("")
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

  // If stall management detail is open, show that page
  if (isStallManagementDetailOpen && currentZone) {
    return (
      <StallManagementDetail
        zone={currentZone}
        floorId={currentFloorId}
        onBack={handleBackFromStallManagement}
        onUpdateZone={handleUpdateZone}
      />
    )
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showLivePreview ? "Ẩn xem trước" : "Hiện xem trước"}
            </Button>
            <Button
              onClick={handleSaveConfig}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu và Xem sơ đồ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
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
            <Card>
              <CardHeader>
                <CardTitle>Cấu hình Tầng và Khu vực</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketConfig.floors.map((floor) => (
                  <div key={floor.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{floor.name}</h3>
                      <Button
                        size="sm"
                        onClick={() => handleAddZone(floor.id)}
                        className="flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Thêm khu vực
                      </Button>
                    </div>
                    
                    {floor.zones.map((zone) => (
                      <div key={zone.id} className="border rounded-lg p-4 mb-3">
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
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
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
                            <Label>Màu sắc</Label>
                            <Input
                              type="color"
                              value={zone.color}
                              onChange={(e) => {
                                const updatedFloors = marketConfig.floors.map(f => 
                                  f.id === floor.id 
                                    ? {
                                        ...f,
                                        zones: f.zones.map(z => 
                                          z.id === zone.id 
                                            ? { ...z, color: e.target.value }
                                            : z
                                        )
                                      }
                                    : f
                                )
                                setMarketConfig({...marketConfig, floors: updatedFloors})
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Live Preview Panel */}
          {showLivePreview && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Xem trước trực tiếp
                  </CardTitle>
                  <CardDescription>
                    Sơ đồ sẽ cập nhật ngay lập tức khi bạn thay đổi cấu hình
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Floor Selector for Preview */}
                  <div className="mb-4">
                    <Label className="text-sm font-medium text-gray-700">Chọn tầng để xem:</Label>
                    <Select 
                      value={selectedFloor} 
                      onValueChange={setSelectedFloor}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {marketConfig.floors.map((floor) => (
                          <SelectItem key={floor.id} value={floor.id}>
                            {floor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative overflow-auto bg-gray-50 rounded-lg border-2 border-gray-200" style={{ height: "500px" }}>
                    <div className="relative p-6">
                      {/* Market Zones - Frame, Name, and Stalls */}
                      {marketConfig.floors
                        .find(f => f.id === selectedFloor)
                        ?.zones.map((zone) => {
                        // Calculate zone position based on zone index (horizontal layout)
                        const currentFloor = marketConfig.floors.find(f => f.id === selectedFloor)
                        const zoneIndex = currentFloor?.zones.indexOf(zone) || 0
                        const zonesPerRow = 2 // 2 zones per row for preview
                        const row = Math.floor(zoneIndex / zonesPerRow)
                        const col = zoneIndex % zonesPerRow
                        const zoneX = 50 + col * 300
                        const zoneY = 50 + row * 200
                        
                        // Calculate dynamic zone size based on number of stalls
                        const stallsPerRow = Math.floor((250 - 30) / (35 + 6)) // Calculate stalls per row
                        const totalRows = Math.ceil(zone.stalls.length / stallsPerRow)
                        const zoneWidth = 250 // Fixed width for preview
                        const zoneHeight = Math.max(120, 25 + 15 + totalRows * (25 + 6) + 16) // Dynamic height with padding
                        
                        return (
                          <div
                            key={zone.id}
                            className="absolute border-2 border-gray-300 rounded-lg bg-white shadow-lg"
                            style={{
                              left: zoneX,
                              top: zoneY,
                              width: zoneWidth,
                              height: zoneHeight,
                              backgroundColor: zone.color + '20' // Add transparency
                            }}
                          >
                            {/* Zone Header */}
                            <div 
                              className="text-center py-2 px-3 border-b border-gray-300"
                              style={{ backgroundColor: zone.color + '40' }}
                            >
                              <h3 className="font-bold text-sm text-gray-800">{zone.name}</h3>
                              <p className="text-xs text-gray-600">{zone.stalls.length} gian hàng</p>
                            </div>
                            
                            {/* Stalls Grid */}
                            <div className="p-3">
                              <div className="grid gap-1" style={{
                                gridTemplateColumns: `repeat(${stallsPerRow}, 1fr)`,
                                gridTemplateRows: `repeat(${totalRows}, 1fr)`
                              }}>
                                {zone.stalls.map((stall, stallIndex) => (
                                  <div
                                    key={stall.id}
                                    className={`
                                      border rounded text-xs text-center p-1 cursor-pointer transition-all
                                      ${stall.status === 'occupied' ? 'bg-green-500 text-white' : ''}
                                      ${stall.status === 'vacant' ? 'bg-gray-300 text-gray-700' : ''}
                                      ${stall.status === 'expiring' ? 'bg-yellow-500 text-white' : ''}
                                      ${stall.status === 'maintenance' ? 'bg-red-500 text-white' : ''}
                                    `}
                                    title={`${stall.code} - ${stall.merchantName || 'Chưa có tiểu thương'}`}
                                  >
                                    {stall.code}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      
                      {/* Show message if no zones in selected floor */}
                      {marketConfig.floors.find(f => f.id === selectedFloor)?.zones.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <p className="text-lg font-medium">Chưa có khu vực nào</p>
                            <p className="text-sm">Hãy thêm khu vực cho {marketConfig.floors.find(f => f.id === selectedFloor)?.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Preview Legend */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Chú thích:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Đang thuê</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-300 rounded"></div>
                        <span>Còn trống</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span>Sắp hết hạn</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Bảo trì</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Stall Management Modal - Keep as fallback */}
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

  // Mouse navigation handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true)
      setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setMapOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)))
  }

  // Tooltip handlers
  const handleStallMouseEnter = (e: React.MouseEvent, stall: Stall) => {
    const tooltipContent = `
      <div class="space-y-1">
        <div class="font-semibold">${stall.code}</div>
        <div>Tiểu thương: ${stall.merchantName || 'Chưa có'}</div>
        <div>Ngành hàng: ${stall.businessType || 'Chưa xác định'}</div>
        <div>Hết hạn: ${formatDate(stall.contractEndDate || "")}</div>
        <div>Trạng thái: ${getStatusText(stall.status)}</div>
      </div>
    `
    setTooltip({
      show: true,
      content: tooltipContent,
      x: e.clientX + 10,
      y: e.clientY - 10
    })
  }

  const handleStallMouseLeave = () => {
    setTooltip({ show: false, content: "", x: 0, y: 0 })
  }

  // Handle edit from detail modal
  const handleEditFromDetail = () => {
    if (selectedStall) {
      // Find the zone containing this stall
      const floor = marketConfig.floors.find(f => 
        f.zones.some(z => z.stalls.some(s => s.id === selectedStall.id))
      )
      const zone = floor?.zones.find(z => 
        z.stalls.some(s => s.id === selectedStall.id)
      )
      
      if (zone && floor) {
        // Switch to config mode and navigate to stall management
        setIsConfigMode(true)
        setCurrentZone(zone)
        setCurrentFloorId(floor.id)
        setIsStallManagementDetailOpen(true)
        setIsDetailModalOpen(false)
      }
    }
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
            onClick={() => {
              setZoom(1)
              setMapOffset({ x: 0, y: 0 })
            }}
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
          <div 
            ref={mapContainerRef}
            className="relative overflow-hidden bg-gray-50 rounded-lg border-2 border-gray-200 cursor-grab active:cursor-grabbing" 
            style={{ height: "600px" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <div 
              className="relative"
              style={{ 
                transform: `scale(${zoom}) translate(${mapOffset.x}px, ${mapOffset.y}px)`,
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
                          onMouseEnter={(e) => handleStallMouseEnter(e, stall)}
                          onMouseLeave={handleStallMouseLeave}
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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Chú thích
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLegend(false)}
                className="h-8 w-8"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
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
                  <div>• Hover để xem thông tin nhanh</div>
                  <div>• Kéo chuột để di chuyển bản đồ</div>
                  <div>• Cuộn chuột để phóng to/thu nhỏ</div>
                  <div>• Dùng bộ lọc để tìm gian hàng cụ thể</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 bg-black text-white text-xs rounded-lg p-3 shadow-lg pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            maxWidth: "250px"
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
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
                <Button onClick={handleEditFromDetail}>
                  <Edit className="w-4 h-4 mr-2" />
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