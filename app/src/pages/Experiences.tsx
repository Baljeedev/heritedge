"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useGuides, useHeritageSites } from "@/lib/api"
import type { GuidesQueryParams } from "@/lib/api/guides"
import type { ExperienceType } from "@/data/experiences"
import { ExperienceFilter } from "@/core/components/experiences/experience-filter"
import { Navigation } from "@/core/components/navigation"
import { GuideCard } from "@/core/components/guides/guide-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Users, Music, Hammer, Loader2, Compass, Clock, type LucideIcon } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import type { Guide } from "@/lib/api/guides"

function CountBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
      {children}
    </span>
  )
}

function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-dashed border-border bg-muted/20 min-h-[320px]">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <p className="text-foreground font-medium mb-1 text-center">{title}</p>
      <p className="text-sm text-muted-foreground text-center max-w-sm">{subtitle}</p>
    </div>
  )
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[320px]">
      <Loader2 className="h-9 w-9 animate-spin text-primary mb-3" />
      <span className="text-muted-foreground">{message}</span>
    </div>
  )
}

function GuidesTabContent({
  guidesLoading,
  guidesError,
  filteredGuides,
}: {
  guidesLoading: boolean
  guidesError: Error | null
  filteredGuides: Guide[]
}) {
  const { t } = useI18n()

  if (guidesLoading) return <LoadingState message={t("loadingGuides")} />

  if (guidesError) {
    return (
      <EmptyState
        icon={Users}
        title={t("errorLoadingGuides")}
        subtitle={t("makeSureBackendRunning")}
      />
    )
  }

  return (
    <>
      <div className="mb-6">
        <CountBadge>
          {filteredGuides.length}{" "}
          {filteredGuides.length === 1 ? t("guidesAvailable") : t("guidesAvailablePlural")}
        </CountBadge>
      </div>
      {filteredGuides.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide._id} guide={guide} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={t("noGuidesFound")}
          subtitle={t("tryAdjustingFilters")}
        />
      )}
    </>
  )
}

function ComingSoonTabContent({ type }: { type: "music" | "workshop" }) {
  const { t } = useI18n()
  const Icon = type === "music" ? Music : Hammer

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl border border-dashed border-primary/30 bg-gradient-to-b from-primary/5 to-muted/20 min-h-[400px]">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-9 h-9 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-md">
          <Clock className="w-4 h-4 text-accent-foreground" />
        </div>
      </div>
      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-semibold tracking-wide uppercase mb-4">
        {t("comingSoon")}
      </span>
      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 text-center">
        {type === "music" ? t("musicShows") : t("workshops")}
      </h3>
      <p className="text-muted-foreground text-center max-w-md leading-relaxed">
        {type === "music" ? t("comingSoonMusicDescription") : t("comingSoonWorkshopDescription")}
      </p>
    </div>
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
    return "guide"
  }

  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<ExperienceType>(getTypeFromParam(categoryParam))
  const [priceFilter, setPriceFilter] = useState<"all" | "budget" | "mid" | "premium">("all")
  const [ratingFilter, setRatingFilter] = useState<number>(0)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null)
  const [selectedArtForm, setSelectedArtForm] = useState<string | null>(null)

  const { data: heritageSitesData } = useHeritageSites({ limit: 200 })
  const heritageSites = heritageSitesData?.sites || []
  const headerImage =
    heritageSites.find((s) => s.name.toLowerCase().includes("taj"))?.image ||
    heritageSites.find((s) => s.image)?.image

  const clearAllFilters = () => {
    setSelectedSite(null)
    setPriceFilter("all")
    setRatingFilter(0)
    setSelectedCity(null)
    setSelectedInstrument(null)
    setSelectedArtForm(null)
  }

  const guidesQueryParams = useMemo((): GuidesQueryParams => {
    const params: GuidesQueryParams = {}
    if (selectedSite) params.siteId = selectedSite
    else if (selectedCity) params.cityId = selectedCity
    if (ratingFilter > 0) params.minRating = ratingFilter
    if (priceFilter === "budget") params.maxPrice = 100
    else if (priceFilter === "mid") {
      params.minPrice = 100
      params.maxPrice = 200
    } else if (priceFilter === "premium") params.minPrice = 200
    return params
  }, [selectedSite, selectedCity, ratingFilter, priceFilter])

  const { data: guidesData, isLoading: guidesLoading, error: guidesError } = useGuides(guidesQueryParams)

  const filteredGuides = guidesData?.guides || []

  const isGuidesTab = selectedType === "guide"

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-border/50 min-h-[280px] md:min-h-[320px]">
        {headerImage ? (
          <img
            src={headerImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-secondary/30 to-background" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_100%_at_30%_40%,oklch(0.42_0.15_35/0.4),transparent_60%)]" />
        <div className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

        {/* decorative pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-24 md:pt-20 md:pb-28">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/25 text-white/95 text-xs font-semibold tracking-[0.15em] uppercase mb-6 backdrop-blur-md shadow-lg">
            <Compass className="w-4 h-4 text-accent" />
            {t("experiences")}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white mb-5 tracking-tight leading-[1.08] max-w-4xl">
            {t("tripsAndExperiencesTitle")}
          </h1>

          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-accent via-primary to-transparent mb-5" />

          <p className="text-base md:text-lg text-white/75 max-w-2xl leading-relaxed font-sans font-normal">
            {t("experiencesDescription")}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      </section>

      <div className="px-4 mt-8 md:mt-10 relative z-10 pb-8">
        <div className="max-w-7xl mx-auto">
          <Tabs
            value={selectedType}
            onValueChange={(value) => {
              setSelectedType(value as ExperienceType)
              setSelectedInstrument(null)
              setSelectedArtForm(null)
            }}
            className="w-full"
          >
            <TabsList className="mb-10 md:mb-12 bg-card/95 backdrop-blur-sm border border-border/60 shadow-lg p-1.5 rounded-full h-auto w-fit flex-wrap gap-1">
              <TabsTrigger
                value="guide"
                className="flex items-center gap-2 rounded-full px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <Users className="w-4 h-4" />
                {t("localGuides")}
              </TabsTrigger>
              <TabsTrigger
                value="music"
                className="flex items-center gap-2 rounded-full px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <Music className="w-4 h-4" />
                {t("musicShows")}
              </TabsTrigger>
              <TabsTrigger
                value="workshop"
                className="flex items-center gap-2 rounded-full px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <Hammer className="w-4 h-4" />
                {t("workshops")}
              </TabsTrigger>
            </TabsList>

            <div className={isGuidesTab ? "grid lg:grid-cols-4 gap-8 lg:gap-10" : ""}>
              {isGuidesTab && (
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
                    onClearFilters={clearAllFilters}
                  />
                </div>
              )}

              <div className={isGuidesTab ? "lg:col-span-3 min-h-[400px]" : "min-h-[400px]"}>
                <TabsContent value="guide" className="mt-0">
                  <GuidesTabContent
                    guidesLoading={guidesLoading}
                    guidesError={guidesError}
                    filteredGuides={filteredGuides}
                  />
                </TabsContent>

                <TabsContent value="music" className="mt-0">
                  <ComingSoonTabContent type="music" />
                </TabsContent>

                <TabsContent value="workshop" className="mt-0">
                  <ComingSoonTabContent type="workshop" />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
