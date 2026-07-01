"use client"

import { useState, useEffect, useRef } from "react"
import { Star, Search, MapPin, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useHeritageSites } from "@/lib/api"
import { citiesApi, type City } from "@/lib/api/cities"
import { instrumentsApi, type Instrument } from "@/lib/api/instruments"
import { artFormsApi, type ArtForm } from "@/lib/api/artForms"
import { useI18n } from "@/lib/i18n/context"
import type { HeritageSite } from "@/lib/api/heritageSites"
import { SearchableSelect } from "@/core/components/ui/searchable-select"
import { Separator } from "@/core/components/ui/separator"
import { cn } from "@/lib/utils"

interface ExperienceFilterProps {
  activeTab: "guide" | "music" | "workshop"
  selectedSite: string | null
  onSiteChange: (siteId: string | null, siteName?: string | null) => void
  priceFilter: "all" | "budget" | "mid" | "premium"
  onPriceChange: (filter: "all" | "budget" | "mid" | "premium") => void
  ratingFilter: number
  onRatingChange: (rating: number) => void
  selectedCity: string | null
  onCityChange: (cityId: string | null) => void
  selectedInstrument: string | null
  onInstrumentChange: (instrumentId: string | null) => void
  selectedArtForm: string | null
  onArtFormChange: (artFormId: string | null) => void
  onClearFilters: () => void
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-2.5">
      {children}
    </label>
  )
}

export function ExperienceFilter({
  activeTab,
  selectedSite,
  onSiteChange,
  priceFilter,
  onPriceChange,
  ratingFilter,
  onRatingChange,
  selectedCity,
  onCityChange,
  selectedInstrument,
  onInstrumentChange,
  selectedArtForm,
  onArtFormChange,
  onClearFilters,
}: ExperienceFilterProps) {
  const { t } = useI18n()
  const [cities, setCities] = useState<City[]>([])
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [artForms, setArtForms] = useState<ArtForm[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSiteName, setSelectedSiteName] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    citiesApi.getAll().then((d) => setCities(d.cities)).catch(() => {})
    instrumentsApi.getAll().then((d) => setInstruments(d.instruments)).catch(() => {})
    artFormsApi.getAll().then((d) => setArtForms(d.artForms)).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: searchData, isLoading: searchLoading } = useHeritageSites({
    search: debouncedSearch || undefined,
    limit: 8,
  })
  const suggestions = debouncedSearch ? searchData?.sites || [] : []

  useEffect(() => {
    if (!selectedSite) setSelectedSiteName(null)
  }, [selectedSite])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSiteSelect = (site: HeritageSite) => {
    onSiteChange(site._id, site.name)
    setSelectedSiteName(site.name)
    setSearchQuery("")
    setShowSuggestions(false)
  }

  const clearMonument = () => {
    onSiteChange(null, null)
    setSelectedSiteName(null)
    setSearchQuery("")
  }

  const hasActiveFilters =
    selectedSite ||
    selectedCity ||
    selectedInstrument ||
    selectedArtForm ||
    priceFilter !== "all" ||
    ratingFilter > 0

  const cityOptions = cities.map((c) => ({
    value: c._id,
    label: c.name,
    sublabel: c.state,
  }))

  const instrumentOptions = instruments.map((i) => ({
    value: i._id,
    label: i.name,
  }))

  const artFormOptions = artForms.map((a) => ({
    value: a._id,
    label: a.name,
  }))

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm sticky top-24 h-fit space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground text-lg">{t("filters")}</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs h-8 text-primary">
            {t("clearFilters")}
          </Button>
        )}
      </div>

      {/* Monument Search */}
      <div>
        <FilterLabel>{t("searchMonuments")}</FilterLabel>
        {selectedSite && selectedSiteName ? (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/20">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-medium text-foreground flex-1 truncate">{selectedSiteName}</span>
            <button onClick={clearMonument} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              placeholder={t("searchMonumentsPlaceholder")}
              className="pl-9 text-sm h-10"
            />
            {showSuggestions && searchQuery && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
              >
                {searchLoading ? (
                  <div className="p-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("searching")}
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((site) => (
                    <button
                      key={site._id}
                      onClick={() => handleSiteSelect(site)}
                      className="w-full text-left px-3 py-2.5 hover:bg-muted transition-colors flex items-start gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{site.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {[site.city, site.state].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-sm text-muted-foreground">{t("noSitesFound")}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* City */}
      <div>
        <FilterLabel>{t("city")}</FilterLabel>
        <SearchableSelect
          options={cityOptions}
          value={selectedCity}
          onChange={onCityChange}
          placeholder={t("selectCity")}
          searchPlaceholder={t("searchCity")}
          allLabel={t("allCities")}
          emptyMessage={t("noOptionsFound")}
        />
      </div>

      {/* Instrument — music */}
      {activeTab === "music" && instruments.length > 0 && (
        <div>
          <FilterLabel>{t("instrument")}</FilterLabel>
          <SearchableSelect
            options={instrumentOptions}
            value={selectedInstrument}
            onChange={onInstrumentChange}
            placeholder={t("selectInstrument")}
            searchPlaceholder={t("searchInstrument")}
            allLabel={t("allInstruments")}
            emptyMessage={t("noOptionsFound")}
          />
        </div>
      )}

      {/* Art Form — workshop */}
      {activeTab === "workshop" && artForms.length > 0 && (
        <div>
          <FilterLabel>{t("artForm")}</FilterLabel>
          <SearchableSelect
            options={artFormOptions}
            value={selectedArtForm}
            onChange={onArtFormChange}
            placeholder={t("selectArtForm")}
            searchPlaceholder={t("searchArtForm")}
            allLabel={t("allArtForms")}
            emptyMessage={t("noOptionsFound")}
          />
        </div>
      )}

      <Separator />

      {/* Price — 2x2 grid */}
      <div>
        <FilterLabel>{t("priceRange")}</FilterLabel>
        <div className="grid grid-cols-2 gap-2">
          {(["all", "budget", "mid", "premium"] as const).map((price) => (
            <button
              key={price}
              onClick={() => onPriceChange(price)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-colors text-center",
                priceFilter === price
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              )}
            >
              {price === "all" && t("anyPrice")}
              {price === "budget" && t("under100")}
              {price === "mid" && t("price100to200")}
              {price === "premium" && t("over200")}
            </button>
          ))}
        </div>
      </div>

      {/* Rating — horizontal chips */}
      <div>
        <FilterLabel>{t("minimumRating")}</FilterLabel>
        <div className="flex flex-wrap gap-2">
          {[0, 3.5, 4.0, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1",
                ratingFilter === rating
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              )}
            >
              {rating === 0 ? (
                t("anyRating")
              ) : (
                <>
                  <Star className="w-3 h-3 fill-current" />
                  {rating}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
