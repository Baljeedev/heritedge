"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useHotels } from "@/lib/api"
import type { Hotel } from "@/lib/api/hotels"
import { useI18n } from "@/lib/i18n/context"

const HOTEL_PLACEHOLDER = "/hotel-placeholder.svg"
function resolveHotelImage(image?: string | null): string {
  const trimmed = image?.trim()
  return trimmed ? trimmed : HOTEL_PLACEHOLDER
}

function HotelCard({ hotel }: { hotel: Hotel }) {  const [imageSrc, setImageSrc] = useState(() => resolveHotelImage(hotel.images?.[0]))
  const isPlaceholderImage = imageSrc === HOTEL_PLACEHOLDER

  return (
    <article className="bg-white border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all flex flex-col h-full shadow-sm">
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={imageSrc}
          alt={hotel.name}
          onError={() => setImageSrc(HOTEL_PLACEHOLDER)}
          className={`w-full h-full ${isPlaceholderImage ? "object-contain bg-muted p-8" : "object-cover"}`}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-foreground leading-tight mb-3">{hotel.name}</h3>
        {hotel.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{hotel.description}</p>
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
