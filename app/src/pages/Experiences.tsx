"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useExperiences, useGuides } from "@/lib/api"
import type { ExperienceType } from "@/data/experiences"
import { ExperienceFilter } from "@/core/components/experiences/experience-filter"
import { Navigation } from "@/core/components/navigation"
import { ExperienceCard } from "@/core/components/experiences/experience-card"
import { GuideCard } from "@/core/components/guides/guide-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Users, Music, Hammer, Loader2 } from "lucide-react"

export default function ExperiencesPage() {
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

  useEffect(() => {
    setSelectedType(getTypeFromParam(categoryParam))
  }, [categoryParam])

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

  const getExperiencesForType = (type: ExperienceType) => {
    switch (type) {
      case "guide":
        return { data: guidesData, isLoading: guidesLoading, error: guidesError }
      case "music":
        return { data: musicData, isLoading: musicLoading, error: musicError }
      case "workshop":
        return { data: workshopsData, isLoading: workshopsLoading, error: workshopsError }
    }
  }

  const getTypeLabel = (type: ExperienceType) => {
    switch (type) {
      case "guide":
        return "Local Guides"
      case "music":
        return "Music Shows"
      case "workshop":
        return "Workshops"
    }
  }

  // Component for rendering guides tab (uses guides API)
  function GuidesTabContent() {
    if (guidesLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading guides...</span>
        </div>
      )
    }

    if (guidesError) {
      return (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground mb-2">Error loading guides</p>
          <p className="text-sm text-muted-foreground">Please make sure the backend API is running</p>
        </div>
      )
    }

    const guides = guidesData?.guides || []

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {guides.length} guide{guides.length !== 1 ? "s" : ""} available
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
            <p className="text-muted-foreground mb-2">No guides found matching your criteria</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </>
    )
  }

  // Component for rendering experience tabs with API data (music and workshops)
  function ExperienceTabContent({ type }: { type: "music" | "workshop" }) {
    const { data, isLoading, error } = getExperiencesForType(type)
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading {getTypeLabel(type).toLowerCase()}...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground mb-2">Error loading {getTypeLabel(type).toLowerCase()}</p>
          <p className="text-sm text-muted-foreground">Please make sure the backend API is running</p>
        </div>
      )
    }

    const experiences = data?.experiences || []

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {experiences.length} {getTypeLabel(type).toLowerCase()} available
          </h2>
        </div>
        {experiences.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {experiences.map((experience) => (
              <ExperienceCard key={`${experience.type}-${experience._id}`} experience={experience} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground mb-2">No {getTypeLabel(type).toLowerCase()} found matching your criteria</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl  font-bold text-foreground mb-2">Trips & Experiences</h1>
          <p className="text-muted-foreground mb-8">
            Discover immersive cultural experiences including local guides, music shows, workshops, and more. Support local
            communities while exploring world heritage sites.
          </p>

          <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as ExperienceType)} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Local Guides
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                Music Shows
              </TabsTrigger>
              <TabsTrigger value="workshop" className="flex items-center gap-2">
                <Hammer className="w-4 h-4" />
                Workshops
              </TabsTrigger>
            </TabsList>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <ExperienceFilter
                  selectedSite={selectedSite}
                  onSiteChange={setSelectedSite}
                  priceFilter={priceFilter}
                  onPriceChange={setPriceFilter}
                  ratingFilter={ratingFilter}
                  onRatingChange={setRatingFilter}
                />
              </div>

              {/* Experience Cards Grid */}
              <div className="lg:col-span-3">
                <TabsContent value="guide" className="mt-0">
                  <GuidesTabContent />
                </TabsContent>

                <TabsContent value="music" className="mt-0">
                  <ExperienceTabContent type="music" />
                </TabsContent>

                <TabsContent value="workshop" className="mt-0">
                  <ExperienceTabContent type="workshop" />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

