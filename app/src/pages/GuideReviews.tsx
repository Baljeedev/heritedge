"use client"

import { useMemo, useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Loader2, Star, X } from "lucide-react"
import { Navigation } from "@/core/components/navigation"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/core/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select"
import { useGuide } from "@/lib/api/hooks/useGuides"
import { useReviews } from "@/lib/api/hooks/useReviews"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

const GUIDE_PLACEHOLDER = "/guide-placeholder.svg"

type RatingFilter = "all" | "5" | "4" | "3" | "2" | "1"

function formatReviewDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function clientInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?"
}

function ReviewerAvatar({
  name,
  imageUrl,
}: {
  name: string
  imageUrl?: string | null
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const trimmed = imageUrl?.trim()

  if (trimmed && !imageFailed) {
    return (
      <img
        src={trimmed}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border border-border bg-muted shrink-0"
        onError={() => setImageFailed(true)}
      />
    )
  }

  return (
    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm border border-primary/15">
      {clientInitial(name)}
    </div>
  )
}

function clampRating(rating: number): number {
  return Math.min(5, Math.max(0, rating))
}

function StarRow({
  rating,
  size = "sm",
}: {
  rating: number
  size?: "sm" | "lg"
}) {
  const starClass = size === "lg" ? "w-7 h-7 md:w-8 md:h-8" : "w-4 h-4"
  const displayRating = clampRating(rating)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            starClass,
            i <= Math.round(displayRating) ? "fill-accent text-accent" : "text-border"
          )}
        />
      ))}
    </div>
  )
}

function ReviewImageLightbox({
  images,
  startIndex,
  open,
  onOpenChange,
}: {
  images: string[]
  startIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useI18n()
  const [index, setIndex] = useState(startIndex)

  useEffect(() => {
    if (open) setIndex(startIndex)
  }, [open, startIndex])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[95vw] sm:max-w-5xl w-auto border-0 bg-transparent shadow-none p-2 data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100"
      >
        <DialogTitle className="sr-only">{t("reviewExperiencePhoto")}</DialogTitle>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={images[index]}
          alt={t("reviewExperiencePhoto")}
          className="max-h-[85vh] max-w-full w-auto h-auto object-contain mx-auto rounded-lg"
        />
        <a
          href={images[index]}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs text-white/80 hover:text-white underline mt-2"
        >
          {t("viewFullSizeImage")}
        </a>
        {images.length > 1 && (
          <div className="flex justify-center gap-2 pt-2 flex-wrap">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "w-14 h-14 rounded-md overflow-hidden border-2",
                  i === index ? "border-primary" : "border-transparent opacity-70"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function GuideReviewsPage() {
  const { guideId = "" } = useParams()
  const { t } = useI18n()
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all")
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const { data: guide, isLoading: guideLoading, error: guideError } = useGuide(guideId, !!guideId)
  const { data: reviewsData, isLoading: reviewsLoading } = useReviews(
    { reviewType: "guide", targetId: guideId, limit: 100 },
    !!guideId
  )

  const reviews = reviewsData?.reviews ?? []
  const isLoading = guideLoading || reviewsLoading

  const filteredReviews = useMemo(() => {
    if (ratingFilter === "all") return reviews
    const min = Number(ratingFilter)
    return reviews.filter((r) => Math.round(r.rating) === min)
  }, [reviews, ratingFilter])

  const overallRating = useMemo(() => {
    if (reviews.length === 0) return clampRating(guide?.rating ?? 0)
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return clampRating(Math.round((sum / reviews.length) * 10) / 10)
  }, [reviews, guide?.rating])

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  if (!guideId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground">
          {t("error")}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-10">
        <Link
          to="/experiences?category=guides"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToGuides")}
        </Link>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <span className="text-muted-foreground">{t("loading")}</span>
          </div>
        ) : guideError || !guide ? (
          <div className="text-center py-24 text-muted-foreground">{t("error")}</div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {/* Overall rating summary */}
            <section className="px-6 py-10 md:py-12 text-center border-b border-border bg-gradient-to-b from-primary/[0.04] to-transparent">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("overallRating")}
              </p>
              <p className="text-sm text-muted-foreground mt-1.5">
                {reviews.length}{" "}
                {reviews.length === 1 ? t("totalReviewSingular") : t("totalReviewsPlural")}
              </p>

              <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 mt-8">
                <span className="font-display text-5xl md:text-6xl font-bold text-foreground leading-none">
                  {overallRating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">{t("outOf5Stars")}</span>
              </div>

              <div className="flex justify-center mt-5">
                <StarRow rating={overallRating} size="lg" />
              </div>
            </section>

            {/* Guide identity + filter */}
            <section className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={guide.image?.trim() || GUIDE_PLACEHOLDER}
                  alt={guide.name}
                  className="w-11 h-11 rounded-full object-cover border border-border bg-muted shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = GUIDE_PLACEHOLDER
                  }}
                />
                <div className="min-w-0">
                  <h1 className="font-display text-lg font-bold text-foreground truncate">
                    {guide.name}
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("clientReviews")}</p>
                  <p className="text-xs font-medium text-primary mt-1">
                    {guide.leadCount ?? 0} {t("leadsGenerated")}
                  </p>
                </div>
              </div>

              {reviews.length > 0 && (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm text-muted-foreground">{t("filterBy")}</span>
                  <Select
                    value={ratingFilter}
                    onValueChange={(v) => setRatingFilter(v as RatingFilter)}
                  >
                    <SelectTrigger size="sm" className="min-w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("viewAll")}</SelectItem>
                      <SelectItem value="5">5 {t("stars")}</SelectItem>
                      <SelectItem value="4">4 {t("stars")}</SelectItem>
                      <SelectItem value="3">3 {t("stars")}</SelectItem>
                      <SelectItem value="2">2 {t("stars")}</SelectItem>
                      <SelectItem value="1">1 {t("stars")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </section>

            {/* Review list */}
            {reviews.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                {t("noReviewsToShow")}
              </p>
            ) : filteredReviews.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                {t("noReviewsMatchFilter")}
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {filteredReviews.map((review) => {
                  const clientName = review.authorName?.trim() || t("guestReviewer")
                  const hasPhotos = review.images && review.images.length > 0
                  return (
                    <li key={review._id} className="px-6 py-6 md:py-7">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <StarRow rating={review.rating} />
                        <span className="text-sm font-medium text-foreground">
                          {review.rating.toFixed(1)} {t("outOf5StarsLower")}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        <ReviewerAvatar name={clientName} imageUrl={review.authorImage} />
                        <p className="text-sm min-w-0">
                          <span className="font-semibold text-foreground">{clientName}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            — {formatReviewDate(review.createdAt)}
                          </span>
                        </p>
                      </div>

                      <p className="mt-3 text-sm md:text-[15px] text-foreground/90 leading-relaxed">
                        {review.comment}
                      </p>

                      {hasPhotos && (
                        <div className="flex gap-2 mt-4 flex-wrap">
                          {review.images!.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => openLightbox(review.images!, i)}
                              className="rounded-lg overflow-hidden border border-border hover:border-primary hover:ring-2 hover:ring-primary/30 transition-all cursor-zoom-in"
                            >
                              <img
                                src={img}
                                alt={t("reviewExperiencePhoto")}
                                className="w-28 h-28 md:w-32 md:h-32 object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </main>

      <ReviewImageLightbox
        images={lightboxImages}
        startIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  )
}
