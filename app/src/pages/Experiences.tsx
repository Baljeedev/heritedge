"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { EXPERIENCES } from "@/data/experiences"
import type { ExperienceType } from "@/data/experiences"
import { ExperienceFilter } from "@/core/components/experiences/experience-filter"
import { Navigation } from "@/core/components/navigation"
import { ExperienceCard } from "@/core/components/experiences/experience-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Users, Music, Hammer } from "lucide-react"

export default function ExperiencesPage() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get("category")

  const getTypeFromParam = (param: string | null): ExperienceType => {
    if (param === "guides") return "guide"
    if (param === "music") return "music"
    if (param === "workshops") return "workshop"
    return "guide" // Default to guides
  }

  const [selectedSite, setSelectedSite] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<ExperienceType>(getTypeFromParam(categoryParam))
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "premium">("all")
  const [ratingFilter, setRatingFilter] = useState<number>(0)

  useEffect(() => {
    setSelectedType(getTypeFromParam(categoryParam))
  }, [categoryParam])

  const filterExperiences = (type: ExperienceType) => {
    return EXPERIENCES.filter((experience) => {
      const matchesType = experience.type === type
      const matchesSite = !selectedSite || experience.sites.includes(selectedSite)

      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "budget" && experience.price <= 100) ||
        (priceFilter === "mid" && experience.price > 100 && experience.price <= 200) ||
        (priceFilter === "premium" && experience.price > 200)

      const matchesRating = experience.rating >= ratingFilter

      return matchesType && matchesSite && matchesPrice && matchesRating
    })
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Trips & Experiences</h1>
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
                  {(() => {
                    const filtered = filterExperiences("guide")
                    return (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-semibold text-foreground">
                            {filtered.length} {getTypeLabel("guide").toLowerCase()} available
                          </h2>
                        </div>
                        {filtered.length > 0 ? (
                          <div className="grid md:grid-cols-2 gap-6">
                            {filtered.map((experience) => (
                              <ExperienceCard key={`${experience.type}-${experience.id}`} experience={experience} />
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
                  })()}
                </TabsContent>

                <TabsContent value="music" className="mt-0">
                  {(() => {
                    const filtered = filterExperiences("music")
                    return (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-semibold text-foreground">
                            {filtered.length} {getTypeLabel("music").toLowerCase()} available
                          </h2>
                        </div>
                        {filtered.length > 0 ? (
                          <div className="grid md:grid-cols-2 gap-6">
                            {filtered.map((experience) => (
                              <ExperienceCard key={`${experience.type}-${experience.id}`} experience={experience} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-card border border-border rounded-lg">
                            <p className="text-muted-foreground mb-2">No music shows found matching your criteria</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </TabsContent>

                <TabsContent value="workshop" className="mt-0">
                  {(() => {
                    const filtered = filterExperiences("workshop")
                    return (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-semibold text-foreground">
                            {filtered.length} {getTypeLabel("workshop").toLowerCase()} available
                          </h2>
                        </div>
                        {filtered.length > 0 ? (
                          <div className="grid md:grid-cols-2 gap-6">
                            {filtered.map((experience) => (
                              <ExperienceCard key={`${experience.type}-${experience.id}`} experience={experience} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-card border border-border rounded-lg">
                            <p className="text-muted-foreground mb-2">No workshops found matching your criteria</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

