"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { useHeritageSites } from "@/lib/api"
import { citiesApi, type City } from "@/lib/api/cities"
import { instrumentsApi, type Instrument } from "@/lib/api/instruments"
import { artFormsApi, type ArtForm } from "@/lib/api/artForms"

interface ExperienceFilterProps {
  activeTab: "guide" | "music" | "workshop"
  selectedSite: string | null
  onSiteChange: (siteId: string | null) => void
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
}

export function ExperienceFilter({
  activeTab,
  selectedSite, onSiteChange,
  priceFilter, onPriceChange,
  ratingFilter, onRatingChange,
  selectedCity, onCityChange,
  selectedInstrument, onInstrumentChange,
  selectedArtForm, onArtFormChange,
}: ExperienceFilterProps) {
  const { data, isLoading } = useHeritageSites({ limit: 100 })
  const sites = data?.sites || []

  const [cities, setCities] = useState<City[]>([])
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [artForms, setArtForms] = useState<ArtForm[]>([])

  useEffect(() => {
    citiesApi.getAll().then(d => setCities(d.cities)).catch(() => {})
    instrumentsApi.getAll().then(d => setInstruments(d.instruments)).catch(() => {})
    artFormsApi.getAll().then(d => setArtForms(d.artForms)).catch(() => {})
  }, [])

  const FilterButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
        active ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-24 h-fit space-y-6">
      <h3 className="font-bold text-foreground text-lg">Filters</h3>

      {/* City Filter — shown for music and workshop tabs */}
      {(activeTab === "music" || activeTab === "workshop") && cities.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-foreground block mb-3">City</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <FilterButton active={selectedCity === null} onClick={() => onCityChange(null)}>All Cities</FilterButton>
            {cities.map(city => (
              <FilterButton key={city._id} active={selectedCity === city._id} onClick={() => onCityChange(city._id)}>
                {city.name}
              </FilterButton>
            ))}
          </div>
        </div>
      )}

      {/* Instruments — music tab only */}
      {activeTab === "music" && instruments.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-foreground block mb-3">Instrument</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <FilterButton active={selectedInstrument === null} onClick={() => onInstrumentChange(null)}>All Instruments</FilterButton>
            {instruments.map(inst => (
              <FilterButton key={inst._id} active={selectedInstrument === inst._id} onClick={() => onInstrumentChange(inst._id)}>
                {inst.name}
              </FilterButton>
            ))}
          </div>
        </div>
      )}

      {/* Art Forms — workshop tab only */}
      {activeTab === "workshop" && artForms.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-foreground block mb-3">Art Form</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <FilterButton active={selectedArtForm === null} onClick={() => onArtFormChange(null)}>All Art Forms</FilterButton>
            {artForms.map(af => (
              <FilterButton key={af._id} active={selectedArtForm === af._id} onClick={() => onArtFormChange(af._id)}>
                {af.name}
              </FilterButton>
            ))}
          </div>
        </div>
      )}

      {/* Heritage Site Filter */}
      <div>
        <label className="text-sm font-semibold text-foreground block mb-3">Heritage Site</label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <FilterButton active={selectedSite === null} onClick={() => onSiteChange(null)}>All Sites</FilterButton>
          {isLoading ? (
            <div className="text-sm text-muted-foreground px-3 py-2">Loading sites...</div>
          ) : (
            sites.map(site => (
              <button
                key={site._id}
                onClick={() => onSiteChange(site._id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm truncate ${
                  selectedSite === site._id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                title={site.name}
              >
                {site.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <label className="text-sm font-semibold text-foreground block mb-3">Price Range</label>
        <div className="space-y-2">
          {(["all", "budget", "mid", "premium"] as const).map(price => (
            <FilterButton key={price} active={priceFilter === price} onClick={() => onPriceChange(price)}>
              {price === "all" && "Any Price"}
              {price === "budget" && "Under $100"}
              {price === "mid" && "$100-$200"}
              {price === "premium" && "Over $200"}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="text-sm font-semibold text-foreground block mb-3">Minimum Rating</label>
        <div className="space-y-2">
          {[0, 3.5, 4.0, 4.5].map(rating => (
            <button
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                ratingFilter === rating ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              {rating === 0 && "Any Rating"}
              {rating > 0 && (
                <>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-current" : "opacity-30"}`} />
                    ))}
                  </div>
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
