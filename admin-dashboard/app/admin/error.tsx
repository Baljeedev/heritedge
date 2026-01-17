"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AdminErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Admin error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Error</h1>
            <p className="text-muted-foreground">An error occurred in the admin panel</p>
          </div>
          <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg break-words">
            {error.message || "An unexpected error occurred"}
          </p>
          <div className="flex gap-3">
            <Button onClick={() => reset()} className="flex-1">
              Retry
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/admin")} className="flex-1">
              Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
