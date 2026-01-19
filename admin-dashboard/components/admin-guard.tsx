"use client"

import { useUser } from "@clerk/nextjs"
import { SignOutButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const ALLOWED_EMAIL = "harshit.rai.verma@gmail.com"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        // Not signed in, redirect to sign-in
        router.push("/sign-in")
        return
      }

      // Check if user's email matches the allowed email
      const userEmail = user.primaryEmailAddress?.emailAddress
      if (userEmail === ALLOWED_EMAIL) {
        setIsAuthorized(true)
      } else {
        // Email doesn't match, don't show anything
        setIsAuthorized(false)
      }
    }
  }, [user, isLoaded, router])

  // While Clerk is loading, show a centered spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If user is not signed in, redirect to sign-in and show a loader
  if (!user) {
    router.push("/sign-in")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If email doesn't match, show a friendly unauthorized message instead of a blank screen
  if (!isAuthorized) {
    const email = user.primaryEmailAddress?.emailAddress
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Not authorized</h1>
          <p className="text-muted-foreground">
            The admin dashboard is restricted. You are signed in as{" "}
            <span className="font-mono">{email}</span>, which does not have admin access.
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

  // User is authenticated and email matches, show children
  return <>{children}</>
}