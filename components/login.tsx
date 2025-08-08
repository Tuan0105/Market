"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, EyeOff, Building2, User, ArrowRight, Smartphone, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface LoginProps {
  onLoginSuccess: (role: "admin" | "user", userData: any) => void
}

export function Login({ onLoginSuccess }: LoginProps) {
  const { toast } = useToast()
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ phone?: string; password?: string; general?: string }>({})
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState<{ phone?: string; otp?: string; password?: string; confirmPassword?: string; general?: string }>({})
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"phone" | "otp" | "newPassword">("phone")
  const [forgotPhone, setForgotPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Sample data - trong thực tế sẽ lấy từ API
  const sampleUsers = [
    {
      phone: "0123456789",
      password: "1",
      role: "admin",
      name: "Ban Quản Lý",
      id: "admin_001"
    },
    {
      phone: "0987654321", 
      password: "1",
      role: "user",
      name: "Nguyễn Thị Lan",
      id: "user_001"
    }
  ]

  const validateForm = () => {
    const newErrors: { phone?: string; password?: string } = {}
    
    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại"
    } else if (!/^[0-9]{10,11}$/.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }
    
    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    // Simulate API call
    setTimeout(() => {
      const user = sampleUsers.find(u => u.phone === phone && u.password === password)
      
      if (user) {
        // Show success toast
        toast({
          title: "Đăng nhập thành công!",
          description: `Chào mừng ${user.name} đến với hệ thống quản lý chợ.`,
          variant: "success",
        })
        
        // Success - redirect based on role
        onLoginSuccess(user.role as "admin" | "user", user)
      } else {
        setErrors({ general: "Số điện thoại hoặc mật khẩu không chính xác" })
      }
      
      setIsLoading(false)
    }, 1000)
  }

  const handleForgotPassword = () => {
    if (!forgotPhone.trim()) {
      setForgotPasswordErrors({ phone: "Vui lòng nhập số điện thoại" })
      return
    }
    
    // Simulate sending OTP
    setForgotPasswordStep("otp")
    setForgotPasswordErrors({})
  }

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      setForgotPasswordErrors({ otp: "Vui lòng nhập mã OTP" })
      return
    }
    
    // Simulate OTP verification
    setForgotPasswordStep("newPassword")
    setForgotPasswordErrors({})
  }

  const handleResetPassword = () => {
    if (!newPassword.trim()) {
      setForgotPasswordErrors({ password: "Vui lòng nhập mật khẩu mới" })
      return
    }
    
    if (newPassword !== confirmPassword) {
      setForgotPasswordErrors({ confirmPassword: "Mật khẩu xác nhận không khớp" })
      return
    }
    
    // Simulate password reset
    setIsForgotPasswordOpen(false)
    setForgotPasswordStep("phone")
    setForgotPhone("")
    setOtp("")
    setNewPassword("")
    setConfirmPassword("")
    setForgotPasswordErrors({})
    
    // Show success toast
    toast({
      title: "Đổi mật khẩu thành công!",
      description: "Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại.",
      variant: "success",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="w-12 h-12 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 ml-2">S-Chợ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Đăng nhập Hệ thống</h1>
          <p className="text-gray-600 mt-2">Quản lý Chợ Lạng Sơn</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại của bạn"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">Ghi nhớ đăng nhập</Label>
              </div>
              <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                <DialogTrigger asChild>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Quên mật khẩu?
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Đặt lại Mật khẩu</DialogTitle>
                  </DialogHeader>
                  
                                     {forgotPasswordStep === "phone" && (
                     <div className="space-y-4">
                       <div>
                         <Label htmlFor="forgotPhone">Số điện thoại</Label>
                         <Input
                           id="forgotPhone"
                           type="tel"
                           placeholder="Nhập số điện thoại đã đăng ký"
                           value={forgotPhone}
                           onChange={(e) => setForgotPhone(e.target.value)}
                           className={forgotPasswordErrors.phone ? 'border-red-500' : ''}
                         />
                         {forgotPasswordErrors.phone && (
                           <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                             <AlertCircle className="w-4 h-4" />
                             {forgotPasswordErrors.phone}
                           </p>
                         )}
                       </div>
                       <Button onClick={handleForgotPassword} className="w-full">
                         Gửi mã xác thực
                       </Button>
                     </div>
                   )}

                                     {forgotPasswordStep === "otp" && (
                     <div className="space-y-4">
                       <div>
                         <Label htmlFor="otp">Mã xác thực OTP</Label>
                         <Input
                           id="otp"
                           type="text"
                           placeholder="Nhập mã 6 số"
                           value={otp}
                           onChange={(e) => setOtp(e.target.value)}
                           maxLength={6}
                           className={forgotPasswordErrors.otp ? 'border-red-500' : ''}
                         />
                         {forgotPasswordErrors.otp && (
                           <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                             <AlertCircle className="w-4 h-4" />
                             {forgotPasswordErrors.otp}
                           </p>
                         )}
                       </div>
                       <Button onClick={handleVerifyOtp} className="w-full">
                         Xác nhận
                       </Button>
                     </div>
                   )}

                                     {forgotPasswordStep === "newPassword" && (
                     <div className="space-y-4">
                       <div>
                         <Label htmlFor="newPassword">Mật khẩu mới</Label>
                         <Input
                           id="newPassword"
                           type="password"
                           placeholder="Nhập mật khẩu mới"
                           value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)}
                           className={forgotPasswordErrors.password ? 'border-red-500' : ''}
                         />
                         {forgotPasswordErrors.password && (
                           <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                             <AlertCircle className="w-4 h-4" />
                             {forgotPasswordErrors.password}
                           </p>
                         )}
                       </div>
                       <div>
                         <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                         <Input
                           id="confirmPassword"
                           type="password"
                           placeholder="Nhập lại mật khẩu mới"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           className={forgotPasswordErrors.confirmPassword ? 'border-red-500' : ''}
                         />
                         {forgotPasswordErrors.confirmPassword && (
                           <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                             <AlertCircle className="w-4 h-4" />
                             {forgotPasswordErrors.confirmPassword}
                           </p>
                         )}
                       </div>
                       <Button onClick={handleResetPassword} className="w-full">
                         Lưu thay đổi
                       </Button>
                     </div>
                   )}
                </DialogContent>
              </Dialog>
            </div>

            {/* Error Message */}
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Login Button */}
            <Button 
              onClick={handleLogin} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Đăng nhập
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>

            {/* Registration Info */}
            <div className="text-center text-sm text-gray-600">
              <p>Chưa có tài khoản? Liên hệ BQL để được cấp</p>
            </div>
          </CardContent>
        </Card>

                 {/* Demo Accounts Info */}
         <div className="mt-6 p-4 bg-blue-50 rounded-lg">
           <h3 className="text-sm font-medium text-blue-900 mb-2">Tài khoản demo:</h3>
           <div className="space-y-1 text-xs text-blue-800">
             <p><strong>Admin:</strong> 0123456789 / 1</p>
             <p><strong>User:</strong> 0987654321 / 1</p>
           </div>
         </div>
      </div>
    </div>
  )
} 