"use client"

import { useState } from "react"
import { Loader2, MapPin, Star, Mail } from "lucide-react"
import { useHotels } from "@/lib/api"
import type { Hotel } from "@/lib/api/hotels"
import { useI18n } from "@/lib/i18n/context"

const HERITAGE_FEATURE_KEYS = [
  { key: "hasLivingHistoryRooms", labelKey: "heritageFeatureLivingHistoryRooms" },
  { key: "hasHistoryLectures", labelKey: "heritageFeatureHistoryLectures" },
  { key: "hasCulturalMeals", labelKey: "heritageFeatureCulturalMeals" },
  { key: "hasStorytellingEvenings", labelKey: "heritageFeatureStorytellingEvenings" },
  { key: "historicalTimelinePosters", labelKey: "heritageFeatureTimelinePosters" },
] as const

const HOTEL_PLACEHOLDER = "/hotel-placeholder.svg"

function resolveHotelImage(image?: string | null): string {
  const trimmed = image?.trim()
  return trimmed ? trimmed : HOTEL_PLACEHOLDER
}

function formatPrice(hotel: Hotel) {
  const currency = hotel.pricePerNight?.currency === "INR" ? "₹" : hotel.pricePerNight?.currency || "₹"
  const min = hotel.pricePerNight?.min ?? 0
  const max = hotel.pricePerNight?.max ?? 0
  if (min === max) return `${currency}${min.toLocaleString()}`
  return `${currency}${min.toLocaleString()} – ${currency}${max.toLocaleString()}`
}

function getNearbySiteNames(hotel: Hotel): string[] {
  return (hotel.nearbySites || [])
    .map((site) => (typeof site === "object" && site !== null && "name" in site ? site.name : null))
    .filter((name): name is string => Boolean(name))
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  const { t } = useI18n()
  const nearbySites = getNearbySiteNames(hotel)
  const enabledFeatures = HERITAGE_FEATURE_KEYS.filter(
    ({ key }) => hotel.heritageFeatures?.[key as keyof typeof hotel.heritageFeatures]
  )
  const [imageSrc, setImageSrc] = useState(() => resolveHotelImage(hotel.images?.[0]))
  const isPlaceholderImage = imageSrc === HOTEL_PLACEHOLDER
  const locationLabel = [hotel.city, hotel.state].filter(Boolean).join(", ")

  return (
    <article className="bg-white border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all flex flex-col h-full shadow-sm">
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={imageSrc}
          alt={hotel.name}
          onError={() => setImageSrc(HOTEL_PLACEHOLDER)}
          className={`w-full h-full ${isPlaceholderImage ? "object-contain bg-muted p-8" : "object-cover"}`}
        />
        {hotel.partnershipType && (
          <span className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-primary capitalize shadow-sm">
            {hotel.partnershipType}
          </span>
        )}
        {hotel.discountPercentage ? (
          <span className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-sm">
            {hotel.discountPercentage}% {t("offViaHeritEdge")}
          </span>
        ) : null}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-foreground leading-tight truncate">{hotel.name}</h3>
            {hotel.chain && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">{hotel.chain}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <span className="text-lg font-bold text-primary leading-tight block">{formatPrice(hotel)}</span>
            <span className="text-xs text-muted-foreground">{t("perNight")}</span>
          </div>
        </div>

        {locationLabel && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{hotel.location ? `${hotel.location}, ${locationLabel}` : locationLabel}</span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(hotel.rating) ? "fill-accent text-accent" : "text-border"}`}
              />
            ))}
          </div>
          <span className="font-semibold text-foreground text-sm">{hotel.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({hotel.reviewCount})</span>
        </div>

        {hotel.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 mb-4">{hotel.description}</p>
        )}

        {hotel.amenities?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t("amenities")}</p>
            <div className="flex flex-wrap gap-1.5">
              {hotel.amenities.slice(0, 4).map((amenity) => (
                <span key={amenity} className="text-xs bg-muted text-foreground px-2 py-1 rounded-full">
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 4 && (
                <span className="text-xs text-muted-foreground px-2 py-1">+{hotel.amenities.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {hotel.roomTypes && hotel.roomTypes.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t("roomTypes")}</p>
            <div className="space-y-1.5">
              {hotel.roomTypes.slice(0, 2).map((room, index) => (
                <div key={index} className="text-xs text-muted-foreground flex justify-between gap-2">
                  <span className="truncate font-medium text-foreground">{room.name}</span>
                  <span className="shrink-0 text-primary">₹{room.pricePerNight.toLocaleString()}</span>
                </div>
              ))}
              {hotel.roomTypes.length > 2 && (
                <p className="text-xs text-muted-foreground">+{hotel.roomTypes.length - 2} more</p>
              )}
            </div>
          </div>
        )}

        {enabledFeatures.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t("heritageFeatures")}</p>
            <div className="flex flex-wrap gap-1.5">
              {enabledFeatures.slice(0, 3).map(({ key, labelKey }) => (
                <span key={key} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {t(labelKey)}
                </span>
              ))}
            </div>
          </div>
        )}

        {nearbySites.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t("nearbyHeritageSites")}</p>
            <div className="flex flex-wrap gap-1.5">
              {nearbySites.slice(0, 3).map((siteName) => (
                <span key={siteName} className="text-xs border border-border text-foreground px-2 py-1 rounded-full">
                  {siteName}
                </span>
              ))}
            </div>
          </div>
        )}

        {hotel.email && (
          <a
            href={`mailto:${hotel.email}`}
            className="mt-auto pt-4 border-t border-border inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span className="truncate">{hotel.email}</span>
          </a>
        )}
      </div>
    </article>
  )
}

export function HomeHotelsSection() {
  const { t } = useI18n()
  const { data, isLoading, error } = useHotels({ limit: 100 })

  const hotels = data?.hotels || []

  if (isLoading) {
    return (
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <span className="text-muted-foreground">{t("loadingHotels")}</span>
        </div>
      </section>
    )
  }

  if (error || hotels.length === 0) return null

  return (
    <section className="py-24 px-4 bg-white border-y border-border/60">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary-foreground mb-4 px-5 py-2 rounded-full bg-primary shadow-sm">
            {t("heritageStays")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            {t("partnerHotels")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("partnerHotelsDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {hotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  )
}
