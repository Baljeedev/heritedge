"use client"

import { useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { setTokenGetter } from "@/lib/api"

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth()

  useEffect(() => {
    // Set the token getter function for the API client
    setTokenGetter(async () => {
      try {
        return await getToken()
      } catch (error) {
        console.error("Error getting auth token:", error)
        return null
      }
    })
  }, [getToken])

  return <>{children}</>
}