"use client"

import { MapPin, Star, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useHeritageSites } from "@/lib/api"

export function FeaturedSites() {
  const { data, isLoading, error } = useHeritageSites({limit: 8})

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading featured sites...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Unable to load featured sites</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please make sure the backend API is running
        </p>
      </div>
    )
  }

  if (!data?.sites || data.sites.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No heritage sites available</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 space-y-6">
      {data.sites.map((site) => (
        <Link key={site._id} to={`/map?site=${site._id}`}>
          <div className="group cursor-pointer">
            <div className="relative h-64 overflow-hidden rounded-lg mb-4 bg-muted">
              <img
                src={site.image || "/placeholder.svg"}
                alt={site.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className=" text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {site.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              {site.city}, {site.state || site.country}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-semibold">{site.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <span className="text-muted-foreground">({(site.reviewCount || 0).toLocaleString()})</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{site.historicalPeriod}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
