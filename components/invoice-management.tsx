"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Eye, Bell, Trash2, Search, Filter, Download } from "lucide-react"

interface Invoice {
  id: string
  merchantName: string
  stallCode: string
  feeType: string
  amount: number
  createdDate: string
  dueDate: string
  status: "unpaid" | "paid" | "overdue" | "cancelled"
}

// Đặt khai báo invoices lên trên cùng, trước các useState
const invoices: Invoice[] = [
  {
    id: "INV-001",
    merchantName: "Nguyễn Thị Lan",
    stallCode: "A01",
    feeType: "Phí điện nước",
    amount: 150000,
    createdDate: "2025-08-01",
    dueDate: "2025-08-15",
    status: "unpaid"
  },
  {
    id: "INV-002", 
    merchantName: "Trần Văn Minh",
    stallCode: "B03",
    feeType: "Phí mặt bằng",
    amount: 500000,
    createdDate: "2025-08-01",
    dueDate: "2025-08-15",
    status: "paid"
  },
  {
    id: "INV-003",
    merchantName: "Lê Thị Hoa",
    stallCode: "C05",
    feeType: "Phí vệ sinh",
    amount: 200000,
    createdDate: "2025-08-01",
    dueDate: "2025-08-15",
    status: "overdue"
  }
]

export function InvoiceManagement({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [feeTypeFilter, setFeeTypeFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([...invoices])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showNotify, setShowNotify] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [showSingleDialog, setShowSingleDialog] = useState(false)
  // Thêm state cho loại phí bulk
  const [bulkFeeType, setBulkFeeType] = useState<string>("")
  const [bulkRows, setBulkRows] = useState([
    { stall: "A01", old: 0, new: 0, area: 10, amount: 0, checked: true },
    { stall: "A02", old: 0, new: 0, area: 12, amount: 0, checked: true },
    { stall: "A03", old: 0, new: 0, area: 8, amount: 0, checked: true },
  ])
  const FEE_CONFIG = {
    electricity: 3500, // VND/kWh
    rent: 500000,      // VND/tháng
    sanitation: 5000   // VND/m2
  }

  // State cho popup hóa đơn lẻ
  const [singleMerchant, setSingleMerchant] = useState("")
  const [singleStall, setSingleStall] = useState("")
  const [singleFeeType, setSingleFeeType] = useState("")
  const [singleAmount, setSingleAmount] = useState(0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unpaid":
        return <Badge variant="secondary">Chưa thanh toán</Badge>
      case "paid":
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã thanh toán</Badge>
      case "overdue":
        return <Badge variant="destructive">Quá hạn</Badge>
      case "cancelled":
        return <Badge variant="outline">Đã hủy</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredInvoices = invoiceList.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.stallCode.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    const matchesFeeType = feeTypeFilter === "all" || invoice.feeType === feeTypeFilter
    
    return matchesSearch && matchesStatus && matchesFeeType
  })

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
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Hóa đơn</h1>
            <p className="text-gray-600">Tạo và quản lý hóa đơn thu phí</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" onClick={() => setShowBulkDialog(true)}>
                <Plus className="w-4 h-4" />
                Tạo Hóa đơn Hàng loạt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Tạo Hóa đơn Hàng loạt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại phí</label>
                    <Select value={bulkFeeType} onValueChange={val => { setBulkFeeType(val); setBulkRows(rows => rows.map(r => ({ ...r, old: 0, new: 0, area: 0, amount: 0, checked: true })) ) }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại phí" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electricity">Phí điện nước</SelectItem>
                        <SelectItem value="rent">Phí mặt bằng</SelectItem>
                        <SelectItem value="sanitation">Phí vệ sinh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kỳ thanh toán</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kỳ thanh toán" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-08">Tháng 08/2025</SelectItem>
                        <SelectItem value="2025-09">Tháng 09/2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Button size="sm" variant="outline" onClick={() => setBulkRows(rows => rows.map(r => ({ ...r, checked: true })))}>Chọn tất cả</Button>
                  <Button size="sm" variant="outline" onClick={() => setBulkRows(rows => rows.map(r => ({ ...r, checked: false })))}>Bỏ chọn tất cả</Button>
                </div>
                {/* Header grid */}
                <div className={`grid grid-cols-6 gap-2 text-sm font-medium text-gray-600`}>
                  <span></span>
                  <span>Gian hàng</span>
                  {bulkFeeType === "electricity" && (<><span>Chỉ số cũ</span><span>Chỉ số mới</span></>)}
                  {bulkFeeType === "sanitation" && <span>Diện tích (m²)</span>}
                  {bulkFeeType === "rent" && <span></span>}
                  <span>Thành tiền</span>
                  <span></span>
                </div>
                {bulkRows.map((row, idx) => (
                  <div key={row.stall} className={`grid grid-cols-6 gap-2 items-center`}>
                    <input type="checkbox" checked={row.checked} onChange={e => setBulkRows(rows => rows.map((r, i) => i === idx ? { ...r, checked: e.target.checked } : r))} />
                    <span className="text-sm">{row.stall}</span>
                    {bulkFeeType === "electricity" && <>
                      <Input type="number" value={row.old} min={0} className="h-8" onChange={e => {
                        const val = Number(e.target.value)
                        setBulkRows(rows => rows.map((r, i) => i === idx ? { ...r, old: val, amount: Math.max(row.new - val, 0) * FEE_CONFIG.electricity } : r))
                      }} />
                      <Input type="number" value={row.new} min={0} className="h-8" onChange={e => {
                        const val = Number(e.target.value)
                        setBulkRows(rows => rows.map((r, i) => i === idx ? { ...r, new: val, amount: Math.max(val - row.old, 0) * FEE_CONFIG.electricity } : r))
                      }} />
                    </>}
                    {bulkFeeType === "sanitation" && <Input type="number" value={row.area} min={0} className="h-8" onChange={e => {
                      const val = Number(e.target.value)
                      setBulkRows(rows => rows.map((r, i) => i === idx ? { ...r, area: val, amount: val * FEE_CONFIG.sanitation } : r))
                    }} />}
                    {bulkFeeType === "rent" && <span></span>}
                    <span className="text-sm text-gray-600">
                      {bulkFeeType === "electricity" && `${row.amount.toLocaleString()} VND`}
                      {bulkFeeType === "sanitation" && `${row.amount.toLocaleString()} VND`}
                      {bulkFeeType === "rent" && `${FEE_CONFIG.rent.toLocaleString()} VND`}
                    </span>
                    <div className="flex justify-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => setBulkRows(rows => rows.filter((_, i) => i !== idx))}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowBulkDialog(false)}>Hủy</Button>
                <Button onClick={() => {
                  // Thêm hóa đơn mẫu vào danh sách
                  const newInvoices: Invoice[] = bulkRows.filter(r => r.checked).map(row => {
                    let amount = 0
                    if (bulkFeeType === "electricity") amount = row.amount
                    else if (bulkFeeType === "sanitation") amount = row.amount
                    else if (bulkFeeType === "rent") amount = FEE_CONFIG.rent
                    return {
                      id: `INV-${invoiceList.length + 1}`,
                      merchantName: "Hàng loạt",
                      stallCode: row.stall,
                      feeType: bulkFeeType === "electricity" ? "Phí điện nước" : bulkFeeType === "sanitation" ? "Phí vệ sinh" : "Phí mặt bằng",
                      amount,
                      createdDate: "2025-08-01",
                      dueDate: "2025-08-15",
                      status: "unpaid" as const
                    }
                  })
                  setInvoiceList(list => [...list, ...newInvoices])
                  setShowBulkDialog(false)
                }}>Xác nhận tạo</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showSingleDialog} onOpenChange={setShowSingleDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowSingleDialog(true)}>
                <Plus className="w-4 h-4" />
                Tạo Hóa đơn Lẻ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo Hóa đơn Lẻ</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiểu thương</label>
                  <Select value={singleMerchant} onValueChange={val => {
                    setSingleMerchant(val)
                    if (val === "merchant1") { setSingleStall("A01") }
                    else if (val === "merchant2") { setSingleStall("B03") }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tiểu thương" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="merchant1">Nguyễn Thị Lan - A01</SelectItem>
                      <SelectItem value="merchant2">Trần Văn Minh - B03</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại phí</label>
                  <Select value={singleFeeType} onValueChange={setSingleFeeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại phí" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">Phí điện nước</SelectItem>
                      <SelectItem value="rent">Phí mặt bằng</SelectItem>
                      <SelectItem value="sanitation">Phí vệ sinh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số tiền</label>
                  <Input type="number" placeholder="Nhập số tiền" value={singleAmount} onChange={e => setSingleAmount(Number(e.target.value))} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSingleDialog(false)}>Hủy</Button>
                  <Button onClick={() => {
                    setInvoiceList(list => [
                      ...list,
                      {
                        id: `INV-${list.length + 1}`,
                        merchantName: singleMerchant === "merchant1" ? "Nguyễn Thị Lan" : singleMerchant === "merchant2" ? "Trần Văn Minh" : "",
                        stallCode: singleStall,
                        feeType: singleFeeType === "electricity" ? "Phí điện nước" : singleFeeType === "sanitation" ? "Phí vệ sinh" : "Phí mặt bằng",
                        amount: singleAmount,
                        createdDate: "2025-08-01",
                        dueDate: "2025-08-15",
                        status: "unpaid"
                      }
                    ])
                    setShowSingleDialog(false)
                    setSingleMerchant("")
                    setSingleStall("")
                    setSingleFeeType("")
                    setSingleAmount(0)
                  }}>Tạo hóa đơn</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Mã HĐ, tên tiểu thương, mã gian hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                  <SelectItem value="overdue">Quá hạn</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại phí</label>
              <Select value={feeTypeFilter} onValueChange={setFeeTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả loại phí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Phí điện nước">Phí điện nước</SelectItem>
                  <SelectItem value="Phí mặt bằng">Phí mặt bằng</SelectItem>
                  <SelectItem value="Phí vệ sinh">Phí vệ sinh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tháng/Năm</label>
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tháng/năm" />
                </SelectTrigger>
                                 <SelectContent>
                   <SelectItem value="all">Tất cả</SelectItem>
                   <SelectItem value="2025-08">08/2025</SelectItem>
                   <SelectItem value="2025-07">07/2025</SelectItem>
                   <SelectItem value="2025-06">06/2025</SelectItem>
                 </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách Hóa đơn</CardTitle>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Xuất Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Mã HĐ</th>
                  <th className="text-left py-3 px-4 font-medium">Tiểu thương</th>
                  <th className="text-left py-3 px-4 font-medium">Gian hàng</th>
                  <th className="text-left py-3 px-4 font-medium">Loại phí</th>
                  <th className="text-left py-3 px-4 font-medium">Số tiền</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày tạo</th>
                  <th className="text-left py-3 px-4 font-medium">Hạn thanh toán</th>
                  <th className="text-left py-3 px-4 font-medium">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{invoice.id}</td>
                    <td className="py-3 px-4">{invoice.merchantName}</td>
                    <td className="py-3 px-4">{invoice.stallCode}</td>
                    <td className="py-3 px-4">{invoice.feeType}</td>
                    <td className="py-3 px-4">{invoice.amount.toLocaleString()} VND</td>
                    <td className="py-3 px-4">{invoice.createdDate}</td>
                    <td className="py-3 px-4">{invoice.dueDate}</td>
                    <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedInvoice(invoice); setShowDetail(true) }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedInvoice(invoice); setShowNotify(true) }}>
                          <Bell className="w-4 h-4" />
                        </Button>
                        {invoice.status === "unpaid" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => { setSelectedInvoice(invoice); setShowCancel(true) }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết hóa đơn</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-2">
              <div><b>Mã HĐ:</b> {selectedInvoice.id}</div>
              <div><b>Tiểu thương:</b> {selectedInvoice.merchantName}</div>
              <div><b>Gian hàng:</b> {selectedInvoice.stallCode}</div>
              <div><b>Loại phí:</b> {selectedInvoice.feeType}</div>
              <div><b>Số tiền:</b> {selectedInvoice.amount.toLocaleString()} VND</div>
              <div><b>Ngày tạo:</b> {selectedInvoice.createdDate}</div>
              <div><b>Hạn thanh toán:</b> {selectedInvoice.dueDate}</div>
              <div><b>Trạng thái:</b> {getStatusBadge(selectedInvoice.status)}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showNotify} onOpenChange={setShowNotify}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gửi lại thông báo</DialogTitle>
          </DialogHeader>
          <div>Bạn có chắc chắn muốn gửi lại thông báo cho hóa đơn <b>{selectedInvoice?.id}</b> không?</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowNotify(false)}>Hủy</Button>
            <Button onClick={() => setShowNotify(false)}>Gửi</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showCancel} onOpenChange={setShowCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy hóa đơn</DialogTitle>
          </DialogHeader>
          <div>Bạn có chắc chắn muốn hủy hóa đơn <b>{selectedInvoice?.id}</b> không?</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowCancel(false)}>Không</Button>
            <Button onClick={() => {
              if (selectedInvoice) {
                setInvoiceList(list => list.map(inv => inv.id === selectedInvoice.id ? { ...inv, status: "cancelled" } : inv))
              }
              setShowCancel(false)
            }}>Hủy hóa đơn</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 