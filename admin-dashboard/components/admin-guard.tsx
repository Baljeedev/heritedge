"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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

  // Show nothing while loading
  if (!isLoaded) {
    return null
  }

  // Show nothing if user is not signed in
  if (!user) {
    return null
  }

  // Show nothing if email doesn't match
  if (!isAuthorized) {
    return null
  }

  // User is authenticated and email matches, show children
  return <>{children}</>
}