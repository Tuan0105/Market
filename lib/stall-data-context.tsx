"use client"

import { createContext, ReactNode, useContext, useState } from "react"

export interface Stall {
  id: string
  code: string
  merchantName: string
  businessType: string
  area: number
  status: "occupied" | "vacant" | "expiring" | "maintenance"
  contractEndDate?: string
  monthlyRent: number
  category?: string
  x?: number
  y?: number
  width?: number
  height?: number
  // Thêm thông tin cho Tài chính và Hồ sơ tiểu thương
  phone?: string
  email?: string
  address?: string
  idNumber?: string
  contractStartDate?: string
  depositAmount?: number
  currentDebt?: number
  lastPaymentDate?: string
}

export interface Zone {
  id: string
  name: string
  category: string
  color: string
  stalls: Stall[]
}

export interface Transaction {
  id: string
  transactionCode: string
  timestamp: Date
  merchantName: string
  stallCode: string
  paymentDescription: string
  amount: number
  paymentMethod: "Tiền mặt" | "Chuyển khoản" | "QR Code"
  status: "Thành công" | "Thất bại" | "Đang xử lý"
  collectedBy?: string
  invoices: InvoiceItem[]
  debtBefore: number
  debtAfter: number
}

export interface Invoice {
  id: string
  merchantName: string
  stallCode: string
  feeType: string
  amount: number
  createdDate: string
  dueDate: string
  status: "unpaid" | "paid" | "overdue" | "cancelled"
  invoiceCode?: string
  description?: string
}

export interface InvoiceItem {
  id: string
  type: string
  amount: number
}

export interface Floor {
  id: string
  name: string
  zones: Zone[]
}

export interface MarketConfig {
  name: string
  floors: Floor[]
}

interface StallDataContextType {
  // Stall Management Data
  stalls: Stall[]
  setStalls: (stalls: Stall[]) => void
  addStall: (stall: Stall) => void
  updateStall: (stallId: string, updates: Partial<Stall>) => void
  deleteStall: (stallId: string) => void
  
  // Market Map Data
  marketConfig: MarketConfig
  setMarketConfig: (config: MarketConfig) => void
  updateZone: (floorId: string, zoneId: string, updates: Partial<Zone>) => void
  addStallToZone: (floorId: string, zoneId: string, stall: Stall) => void
  updateStallInZone: (floorId: string, zoneId: string, stallId: string, updates: Partial<Stall>) => void
  deleteStallFromZone: (floorId: string, zoneId: string, stallId: string) => void
  
  // Financial Data
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void
  deleteTransaction: (transactionId: string) => void
  
  // Invoice Data
  invoices: Invoice[]
  setInvoices: (invoices: Invoice[]) => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (invoiceId: string, updates: Partial<Invoice>) => void
  deleteInvoice: (invoiceId: string) => void
  
  // Synchronization
  syncStallData: () => void
  syncMapData: () => void
  syncFinancialData: () => void
}

const StallDataContext = createContext<StallDataContextType | undefined>(undefined)

export function StallDataProvider({ children }: { children: ReactNode }) {
  // Stall Management Data
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
      phone: "0901234567",
      email: "nguyenthilan@email.com",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      idNumber: "123456789012",
      contractStartDate: "2024-01-15",
      depositAmount: 10000000,
      currentDebt: 8200000,
      lastPaymentDate: "2025-08-05",
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
      phone: "0912345678",
      email: "tranvanhung@email.com",
      address: "456 Đường XYZ, Quận 3, TP.HCM",
      idNumber: "234567890123",
      contractStartDate: "2024-02-01",
      depositAmount: 9000000,
      currentDebt: 5500000,
      lastPaymentDate: "2025-08-05",
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
      phone: "0923456789",
      email: "lethimai@email.com",
      address: "789 Đường DEF, Quận 5, TP.HCM",
      idNumber: "345678901234",
      contractStartDate: "2024-03-01",
      depositAmount: 8000000,
      currentDebt: 3200000,
      lastPaymentDate: "2025-08-05",
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
      phone: "0934567890",
      email: "phamvannam@email.com",
      address: "321 Đường GHI, Quận 7, TP.HCM",
      idNumber: "456789012345",
      contractStartDate: "2024-04-01",
      depositAmount: 15000000,
      currentDebt: 7500000,
      lastPaymentDate: "2025-08-05",
    },
    {
      id: "7",
      code: "D01",
      merchantName: "Hoàng Thị Hoa",
      businessType: "Hải sản",
      area: 25,
      status: "occupied",
      contractEndDate: "2026-01-15",
      monthlyRent: 9000000,
      phone: "0945678901",
      email: "hoangthihoa@email.com",
      address: "654 Đường JKL, Quận 8, TP.HCM",
      idNumber: "567890123456",
      contractStartDate: "2024-05-01",
      depositAmount: 18000000,
      currentDebt: 4200000,
      lastPaymentDate: "2025-08-05",
    },
    {
      id: "8",
      code: "D02",
      merchantName: "Vũ Đình Long",
      businessType: "Gia vị",
      area: 12,
      status: "expiring",
      contractEndDate: "2025-08-20",
      monthlyRent: 5500000,
      phone: "0956789012",
      email: "vudinhlong@email.com",
      address: "987 Đường MNO, Quận 10, TP.HCM",
      idNumber: "678901234567",
      contractStartDate: "2024-06-01",
      depositAmount: 11000000,
      currentDebt: 0,
      lastPaymentDate: "2025-08-05",
    },
    {
      id: "9",
      code: "E01",
      merchantName: "",
      businessType: "",
      area: 14,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 6500000,
    },
    {
      id: "10",
      code: "E02",
      merchantName: "",
      businessType: "",
      area: 16,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 7000000,
    },
    // Thêm 15 gian hàng nữa để demo pagination
    {
      id: "11",
      code: "A03",
      merchantName: "Ngô Thị Bình",
      businessType: "Trái cây",
      area: 13,
      status: "occupied",
      contractEndDate: "2025-10-15",
      monthlyRent: 5200000,
      phone: "0967890123",
      email: "ngothibinh@email.com",
      address: "147 Đường PQR, Quận 11, TP.HCM",
      idNumber: "789012345678",
      contractStartDate: "2024-07-01",
      depositAmount: 10400000,
      currentDebt: 0,
      lastPaymentDate: "2025-08-06",
    },
    {
      id: "12",
      code: "A04",
      merchantName: "",
      businessType: "",
      area: 11,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 4800000,
    },
    {
      id: "13",
      code: "B03",
      merchantName: "Đỗ Văn Minh",
      businessType: "Gạo, đậu",
      area: 9,
      status: "occupied",
      contractEndDate: "2026-02-28",
      monthlyRent: 4200000,
      phone: "0978901234",
      email: "dovanminh@email.com",
      address: "258 Đường STU, Quận 12, TP.HCM",
      idNumber: "890123456789",
      contractStartDate: "2024-08-01",
      depositAmount: 8400000,
      currentDebt: 0,
      lastPaymentDate: "2025-08-06",
    },
    {
      id: "14",
      code: "B04",
      merchantName: "",
      businessType: "",
      area: 17,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 7200000,
    },
    {
      id: "15",
      code: "C03",
      merchantName: "Lý Thị Hương",
      businessType: "Bánh kẹo",
      area: 7,
      status: "occupied",
      contractEndDate: "2025-12-10",
      monthlyRent: 3800000,
      phone: "0989012345",
      email: "lythihuong@email.com",
      address: "369 Đường VWX, Quận Bình Tân, TP.HCM",
      idNumber: "901234567890",
      contractStartDate: "2024-09-01",
      depositAmount: 7600000,
      currentDebt: 0,
      lastPaymentDate: "2025-08-06",
    },
    {
      id: "16",
      code: "C04",
      merchantName: "",
      businessType: "",
      area: 19,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 7800000,
    },
    {
      id: "17",
      code: "D03",
      merchantName: "Trịnh Văn Sơn",
      businessType: "Đồ khô",
      area: 22,
      status: "occupied",
      contractEndDate: "2026-04-15",
      monthlyRent: 8500000,
      phone: "0990123456",
      email: "trinhvanson@email.com",
      address: "741 Đường YZA, Quận Tân Bình, TP.HCM",
      idNumber: "012345678901",
      contractStartDate: "2024-10-01",
      depositAmount: 17000000,
      currentDebt: 0,
      lastPaymentDate: "2025-08-06",
    },
    {
      id: "18",
      code: "D04",
      merchantName: "",
      businessType: "",
      area: 14,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 6800000,
    },
    {
      id: "19",
      code: "E03",
      merchantName: "Phan Thị Nga",
      businessType: "Đồ uống",
      area: 8,
      status: "occupied",
      contractEndDate: "2025-11-20",
      monthlyRent: 3600000,
      phone: "0991234567",
      email: "phanthinga@email.com",
      address: "852 Đường BCD, Quận Tân Phú, TP.HCM",
      idNumber: "123456789012",
      contractStartDate: "2024-11-01",
      depositAmount: 7200000,
      currentDebt: 0,
      lastPaymentDate: "2025-08-06",
    },
    {
      id: "20",
      code: "E04",
      merchantName: "",
      businessType: "",
      area: 21,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 8200000,
    },
    {
      id: "21",
      code: "A05",
      merchantName: "Hoàng Văn Tú",
      businessType: "Thực phẩm đông lạnh",
      area: 16,
      status: "occupied",
      contractEndDate: "2026-01-30",
      monthlyRent: 6800000,
      phone: "0992345678",
      email: "hoangvantu@email.com",
      address: "963 Đường EFG, Quận Gò Vấp, TP.HCM",
      idNumber: "234567890123",
      contractStartDate: "2024-12-01",
      depositAmount: 13600000,
      currentDebt: 0,
      lastPaymentDate: "2025-08-06",
    },
    {
      id: "22",
      code: "A06",
      merchantName: "",
      businessType: "",
      area: 12,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 5200000,
    },
    {
      id: "23",
      code: "B05",
      merchantName: "Võ Thị Lan",
      businessType: "Gia vị khô",
      area: 10,
      status: "occupied",
      contractEndDate: "2025-09-25",
      monthlyRent: 4400000,
      phone: "0993456789",
      email: "vothilan@email.com",
      address: "159 Đường HIJ, Quận Phú Nhuận, TP.HCM",
      idNumber: "345678901234",
      contractStartDate: "2025-01-01",
      depositAmount: 8800000,
      currentDebt: 0,
      lastPaymentDate: "2025-08-07",
    },
    {
      id: "24",
      code: "B06",
      merchantName: "",
      businessType: "",
      area: 18,
      status: "vacant",
      contractEndDate: "",
      monthlyRent: 7400000,
    },
    {
      id: "25",
      code: "C05",
      merchantName: "Nguyễn Văn Hải",
      businessType: "Đồ gia dụng",
      area: 24,
      status: "occupied",
      contractEndDate: "2026-03-10",
      monthlyRent: 9200000,
      phone: "0994567890",
      email: "nguyenvanhai@email.com",
      address: "753 Đường KLM, Quận Bình Thạnh, TP.HCM",
      idNumber: "456789012345",
      contractStartDate: "2025-02-01",
      depositAmount: 18400000,
      currentDebt: 0,
      lastPaymentDate: "2025-08-07",
    },
  ])

  // Market Map Data
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
              { 
                id: "1", 
                code: "A01", 
                x: 80, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "Nguyễn Thị Lan", 
                businessType: "Thực phẩm tươi sống", 
                status: "occupied", 
                category: "food", 
                monthlyRent: 5000000, 
                area: 12, 
                contractEndDate: "2025-12-31" 
              },
              { 
                id: "2", 
                code: "A02", 
                x: 140, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "food", 
                monthlyRent: 6000000, 
                area: 15 
              },
              { 
                id: "11", 
                code: "A03", 
                x: 200, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "Ngô Thị Bình", 
                businessType: "Trái cây", 
                status: "occupied", 
                category: "food", 
                monthlyRent: 5200000, 
                area: 13, 
                contractEndDate: "2025-10-15" 
              },
              { 
                id: "12", 
                code: "A04", 
                x: 260, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "food", 
                monthlyRent: 4800000, 
                area: 11 
              },
              { 
                id: "21", 
                code: "A05", 
                x: 80, 
                y: 130, 
                width: 40, 
                height: 30, 
                merchantName: "Hoàng Văn Tú", 
                businessType: "Thực phẩm đông lạnh", 
                status: "occupied", 
                category: "food", 
                monthlyRent: 6800000, 
                area: 16, 
                contractEndDate: "2026-01-30" 
              },
              { 
                id: "22", 
                code: "A06", 
                x: 140, 
                y: 130, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "food", 
                monthlyRent: 5200000, 
                area: 12 
              },
            ]
          },
          {
            id: "B",
            name: "Khu B - Rau củ quả",
            category: "vegetables",
            color: "#84cc16",
            stalls: [
              { 
                id: "3", 
                code: "B01", 
                x: 430, 
                y: 80, 
                width: 35, 
                height: 25, 
                merchantName: "Trần Văn Hùng", 
                businessType: "Gia vị, nước chấm", 
                status: "expiring", 
                category: "vegetables", 
                monthlyRent: 4500000, 
                area: 10, 
                contractEndDate: "2025-09-15" 
              },
              { 
                id: "4", 
                code: "B02", 
                x: 480, 
                y: 80, 
                width: 35, 
                height: 25, 
                merchantName: "Lê Thị Mai", 
                businessType: "Rau củ quả", 
                status: "occupied", 
                category: "vegetables", 
                monthlyRent: 4000000, 
                area: 8, 
                contractEndDate: "2026-03-20" 
              },
              { 
                id: "13", 
                code: "B03", 
                x: 530, 
                y: 80, 
                width: 35, 
                height: 25, 
                merchantName: "Đỗ Văn Minh", 
                businessType: "Gạo, đậu", 
                status: "occupied", 
                category: "vegetables", 
                monthlyRent: 4200000, 
                area: 9, 
                contractEndDate: "2026-02-28" 
              },
              { 
                id: "14", 
                code: "B04", 
                x: 580, 
                y: 80, 
                width: 35, 
                height: 25, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "vegetables", 
                monthlyRent: 7200000, 
                area: 17 
              },
              { 
                id: "23", 
                code: "B05", 
                x: 430, 
                y: 120, 
                width: 35, 
                height: 25, 
                merchantName: "Võ Thị Lan", 
                businessType: "Gia vị khô", 
                status: "occupied", 
                category: "vegetables", 
                monthlyRent: 4400000, 
                area: 10, 
                contractEndDate: "2025-09-25" 
              },
              { 
                id: "24", 
                code: "B06", 
                x: 480, 
                y: 120, 
                width: 35, 
                height: 25, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "vegetables", 
                monthlyRent: 7400000, 
                area: 18 
              },
            ]
          },
          {
            id: "C",
            name: "Khu C - Thịt & Hải sản",
            category: "meat",
            color: "#ef4444",
            stalls: [
              { 
                id: "5", 
                code: "C01", 
                x: 780, 
                y: 80, 
                width: 45, 
                height: 35, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "meat", 
                monthlyRent: 8000000, 
                area: 20 
              },
              { 
                id: "6", 
                code: "C02", 
                x: 840, 
                y: 80, 
                width: 45, 
                height: 35, 
                merchantName: "Phạm Văn Nam", 
                businessType: "Thịt tươi", 
                status: "occupied", 
                category: "meat", 
                monthlyRent: 7500000, 
                area: 18, 
                contractEndDate: "2025-11-30" 
              },
              { 
                id: "15", 
                code: "C03", 
                x: 900, 
                y: 80, 
                width: 45, 
                height: 35, 
                merchantName: "Lý Thị Hương", 
                businessType: "Bánh kẹo", 
                status: "occupied", 
                category: "meat", 
                monthlyRent: 3800000, 
                area: 7, 
                contractEndDate: "2025-12-10" 
              },
              { 
                id: "16", 
                code: "C04", 
                x: 960, 
                y: 80, 
                width: 45, 
                height: 35, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "meat", 
                monthlyRent: 7800000, 
                area: 19 
              },
              { 
                id: "25", 
                code: "C05", 
                x: 780, 
                y: 130, 
                width: 45, 
                height: 35, 
                merchantName: "Nguyễn Văn Hải", 
                businessType: "Đồ gia dụng", 
                status: "occupied", 
                category: "meat", 
                monthlyRent: 9200000, 
                area: 24, 
                contractEndDate: "2026-03-10" 
              },
            ]
          },
          {
            id: "D",
            name: "Khu D - Gia vị & Đồ khô",
            category: "spices",
            color: "#3b82f6",
            stalls: [
              { 
                id: "7", 
                code: "D01", 
                x: 1130, 
                y: 80, 
                width: 50, 
                height: 40, 
                merchantName: "Hoàng Thị Hoa", 
                businessType: "Hải sản", 
                status: "occupied", 
                category: "spices", 
                monthlyRent: 9000000, 
                area: 25, 
                contractEndDate: "2026-01-15" 
              },
              { 
                id: "8", 
                code: "D02", 
                x: 1190, 
                y: 80, 
                width: 50, 
                height: 40, 
                merchantName: "Vũ Đình Long", 
                businessType: "Gia vị", 
                status: "expiring", 
                category: "spices", 
                monthlyRent: 5500000, 
                area: 12, 
                contractEndDate: "2025-08-20" 
              },
              { 
                id: "17", 
                code: "D03", 
                x: 1250, 
                y: 80, 
                width: 50, 
                height: 40, 
                merchantName: "Trịnh Văn Sơn", 
                businessType: "Đồ khô", 
                status: "occupied", 
                category: "spices", 
                monthlyRent: 8500000, 
                area: 22, 
                contractEndDate: "2026-04-15" 
              },
              { 
                id: "18", 
                code: "D04", 
                x: 1310, 
                y: 80, 
                width: 50, 
                height: 40, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "spices", 
                monthlyRent: 6800000, 
                area: 14 
              },
            ]
          },
          {
            id: "E",
            name: "Khu E - Đồ uống & Giải khát",
            category: "beverages",
            color: "#f59e0b",
            stalls: [
              { 
                id: "9", 
                code: "E01", 
                x: 1480, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "beverages", 
                monthlyRent: 6500000, 
                area: 14 
              },
              { 
                id: "10", 
                code: "E02", 
                x: 1540, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "beverages", 
                monthlyRent: 7000000, 
                area: 16 
              },
              { 
                id: "19", 
                code: "E03", 
                x: 1600, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "Phan Thị Nga", 
                businessType: "Đồ uống", 
                status: "occupied", 
                category: "beverages", 
                monthlyRent: 3600000, 
                area: 8, 
                contractEndDate: "2025-11-20" 
              },
              { 
                id: "20", 
                code: "E04", 
                x: 1660, 
                y: 80, 
                width: 40, 
                height: 30, 
                merchantName: "", 
                businessType: "", 
                status: "vacant", 
                category: "beverages", 
                monthlyRent: 8200000, 
                area: 21 
              },
            ]
          }
        ]
      }
    ]
  })

  // Financial Data
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      transactionCode: "GD-20250805-001",
      timestamp: new Date("2025-08-05T10:30:00"),
      merchantName: "Nguyễn Thị Lan",
      stallCode: "A01",
      paymentDescription: "Thanh toán phí mặt bằng và điện, nước T08/2025",
      amount: 5500000,
      paymentMethod: "Tiền mặt",
      status: "Thành công",
      collectedBy: "Trần Văn An",
      invoices: [
        { id: "INV-082025-A01", type: "Phí mặt bằng", amount: 5000000 },
        { id: "INV-DN-082025-A01", type: "Phí điện, nước", amount: 500000 }
      ] as InvoiceItem[],
      debtBefore: 5500000,
      debtAfter: 0
    },
    {
      id: "2",
      transactionCode: "GD-20250805-002",
      timestamp: new Date("2025-08-05T11:15:00"),
      merchantName: "Trần Văn Hùng",
      stallCode: "B01",
      paymentDescription: "Thanh toán phí mặt bằng T08/2025",
      amount: 4500000,
      paymentMethod: "Chuyển khoản",
      status: "Thành công",
      collectedBy: "Nguyễn Thị Hoa",
      invoices: [
        { id: "INV-082025-B01", type: "Phí mặt bằng", amount: 4500000 }
      ],
      debtBefore: 4500000,
      debtAfter: 0
    },
    {
      id: "3",
      transactionCode: "GD-20250805-003",
      timestamp: new Date("2025-08-05T14:20:00"),
      merchantName: "Lê Thị Mai",
      stallCode: "B02",
      paymentDescription: "Thanh toán phí mặt bằng và vệ sinh T08/2025",
      amount: 4200000,
      paymentMethod: "QR Code",
      status: "Thành công",
      collectedBy: "Trần Văn An",
      invoices: [
        { id: "INV-082025-B02", type: "Phí mặt bằng", amount: 4000000 },
        { id: "INV-VS-082025-B02", type: "Phí vệ sinh", amount: 200000 }
      ],
      debtBefore: 4200000,
      debtAfter: 0
    },
    {
      id: "4",
      transactionCode: "GD-20250805-004",
      timestamp: new Date("2025-08-05T15:45:00"),
      merchantName: "Phạm Văn Nam",
      stallCode: "C02",
      paymentDescription: "Thanh toán phí mặt bằng T08/2025",
      amount: 7500000,
      paymentMethod: "Chuyển khoản",
      status: "Thành công",
      collectedBy: "Lê Văn Minh",
      invoices: [
        { id: "INV-082025-C02", type: "Phí mặt bằng", amount: 7500000 }
      ],
      debtBefore: 7500000,
      debtAfter: 0
    },
    {
      id: "5",
      transactionCode: "GD-20250805-005",
      timestamp: new Date("2025-08-05T16:20:00"),
      merchantName: "Hoàng Thị Hoa",
      stallCode: "D01",
      paymentDescription: "Thanh toán phí mặt bằng và điện, nước T08/2025",
      amount: 9500000,
      paymentMethod: "Tiền mặt",
      status: "Thành công",
      collectedBy: "Trần Văn An",
      invoices: [
        { id: "INV-082025-D01", type: "Phí mặt bằng", amount: 9000000 },
        { id: "INV-DN-082025-D01", type: "Phí điện, nước", amount: 500000 }
      ] as InvoiceItem[],
      debtBefore: 9500000,
      debtAfter: 0
    },
    {
      id: "6",
      transactionCode: "GD-20250805-006",
      timestamp: new Date("2025-08-05T17:10:00"),
      merchantName: "Vũ Đình Long",
      stallCode: "D02",
      paymentDescription: "Thanh toán phí mặt bằng T08/2025",
      amount: 5500000,
      paymentMethod: "QR Code",
      status: "Thành công",
      collectedBy: "Nguyễn Thị Hoa",
      invoices: [
        { id: "INV-082025-D02", type: "Phí mặt bằng", amount: 5500000 }
      ],
      debtBefore: 5500000,
      debtAfter: 0
    },
    {
      id: "7",
      transactionCode: "GD-20250806-001",
      timestamp: new Date("2025-08-06T09:15:00"),
      merchantName: "Ngô Thị Bình",
      stallCode: "A03",
      paymentDescription: "Thanh toán phí mặt bằng và vệ sinh T08/2025",
      amount: 5400000,
      paymentMethod: "Chuyển khoản",
      status: "Thành công",
      collectedBy: "Lê Văn Minh",
      invoices: [
        { id: "INV-082025-A03", type: "Phí mặt bằng", amount: 5200000 },
        { id: "INV-VS-082025-A03", type: "Phí vệ sinh", amount: 200000 }
      ] as InvoiceItem[],
      debtBefore: 5400000,
      debtAfter: 0
    },
    {
      id: "8",
      transactionCode: "GD-20250806-002",
      timestamp: new Date("2025-08-06T10:30:00"),
      merchantName: "Đỗ Văn Minh",
      stallCode: "B03",
      paymentDescription: "Thanh toán phí mặt bằng T08/2025",
      amount: 4200000,
      paymentMethod: "Tiền mặt",
      status: "Thành công",
      collectedBy: "Trần Văn An",
      invoices: [
        { id: "INV-082025-B03", type: "Phí mặt bằng", amount: 4200000 }
      ],
      debtBefore: 4200000,
      debtAfter: 0
    },
    {
      id: "9",
      transactionCode: "GD-20250806-003",
      timestamp: new Date("2025-08-06T11:45:00"),
      merchantName: "Lý Thị Hương",
      stallCode: "C03",
      paymentDescription: "Thanh toán phí mặt bằng và điện, nước T08/2025",
      amount: 4000000,
      paymentMethod: "Chuyển khoản",
      status: "Thành công",
      collectedBy: "Nguyễn Thị Hoa",
      invoices: [
        { id: "INV-082025-C03", type: "Phí mặt bằng", amount: 3800000 },
        { id: "INV-DN-082025-C03", type: "Phí điện, nước", amount: 200000 }
      ] as InvoiceItem[],
      debtBefore: 4000000,
      debtAfter: 0
    },
    {
      id: "10",
      transactionCode: "GD-20250806-004",
      timestamp: new Date("2025-08-06T14:20:00"),
      merchantName: "Trịnh Văn Sơn",
      stallCode: "D03",
      paymentDescription: "Thanh toán phí mặt bằng T08/2025",
      amount: 8500000,
      paymentMethod: "QR Code",
      status: "Thành công",
      collectedBy: "Lê Văn Minh",
      invoices: [
        { id: "INV-082025-D03", type: "Phí mặt bằng", amount: 8500000 }
      ],
      debtBefore: 8500000,
      debtAfter: 0
    },
    {
      id: "11",
      transactionCode: "GD-20250806-005",
      timestamp: new Date("2025-08-06T15:30:00"),
      merchantName: "Phan Thị Nga",
      stallCode: "E03",
      paymentDescription: "Thanh toán phí mặt bằng và vệ sinh T08/2025",
      amount: 3800000,
      paymentMethod: "Tiền mặt",
      status: "Thành công",
      collectedBy: "Trần Văn An",
      invoices: [
        { id: "INV-082025-E03", type: "Phí mặt bằng", amount: 3600000 },
        { id: "INV-VS-082025-E03", type: "Phí vệ sinh", amount: 200000 }
      ] as InvoiceItem[],
      debtBefore: 3800000,
      debtAfter: 0
    },
    {
      id: "12",
      transactionCode: "GD-20250806-006",
      timestamp: new Date("2025-08-06T16:45:00"),
      merchantName: "Hoàng Văn Tú",
      stallCode: "A05",
      paymentDescription: "Thanh toán phí mặt bằng T08/2025",
      amount: 6800000,
      paymentMethod: "Chuyển khoản",
      status: "Thành công",
      collectedBy: "Nguyễn Thị Hoa",
      invoices: [
        { id: "INV-082025-A05", type: "Phí mặt bằng", amount: 6800000 }
      ],
      debtBefore: 6800000,
      debtAfter: 0
    },
    {
      id: "13",
      transactionCode: "GD-20250807-001",
      timestamp: new Date("2025-08-07T09:00:00"),
      merchantName: "Võ Thị Lan",
      stallCode: "B05",
      paymentDescription: "Thanh toán phí mặt bằng và điện, nước T08/2025",
      amount: 4600000,
      paymentMethod: "QR Code",
      status: "Thành công",
      collectedBy: "Lê Văn Minh",
      invoices: [
        { id: "INV-082025-B05", type: "Phí mặt bằng", amount: 4400000 },
        { id: "INV-DN-082025-B05", type: "Phí điện, nước", amount: 200000 }
      ] as InvoiceItem[],
      debtBefore: 4600000,
      debtAfter: 0
    },
    {
      id: "14",
      transactionCode: "GD-20250807-002",
      timestamp: new Date("2025-08-07T10:15:00"),
      merchantName: "Nguyễn Văn Hải",
      stallCode: "C05",
      paymentDescription: "Thanh toán phí mặt bằng T08/2025",
      amount: 9200000,
      paymentMethod: "Tiền mặt",
      status: "Thành công",
      collectedBy: "Trần Văn An",
      invoices: [
        { id: "INV-082025-C05", type: "Phí mặt bằng", amount: 9200000 }
      ],
      debtBefore: 9200000,
      debtAfter: 0
    },
    {
      id: "15",
      transactionCode: "GD-20250807-003",
      timestamp: new Date("2025-08-07T11:30:00"),
      merchantName: "Nguyễn Thị Lan",
      stallCode: "A01",
      paymentDescription: "Thanh toán phí điện, nước T09/2025",
      amount: 600000,
      paymentMethod: "Chuyển khoản",
      status: "Thành công",
      collectedBy: "Nguyễn Thị Hoa",
      invoices: [
        { id: "INV-092025-A01", type: "Phí điện, nước", amount: 600000 }
      ],
      debtBefore: 600000,
      debtAfter: 0
    },
    {
      id: "16",
      transactionCode: "GD-20250807-004",
      timestamp: new Date("2025-08-07T14:45:00"),
      merchantName: "Trần Văn Hùng",
      stallCode: "B01",
      paymentDescription: "Thanh toán phí vệ sinh T08/2025",
      amount: 300000,
      paymentMethod: "Tiền mặt",
      status: "Thành công",
      collectedBy: "Lê Văn Minh",
      invoices: [
        { id: "INV-VS-082025-B01", type: "Phí vệ sinh", amount: 300000 }
      ],
      debtBefore: 300000,
      debtAfter: 0
    },
    {
      id: "17",
      transactionCode: "GD-20250807-005",
      timestamp: new Date("2025-08-07T16:00:00"),
      merchantName: "Lê Thị Mai",
      stallCode: "B02",
      paymentDescription: "Thanh toán phí điện, nước T09/2025",
      amount: 450000,
      paymentMethod: "QR Code",
      status: "Thành công",
      collectedBy: "Trần Văn An",
      invoices: [
        { id: "INV-092025-B02", type: "Phí điện, nước", amount: 450000 }
      ],
      debtBefore: 450000,
      debtAfter: 0
    },
    {
      id: "18",
      transactionCode: "GD-20250808-001",
      timestamp: new Date("2025-08-08T09:30:00"),
      merchantName: "Phạm Văn Nam",
      stallCode: "C02",
      paymentDescription: "Thanh toán phí vệ sinh T08/2025",
      amount: 400000,
      paymentMethod: "Chuyển khoản",
      status: "Thành công",
      collectedBy: "Nguyễn Thị Hoa",
      invoices: [
        { id: "INV-VS-082025-C02", type: "Phí vệ sinh", amount: 400000 }
      ],
      debtBefore: 400000,
      debtAfter: 0
    },
    {
      id: "19",
      transactionCode: "GD-20250808-002",
      timestamp: new Date("2025-08-08T10:45:00"),
      merchantName: "Hoàng Thị Hoa",
      stallCode: "D01",
      paymentDescription: "Thanh toán phí vệ sinh T08/2025",
      amount: 500000,
      paymentMethod: "Tiền mặt",
      status: "Thành công",
      collectedBy: "Lê Văn Minh",
      invoices: [
        { id: "INV-VS-082025-D01", type: "Phí vệ sinh", amount: 500000 }
      ],
      debtBefore: 500000,
      debtAfter: 0
    },
    {
      id: "20",
      transactionCode: "GD-20250808-003",
      timestamp: new Date("2025-08-08T11:15:00"),
      merchantName: "Vũ Đình Long",
      stallCode: "D02",
      paymentDescription: "Thanh toán phí điện, nước T09/2025",
      amount: 350000,
      paymentMethod: "QR Code",
      status: "Thành công",
      collectedBy: "Trần Văn An",
      invoices: [
        { id: "INV-092025-D02", type: "Phí điện, nước", amount: 350000 }
      ],
      debtBefore: 350000,
      debtAfter: 0
    }
  ])

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-082025-A01-001",
      merchantName: "Nguyễn Thị Lan",
      stallCode: "A01",
      feeType: "Phí mặt bằng",
      amount: 5000000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "unpaid",
      description: "Phí thuê mặt bằng tháng 8/2025"
    },
    {
      id: "INV-082025-A01-002",
      merchantName: "Nguyễn Thị Lan",
      stallCode: "A01",
      feeType: "Phí điện",
      amount: 1200000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-20",
      status: "unpaid",
      description: "Tiền điện tháng 7/2025"
    },
    {
      id: "INV-082025-A01-003",
      merchantName: "Nguyễn Thị Lan",
      stallCode: "A01",
      feeType: "Phí vệ sinh",
      amount: 2000000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-25",
      status: "unpaid",
      description: "Phí vệ sinh môi trường tháng 8/2025"
    },
    {
      id: "INV-082025-B01-001",
      merchantName: "Trần Văn Hùng",
      stallCode: "B01",
      feeType: "Phí mặt bằng",
      amount: 3500000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "unpaid",
      description: "Phí thuê mặt bằng tháng 8/2025"
    },
    {
      id: "INV-082025-B01-002",
      merchantName: "Trần Văn Hùng",
      stallCode: "B01",
      feeType: "Phí điện",
      amount: 800000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-20",
      status: "unpaid",
      description: "Tiền điện tháng 7/2025"
    },
    {
      id: "INV-082025-B01-003",
      merchantName: "Trần Văn Hùng",
      stallCode: "B01",
      feeType: "Phí vệ sinh",
      amount: 1200000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-25",
      status: "unpaid",
      description: "Phí vệ sinh môi trường tháng 8/2025"
    },
    {
      id: "INV-082025-B02-001",
      merchantName: "Lê Thị Mai",
      stallCode: "B02",
      feeType: "Phí mặt bằng",
      amount: 2800000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "unpaid",
      description: "Phí thuê mặt bằng tháng 8/2025"
    },
    {
      id: "INV-082025-B02-002",
      merchantName: "Lê Thị Mai",
      stallCode: "B02",
      feeType: "Phí điện",
      amount: 400000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-20",
      status: "unpaid",
      description: "Tiền điện tháng 7/2025"
    },
    {
      id: "INV-082025-C02-001",
      merchantName: "Phạm Văn Nam",
      stallCode: "C02",
      feeType: "Phí mặt bằng",
      amount: 4500000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "unpaid",
      description: "Phí thuê mặt bằng tháng 8/2025"
    },
    {
      id: "INV-082025-C02-002",
      merchantName: "Phạm Văn Nam",
      stallCode: "C02",
      feeType: "Phí điện",
      amount: 1500000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-20",
      status: "unpaid",
      description: "Tiền điện tháng 7/2025"
    },
    {
      id: "INV-082025-C02-003",
      merchantName: "Phạm Văn Nam",
      stallCode: "C02",
      feeType: "Phí vệ sinh",
      amount: 1500000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-25",
      status: "unpaid",
      description: "Phí vệ sinh môi trường tháng 8/2025"
    },
    {
      id: "INV-082025-D01-001",
      merchantName: "Hoàng Thị Hoa",
      stallCode: "D01",
      feeType: "Phí mặt bằng",
      amount: 3800000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "unpaid",
      description: "Phí thuê mặt bằng tháng 8/2025"
    },
    {
      id: "INV-082025-D01-002",
      merchantName: "Hoàng Thị Hoa",
      stallCode: "D01",
      feeType: "Phí điện",
      amount: 400000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-20",
      status: "unpaid",
      description: "Tiền điện tháng 7/2025"
    },
    {
      id: "INV-010",
      merchantName: "Trịnh Văn Sơn",
      stallCode: "D03",
      feeType: "Phí mặt bằng",
      amount: 8500000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-011",
      merchantName: "Phan Thị Nga",
      stallCode: "E03",
      feeType: "Phí mặt bằng",
      amount: 3600000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-012",
      merchantName: "Hoàng Văn Tú",
      stallCode: "A05",
      feeType: "Phí mặt bằng",
      amount: 6800000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-013",
      merchantName: "Võ Thị Lan",
      stallCode: "B05",
      feeType: "Phí mặt bằng",
      amount: 4400000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-014",
      merchantName: "Nguyễn Văn Hải",
      stallCode: "C05",
      feeType: "Phí mặt bằng",
      amount: 9200000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-015",
      merchantName: "Nguyễn Thị Lan",
      stallCode: "A01",
      feeType: "Phí điện nước",
      amount: 600000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "paid"
    },
    {
      id: "INV-016",
      merchantName: "Trần Văn Hùng",
      stallCode: "B01",
      feeType: "Phí vệ sinh",
      amount: 300000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-017",
      merchantName: "Lê Thị Mai",
      stallCode: "B02",
      feeType: "Phí điện nước",
      amount: 450000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "paid"
    },
    {
      id: "INV-018",
      merchantName: "Phạm Văn Nam",
      stallCode: "C02",
      feeType: "Phí vệ sinh",
      amount: 400000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-019",
      merchantName: "Hoàng Thị Hoa",
      stallCode: "D01",
      feeType: "Phí vệ sinh",
      amount: 500000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-020",
      merchantName: "Vũ Đình Long",
      stallCode: "D02",
      feeType: "Phí điện nước",
      amount: 350000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "paid"
    },
    {
      id: "INV-021",
      merchantName: "Ngô Thị Bình",
      stallCode: "A03",
      feeType: "Phí vệ sinh",
      amount: 200000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-022",
      merchantName: "Đỗ Văn Minh",
      stallCode: "B03",
      feeType: "Phí điện nước",
      amount: 200000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-023",
      merchantName: "Lý Thị Hương",
      stallCode: "C03",
      feeType: "Phí điện nước",
      amount: 200000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-024",
      merchantName: "Trịnh Văn Sơn",
      stallCode: "D03",
      feeType: "Phí vệ sinh",
      amount: 400000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-025",
      merchantName: "Phan Thị Nga",
      stallCode: "E03",
      feeType: "Phí vệ sinh",
      amount: 200000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-026",
      merchantName: "Hoàng Văn Tú",
      stallCode: "A05",
      feeType: "Phí điện nước",
      amount: 300000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-027",
      merchantName: "Võ Thị Lan",
      stallCode: "B05",
      feeType: "Phí điện nước",
      amount: 200000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-028",
      merchantName: "Nguyễn Văn Hải",
      stallCode: "C05",
      feeType: "Phí vệ sinh",
      amount: 500000,
      createdDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "paid"
    },
    {
      id: "INV-029",
      merchantName: "Nguyễn Thị Lan",
      stallCode: "A01",
      feeType: "Phí mặt bằng",
      amount: 5000000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-030",
      merchantName: "Trần Văn Hùng",
      stallCode: "B01",
      feeType: "Phí mặt bằng",
      amount: 4500000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-031",
      merchantName: "Lê Thị Mai",
      stallCode: "B02",
      feeType: "Phí mặt bằng",
      amount: 4000000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-032",
      merchantName: "Phạm Văn Nam",
      stallCode: "C02",
      feeType: "Phí mặt bằng",
      amount: 7500000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-033",
      merchantName: "Hoàng Thị Hoa",
      stallCode: "D01",
      feeType: "Phí mặt bằng",
      amount: 9000000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-034",
      merchantName: "Vũ Đình Long",
      stallCode: "D02",
      feeType: "Phí mặt bằng",
      amount: 5500000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-035",
      merchantName: "Ngô Thị Bình",
      stallCode: "A03",
      feeType: "Phí mặt bằng",
      amount: 5200000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-036",
      merchantName: "Đỗ Văn Minh",
      stallCode: "B03",
      feeType: "Phí mặt bằng",
      amount: 4200000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-037",
      merchantName: "Lý Thị Hương",
      stallCode: "C03",
      feeType: "Phí mặt bằng",
      amount: 3800000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-038",
      merchantName: "Trịnh Văn Sơn",
      stallCode: "D03",
      feeType: "Phí mặt bằng",
      amount: 8500000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-039",
      merchantName: "Phan Thị Nga",
      stallCode: "E03",
      feeType: "Phí mặt bằng",
      amount: 3600000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-040",
      merchantName: "Hoàng Văn Tú",
      stallCode: "A05",
      feeType: "Phí mặt bằng",
      amount: 6800000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-041",
      merchantName: "Võ Thị Lan",
      stallCode: "B05",
      feeType: "Phí mặt bằng",
      amount: 4400000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    },
    {
      id: "INV-042",
      merchantName: "Nguyễn Văn Hải",
      stallCode: "C05",
      feeType: "Phí mặt bằng",
      amount: 9200000,
      createdDate: "2025-09-01",
      dueDate: "2025-09-15",
      status: "unpaid"
    }
  ])

  // Financial Functions
  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction])
  }

  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, ...updates } : t))
  }

  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId))
  }

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [...prev, invoice])
  }

  const updateInvoice = (invoiceId: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, ...updates } : i))
  }

  const deleteInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.filter(i => i.id !== invoiceId))
  }

  const syncFinancialData = () => {
    // Sync financial data with stall data
    setStalls(prev => prev.map(stall => {
      const stallTransactions = transactions.filter(t => t.stallCode === stall.code)
      const stallInvoices = invoices.filter(i => i.stallCode === stall.code)
      
      const totalPaid = stallTransactions
        .filter(t => t.status === "Thành công")
        .reduce((sum, t) => sum + t.amount, 0)
      
      const totalInvoiced = stallInvoices
        .filter(i => i.status === "paid")
        .reduce((sum, i) => sum + i.amount, 0)
      
      const currentDebt = totalInvoiced - totalPaid
      
      return {
        ...stall,
        currentDebt: currentDebt > 0 ? currentDebt : 0,
        lastPaymentDate: stallTransactions.length > 0 
          ? stallTransactions[stallTransactions.length - 1].timestamp.toISOString().split('T')[0]
          : undefined
      }
    }))
  }

  // Stall Management Functions
  const addStall = (stall: Stall) => {
    setStalls(prev => [...prev, stall])
  }

  const updateStall = (stallId: string, updates: Partial<Stall>) => {
    setStalls(prev => prev.map(stall => 
      stall.id === stallId ? { ...stall, ...updates } : stall
    ))
  }

  const deleteStall = (stallId: string) => {
    setStalls(prev => prev.filter(stall => stall.id !== stallId))
  }

  // Market Map Functions
  const updateZone = (floorId: string, zoneId: string, updates: Partial<Zone>) => {
    setMarketConfig(prev => ({
      ...prev,
      floors: prev.floors.map(floor => 
        floor.id === floorId 
          ? {
              ...floor,
              zones: floor.zones.map(zone => 
                zone.id === zoneId 
                  ? { ...zone, ...updates }
                  : zone
              )
            }
          : floor
      )
    }))
  }

  const addStallToZone = (floorId: string, zoneId: string, stall: Stall) => {
    setMarketConfig(prev => ({
      ...prev,
      floors: prev.floors.map(floor => 
        floor.id === floorId 
          ? {
              ...floor,
              zones: floor.zones.map(zone => 
                zone.id === zoneId 
                  ? { ...zone, stalls: [...zone.stalls, stall] }
                  : zone
              )
            }
          : floor
      )
    }))
  }

  const updateStallInZone = (floorId: string, zoneId: string, stallId: string, updates: Partial<Stall>) => {
    setMarketConfig(prev => ({
      ...prev,
      floors: prev.floors.map(floor => 
        floor.id === floorId 
          ? {
              ...floor,
              zones: floor.zones.map(zone => 
                zone.id === zoneId 
                  ? {
                      ...zone,
                      stalls: zone.stalls.map(stall => 
                        stall.id === stallId 
                          ? { ...stall, ...updates }
                          : stall
                      )
                    }
                  : zone
              )
            }
          : floor
      )
    }))
  }

  const deleteStallFromZone = (floorId: string, zoneId: string, stallId: string) => {
    setMarketConfig(prev => ({
      ...prev,
      floors: prev.floors.map(floor => 
        floor.id === floorId 
          ? {
              ...floor,
              zones: floor.zones.map(zone => 
                zone.id === zoneId 
                  ? {
                      ...zone,
                      stalls: zone.stalls.filter(stall => stall.id !== stallId)
                    }
                  : zone
              )
            }
          : floor
      )
    }))
  }

  // Synchronization Functions
  const syncStallData = () => {
    // Sync stall management data to market map
    setMarketConfig(prev => ({
      ...prev,
      floors: prev.floors.map(floor => ({
        ...floor,
        zones: floor.zones.map(zone => ({
          ...zone,
          stalls: zone.stalls.map(stall => {
            const stallData = stalls.find(s => s.code === stall.code)
            if (stallData) {
              return {
                ...stall,
                merchantName: stallData.merchantName,
                businessType: stallData.businessType,
                status: stallData.status,
                contractEndDate: stallData.contractEndDate,
                monthlyRent: stallData.monthlyRent,
                area: stallData.area
              }
            }
            return stall
          })
        }))
      }))
    }))
  }

  const syncMapData = () => {
    // Sync market map data to stall management
    const allStalls: Stall[] = []
    marketConfig.floors.forEach(floor => {
      floor.zones.forEach(zone => {
        zone.stalls.forEach(stall => {
          allStalls.push({
            id: stall.id,
            code: stall.code,
            merchantName: stall.merchantName,
            businessType: stall.businessType,
            area: stall.area,
            status: stall.status,
            contractEndDate: stall.contractEndDate,
            monthlyRent: stall.monthlyRent
          })
        })
      })
    })
    setStalls(allStalls)
  }

  const value: StallDataContextType = {
    stalls,
    setStalls,
    addStall,
    updateStall,
    deleteStall,
    marketConfig,
    setMarketConfig,
    updateZone,
    addStallToZone,
    updateStallInZone,
    deleteStallFromZone,
    transactions,
    setTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    invoices,
    setInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    syncStallData,
    syncMapData,
    syncFinancialData
  }

  return (
    <StallDataContext.Provider value={value}>
      {children}
    </StallDataContext.Provider>
  )
}

export function useStallData() {
  const context = useContext(StallDataContext)
  if (context === undefined) {
    throw new Error('useStallData must be used within a StallDataProvider')
  }
  return context
}
