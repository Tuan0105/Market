"use client"

import { useToast } from "@/components/ui/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast"
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="grid gap-1">
              {variant === "success" && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {title && <ToastTitle>{title}</ToastTitle>}
                </div>
              )}
              {variant === "destructive" && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  {title && <ToastTitle>{title}</ToastTitle>}
                </div>
              )}
              {variant === "default" && (
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  {title && <ToastTitle>{title}</ToastTitle>}
                </div>
              )}
              {variant !== "success" && variant !== "destructive" && variant !== "default" && title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
    </div>
  )
}
