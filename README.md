# Market Management System

Hệ thống quản lý chợ truyền thống với giao diện hiện đại và tính năng đầy đủ.

## 🚀 Tính năng chính

### 👨‍💼 **Quản trị viên (Admin)**
- **Dashboard tổng quan**: Hiển thị KPI, biểu đồ thống kê, widget thông minh
- **Quản lý gian hàng**: Danh sách, thêm/sửa/xóa gian hàng, sơ đồ chợ
- **Quản lý tiểu thương**: Thông tin cá nhân, hợp đồng, công nợ
- **Ghi nhận thanh toán**: Xử lý thanh toán, lịch sử giao dịch
- **Báo cáo & Phân tích**: Báo cáo thu chi, công nợ, xuất Excel
- **Thông báo**: Gửi thông báo đến tiểu thương

### 👨‍💼 **Tiểu thương (Merchant)**
- **Dashboard cá nhân**: Thông tin công nợ, thông báo, lịch sử thanh toán
- **Thanh toán**: QR code, chuyển khoản, xác nhận thanh toán
- **Hợp đồng**: Xem thông tin hợp đồng, gia hạn
- **Phản ánh**: Gửi góp ý, báo hỏng hóc
- **Sơ đồ chợ**: Xem vị trí gian hàng của mình

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Framework**: Tailwind CSS, Shadcn UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Styling**: class-variance-authority

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Chạy dự án
```bash
npm run dev
# hoặc
yarn dev
```

Truy cập: http://localhost:3000

## 🏗️ Cấu trúc dự án

```
Market/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Trang chủ
│   └── globals.css        # CSS toàn cục
├── components/             # React Components
│   ├── ui/                # UI Components (Shadcn)
│   ├── overview.tsx       # Dashboard Admin
│   ├── user-dashboard.tsx # Dashboard Merchant
│   ├── stall-management.tsx # Quản lý gian hàng
│   ├── payment-recording.tsx # Ghi nhận thanh toán
│   ├── reports-analytics.tsx # Báo cáo & Phân tích
│   └── digital-market-map.tsx # Sơ đồ chợ
├── public/                # Static files
└── package.json           # Dependencies
```

## 🎨 Giao diện

### Admin Dashboard
- **4 KPI Cards**: Doanh thu, tiểu thương, gian hàng, tỷ lệ thu phí
- **3 Smart Widgets**: Công nợ quá hạn, hợp đồng sắp hết hạn, tình trạng mặt bằng
- **Hoạt động gần đây**: Timeline các hoạt động

### Merchant Dashboard
- **Card-based design**: Thiết kế thẻ thông tin
- **Mobile-first**: Tối ưu cho điện thoại
- **Quick actions**: Thanh toán, xem thông báo, tài khoản

## 🔐 Đăng nhập

### Admin
- Username: `admin`
- Password: `admin123`

### Merchant
- Username: `merchant`
- Password: `merchant123`

## 📊 Tính năng nổi bật

### Biểu đồ thống kê
- **Area Chart**: Xu hướng doanh thu
- **Bar Chart**: Số tiểu thương hoạt động
- **Line Chart**: Tỷ lệ thu phí
- **Pie Chart**: Tình trạng mặt bằng

### Modal & Dialog
- **Contract Detail**: Chi tiết hợp đồng
- **Merchant Detail**: Thông tin tiểu thương
- **Payment Confirmation**: Xác nhận thanh toán
- **Market Map**: Sơ đồ chợ tương tác

### Toast Notifications
- **Success/Error/Info**: Thông báo trạng thái
- **Auto-dismiss**: Tự động ẩn sau 2 giây
- **Position**: Góc trên phải

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## 📝 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📞 Liên hệ

- **Email**: your-email@example.com
- **GitHub**: [@your-username](https://github.com/your-username)

---

⭐ Nếu dự án này hữu ích, hãy cho một star nhé!
