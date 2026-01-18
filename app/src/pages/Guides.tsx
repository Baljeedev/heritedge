"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useGuides } from "@/lib/api"
import { GuideFilter } from "@/core/components/guides/guide-filter"
import { Navigation } from "@/core/components/navigation"
import { GuideCard } from "@/core/components/guides/guide-card"
import { Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function GuidesPage() {
  const { t } = useI18n()
  const location = useLocation()

  // Debug: Log when component mounts and location changes
  useEffect(() => {
    console.log("GuidesPage mounted/updated - pathname:", location.pathname)
  }, [location.pathname])
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "premium">("all")
  const [ratingFilter, setRatingFilter] = useState<number>(0)

  // Build query parameters for API
  const getQueryParams = (): Record<string, string | number> => {
    const params: Record<string, string | number> = {}

    if (selectedSite) params.siteId = selectedSite
    if (ratingFilter > 0) params.minRating = ratingFilter

    if (priceFilter !== "all") {
      if (priceFilter === "budget") params.maxPrice = 100
      else if (priceFilter === "mid") params.maxPrice = 200
      // premium has no maxPrice limit
    }

    return params
  }

  const queryParams = getQueryParams()
  const { data, isLoading, error } = useGuides(queryParams)

  // Debug: Log the query params being sent
  console.log("Guides page - Query params:", queryParams)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl  font-bold text-foreground mb-2">{t('localTourGuides')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('guidesDescription')}
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
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">{t('loadingGuides')}</span>
                </div>
              )}

              {error && (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                  <p className="text-muted-foreground mb-2">{t('errorLoadingGuides')}</p>
                  <p className="text-sm text-muted-foreground">{t('makeSureBackendRunning')}</p>
                </div>
              )}

              {!isLoading && !error && data && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">
                      {data.guides.length} {data.guides.length === 1 ? t('guidesAvailable') : t('guidesAvailablePlural')}
                    </h2>
                  </div>

                  {data.guides.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {data.guides.map((guide) => (
                        <GuideCard key={guide._id} guide={guide} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-card border border-border rounded-lg">
                      <p className="text-muted-foreground mb-2">{t('noGuidesFound')}</p>
                      <p className="text-sm text-muted-foreground">{t('tryAdjustingFilters')}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
