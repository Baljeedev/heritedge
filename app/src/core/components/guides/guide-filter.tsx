"use client"

import { Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useHeritageSites } from "@/lib/api"

interface GuideFilterProps {
  selectedSite: string | null
  onSiteChange: (siteId: string | null) => void
  priceMin: string
  priceMax: string
  onPriceMinChange: (value: string) => void
  onPriceMaxChange: (value: string) => void
  ratingFilter: number
  onRatingChange: (rating: number) => void
}

export function GuideFilter({
  selectedSite,
  onSiteChange,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  ratingFilter,
  onRatingChange,
}: GuideFilterProps) {
  const { data, isLoading } = useHeritageSites({ limit: 100 })
  const sites = data?.sites || []

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-24 h-fit space-y-6">
      <h3 className=" font-bold text-foreground text-lg">Filters</h3>

      <div>
        <label className="text-sm font-semibold text-foreground block mb-3">Heritage Site</label>
        <div className="space-y-2">
          <button
            onClick={() => onSiteChange(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
              selectedSite === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-foreground"
            }`}
          >
            All Sites
          </button>
          {isLoading ? (
            <div className="text-sm text-muted-foreground px-3 py-2">Loading sites...</div>
          ) : (
            sites.map((site) => (
              <button
                key={site._id}
                onClick={() => onSiteChange(site._id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm truncate ${
                  selectedSite === site._id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
                title={site.name}
              >
                {site.name}
              </button>
            ))
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground block mb-3">Price Range (₹/day)</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Min</label>
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
            <label className="text-xs text-muted-foreground mb-1 block">Max</label>
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

      <div>
        <label className="text-sm font-semibold text-foreground block mb-3">Minimum Rating</label>
        <div className="space-y-2">
          {[0, 3.5, 4.0, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                ratingFilter === rating
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
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
