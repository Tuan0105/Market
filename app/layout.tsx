import type { Metadata } from 'next'
import './globals.css'
import 'react-day-picker/dist/style.css'
import { Toaster } from "@/components/ui/toaster"
import { StallDataProvider } from "@/lib/stall-data-context"

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
        <StallDataProvider>
          {children}
        </StallDataProvider>
        <Toaster />
      </body>
    </html>
  )
}
