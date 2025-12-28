"use client"

import { Star, MapPin, Heart, Music, Hammer, Users, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { HERITAGE_SITES } from "@/data/heritage-sites"
import type { Experience, GuideExperience, MusicShowExperience, WorkshopExperience } from "@/data/experiences"

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const experienceSites = HERITAGE_SITES.filter((site) => experience.sites.includes(site.id))

  const getTypeIcon = () => {
    switch (experience.type) {
      case "guide":
        return <Users className="w-5 h-5" />
      case "music":
        return <Music className="w-5 h-5" />
      case "workshop":
        return <Hammer className="w-5 h-5" />
    }
  }

  const getTypeLabel = () => {
    switch (experience.type) {
      case "guide":
        return "Local Guide"
      case "music":
        return "Music Show"
      case "workshop":
        return "Workshop"
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all">
      {/* Header with Image */}
      <div className="relative h-48 bg-muted overflow-hidden group">
        <img
          src={experience.image || "/placeholder.svg"}
          alt={experience.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            {getTypeIcon()}
            {getTypeLabel()}
          </span>
        </div>
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all"
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-foreground"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg font-serif font-bold text-foreground mb-2">{experience.name}</h3>

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
          <span className="text-xs text-muted-foreground">({experience.reviews})</span>
        </div>

        {/* Sites */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Available at:</p>
          <div className="flex flex-wrap gap-1">
            {experienceSites.map((site) => (
              <span key={site.id} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {site.name}
              </span>
            ))}
          </div>
        </div>

        {/* Type-specific quick info */}
        {experience.type === "guide" && (
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-muted p-2 rounded text-center">
              <p className="text-muted-foreground">{(experience as GuideExperience).experience}+ years</p>
            </div>
            <div className="bg-muted p-2 rounded text-center">
              <p className="text-muted-foreground">{(experience as GuideExperience).languages.length} languages</p>
            </div>
          </div>
        )}

        {experience.type === "music" && (
          <div className="mb-4 text-xs">
            <div className="bg-muted p-2 rounded flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{(experience as MusicShowExperience).duration}</span>
            </div>
          </div>
        )}

        {experience.type === "workshop" && (
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-muted p-2 rounded text-center">
              <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-muted-foreground">{(experience as WorkshopExperience).duration}</p>
            </div>
            <div className="bg-muted p-2 rounded text-center">
              <Users className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="text-muted-foreground">
                Max {(experience as WorkshopExperience).maxParticipants} people
              </p>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4 border-t border-border pt-4">
          <span className="text-2xl font-bold text-primary">${experience.price}</span>
          <span className="text-sm text-muted-foreground">
            {experience.type === "guide" ? "per day" : experience.type === "music" ? "per person" : "per person"}
          </span>
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

            {/* Type-specific details */}
            {experience.type === "guide" && (
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

            {experience.type === "music" && (
              <>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">Performers</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {(experience as MusicShowExperience).performers.map((performer, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Music className="w-3 h-3 text-primary" />
                        {performer}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">Schedule</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {(experience as MusicShowExperience).schedule.map((time, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-primary" />
                        {time}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Venue:</span> {(experience as MusicShowExperience).venue}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Genre:</span> {(experience as MusicShowExperience).genre}
                  </p>
                </div>
              </>
            )}

            {experience.type === "workshop" && (
              <>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">Instructor</h4>
                  <p className="text-sm text-muted-foreground">{(experience as WorkshopExperience).instructor}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-2">What You'll Learn</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {(experience as WorkshopExperience).topics.map((topic, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-foreground">Skill Level:</span>{" "}
                    <span className="text-muted-foreground capitalize">
                      {(experience as WorkshopExperience).skillLevel}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Materials:</span>{" "}
                    <span className="text-muted-foreground">
                      {(experience as WorkshopExperience).materialsIncluded ? "Included" : "Not included"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

