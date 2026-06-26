"use client"

import { Star, MapPin, Award, Users, MessageSquare, Heart, Play, BadgeCheck, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import { useAuth } from "@clerk/clerk-react"
import type { Guide as ApiGuide } from "@/lib/api/guides"
import { guidesApi } from "@/lib/api/guides"
import { formatWhatsAppUrl } from "@/lib/whatsapp"
import { GuideReviewForm } from "@/core/components/guides/guide-review-form"
import { useReviews } from "@/lib/api/hooks/useReviews"
import { useI18n } from "@/lib/i18n/context"

const GUIDE_PLACEHOLDER_IMAGE = "/guide-placeholder.svg"

function resolveGuideImage(image?: string | null): string {
  const trimmed = image?.trim()
  return trimmed ? trimmed : GUIDE_PLACEHOLDER_IMAGE
}

interface PopulatedSite {
  name: string
  city?: string
  state?: string
  location?: string
}

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
  const { t } = useI18n()
  const { isSignedIn } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const isApiData = "_id" in guide
  const guideId = isApiData ? (guide as ApiGuide)._id : undefined

  const { data: reviewsData } = useReviews(
    { reviewType: "guide", targetId: guideId ?? "", limit: 3 },
    !!guideId
  )

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  const rawImage = isApiData ? (guide as ApiGuide).image : (guide as StaticGuide).image
  const [imageSrc, setImageSrc] = useState(() => resolveGuideImage(rawImage))
  const videoUrl = isApiData ? (guide as ApiGuide).video : undefined
  const isPlaceholderImage = imageSrc === GUIDE_PLACEHOLDER_IMAGE

  const getPopulatedSites = (): PopulatedSite[] => {
    if (!guide.sites?.length) return []
    if (isApiData) {
      const apiGuide = guide as ApiGuide
      if (typeof apiGuide.sites[0] === "object" && apiGuide.sites[0] !== null && "name" in apiGuide.sites[0]) {
        return (apiGuide.sites as PopulatedSite[]).map((s) => ({
          name: s.name,
          city: s.city,
          state: s.state,
          location: s.location,
        }))
      }
      return []
    }
    return (guide as StaticGuide).sites.map(() => ({ name: "Heritage Site" }))
  }

  const populatedSites = getPopulatedSites()
  const siteNames = populatedSites.map((s) => s.name)

  const getPrimaryLocation = () => {
    const first = populatedSites[0]
    if (!first) return null
    const parts = [first.city, first.state].filter(Boolean)
    if (parts.length > 0) return parts.join(", ")
    return first.location || null
  }

  const primaryLocation = getPrimaryLocation()

  const specialization = isApiData
    ? (guide as ApiGuide).specialization
    : (guide as StaticGuide).specialization

  const reviewCount = isApiData
    ? (guide as ApiGuide).reviewCount
    : (guide as StaticGuide).reviews

  const experience = isApiData
    ? (guide as ApiGuide).experience
    : (guide as StaticGuide).experience

  const languages = guide.languages ?? []

  const certifications = isApiData
    ? ((guide as ApiGuide).certifications ?? []).map((c) => c.name)
    : (guide as StaticGuide).certifications ?? []

  const isVerified = isApiData
    ? ((guide as ApiGuide).certifications ?? []).some((c) => c.verified)
    : false

  const whatsappNumber = isApiData ? (guide as ApiGuide).whatsappNumber : undefined
  const whatsappUrl = whatsappNumber ? formatWhatsAppUrl(whatsappNumber) : ""

  const handleContactGuide = () => {
    if (!isApiData) return
    guidesApi.recordLead((guide as ApiGuide)._id).catch(() => {})
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all">
      <div className="relative h-48 bg-muted overflow-hidden group flex">
        <div className={`relative overflow-hidden ${videoUrl ? "flex-1" : "w-full"}`}>
          <img
            src={imageSrc}
            alt={guide.name}
            onError={() => setImageSrc(GUIDE_PLACEHOLDER_IMAGE)}
            className={`w-full h-full ${isPlaceholderImage ? "object-contain bg-muted p-6" : "object-cover group-hover:scale-105"} transition-transform duration-300`}
          />
        </div>

        {videoUrl && (
          <div className="flex-1 relative overflow-hidden group/video">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-full object-cover"
              poster={imageSrc}
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

        {isVerified && (
          <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium z-10">
            <BadgeCheck className="w-3.5 h-3.5" />
            {t("verifiedGuide")}
          </span>
        )}

        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all z-10"
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-foreground"}`} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-lg font-bold text-foreground leading-tight">{guide.name}</h3>
          <div className="text-right shrink-0">
            <span className="text-xl font-bold text-primary">${guide.pricePerDay}</span>
            <span className="text-xs text-muted-foreground block">{t("perDay")}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-2">{specialization}</p>

        {primaryLocation && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{primaryLocation}</span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(guide.rating) ? "fill-accent text-accent" : "text-border"}`}
              />
            ))}
          </div>
          <span className="font-semibold text-foreground">{guide.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-primary" />
            {experience}+ years
          </span>
          {languages.length > 0 && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-primary" />
              {languages.join(", ")}
            </span>
          )}
        </div>

        {siteNames.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{t("specializesIn")}</p>
            <div className="flex flex-wrap gap-1.5">
              {siteNames.map((siteName, index) => (
                <span key={index} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  {siteName}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t border-border">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleContactGuide}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              {t("contactNow")}
            </a>
          ) : (
            <Button className="flex-1" size="sm" disabled>
              <MessageSquare className="w-4 h-4 mr-2" />
              {t("contactUnavailable")}
            </Button>
          )}
          {isSignedIn && isApiData && guideId && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={() => setShowReviewForm(true)}
            >
              <PenLine className="w-4 h-4 mr-2" />
              {t("writeReview")}
            </Button>
          )}
        </div>

        {isApiData && guideId && (
          <GuideReviewForm
            open={showReviewForm}
            onOpenChange={setShowReviewForm}
            guideId={guideId}
            guideName={guide.name}
          />
        )}

        <div className="mt-4 pt-4 border-t border-border space-y-4">
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-2">About</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{guide.bio}</p>
          </div>

          {languages.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span key={lang} className="text-xs bg-muted text-foreground px-2 py-1 rounded-full">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">Certifications</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {certifications.map((cert, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isApiData && (guide as StaticGuide).topReviews && (
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">{t("recentReviews")}</h4>
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

          {isApiData && reviewsData?.reviews && reviewsData.reviews.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">{t("recentReviews")}</h4>
              <div className="space-y-2">
                {reviewsData.reviews.slice(0, 3).map((review) => (
                  <div key={review._id} className="text-xs bg-muted p-2 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      {review.authorImage ? (
                        <img
                          src={review.authorImage}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/10 shrink-0" />
                      )}
                      <p className="font-semibold text-foreground flex-1">
                        {review.authorName || t("guide")}
                      </p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`w-2.5 h-2.5 ${j < review.rating ? "fill-accent text-accent" : "text-border"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-3">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
