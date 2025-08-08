export interface Merchant {
  id: string
  name: string
  stallId: string
  phone: string
  email: string
  address: string
  zone: string
  contractId: string
  contractStartDate: string
  contractEndDate: string
  status: "active" | "inactive" | "suspended"
  totalDebt: number
  monthlyRent: number
  joinDate: string
}

export interface Invoice {
  id: string
  merchantId: string
  type: string
  amount: number
  dueDate: string
  status: "unpaid" | "partial" | "paid"
  description: string
  createdDate: string
}

export interface Transaction {
  id: string
  merchantId: string
  invoiceId: string
  date: string
  amount: number
  paymentMethod: "cash" | "transfer"
  status: "completed" | "pending"
  description: string
}

export interface Notification {
  id: string
  title: string
  content: string
  recipients: string[]
  sentDate: string
  status: "sent" | "draft"
  readCount: number
}

export const sampleMerchants: Merchant[] = [
  {
    id: "1",
    name: "Nguyễn Thị Lan",
    stallId: "A01",
    phone: "0901234567",
    email: "nguyenthilan@email.com",
    address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    zone: "Khu A - Thực phẩm tươi sống",
    contractId: "HD-2024-001",
    contractStartDate: "2024-01-15",
    contractEndDate: "2025-01-14",
    status: "active",
    totalDebt: 8200000,
    monthlyRent: 5000000,
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Trần Văn Hùng",
    stallId: "B12",
    phone: "0912345678",
    email: "tranvanhung@email.com",
    address: "456 Đường Lê Lợi, Quận 3, TP.HCM",
    zone: "Khu B - Thực phẩm khô",
    contractId: "HD-2024-002",
    contractStartDate: "2024-02-01",
    contractEndDate: "2025-01-31",
    status: "active",
    totalDebt: 5500000,
    monthlyRent: 3500000,
    joinDate: "2024-02-01",
  },
  {
    id: "3",
    name: "Lê Thị Mai",
    stallId: "C05",
    phone: "0923456789",
    email: "lethimai@email.com",
    address: "789 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
    zone: "Khu C - Quần áo & Phụ kiện",
    contractId: "HD-2024-003",
    contractStartDate: "2024-03-01",
    contractEndDate: "2025-02-28",
    status: "suspended",
    totalDebt: 3200000,
    monthlyRent: 2800000,
    joinDate: "2024-03-01",
  },
  {
    id: "4",
    name: "Phạm Minh Tuấn",
    stallId: "D08",
    phone: "0934567890",
    email: "phamminhtuan@email.com",
    address: "321 Đường Võ Văn Tần, Quận 10, TP.HCM",
    zone: "Khu D - Đồ gia dụng",
    contractId: "HD-2024-004",
    contractStartDate: "2024-04-01",
    contractEndDate: "2025-03-31",
    status: "active",
    totalDebt: 0,
    monthlyRent: 4200000,
    joinDate: "2024-04-01",
  },
]

export const sampleInvoices: Invoice[] = [
  {
    id: "INV-082025-A01-001",
    merchantId: "1",
    type: "Phí mặt bằng",
    amount: 5000000,
    dueDate: "2025-08-15",
    status: "unpaid",
    description: "Phí thuê mặt bằng tháng 8/2025",
    createdDate: "2025-08-01",
  },
  {
    id: "INV-082025-A01-002",
    merchantId: "1",
    type: "Phí điện",
    amount: 1200000,
    dueDate: "2025-08-20",
    status: "unpaid",
    description: "Tiền điện tháng 7/2025",
    createdDate: "2025-08-01",
  },
  {
    id: "INV-082025-A01-003",
    merchantId: "1",
    type: "Phí vệ sinh",
    amount: 2000000,
    dueDate: "2025-08-25",
    status: "unpaid",
    description: "Phí vệ sinh môi trường tháng 8/2025",
    createdDate: "2025-08-01",
  },
]

export const sampleTransactions: Transaction[] = [
  {
    id: "TXN-20250805-001",
    merchantId: "1",
    invoiceId: "INV-072025-A01-001",
    date: "2025-08-05",
    amount: 5000000,
    paymentMethod: "cash",
    status: "completed",
    description: "Thanh toán phí mặt bằng tháng 7/2025",
  },
]

export const sampleNotifications: Notification[] = [
  {
    id: "NOTIF-001",
    title: "Thông báo về giờ hoạt động mới",
    content:
      "Kính gửi quý tiểu thương, từ ngày 10/08/2025, chợ sẽ hoạt động từ 5:00 - 18:00 hàng ngày. Vui lòng tuân thủ quy định mới.",
    recipients: ["all"],
    sentDate: "2025-08-05T08:30:00",
    status: "sent",
    readCount: 142,
  },
  {
    id: "NOTIF-002",
    title: "Thông báo bảo trì hệ thống điện",
    content:
      "Chợ sẽ tiến hành bảo trì hệ thống điện vào ngày 15/08/2025 từ 6:00 - 8:00. Trong thời gian này, việc cung cấp điện có thể bị gián đoạn.",
    recipients: ["A", "B"],
    sentDate: "2025-08-03T14:15:00",
    status: "sent",
    readCount: 98,
  },
]
