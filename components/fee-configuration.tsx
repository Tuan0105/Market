"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Edit, Trash2, Settings } from "lucide-react"

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // State cho form thêm loại phí mới
  const [newFeeName, setNewFeeName] = useState("")
  const [newFeeUnit, setNewFeeUnit] = useState("")
  const [newFeeMethod, setNewFeeMethod] = useState<"fixed" | "progressive" | "area">("fixed")
  const [newFeeUnitPrice, setNewFeeUnitPrice] = useState(0)
  const [newFeeAreaPrice, setNewFeeAreaPrice] = useState(0)
  const [newFeeDescription, setNewFeeDescription] = useState("")

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
      ...(newFeeMethod === "progressive" && { 
        progressiveRates: [
          { from: 0, to: 50, price: 2000 },
          { from: 51, to: 100, price: 2500 }
        ]
      })
    }

    setFeeTypes(prev => [...prev, newFee])
    
    // Reset form
    setNewFeeName("")
    setNewFeeUnit("")
    setNewFeeMethod("fixed")
    setNewFeeUnitPrice(0)
    setNewFeeAreaPrice(0)
    setNewFeeDescription("")
    setIsAddDialogOpen(false)
  }

  // Hàm xóa loại phí
  const handleDeleteFeeType = (feeId: string) => {
    setFeeTypes(prev => prev.filter(fee => fee.id !== feeId))
  }

  const getCalculationMethodText = (method: string) => {
    switch (method) {
      case "fixed":
        return "Đơn giá cố định"
      case "progressive":
        return "Lũy tiến (Bậc thang)"
      case "area":
        return "Theo diện tích"
      default:
        return method
    }
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Thêm loại phí mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm loại phí mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
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
                <Input 
                  placeholder="Ví dụ: kWh, m³, tháng..." 
                  value={newFeeUnit}
                  onChange={(e) => setNewFeeUnit(e.target.value)}
                />
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <Input 
                  placeholder="Mô tả chi tiết về loại phí này" 
                  value={newFeeDescription}
                  onChange={(e) => setNewFeeDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddFeeType}>Thêm loại phí</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fee Types List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeTypes.map((fee) => (
          <Card key={fee.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{fee.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedFee(fee)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Chỉnh sửa: {fee.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tên loại phí</label>
                          <Input defaultValue={fee.name} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị tính</label>
                          <Input defaultValue={fee.unit} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phương pháp tính</label>
                          <Select defaultValue={fee.calculationMethod}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">Đơn giá cố định</SelectItem>
                              <SelectItem value="progressive">Lũy tiến (Bậc thang)</SelectItem>
                              <SelectItem value="area">Theo diện tích</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {fee.calculationMethod === "fixed" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Đơn giá ({fee.unit})</label>
                            <Input type="number" defaultValue={fee.unitPrice} />
                          </div>
                        )}
                        
                        {fee.calculationMethod === "progressive" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bậc giá</label>
                            <div className="space-y-2">
                              {fee.progressiveRates?.map((rate, index) => (
                                <div key={index} className="grid grid-cols-3 gap-2">
                                  <Input type="number" placeholder="Từ" defaultValue={rate.from} />
                                  <Input type="number" placeholder="Đến" defaultValue={rate.to} />
                                  <Input type="number" placeholder="Giá" defaultValue={rate.price} />
                                </div>
                              ))}
                              <Button variant="outline" size="sm" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm bậc giá
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {fee.calculationMethod === "area" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Đơn giá theo m²</label>
                            <Input type="number" defaultValue={fee.areaPrice} />
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                          <Input defaultValue={fee.description} />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Hủy</Button>
                          <Button>Lưu thay đổi</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
            <CardContent className="space-y-3">
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
    </div>
  )
} 