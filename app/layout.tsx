import type { Metadata } from 'next'
import './globals.css'
import 'react-day-picker/dist/style.css'
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Market Management Dashboard',
  description: 'Hệ thống quản lý chợ truyền thống',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
