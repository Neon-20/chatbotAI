"use client"

import { useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChatbotUIContext } from "@/context/context"

type Role = "user" | "developer" | "admin" | "superadmin"

interface UseRoleBasedAccessOptions {
  allowedRoles: Role[]
  redirectTo?: string
  showAccessDenied?: boolean
}

interface UseRoleBasedAccessReturn {
  isAuthorized: boolean
  isLoading: boolean
  userRole: Role | null
  hasAccess: (roles: Role[]) => boolean
}

export function useRoleBasedAccess({
  allowedRoles,
  redirectTo = "/",
  showAccessDenied = false
}: UseRoleBasedAccessOptions): UseRoleBasedAccessReturn {
  const { profile } = useContext(ChatbotUIContext)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const userRole = profile?.roles as Role | null

  const hasAccess = useCallback(
    (roles: Role[]): boolean => {
      if (!userRole) return false
      return roles.includes(userRole)
    },
    [userRole]
  )

  useEffect(() => {
    // Wait for profile to be loaded - distinguish between loading and no profile
    if (profile === null) {
      setIsLoading(true)
      return
    }

    // Profile is loaded (could be undefined if user has no profile)
    setIsLoading(false)

    const authorized = hasAccess(allowedRoles)
    setIsAuthorized(authorized)

    // If not authorized and we should redirect (not show access denied)
    if (!authorized && !showAccessDenied) {
      // Use setTimeout to avoid navigation during render
      setTimeout(() => {
        router.push(redirectTo)
      }, 0)
    }
  }, [profile, allowedRoles, redirectTo, showAccessDenied, router, hasAccess])

  return {
    isAuthorized,
    isLoading,
    userRole,
    hasAccess
  }
}

// Utility function to check if user has specific role
export function hasRole(userRole: Role | null, requiredRoles: Role[]): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}

// Utility function to check if user is admin or superadmin
export function isAdminOrSuperAdmin(userRole: Role | null): boolean {
  return hasRole(userRole, ["admin", "superadmin"])
}

// Utility function to check if user is superadmin only
export function isSuperAdmin(userRole: Role | null): boolean {
  return hasRole(userRole, ["superadmin"])
}
