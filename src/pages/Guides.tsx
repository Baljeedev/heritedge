"use client"

import { useState } from "react"
import { TOUR_GUIDES } from "@/data/tour-guides"
import { GuideFilter } from "@/core/components/guides/guide-filter"
import { Navigation } from "@/core/components/navigation"
import { GuideCard } from "@/core/components/guides/guide-card"

export default function GuidesPage() {
  const [selectedSite, setSelectedSite] = useState<number | null>(null)
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "premium">("all")
  const [ratingFilter, setRatingFilter] = useState<number>(0)

  const filteredGuides = TOUR_GUIDES.filter((guide) => {
    const matchesSite = !selectedSite || guide.sites.includes(selectedSite)

    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "budget" && guide.pricePerDay <= 100) ||
      (priceFilter === "mid" && guide.pricePerDay > 100 && guide.pricePerDay <= 200) ||
      (priceFilter === "premium" && guide.pricePerDay > 200)

    const matchesRating = guide.rating >= ratingFilter

    return matchesSite && matchesPrice && matchesRating
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Local Tour Guides & Artisans</h1>
          <p className="text-muted-foreground mb-8">
            Connect with certified guides who bring history to life while supporting local communities
          </p>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <GuideFilter
                selectedSite={selectedSite}
                onSiteChange={setSelectedSite}
                priceFilter={priceFilter}
                onPriceChange={setPriceFilter}
                ratingFilter={ratingFilter}
                onRatingChange={setRatingFilter}
              />
            </div>

            {/* Guide Cards Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  {filteredGuides.length} guide{filteredGuides.length !== 1 ? "s" : ""} available
                </h2>
              </div>

              {filteredGuides.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredGuides.map((guide) => (
                    <GuideCard key={guide.id} guide={guide} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                  <p className="text-muted-foreground mb-2">No guides found matching your criteria</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
