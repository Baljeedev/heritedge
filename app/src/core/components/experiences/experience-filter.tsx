"use client"

import { useState, useEffect } from "react"
import { Star, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { citiesApi, type City } from "@/lib/api/cities"
import { instrumentsApi, type Instrument } from "@/lib/api/instruments"
import { artFormsApi, type ArtForm } from "@/lib/api/artForms"
import { useI18n } from "@/lib/i18n/context"
import { SearchableSelect } from "@/core/components/ui/searchable-select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ExperienceFilterProps {
  activeTab: "guide" | "music" | "workshop"
  specializationFilter: string | null
  onSpecializationChange: (value: string | null) => void
  priceMin: string
  priceMax: string
  onPriceMinChange: (value: string) => void
  onPriceMaxChange: (value: string) => void
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
  specializationFilter,
  onSpecializationChange,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
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

  const [searchQuery, setSearchQuery] = useState(specializationFilter ?? "")

  useEffect(() => {
    citiesApi.getAll().then((d) => setCities(d.cities)).catch(() => {})
    instrumentsApi.getAll().then((d) => setInstruments(d.instruments)).catch(() => {})
    artFormsApi.getAll().then((d) => setArtForms(d.artForms)).catch(() => {})
  }, [])

  useEffect(() => {
    setSearchQuery(specializationFilter ?? "")
  }, [specializationFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchQuery.trim()
      if (trimmed.length >= 2) {
        onSpecializationChange(trimmed)
      } else {
        onSpecializationChange(null)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, onSpecializationChange])

  const clearSpecialization = () => {
    setSearchQuery("")
    onSpecializationChange(null)
  }

  const hasActiveFilters =
    specializationFilter ||
    selectedCity ||
    selectedInstrument ||
    selectedArtForm ||
    priceMin !== "" ||
    priceMax !== "" ||
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

      {/* Specialization Search */}
      <div>
        <FilterLabel>{t("searchSpecialization")}</FilterLabel>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchSpecializationPlaceholder")}
            className="pl-9 pr-9 text-sm h-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSpecialization}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
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

      {/* Price — min/max (INR per day) */}
      <div>
        <FilterLabel>{t("priceRange")}</FilterLabel>
        <p className="text-xs text-muted-foreground mb-2">{t("priceRangeHint")}</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("minPrice")}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={priceMin}
                onChange={(e) => onPriceMinChange(e.target.value)}
                className="pl-7 h-9 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("maxPrice")}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
              <Input
                type="number"
                min={0}
                placeholder="∞"
                value={priceMax}
                onChange={(e) => onPriceMaxChange(e.target.value)}
                className="pl-7 h-9 text-sm"
              />
            </div>
          </div>
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
