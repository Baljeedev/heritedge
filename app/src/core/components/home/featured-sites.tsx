"use client"

import { MapPin, Star, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useHeritageSites } from "@/lib/api"

export function FeaturedSites() {
  const { data, isLoading, error } = useHeritageSites({ limit: 8 })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading featured sites...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/50">
        <p className="text-muted-foreground">Unable to load featured sites</p>
        <p className="text-sm text-muted-foreground mt-2">Please make sure the backend API is running</p>
      </div>
    )
  }

  if (!data?.sites || data.sites.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/50">
        <p className="text-muted-foreground">No heritage sites available</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
      {data.sites.map((site) => (
        <Link key={site._id} to={`/map?site=${site._id}`} className="group block">
          <article className="h-full">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-muted shadow-sm group-hover:shadow-[0_12px_40px_oklch(0.42_0.15_35/0.15)] transition-shadow duration-300">
              <img
                src={site.image || "/placeholder.svg"}
                alt={site.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              {site.era && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium backdrop-blur-sm">
                  {site.era}
                </span>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-1.5 text-white/90 text-sm mb-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {site.city}, {site.state || site.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-white">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    <span className="text-sm font-semibold">{site.rating?.toFixed(1) || "N/A"}</span>
                  </div>
                  <span className="text-white/70 text-xs">({(site.reviewCount || 0).toLocaleString()})</span>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 px-0.5">
              {site.name}
            </h3>
          </article>
        </Link>
      ))}
    </div>
  )
}
