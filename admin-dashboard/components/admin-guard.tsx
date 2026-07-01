"use client"

import { useUser } from "@clerk/nextjs"
import { SignOutButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const SUPER_ADMIN_EMAIL = "baljeelovesmemes@gmail.com"

export type AdminRole = "admin" | "manager" | null

interface AdminGuardProps {
  children: React.ReactNode
  requiredRole?: "admin" | "manager"
}

export function AdminGuard({ children, requiredRole }: AdminGuardProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [role, setRole] = useState<AdminRole>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      setChecking(false)
      router.replace("/sign-in")
      return
    }

    const userEmail = user.primaryEmailAddress?.emailAddress
    if (userEmail === SUPER_ADMIN_EMAIL) {
      setRole("admin")
      setChecking(false)
      return
    }

    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001"
    fetch(`${apiBase}/api/admin-users/check/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.authorized) setRole(data.role as AdminRole)
        else setRole(null)
      })
      .catch(() => setRole(null))
      .finally(() => setChecking(false))
  }, [user, isLoaded, router])

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Not authorized</h1>
          <p className="text-muted-foreground">
            You are signed in as{" "}
            <span className="font-mono">{user.primaryEmailAddress?.emailAddress}</span>, which does
            not have admin or manager access.
          </p>
          <div className="flex items-center justify-center gap-2">
            <SignOutButton redirectUrl="/sign-in">
              <Button variant="destructive">Log out</Button>
            </SignOutButton>
            <Button variant="outline" onClick={() => router.push("/")}>
              Go to home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (requiredRole === "admin" && role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Admin access required</h1>
          <p className="text-muted-foreground">
            This section is only accessible to admins. You are logged in as a manager.
          </p>
          <Button variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export function useAdminRole(): { role: AdminRole; isAdmin: boolean; isManager: boolean } {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<AdminRole>(null)

  useEffect(() => {
    if (!isLoaded || !user) return
    const userEmail = user.primaryEmailAddress?.emailAddress
    if (userEmail === SUPER_ADMIN_EMAIL) {
      setRole("admin")
      return
    }

    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001"
    fetch(`${apiBase}/api/admin-users/check/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.authorized) setRole(data.role as AdminRole)
      })
      .catch(() => {})
  }, [user, isLoaded])

  return { role, isAdmin: role === "admin", isManager: role === "manager" || role === "admin" }
}
