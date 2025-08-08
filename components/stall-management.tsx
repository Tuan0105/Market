"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Edit, Calendar, ArrowLeft, Trash2, MapPin } from "lucide-react"

interface StallManagementProps {
  onBack: () => void
}

interface Stall {
  id: string
  code: string
  merchantName: string
  businessType: string
  area: number
  status: "occupied" | "vacant" | "expiring"
  contractEndDate: string
  monthlyRent: number
}

type FilterStatus = "all" | "occupied" | "vacant" | "expiring"

export function StallManagement({ onBack }: StallManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [isAddContractModalOpen, setIsAddContractModalOpen] = useState(false)
  const [selectedStalls, setSelectedStalls] = useState<string[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewStallModalOpen, setIsViewStallModalOpen] = useState(false)
  const [isEditStallModalOpen, setIsEditStallModalOpen] = useState(false)
  const [isContractHistoryModalOpen, setIsContractHistoryModalOpen] = useState(false)
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null)
  const [editingStall, setEditingStall] = useState<Stall | null>(null)
  const [newContract, setNewContract] = useState({
    code: "",
    merchantName: "",
    businessType: "",
    area: 0,
    monthlyRent: 0,
    contractEndDate: "",
    status: "vacant" as const
  })

  // Sample merchants data (sẽ được đồng bộ với Hồ sơ tiểu thương)
  const merchants = [
    { id: "1", name: "Nguyễn Thị Lan", stallId: "A01" },
    { id: "2", name: "Trần Văn Hùng", stallId: "B01" },
    { id: "3", name: "Lê Thị Mai", stallId: "B02" },
    { id: "4", name: "Phạm Văn Nam", stallId: "C02" },
    { id: "5", name: "Hoàng Thị Hoa", stallId: "D01" },
    { id: "6", name: "Vũ Đình Long", stallId: "D02" },
  ]

  // Sample data - chuyển thành state để có thể thêm mới
  const [stalls, setStalls] = useState<Stall[]>([
    {
      id: "1",
      code: "A01",
      merchantName: "Nguyễn Thị Lan",
      businessType: "Thực phẩm tươi sống",
      area: 12,
      status: "occupied",
      contractEndDate: "2025-12-31",
      monthlyRent: 5000000,
    },
    {
      id: "2",
      code: "A02",
      merchantName: "",
      businessType: "",
      area: 15,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 6000000,
    },
    {
      id: "3",
      code: "B01",
      merchantName: "Trần Văn Hùng",
      businessType: "Gia vị, nước chấm",
      area: 10,
      status: "expiring",
      contractEndDate: "2025-09-15",
      monthlyRent: 4500000,
    },
    {
      id: "4",
      code: "B02",
      merchantName: "Lê Thị Mai",
      businessType: "Rau củ quả",
      area: 8,
      status: "occupied",
      contractEndDate: "2026-03-20",
      monthlyRent: 4000000,
    },
    {
      id: "5",
      code: "C01",
      merchantName: "",
      businessType: "",
      area: 20,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 8000000,
    },
    {
      id: "6",
      code: "C02",
      merchantName: "Phạm Văn Nam",
      businessType: "Thịt tươi",
      area: 18,
      status: "occupied",
      contractEndDate: "2025-11-30",
      monthlyRent: 7500000,
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "occupied":
        return <Badge className="bg-green-100 text-green-800">Đang cho thuê</Badge>
      case "vacant":
        return <Badge className="bg-gray-100 text-gray-800">Còn trống</Badge>
      case "expiring":
        return <Badge className="bg-orange-100 text-orange-800">Sắp hết hạn</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const filteredStalls = stalls.filter((stall) => {
    const matchesSearch = 
      stall.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stall.merchantName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filterStatus === "all" || 
      stall.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getFilterCount = (status: FilterStatus) => {
    if (status === "all") return stalls.length
    return stalls.filter(stall => stall.status === status).length
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
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Gian hàng</h1>
            <p className="text-gray-600">Quản lý thông tin gian hàng và hợp đồng thuê</p>
          </div>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddContractModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Hợp đồng mới
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc và Tìm kiếm</CardTitle>
          <CardDescription>Tìm kiếm và lọc gian hàng theo trạng thái</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              Tất cả ({getFilterCount("all")})
            </Button>
            <Button
              variant={filterStatus === "occupied" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("occupied")}
            >
              Đang cho thuê ({getFilterCount("occupied")})
            </Button>
            <Button
              variant={filterStatus === "vacant" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("vacant")}
            >
              Còn trống ({getFilterCount("vacant")})
            </Button>
            <Button
              variant={filterStatus === "expiring" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("expiring")}
            >
              Sắp hết hợp đồng ({getFilterCount("expiring")})
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo mã gian hàng hoặc tên tiểu thương..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Market Map Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Sơ đồ Chợ
          </CardTitle>
          <CardDescription>Bản đồ trực quan các gian hàng và khu vực</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-auto bg-gray-50 rounded-lg border-2 border-gray-200" style={{ height: "400px" }}>
            <div className="relative p-6">
              {/* Market Zones */}
              <div className="grid grid-cols-3 gap-6">
                {/* Zone A - Food */}
                <div className="bg-green-500 rounded-lg p-4 text-white shadow-lg">
                  <div className="text-center mb-3">
                    <h3 className="font-bold text-lg">Khu A</h3>
                    <p className="text-sm opacity-90">Thực phẩm tươi sống</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white bg-opacity-20 rounded p-2 text-center text-xs">
                      <div className="font-bold">A01</div>
                      <div className="opacity-90">Nguyễn Thị Lan</div>
                    </div>
                    <div className="bg-gray-300 bg-opacity-30 rounded p-2 text-center text-xs">
                      <div className="font-bold">A02</div>
                      <div className="opacity-90">Còn trống</div>
                    </div>
                  </div>
                </div>

                {/* Zone B - Vegetables */}
                <div className="bg-lime-500 rounded-lg p-4 text-white shadow-lg">
                  <div className="text-center mb-3">
                    <h3 className="font-bold text-lg">Khu B</h3>
                    <p className="text-sm opacity-90">Rau củ quả</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white bg-opacity-20 rounded p-2 text-center text-xs">
                      <div className="font-bold">B01</div>
                      <div className="opacity-90">Trần Văn Hùng</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded p-2 text-center text-xs">
                      <div className="font-bold">B02</div>
                      <div className="opacity-90">Lê Thị Mai</div>
                    </div>
                  </div>
                </div>

                {/* Zone C - Mixed */}
                <div className="bg-blue-500 rounded-lg p-4 text-white shadow-lg">
                  <div className="text-center mb-3">
                    <h3 className="font-bold text-lg">Khu C</h3>
                    <p className="text-sm opacity-90">Hỗn hợp</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-300 bg-opacity-30 rounded p-2 text-center text-xs">
                      <div className="font-bold">C01</div>
                      <div className="opacity-90">Còn trống</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded p-2 text-center text-xs">
                      <div className="font-bold">C02</div>
                      <div className="opacity-90">Phạm Văn Nam</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Đang cho thuê</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span>Còn trống</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span>Sắp hết hạn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stalls Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Danh sách Gian hàng</CardTitle>
              <CardDescription>
                Hiển thị {filteredStalls.length} gian hàng
              </CardDescription>
            </div>
            {selectedStalls.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Đã chọn {selectedStalls.length} gian hàng
                </span>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa đã chọn
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedStalls.length === filteredStalls.length && filteredStalls.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStalls(filteredStalls.map(s => s.id))
                        } else {
                          setSelectedStalls([])
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Mã Gian hàng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tên Tiểu thương</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ngành hàng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Diện tích (m²)</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ngày hết hạn HĐ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredStalls.map((stall) => (
                  <tr key={stall.id} className={`border-b hover:bg-gray-50 ${
                    selectedStalls.includes(stall.id) ? 'bg-blue-50' : ''
                  }`}>
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedStalls.includes(stall.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStalls([...selectedStalls, stall.id])
                          } else {
                            setSelectedStalls(selectedStalls.filter(id => id !== stall.id))
                          }
                        }}
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{stall.code}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {stall.merchantName || "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {stall.businessType || "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{stall.area}</td>
                    <td className="py-3 px-4">{getStatusBadge(stall.status)}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {formatDate(stall.contractEndDate)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedStall(stall)
                            setIsViewStallModalOpen(true)
                          }}
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setEditingStall(stall)
                            setIsEditStallModalOpen(true)
                          }}
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedStall(stall)
                            setIsContractHistoryModalOpen(true)
                          }}
                          title="Lịch sử hợp đồng"
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStalls.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy gian hàng nào phù hợp với bộ lọc
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Contract Modal */}
      <Dialog open={isAddContractModalOpen} onOpenChange={setIsAddContractModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm Hợp đồng mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Chọn tiểu thương</Label>
                <Select
                  value={newContract.merchantName || "none"}
                  onValueChange={(value) => {
                    const selectedMerchant = merchants.find(m => m.name === value)
                    setNewContract({
                      ...newContract, 
                      merchantName: value === "none" ? "" : value,
                      code: selectedMerchant?.stallId || ""
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tiểu thương..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Chưa có tiểu thương</SelectItem>
                    {merchants.map((merchant) => (
                      <SelectItem key={merchant.id} value={merchant.name}>
                        {merchant.name} - {merchant.stallId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Mã gian hàng</Label>
                <Input
                  value={newContract.code}
                  onChange={(e) => setNewContract({...newContract, code: e.target.value})}
                  placeholder="VD: A01, B02..."
                  disabled={newContract.merchantName !== ""}
                />
              </div>
              <div>
                <Label>Ngành hàng</Label>
                <Input
                  value={newContract.businessType}
                  onChange={(e) => setNewContract({...newContract, businessType: e.target.value})}
                  placeholder="VD: Thực phẩm, Rau củ..."
                />
              </div>
              <div>
                <Label>Diện tích (m²)</Label>
                <Input
                  type="number"
                  value={newContract.area}
                  onChange={(e) => setNewContract({...newContract, area: parseInt(e.target.value) || 0})}
                  placeholder="Nhập diện tích..."
                />
              </div>
              <div>
                <Label>Tiền thuê/tháng (VND)</Label>
                <Input
                  type="number"
                  value={newContract.monthlyRent}
                  onChange={(e) => setNewContract({...newContract, monthlyRent: parseInt(e.target.value) || 0})}
                  placeholder="Nhập tiền thuê..."
                />
              </div>
              <div>
                <Label>Ngày hết hạn hợp đồng</Label>
                <Input
                  type="date"
                  value={newContract.contractEndDate}
                  onChange={(e) => setNewContract({...newContract, contractEndDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Trạng thái</Label>
                <Select
                  value={newContract.status}
                  onValueChange={(value) => setNewContract({...newContract, status: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="occupied">Đang cho thuê</SelectItem>
                    <SelectItem value="vacant">Còn trống</SelectItem>
                    <SelectItem value="expiring">Sắp hết hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddContractModalOpen(false)
                  setNewContract({
                    code: "",
                    merchantName: "",
                    businessType: "",
                    area: 0,
                    monthlyRent: 0,
                    contractEndDate: "",
                    status: "vacant"
                  })
                }}
              >
                Hủy
              </Button>
                             <Button 
                 onClick={() => {
                   // Thêm logic lưu hợp đồng mới
                   if (newContract.code && newContract.area > 0) {
                     const newStall: Stall = {
                       id: String(stalls.length + 1),
                       code: newContract.code,
                       merchantName: newContract.merchantName,
                       businessType: newContract.businessType,
                       area: newContract.area,
                       status: newContract.status,
                       contractEndDate: newContract.contractEndDate,
                       monthlyRent: newContract.monthlyRent,
                     }
                     
                     setStalls([...stalls, newStall])
                     
                     // Reset form
                     setNewContract({
                       code: "",
                       merchantName: "",
                       businessType: "",
                       area: 0,
                       monthlyRent: 0,
                       contractEndDate: "",
                       status: "vacant"
                     })
                     
                     setIsAddContractModalOpen(false)
                   }
                 }}
               >
                 Thêm hợp đồng
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Stall Details Modal */}
      <Dialog open={isViewStallModalOpen} onOpenChange={setIsViewStallModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Gian hàng</DialogTitle>
          </DialogHeader>
          {selectedStall && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600">Mã gian hàng</Label>
                    <p className="font-medium text-lg">{selectedStall.code}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Tên tiểu thương</Label>
                    <p className="font-medium">{selectedStall.merchantName || "Chưa có tiểu thương"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Ngành hàng</Label>
                    <p className="font-medium">{selectedStall.businessType || "Chưa xác định"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Diện tích</Label>
                    <p className="font-medium">{selectedStall.area} m²</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600">Trạng thái</Label>
                    <div className="mt-1">{getStatusBadge(selectedStall.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Ngày hết hạn hợp đồng</Label>
                    <p className="font-medium">{formatDate(selectedStall.contractEndDate)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Phí thuê hàng tháng</Label>
                    <p className="font-medium">{formatCurrency(selectedStall.monthlyRent)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Thời gian còn lại</Label>
                    <p className="font-medium">
                      {selectedStall.contractEndDate ? 
                        `${Math.floor((new Date(selectedStall.contractEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ngày` : 
                        "Không có hợp đồng"
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewStallModalOpen(false)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Stall Modal */}
      <Dialog open={isEditStallModalOpen} onOpenChange={setIsEditStallModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin gian hàng</DialogTitle>
          </DialogHeader>
          {editingStall && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Mã gian hàng</Label>
                  <Input
                    value={editingStall.code}
                    onChange={(e) => setEditingStall({...editingStall, code: e.target.value})}
                    placeholder="VD: A01, B02..."
                  />
                </div>
                <div>
                  <Label>Tên tiểu thương</Label>
                  <Input
                    value={editingStall.merchantName}
                    onChange={(e) => setEditingStall({...editingStall, merchantName: e.target.value})}
                    placeholder="Nhập tên tiểu thương..."
                  />
                </div>
                <div>
                  <Label>Ngành hàng</Label>
                  <Input
                    value={editingStall.businessType}
                    onChange={(e) => setEditingStall({...editingStall, businessType: e.target.value})}
                    placeholder="VD: Thực phẩm, Rau củ..."
                  />
                </div>
                <div>
                  <Label>Diện tích (m²)</Label>
                  <Input
                    type="number"
                    value={editingStall.area}
                    onChange={(e) => setEditingStall({...editingStall, area: parseInt(e.target.value) || 0})}
                    placeholder="Nhập diện tích..."
                  />
                </div>
                <div>
                  <Label>Phí thuê/tháng (VND)</Label>
                  <Input
                    type="number"
                    value={editingStall.monthlyRent}
                    onChange={(e) => setEditingStall({...editingStall, monthlyRent: parseInt(e.target.value) || 0})}
                    placeholder="Nhập phí thuê..."
                  />
                </div>
                <div>
                  <Label>Ngày hết hạn hợp đồng</Label>
                  <Input
                    type="date"
                    value={editingStall.contractEndDate}
                    onChange={(e) => setEditingStall({...editingStall, contractEndDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Trạng thái</Label>
                  <Select
                    value={editingStall.status}
                    onValueChange={(value) => setEditingStall({...editingStall, status: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="occupied">Đang cho thuê</SelectItem>
                      <SelectItem value="vacant">Còn trống</SelectItem>
                      <SelectItem value="expiring">Sắp hết hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditStallModalOpen(false)
                    setEditingStall(null)
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  onClick={() => {
                    if (editingStall && editingStall.code && editingStall.area > 0) {
                      const updatedStalls = stalls.map(stall => 
                        stall.id === editingStall.id ? editingStall : stall
                      )
                      setStalls(updatedStalls)
                      setIsEditStallModalOpen(false)
                      setEditingStall(null)
                    }
                  }}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contract History Modal */}
      <Dialog open={isContractHistoryModalOpen} onOpenChange={setIsContractHistoryModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Lịch sử Hợp đồng - {selectedStall?.code}</DialogTitle>
          </DialogHeader>
          {selectedStall && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Thông tin hợp đồng hiện tại</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Tiểu thương</Label>
                    <p className="font-medium">{selectedStall.merchantName || "Chưa có"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Ngày hết hạn</Label>
                    <p className="font-medium">{formatDate(selectedStall.contractEndDate)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Phí thuê</Label>
                    <p className="font-medium">{formatCurrency(selectedStall.monthlyRent)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Lịch sử hợp đồng của gian hàng {selectedStall.code}</h4>
                <div className="space-y-3">
                  {/* Sample contract history data for this specific stall */}
                  {selectedStall.merchantName ? (
                    <>
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{selectedStall.merchantName}</p>
                            <p className="text-sm text-gray-600">
                              {selectedStall.contractEndDate ? 
                                `01/01/${new Date(selectedStall.contractEndDate).getFullYear()} - ${formatDate(selectedStall.contractEndDate)}` : 
                                "Chưa có ngày kết thúc"
                              }
                            </p>
                            <p className="text-sm text-gray-600">Phí thuê: {formatCurrency(selectedStall.monthlyRent)}/tháng</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Đang hoạt động</Badge>
                        </div>
                      </div>
                      
                      {/* Previous contracts for this stall */}
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Nguyễn Văn A</p>
                            <p className="text-sm text-gray-600">01/01/2023 - 31/12/2023</p>
                            <p className="text-sm text-gray-600">Phí thuê: 4,500,000 VND/tháng</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Trần Thị B</p>
                            <p className="text-sm text-gray-600">01/01/2022 - 31/12/2022</p>
                            <p className="text-sm text-gray-600">Phí thuê: 4,000,000 VND/tháng</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Gian hàng này chưa có lịch sử hợp đồng</p>
                      <p className="text-sm mt-2">Chưa có tiểu thương nào thuê gian hàng này</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsContractHistoryModalOpen(false)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Xác nhận xóa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa {selectedStalls.length} gian hàng đã chọn? 
              Hành động này không thể hoàn tác.
            </p>
            
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-700 font-medium">Gian hàng sẽ bị xóa:</p>
              <div className="mt-2 space-y-1">
                {stalls
                  .filter(stall => selectedStalls.includes(stall.id))
                  .map(stall => (
                    <div key={stall.id} className="text-sm text-red-600">
                      • {stall.code} - {stall.merchantName || "Chưa có tiểu thương"}
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteModalOpen(false)
                }}
              >
                Hủy
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  // Xóa các gian hàng đã chọn
                  const updatedStalls = stalls.filter(
                    stall => !selectedStalls.includes(stall.id)
                  )
                  setStalls(updatedStalls)
                  
                  // Reset selected stalls
                  setSelectedStalls([])
                  
                  setIsDeleteModalOpen(false)
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa vĩnh viễn
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 