"use client"

import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useExperiences, useGuides } from "@/lib/api"
import type { ExperienceType } from "@/data/experiences"
import type { Experience } from "@/lib/api/experiences"
import { ExperienceFilter } from "@/core/components/experiences/experience-filter"
import { Navigation } from "@/core/components/navigation"
import { ExperienceCard } from "@/core/components/experiences/experience-card"
import { GuideCard } from "@/core/components/guides/guide-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Users, Music, Hammer, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import type { Guide } from "@/lib/api/guides"

// Component for rendering guides tab (uses guides API)
function GuidesTabContent({
  guidesData,
  guidesLoading,
  guidesError
}: {
  guidesData: { guides: Guide[] } | undefined
  guidesLoading: boolean
  guidesError: Error | null
}) {
  const { t } = useI18n()

  if (guidesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">{t('loadingGuides')}</span>
      </div>
    )
  }

  if (guidesError) {
    return (
      <div className="text-center py-12 bg-card border border-border rounded-lg">
        <p className="text-muted-foreground mb-2">{t('errorLoadingGuides')}</p>
        <p className="text-sm text-muted-foreground">{t('makeSureBackendRunning')}</p>
      </div>
    )
  }

  const guides = guidesData?.guides || []

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          {guides.length} {guides.length === 1 ? t('guidesAvailable') : t('guidesAvailablePlural')}
        </h2>
      </div>
      {guides.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide) => (
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
  )
}

// Component for rendering experience tabs with API data (music and workshops)
function ExperienceTabContent({
  type,
  data,
  isLoading,
  error,
  getTypeLabel
}: {
  type: "music" | "workshop"
  data: { experiences: Experience[] } | undefined
  isLoading: boolean
  error: Error | null
  getTypeLabel: (type: ExperienceType) => string
}) {
  const { t } = useI18n()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">{t('loadingExperiences')}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-card border border-border rounded-lg">
        <p className="text-muted-foreground mb-2">{t('errorLoadingExperiences')}</p>
        <p className="text-sm text-muted-foreground">{t('makeSureBackendRunning')}</p>
      </div>
    )
  }

  // Type guard to check if data has experiences property
  const experiences = (data && 'experiences' in data) ? data.experiences : []

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          {experiences.length} {getTypeLabel(type)} {t('experiencesAvailable')}
        </h2>
      </div>
      {experiences.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {experiences.map((experience: Experience) => (
            <ExperienceCard key={`${experience.type}-${experience._id}`} experience={experience} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground mb-2">{t('noExperiencesFound')} {getTypeLabel(type)} {t('noExperiencesFoundPlural')}</p>
          <p className="text-sm text-muted-foreground">{t('tryAdjustingFilters')}</p>
        </div>
      )}
    </>
  )
}

export default function ExperiencesPage() {
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get("category")

  const getTypeFromParam = (param: string | null): ExperienceType => {
    if (param === "guides") return "guide"
    if (param === "music") return "music"
    if (param === "workshops") return "workshop"
    return "guide" // Default to guides
  }

  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<ExperienceType>(getTypeFromParam(categoryParam))
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "premium">("all")
  const [ratingFilter, setRatingFilter] = useState<number>(0)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null)
  const [selectedArtForm, setSelectedArtForm] = useState<string | null>(null)

  // Remove the effect; instead, compute the default type value inside useState initializer
  // and derive the selectedType from categoryParam directly when needed.
  // Option 1: If you want selectedType to always reflect the URL param,
  // just compute it as a derived value (not via state):
  // const selectedType = getTypeFromParam(categoryParam);

  // But if you want to allow setSelectedType for user interaction,
  // initialize once, but don't update on every URL param change (recommended):

  // Build query parameters for API
  const getQueryParams = (type: ExperienceType) => {
    const params: Record<string, string | number> = { type }

    if (selectedSite) params.siteId = selectedSite
    if (ratingFilter > 0) params.minRating = ratingFilter

    if (priceFilter !== "all") {
      if (priceFilter === "budget") params.maxPrice = 100
      else if (priceFilter === "mid") params.maxPrice = 200
      // premium has no maxPrice limit
    }

    if (type === "music") {
      if (selectedCity) params.cityId = selectedCity
      if (selectedInstrument) params.instrumentId = selectedInstrument
    } else if (type === "workshop") {
      if (selectedCity) params.cityId = selectedCity
      if (selectedArtForm) params.artFormId = selectedArtForm
    }

    return params
  }

  // Build query parameters for guides API (different from experiences)
  const getGuidesQueryParams = () => {
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

  // Fetch guides using the guides API (not experiences API)
  const { data: guidesData, isLoading: guidesLoading, error: guidesError } = useGuides(getGuidesQueryParams())
  // Fetch experiences for music and workshops
  const { data: musicData, isLoading: musicLoading, error: musicError } = useExperiences(getQueryParams("music"))
  const { data: workshopsData, isLoading: workshopsLoading, error: workshopsError } = useExperiences(getQueryParams("workshop"))

  const getTypeLabel = (type: ExperienceType) => {
    switch (type) {
      case "guide":
        return t('localGuides')
      case "music":
        return t('musicShows')
      case "workshop":
        return t('workshops')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl  font-bold text-foreground mb-2">{t('tripsAndExperiencesTitle')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('experiencesDescription')}
          </p>

          <Tabs value={selectedType} onValueChange={(value) => { setSelectedType(value as ExperienceType); setSelectedCity(null); setSelectedInstrument(null); setSelectedArtForm(null) }} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('localGuides')}
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                {t('musicShows')}
              </TabsTrigger>
              <TabsTrigger value="workshop" className="flex items-center gap-2">
                <Hammer className="w-4 h-4" />
                {t('workshops')}
              </TabsTrigger>
            </TabsList>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <ExperienceFilter
                  activeTab={selectedType}
                  selectedSite={selectedSite}
                  onSiteChange={setSelectedSite}
                  priceFilter={priceFilter}
                  onPriceChange={setPriceFilter}
                  ratingFilter={ratingFilter}
                  onRatingChange={setRatingFilter}
                  selectedCity={selectedCity}
                  onCityChange={setSelectedCity}
                  selectedInstrument={selectedInstrument}
                  onInstrumentChange={setSelectedInstrument}
                  selectedArtForm={selectedArtForm}
                  onArtFormChange={setSelectedArtForm}
                />
              </div>

              {/* Experience Cards Grid */}
              <div className="lg:col-span-3">
                <TabsContent value="guide" className="mt-0">
                  <GuidesTabContent
                    guidesData={guidesData}
                    guidesLoading={guidesLoading}
                    guidesError={guidesError}
                  />
                </TabsContent>

                <TabsContent value="music" className="mt-0">
                  <ExperienceTabContent
                    type="music"
                    data={musicData}
                    isLoading={musicLoading}
                    error={musicError}
                    getTypeLabel={getTypeLabel}
                  />
                </TabsContent>

                <TabsContent value="workshop" className="mt-0">
                  <ExperienceTabContent
                    type="workshop"
                    data={workshopsData}
                    isLoading={workshopsLoading}
                    error={workshopsError}
                    getTypeLabel={getTypeLabel}
                  />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

