"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Error</h1>
          <p className="text-xl text-muted-foreground">Something went wrong</p>
        </div>
        <p className="text-sm text-muted-foreground">{error.message || "An unexpected error occurred"}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>Try Again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/admin")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
