"use client"

import { Star, MapPin, Award, Users, MessageSquare, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { HERITAGE_SITES } from "@/data/heritage-sites"
import type { Guide as ApiGuide } from "@/lib/api/guides"

interface StaticGuide {
  id: number
  name: string
  image: string
  specialization: string
  sites: number[]
  rating: number
  reviews: number
  pricePerDay: number
  languages: string[]
  experience: number
  bio: string
  certifications: string[]
  topReviews: Array<{ author: string; rating: number; text: string; date: string }>
}

interface GuideCardProps {
  guide: ApiGuide | StaticGuide
}

export function GuideCard({ guide }: GuideCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Check if this is API data or static data
  const isApiData = '_id' in guide
  
  // Handle sites data - could be populated objects or just IDs
  const getSiteNames = () => {
    if (!guide.sites) return []
    
    if (isApiData) {
      const apiGuide = guide as ApiGuide
      if (Array.isArray(apiGuide.sites) && apiGuide.sites.length > 0) {
        if (typeof apiGuide.sites[0] === 'object' && 'name' in apiGuide.sites[0]) {
          return (apiGuide.sites as any[]).map(site => site.name)
        }
      }
      return ['Heritage Site'] // fallback for unpopulated sites
    } else {
      // Static data - use HERITAGE_SITES lookup
      const staticGuide = guide as StaticGuide
      const guideSites = HERITAGE_SITES.filter((site) => staticGuide.sites.includes(site.id))
      return guideSites.map(site => site.name)
    }
  }

  const siteNames = getSiteNames()
  
  // Get specialization display
  const getSpecialization = () => {
    if (isApiData) {
      const apiGuide = guide as ApiGuide
      return Array.isArray(apiGuide.specialization) ? apiGuide.specialization.join(', ') : apiGuide.specialization
    } else {
      return (guide as StaticGuide).specialization
    }
  }

  // Get review count
  const getReviewCount = () => {
    if (isApiData) {
      return (guide as ApiGuide).reviewCount
    } else {
      return (guide as StaticGuide).reviews
    }
  }

  // Get certifications
  const getCertifications = () => {
    if (isApiData) {
      const apiGuide = guide as ApiGuide
      return apiGuide.certifications.map(cert => cert.name)
    } else {
      return (guide as StaticGuide).certifications
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all">
      {/* Header with Image */}
      <div className="relative h-48 bg-muted overflow-hidden group">
        <img
          src={
            isApiData 
              ? (guide as ApiGuide).avatar || "/placeholder.svg"
              : (guide as StaticGuide).image || "/placeholder.svg"
          }
          alt={guide.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all"
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-foreground"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name & Title */}
        <h3 className="text-lg  font-bold text-foreground">{guide.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{getSpecialization()}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(guide.rating) ? "fill-accent text-accent" : "text-border"}`}
              />
            ))}
          </div>
          <span className="font-semibold text-foreground">{guide.rating}</span>
          <span className="text-xs text-muted-foreground">({getReviewCount()})</span>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="bg-muted p-2 rounded text-center">
            <Award className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-muted-foreground">
              {isApiData ? 'Certified' : `${(guide as StaticGuide).experience}+ years`}
            </p>
          </div>
          <div className="bg-muted p-2 rounded text-center">
            <Users className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-muted-foreground">{guide.languages.length} languages</p>
          </div>
          <div className="bg-muted p-2 rounded text-center">
            <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-muted-foreground">{siteNames.length} sites</p>
          </div>
        </div>

        {/* Sites */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Specializes in:</p>
          <div className="flex flex-wrap gap-1">
            {siteNames.map((siteName, index) => (
              <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {siteName}
              </span>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4 border-t border-border pt-4">
          <span className="text-2xl font-bold text-primary">${guide.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">per day</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
            Book Now
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)} className="flex-1">
            {showDetails ? "Hide" : "View"} Details
          </Button>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {/* Bio */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">About</h4>
              <p className="text-sm text-muted-foreground">{guide.bio}</p>
            </div>

            {/* Languages */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {guide.languages.map((lang) => (
                  <span key={lang} className="text-xs bg-muted text-foreground px-2 py-1 rounded">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">Certifications</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {getCertifications().map((cert, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Reviews - only show for static data */}
            {!isApiData && (guide as StaticGuide).topReviews && (
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-2">Recent Reviews</h4>
                <div className="space-y-2">
                  {(guide as StaticGuide).topReviews.slice(0, 2).map((review, i) => (
                    <div key={i} className="text-xs bg-muted p-2 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-foreground">{review.author}</p>
                        <span className="text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-1">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`w-2.5 h-2.5 ${j < review.rating ? "fill-accent text-accent" : "text-border"}`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground line-clamp-2">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Button */}
            <Button variant="outline" className="w-full bg-transparent" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Guide
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
