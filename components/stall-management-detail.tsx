"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react"
import { useStallData, Stall, Zone } from "@/lib/stall-data-context"

interface StallManagementDetailProps {
  zone: Zone
  floorId: string
  onBack: () => void
  onUpdateZone: (updatedZone: Zone) => void
}

export function StallManagementDetail({ zone, floorId, onBack, onUpdateZone }: StallManagementDetailProps) {
  const { updateStallInZone, deleteStallFromZone } = useStallData()
  
  const [editingStall, setEditingStall] = useState<Stall | null>(null)
  const [isAddingStall, setIsAddingStall] = useState(false)
  const [newStall, setNewStall] = useState<Partial<Stall>>({
    code: "",
    area: 12,
    monthlyRent: 5000000,
    merchantName: "",
    businessType: "",
    status: "vacant",
    category: zone.category
  })

  const handleAddStall = () => {
    if (!newStall.code) return

    const stallId = `${zone.id}${String(zone.stalls.length + 1).padStart(2, '0')}`
    const stall: Stall = {
      id: stallId,
      code: newStall.code,
      x: 0,
      y: 0,
      width: 40,
      height: 30,
      merchantName: newStall.merchantName || "",
      businessType: newStall.businessType || "",
      status: newStall.status as any || "vacant",
      category: zone.category,
      monthlyRent: newStall.monthlyRent || 5000000,
      area: newStall.area || 12,
      contractEndDate: newStall.contractEndDate
    }

    // Update both context and local state
    updateStallInZone(floorId, zone.id, stallId, stall)
    
    const updatedZone = {
      ...zone,
      stalls: [...zone.stalls, stall]
    }
    onUpdateZone(updatedZone)
    
    setIsAddingStall(false)
    setNewStall({
      code: "",
      area: 12,
      monthlyRent: 5000000,
      merchantName: "",
      businessType: "",
      status: "vacant",
      category: zone.category
    })
  }

  const handleUpdateStall = () => {
    if (!editingStall) return

    // Update both context and local state
    updateStallInZone(floorId, zone.id, editingStall.id, editingStall)
    
    const updatedZone = {
      ...zone,
      stalls: zone.stalls.map(stall => 
        stall.id === editingStall.id ? editingStall : stall
      )
    }

    onUpdateZone(updatedZone)
    setEditingStall(null)
  }

  const handleDeleteStall = (stallId: string) => {
    // Update both context and local state
    deleteStallFromZone(floorId, zone.id, stallId)
    
    const updatedZone = {
      ...zone,
      stalls: zone.stalls.filter(stall => stall.id !== stallId)
    }

    onUpdateZone(updatedZone)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied": return "bg-green-100 text-green-800"
      case "vacant": return "bg-gray-100 text-gray-800"
      case "expiring": return "bg-yellow-100 text-yellow-800"
      case "maintenance": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
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
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Gian hàng - {zone.name}</h1>
            <p className="text-gray-600">Quản lý chi tiết các gian hàng trong khu vực</p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddingStall(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm gian hàng
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{zone.stalls.length}</div>
            <div className="text-sm text-gray-600">Tổng gian hàng</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {zone.stalls.filter(s => s.status === "occupied").length}
            </div>
            <div className="text-sm text-gray-600">Đang thuê</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {zone.stalls.filter(s => s.status === "vacant").length}
            </div>
            <div className="text-sm text-gray-600">Còn trống</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {zone.stalls.filter(s => s.status === "expiring").length}
            </div>
            <div className="text-sm text-gray-600">Sắp hết hạn</div>
          </CardContent>
        </Card>
      </div>

      {/* Stalls Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Gian hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã gian hàng</TableHead>
                <TableHead>Diện tích (m²)</TableHead>
                <TableHead>Tiền thuê/tháng</TableHead>
                <TableHead>Tiểu thương</TableHead>
                <TableHead>Ngành hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày hết hạn</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zone.stalls.map((stall) => (
                <TableRow key={stall.id}>
                  <TableCell className="font-medium">{stall.code}</TableCell>
                  <TableCell className="text-right">{stall.area}</TableCell>
                  <TableCell>{formatCurrency(stall.monthlyRent)}</TableCell>
                  <TableCell>{stall.merchantName || "Chưa có"}</TableCell>
                  <TableCell>{stall.businessType || "Chưa xác định"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(stall.status)}>
                      {getStatusText(stall.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{stall.contractEndDate || "Chưa có"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingStall(stall)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteStall(stall.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Stall Dialog */}
      {isAddingStall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Thêm gian hàng mới</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddingStall(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Mã gian hàng</Label>
                <Input
                  value={newStall.code}
                  onChange={(e) => setNewStall({...newStall, code: e.target.value})}
                  placeholder="Nhập mã gian hàng..."
                />
              </div>
              
              <div>
                <Label>Diện tích (m²)</Label>
                <Input
                  type="number"
                  value={newStall.area}
                  onChange={(e) => setNewStall({...newStall, area: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <Label>Tiền thuê/tháng (VND)</Label>
                <Input
                  type="number"
                  value={newStall.monthlyRent}
                  onChange={(e) => setNewStall({...newStall, monthlyRent: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <Label>Trạng thái</Label>
                <Select
                  value={newStall.status}
                  onValueChange={(value) => setNewStall({...newStall, status: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacant">Còn trống</SelectItem>
                    <SelectItem value="occupied">Đang thuê</SelectItem>
                    <SelectItem value="expiring">Sắp hết hạn</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsAddingStall(false)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddStall}
                className="flex-1"
              >
                Thêm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Stall Dialog */}
      {editingStall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chỉnh sửa gian hàng {editingStall.code}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingStall(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Mã gian hàng</Label>
                <Input
                  value={editingStall.code}
                  onChange={(e) => setEditingStall({...editingStall, code: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Diện tích (m²)</Label>
                <Input
                  type="number"
                  value={editingStall.area}
                  onChange={(e) => setEditingStall({...editingStall, area: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <Label>Tiền thuê/tháng (VND)</Label>
                <Input
                  type="number"
                  value={editingStall.monthlyRent}
                  onChange={(e) => setEditingStall({...editingStall, monthlyRent: parseInt(e.target.value) || 0})}
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
                  placeholder="Nhập ngành hàng..."
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
                    <SelectItem value="occupied">Đang thuê</SelectItem>
                    <SelectItem value="vacant">Còn trống</SelectItem>
                    <SelectItem value="expiring">Sắp hết hạn</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Ngày hết hạn hợp đồng</Label>
                <Input
                  type="date"
                  value={editingStall.contractEndDate || ""}
                  onChange={(e) => setEditingStall({...editingStall, contractEndDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditingStall(null)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                onClick={handleUpdateStall}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
