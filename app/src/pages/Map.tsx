"use client"

import { HeritageMap } from "@/core/components/map/heritage-map"
import { MapControls } from "@/core/components/map/map-controls"
import { SiteDetailPanel } from "@/core/components/map/site-detail-panel"
import { Navigation } from "@/core/components/navigation"
import { useState } from "react"

export default function MapPage() {
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null)
  const [selectedSites, setSelectedSites] = useState<number[]>([])

  const handleToggleSite = (siteId: number) => {
    setSelectedSites((prev) => (prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]))
  }

  const handleProceedToTripPlanner = () => {
    if (selectedSites.length > 0) {
      const siteIds = selectedSites.join(",")
      window.location.href = `/trip-planner?sites=${siteIds}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex h-[calc(100vh-60px)]">
        {/* Map Section */}
        <div className="flex-1 relative">
          <HeritageMap selectedSiteId={selectedSiteId} onSiteSelect={setSelectedSiteId} />

          {/* Map Controls */}
          <MapControls
            selectedCount={selectedSites.length}
            onProceed={handleProceedToTripPlanner}
            disabled={selectedSites.length === 0}
          />
        </div>

        {/* Detail Panel */}
        <div className="w-2/5 border-l border-border bg-card overflow-y-auto max-h-full">
          {selectedSiteId ? (
            <SiteDetailPanel
              siteId={selectedSiteId}
              isSelected={selectedSites.includes(selectedSiteId)}
              onToggleSelect={() => handleToggleSite(selectedSiteId)}
            />
          ) : (
            <div className="p-6 flex items-center justify-center h-full text-center text-muted-foreground">
              <p>Select a site on the map to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
