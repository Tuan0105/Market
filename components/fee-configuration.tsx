"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ArrowLeft, Plus, Edit, Trash2, Settings, Zap, Droplets, Building2, Trash, Car, Wifi, Shield, X } from "lucide-react"

interface FeeType {
  id: string
  name: string
  unit: string
  calculationMethod: "fixed" | "progressive" | "area"
  unitPrice?: number
  progressiveRates?: Array<{
    from: number
    to: number
    price: number
  }>
  areaPrice?: number
  description: string
}

export function FeeConfiguration({ onBack }: { onBack: () => void }) {
  const [selectedFee, setSelectedFee] = useState<FeeType | null>(null)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // State cho form thêm loại phí mới
  const [newFeeName, setNewFeeName] = useState("")
  const [newFeeUnit, setNewFeeUnit] = useState("")
  const [newFeeMethod, setNewFeeMethod] = useState<"fixed" | "progressive" | "area">("fixed")
  const [newFeeUnitPrice, setNewFeeUnitPrice] = useState(0)
  const [newFeeAreaPrice, setNewFeeAreaPrice] = useState(0)
  const [newFeeDescription, setNewFeeDescription] = useState("")
  const [newFeeProgressiveRates, setNewFeeProgressiveRates] = useState<Array<{from: number, to: number, price: number}>>([
    { from: 0, to: 50, price: 2000 },
    { from: 51, to: 100, price: 2500 }
  ])

  // Sample data - chuyển thành state để có thể thêm/xóa
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([
    {
      id: "electricity",
      name: "Phí Điện",
      unit: "kWh",
      calculationMethod: "progressive",
      progressiveRates: [
        { from: 0, to: 50, price: 2000 },
        { from: 51, to: 100, price: 2500 },
        { from: 101, to: 200, price: 3000 },
        { from: 201, to: 999999, price: 3500 }
      ],
      description: "Phí điện theo chỉ số đồng hồ"
    },
    {
      id: "water",
      name: "Phí Nước",
      unit: "m³",
      calculationMethod: "fixed",
      unitPrice: 15000,
      description: "Phí nước theo chỉ số đồng hồ"
    },
    {
      id: "rent",
      name: "Phí Mặt bằng",
      unit: "tháng",
      calculationMethod: "fixed",
      unitPrice: 500000,
      description: "Phí thuê mặt bằng hàng tháng"
    },
    {
      id: "sanitation",
      name: "Phí Vệ sinh",
      unit: "m²",
      calculationMethod: "area",
      areaPrice: 5000,
      description: "Phí vệ sinh theo diện tích gian hàng"
    }
  ])

  // Hàm thêm loại phí mới
  const handleAddFeeType = () => {
    if (!newFeeName || !newFeeUnit) return

    const newFee: FeeType = {
      id: `fee_${Date.now()}`,
      name: newFeeName,
      unit: newFeeUnit,
      calculationMethod: newFeeMethod,
      description: newFeeDescription,
      ...(newFeeMethod === "fixed" && { unitPrice: newFeeUnitPrice }),
      ...(newFeeMethod === "area" && { areaPrice: newFeeAreaPrice }),
      ...(newFeeMethod === "progressive" && { progressiveRates: newFeeProgressiveRates })
    }

    setFeeTypes(prev => [...prev, newFee])
    
    // Reset form
    setNewFeeName("")
    setNewFeeUnit("")
    setNewFeeMethod("fixed")
    setNewFeeUnitPrice(0)
    setNewFeeAreaPrice(0)
    setNewFeeDescription("")
    setNewFeeProgressiveRates([{ from: 0, to: 50, price: 2000 }, { from: 51, to: 100, price: 2500 }])
    setIsSidePanelOpen(false)
    setIsEditing(false)
  }

  // Hàm mở side panel để thêm mới
  const handleOpenAddPanel = () => {
    setIsEditing(false)
    setIsSidePanelOpen(true)
    // Reset form
    setNewFeeName("")
    setNewFeeUnit("")
    setNewFeeMethod("fixed")
    setNewFeeUnitPrice(0)
    setNewFeeAreaPrice(0)
    setNewFeeDescription("")
    setNewFeeProgressiveRates([{ from: 0, to: 50, price: 2000 }, { from: 51, to: 100, price: 2500 }])
  }

  // Hàm mở side panel để chỉnh sửa
  const handleOpenEditPanel = (fee: FeeType) => {
    setSelectedFee(fee)
    setIsEditing(true)
    setIsSidePanelOpen(true)
    // Fill form with current data
    setNewFeeName(fee.name)
    setNewFeeUnit(fee.unit)
    setNewFeeMethod(fee.calculationMethod)
    setNewFeeUnitPrice(fee.unitPrice || 0)
    setNewFeeAreaPrice(fee.areaPrice || 0)
    setNewFeeDescription(fee.description)
    setNewFeeProgressiveRates(fee.progressiveRates || [{ from: 0, to: 50, price: 2000 }])
  }

  // Hàm xóa loại phí
  const handleDeleteFeeType = (feeId: string) => {
    setFeeTypes(prev => prev.filter(fee => fee.id !== feeId))
  }

  // Hàm thêm bậc giá mới
  const handleAddProgressiveRate = () => {
    const lastRate = newFeeProgressiveRates[newFeeProgressiveRates.length - 1]
    const newFrom = lastRate ? lastRate.to + 1 : 0
    setNewFeeProgressiveRates([...newFeeProgressiveRates, { from: newFrom, to: newFrom + 49, price: 2000 }])
  }

  // Hàm xóa bậc giá
  const handleRemoveProgressiveRate = (index: number) => {
    setNewFeeProgressiveRates(newFeeProgressiveRates.filter((_, i) => i !== index))
  }

  // Hàm cập nhật bậc giá
  const handleUpdateProgressiveRate = (index: number, field: 'from' | 'to' | 'price', value: number) => {
    const updatedRates = [...newFeeProgressiveRates]
    updatedRates[index] = { ...updatedRates[index], [field]: value }
    setNewFeeProgressiveRates(updatedRates)
  }

  const getCalculationMethodBadge = (method: string) => {
    switch (method) {
      case "fixed":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Đơn giá cố định</Badge>
      case "progressive":
        return <Badge variant="default" className="bg-green-100 text-green-800">Lũy tiến</Badge>
      case "area":
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Theo diện tích</Badge>
      default:
        return <Badge variant="secondary">{method}</Badge>
    }
  }

  // Hàm lấy icon cho loại phí
  const getFeeIcon = (feeName: string) => {
    const name = feeName.toLowerCase()
    if (name.includes('điện') || name.includes('electricity')) return <Zap className="w-5 h-5 text-yellow-500" />
    if (name.includes('nước') || name.includes('water')) return <Droplets className="w-5 h-5 text-blue-500" />
    if (name.includes('mặt bằng') || name.includes('rent')) return <Building2 className="w-5 h-5 text-gray-500" />
    if (name.includes('vệ sinh') || name.includes('sanitation')) return <Trash className="w-5 h-5 text-green-500" />
    if (name.includes('gửi xe') || name.includes('parking')) return <Car className="w-5 h-5 text-purple-500" />
    if (name.includes('internet') || name.includes('wifi')) return <Wifi className="w-5 h-5 text-indigo-500" />
    if (name.includes('bảo hiểm') || name.includes('insurance')) return <Shield className="w-5 h-5 text-red-500" />
    return <Settings className="w-5 h-5 text-gray-500" />
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
            <h1 className="text-2xl font-bold text-gray-900">Cấu hình Phí & Dịch vụ</h1>
            <p className="text-gray-600">Thiết lập các loại phí và phương pháp tính</p>
          </div>
        </div>
        <Button className="flex items-center gap-2" onClick={handleOpenAddPanel}>
          <Plus className="w-4 h-4" />
          Thêm loại phí mới
        </Button>
      </div>

      {/* Fee Types List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeTypes.map((fee) => (
          <Card key={fee.id} className="hover:shadow-md transition-shadow min-h-[280px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFeeIcon(fee.name)}
                  <CardTitle className="text-lg">{fee.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenEditPanel(fee)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-600"
                    onClick={() => handleDeleteFeeType(fee.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Đơn vị:</span>
                <Badge variant="outline">{fee.unit}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Phương pháp:</span>
                {getCalculationMethodBadge(fee.calculationMethod)}
              </div>
              
              {fee.calculationMethod === "fixed" && (
                <div className="text-sm">
                  <span className="text-gray-600">Đơn giá: </span>
                  <span className="font-medium">{fee.unitPrice?.toLocaleString()} VND/{fee.unit}</span>
                </div>
              )}
              
              {fee.calculationMethod === "progressive" && (
                <div className="text-sm">
                  <span className="text-gray-600">Bậc giá:</span>
                  <div className="mt-1 space-y-1">
                    {fee.progressiveRates?.map((rate, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        {rate.from}-{rate.to} {fee.unit}: {rate.price.toLocaleString()} VND
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {fee.calculationMethod === "area" && (
                <div className="text-sm">
                  <span className="text-gray-600">Đơn giá: </span>
                  <span className="font-medium">{fee.areaPrice?.toLocaleString()} VND/m²</span>
                </div>
              )}
              
              <div className="text-sm text-gray-600 mt-3">
                {fee.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Hướng dẫn sử dụng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Đơn giá cố định</h4>
              <p>Áp dụng cho các loại phí có giá cố định theo đơn vị (VD: Phí nước 15.000 VND/m³)</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Lũy tiến (Bậc thang)</h4>
              <p>Áp dụng cho phí điện với nhiều bậc giá khác nhau tùy theo mức tiêu thụ</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Theo diện tích</h4>
              <p>Áp dụng cho phí vệ sinh, phí bảo trì tính theo diện tích gian hàng</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sheet for Add/Edit */}
      <Sheet open={isSidePanelOpen} onOpenChange={setIsSidePanelOpen}>
        <SheetContent side="right" className="overflow-y-auto p-0">
          <SheetHeader className="space-y-4 pb-6 border-b p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <SheetTitle className="text-xl font-bold">
                    {isEditing ? `Chỉnh sửa: ${selectedFee?.name}` : 'Thêm loại phí mới'}
                  </SheetTitle>
                  <p className="text-sm text-gray-600">
                    {isEditing ? 'Cập nhật thông tin loại phí' : 'Điền đầy đủ thông tin để tạo loại phí mới'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSidePanelOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên loại phí</label>
                  <Input 
                    placeholder="Ví dụ: Phí điện, Phí nước..." 
                    value={newFeeName}
                    onChange={(e) => setNewFeeName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị tính</label>
                  <div className="space-y-2">
                    <Select value={newFeeUnit} onValueChange={setNewFeeUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đơn vị tính phổ biến" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kWh">kWh (Kilowatt giờ)</SelectItem>
                        <SelectItem value="m³">m³ (Mét khối)</SelectItem>
                        <SelectItem value="tháng">Tháng</SelectItem>
                        <SelectItem value="m²">m² (Mét vuông)</SelectItem>
                        <SelectItem value="ngày">Ngày</SelectItem>
                        <SelectItem value="tuần">Tuần</SelectItem>
                        <SelectItem value="năm">Năm</SelectItem>
                        <SelectItem value="lần">Lần</SelectItem>
                        <SelectItem value="kg">kg (Kilogram)</SelectItem>
                        <SelectItem value="lít">Lít</SelectItem>
                        <SelectItem value="giờ">Giờ</SelectItem>
                        <SelectItem value="phút">Phút</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-gray-500">
                      Hoặc nhập đơn vị tùy chỉnh:
                    </div>
                    <Input 
                      placeholder="Nhập đơn vị tùy chỉnh..." 
                      value={newFeeUnit}
                      onChange={(e) => setNewFeeUnit(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương pháp tính</label>
                  <Select value={newFeeMethod} onValueChange={(value: "fixed" | "progressive" | "area") => setNewFeeMethod(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phương pháp tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Đơn giá cố định</SelectItem>
                      <SelectItem value="progressive">Lũy tiến (Bậc thang)</SelectItem>
                      <SelectItem value="area">Theo diện tích</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newFeeMethod === "fixed" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đơn giá ({newFeeUnit})</label>
                    <Input 
                      type="number" 
                      placeholder="Nhập đơn giá"
                      value={newFeeUnitPrice}
                      onChange={(e) => setNewFeeUnitPrice(Number(e.target.value))}
                    />
                  </div>
                )}

                {newFeeMethod === "area" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đơn giá theo m²</label>
                    <Input 
                      type="number" 
                      placeholder="Nhập đơn giá theo m²"
                      value={newFeeAreaPrice}
                      onChange={(e) => setNewFeeAreaPrice(Number(e.target.value))}
                    />
                  </div>
                )}

                {newFeeMethod === "progressive" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bậc giá</label>
                    <div className="space-y-3">
                      {/* Table Header */}
                      <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-700">
                        <div>Từ</div>
                        <div>Đến</div>
                        <div>Đơn giá (VND)</div>
                        <div></div>
                      </div>
                      
                      {/* Table Rows */}
                      {newFeeProgressiveRates.map((rate, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2">
                          <Input
                            type="number"
                            value={rate.from}
                            onChange={(e) => handleUpdateProgressiveRate(index, 'from', Number(e.target.value))}
                          />
                          <Input
                            type="number"
                            value={rate.to}
                            onChange={(e) => handleUpdateProgressiveRate(index, 'to', Number(e.target.value))}
                          />
                          <Input
                            type="number"
                            value={rate.price}
                            onChange={(e) => handleUpdateProgressiveRate(index, 'price', Number(e.target.value))}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-red-600"
                            onClick={() => handleRemoveProgressiveRate(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleAddProgressiveRate}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm bậc giá
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <Input 
                    placeholder="Mô tả chi tiết về loại phí này" 
                    value={newFeeDescription}
                    onChange={(e) => setNewFeeDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsSidePanelOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleAddFeeType}>
                    {isEditing ? 'Lưu thay đổi' : 'Thêm loại phí'}
                  </Button>
                </div>
              </div>
          </SheetContent>
        </Sheet>
    </div>
  )
}