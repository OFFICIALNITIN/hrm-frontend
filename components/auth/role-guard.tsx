"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, hasAnyRole } = useAuth()

  if (!user) {
    return null
  }

  if (!hasAnyRole(allowedRoles)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Alert className="max-w-md">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this section. Contact your administrator if you believe this is an
            error.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
