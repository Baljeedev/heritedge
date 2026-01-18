"use client"

import { Star } from "lucide-react"
import { useHeritageSites } from "@/lib/api"

interface GuideFilterProps {
  selectedSite: string | null
  onSiteChange: (siteId: string | null) => void
  priceFilter: "all" | "budget" | "mid" | "premium"
  onPriceChange: (filter: "all" | "budget" | "mid" | "premium") => void
  ratingFilter: number
  onRatingChange: (rating: number) => void
}

export function GuideFilter({
  selectedSite,
  onSiteChange,
  priceFilter,
  onPriceChange,
  ratingFilter,
  onRatingChange,
}: GuideFilterProps) {
  const { data, isLoading } = useHeritageSites({ limit: 100 })
  const sites = data?.sites || []

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-24 h-fit space-y-6">
      <h3 className=" font-bold text-foreground text-lg">Filters</h3>

      {/* Site Filter */}
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

      {/* Price Filter */}
      <div>
        <label className="text-sm font-semibold text-foreground block mb-3">Price Range</label>
        <div className="space-y-2">
          {["all", "budget", "mid", "premium"].map((price) => (
            <button
              key={price}
              onClick={() => onPriceChange(price as any)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                priceFilter === price
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              {price === "all" && "Any Price"}
              {price === "budget" && "Under $100/day"}
              {price === "mid" && "$100-$200/day"}
              {price === "premium" && "Over $200/day"}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
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
