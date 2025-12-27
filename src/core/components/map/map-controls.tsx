"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface MapControlsProps {
  selectedCount: number
  onProceed: () => void
  disabled: boolean
}

export function MapControls({ selectedCount, onProceed, disabled }: MapControlsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-4">
      <div className="text-sm">
        <p className="font-semibold text-foreground">
          {selectedCount} site{selectedCount !== 1 ? "s" : ""} selected
        </p>
        <p className="text-muted-foreground text-xs">Ready to plan your trip?</p>
      </div>
      <Button onClick={onProceed} disabled={disabled} className="gap-2">
        Continue to Trip Planner
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
