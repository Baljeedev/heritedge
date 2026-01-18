"use client"

import { Star, MapPin, Heart, Music, Hammer, Users, Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import type { Experience as ApiExperience } from "@/lib/api/experiences"
import type { Experience as StaticExperience, GuideExperience, MusicShowExperience, WorkshopExperience } from "@/data/experiences"

interface ExperienceCardProps {
  experience: ApiExperience | StaticExperience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }
  
  // Check if this is API data or static data (must be defined first)
  const isApiData = '_id' in experience
  
  // Get video URL
  const getVideoUrl = () => {
    if (isApiData) {
      return (experience as ApiExperience).video
    }
    return undefined
  }
  
  // Get image URL
  const getImageUrl = () => {
    if (isApiData) {
      return (experience as ApiExperience).image || "/placeholder.svg"
    }
    return (experience as StaticExperience).image || "/placeholder.svg"
  }
  
  const videoUrl = getVideoUrl()
  const imageUrl = getImageUrl()
  
  // Handle sites data - could be populated objects or just IDs
  const getSiteNames = () => {
    if (!experience.sites) return []
    
    if (isApiData) {
      const apiExp = experience as ApiExperience
      if (Array.isArray(apiExp.sites) && apiExp.sites.length > 0) {
        if (typeof apiExp.sites[0] === 'object' && apiExp.sites[0] !== null && 'name' in apiExp.sites[0]) {
          return (apiExp.sites as Array<{ name: string }>).map(site => site.name)
        }
      }
      return ['Heritage Site'] // fallback for unpopulated sites
    } else {
      // Static data - return generic site names
      const staticExp = experience as StaticExperience
      return staticExp.sites.map(() => 'Heritage Site')
    }
  }

  const siteNames = getSiteNames()

  const getTypeIcon = () => {
    if (isApiData) {
      const type = (experience as ApiExperience).type
      switch (type) {
        case "guide":
          return <Users className="w-5 h-5" />
        case "music":
          return <Music className="w-5 h-5" />
        case "workshop":
          return <Hammer className="w-5 h-5" />
        default:
          return <Users className="w-5 h-5" />
      }
    } else {
      const type = (experience as StaticExperience).type as string
      if (type === "guide" || type === "tour") {
        return <Users className="w-5 h-5" />
      } else if (type === "music" || type === "event") {
        return <Music className="w-5 h-5" />
      } else if (type === "workshop" || type === "activity") {
        return <Hammer className="w-5 h-5" />
      }
      return <Users className="w-5 h-5" />
    }
  }

  const getTypeLabel = () => {
    if (isApiData) {
      const type = (experience as ApiExperience).type
      switch (type) {
        case "guide":
          return "Local Guide"
        case "music":
          return "Music Show"
        case "workshop":
          return "Workshop"
        default:
          return "Experience"
      }
    } else {
      const type = (experience as StaticExperience).type as string
      if (type === "guide" || type === "tour") {
        return "Local Guide"
      } else if (type === "music" || type === "event") {
        return "Music Show"
      } else if (type === "workshop" || type === "activity") {
        return "Workshop"
      }
      return "Experience"
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all">
      {/* Header with Image and Video */}
      <div className="relative h-48 bg-muted overflow-hidden group flex">
        {/* Image */}
        {imageUrl && (
          <div className="flex-1 relative overflow-hidden">
            <img
              src={imageUrl}
              alt={experience.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                {getTypeIcon()}
                {getTypeLabel()}
              </span>
            </div>
          </div>
        )}
        
        {/* Video */}
        {videoUrl && (
          <div className="flex-1 relative overflow-hidden group/video">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-full object-cover"
              poster={imageUrl} // Use image as video thumbnail
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onEnded={() => setIsVideoPlaying(false)}
            />
            {!isVideoPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer group-hover/video:bg-black/30 transition-colors"
                onClick={handlePlayClick}
              >
                <div className="bg-white/90 hover:bg-white rounded-full p-4 shadow-lg transition-all group-hover/video:scale-110">
                  <Play className="w-8 h-8 text-foreground fill-foreground" />
                </div>
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all z-10"
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-foreground"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg  font-bold text-foreground mb-2">{experience.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(experience.rating) ? "fill-accent text-accent" : "text-border"}`}
              />
            ))}
          </div>
          <span className="font-semibold text-foreground">{experience.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({isApiData ? (experience as ApiExperience).reviewCount : (experience as StaticExperience).reviews})
          </span>
        </div>

        {/* Sites */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Available at:</p>
          <div className="flex flex-wrap gap-1">
            {siteNames.map((siteName, index) => (
              <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {siteName}
              </span>
            ))}
          </div>
        </div>

        {/* Duration info for all types */}
        <div className="mb-4 text-xs">
          <div className="bg-muted p-2 rounded flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              {isApiData 
                ? (experience as ApiExperience).duration || "Full day"
                : (experience as StaticExperience).type === "guide" 
                  ? "Full day" 
                  : (experience as StaticExperience).type === "music" 
                    ? (experience as MusicShowExperience).duration
                    : (experience as WorkshopExperience).duration
              }
            </span>
          </div>
        </div>

        {/* Max participants for API data */}
        {isApiData && (experience as ApiExperience).maxParticipants && (
          <div className="mb-4 text-xs">
            <div className="bg-muted p-2 rounded flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                Max {(experience as ApiExperience).maxParticipants} people
              </span>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4 border-t border-border pt-4">
          <span className="text-2xl font-bold text-primary">${experience.price}</span>
          <span className="text-sm text-muted-foreground">per person</span>
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
            {/* Description */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">About</h4>
              <p className="text-sm text-muted-foreground">{experience.description}</p>
            </div>

            {/* API Data Details */}
            {isApiData && (
              <>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-foreground">Skill Level:</span>{" "}
                    <span className="text-muted-foreground capitalize">
                      {(experience as ApiExperience).skillLevel}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Duration:</span>{" "}
                    <span className="text-muted-foreground">
                      {(() => {
                        const duration = (experience as ApiExperience).duration
                        if (typeof duration === 'number' && duration !== undefined && !isNaN(duration)) {
                          return `${Math.floor(duration / 60)}h ${duration % 60}m`
                        }
                        return duration || 'N/A'
                      })()}
                    </span>
                  </div>
                </div>
                
                {(() => {
                  const guideId = (experience as ApiExperience).guideId
                  if (guideId && typeof guideId === 'object' && guideId !== null && 'name' in guideId && 'specialization' in guideId) {
                    return (
                      <div>
                        <h4 className="font-semibold text-foreground text-sm mb-2">Guide</h4>
                        <p className="text-sm text-muted-foreground">
                          {guideId.name} - {guideId.specialization}
                        </p>
                      </div>
                    )
                  }
                  return null
                })()}
              </>
            )}

            {/* Static Data Details - only show for static experiences */}
            {!isApiData && experience.type === "guide" && (
              <>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {(experience as GuideExperience).languages.map((lang) => (
                      <span key={lang} className="text-xs bg-muted text-foreground px-2 py-1 rounded">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">Certifications</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {(experience as GuideExperience).certifications.map((cert, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {!isApiData && (() => {
              const type = (experience as StaticExperience).type as string
              return type === "workshop" || type === "activity"
            })() && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-semibold text-foreground">Skill Level:</span>{" "}
                  <span className="text-muted-foreground capitalize">
                    {(experience as WorkshopExperience).skillLevel || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Materials:</span>{" "}
                  <span className="text-muted-foreground">
                    {(experience as WorkshopExperience).materialsIncluded ? "Included" : "Not included"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

