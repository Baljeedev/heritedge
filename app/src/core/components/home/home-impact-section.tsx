"use client"

import { useEffect, useState } from "react"
import { Loader2, Quote } from "lucide-react"
import { useGuideTestimonials } from "@/lib/api"
import type { GuideTestimonial, GuideTestimonialGuide } from "@/lib/api/guide-testimonials"
import { useI18n } from "@/lib/i18n/context"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/core/components/ui/carousel"

const GUIDE_PLACEHOLDER = "/guide-placeholder.svg"

function getGuide(testimonial: GuideTestimonial): GuideTestimonialGuide | null {
  const g = testimonial.guideId
  if (!g || typeof g === "string") return null
  return g
}

function TestimonialCard({ testimonial }: { testimonial: GuideTestimonial }) {
  const { t } = useI18n()
  const guide = getGuide(testimonial)
  const [imageSrc, setImageSrc] = useState(() => guide?.image?.trim() || GUIDE_PLACEHOLDER)
  const isPlaceholder = imageSrc === GUIDE_PLACEHOLDER

  if (!guide) return null

  return (
    <article className="bg-white/95 backdrop-blur-sm border border-accent/20 rounded-2xl overflow-hidden hover:border-accent/45 hover:shadow-[0_16px_48px_oklch(0.42_0.15_35/0.1)] transition-all flex flex-col h-full border-l-4 border-l-accent shadow-sm">
      <div className="p-6 flex flex-col flex-1 bg-gradient-to-br from-primary/[0.03] to-transparent">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={imageSrc}
            alt={guide.name}
            onError={() => setImageSrc(GUIDE_PLACEHOLDER)}
            className={`w-14 h-14 rounded-full shrink-0 border border-border ${
              isPlaceholder ? "object-contain bg-muted p-2" : "object-cover"
            }`}
          />
          <div className="min-w-0">
            <h3 className="font-bold text-foreground truncate">{guide.name}</h3>
            <span className="inline-flex mt-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {guide.leadCount ?? 0} {t("leadsGenerated")}
            </span>
          </div>
        </div>

        <div className="relative flex-1">
          <Quote className="w-8 h-8 text-primary/20 absolute -top-1 -left-1" />
          <p className="text-sm text-muted-foreground leading-relaxed pl-6 italic">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </div>
      </div>
    </article>
  )
}

export function HomeImpactSection() {
  const { t } = useI18n()
  const { data, isLoading, error } = useGuideTestimonials()
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  const testimonials = data?.testimonials || []
  const useSlider = testimonials.length > 2

  useEffect(() => {
    if (!carouselApi || !useSlider) return

    const timer = setInterval(() => {
      carouselApi.scrollNext()
    }, 5000)

    return () => clearInterval(timer)
  }, [carouselApi, useSlider])

  if (isLoading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <span className="text-muted-foreground">{t("loadingImpact")}</span>
        </div>
      </section>
    )
  }

  if (error || testimonials.length === 0) return null

  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] font-display text-primary/[0.04] pointer-events-none select-none leading-none">
        &ldquo;
      </div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-10">
          <p className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 px-4 py-1.5 rounded-full bg-white/80 border border-primary/20 shadow-sm">
            {t("ourImpact")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            {t("guideTestimonialsTitle")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("guideTestimonialsDescription")}
          </p>
        </div>

        {useSlider ? (
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
              containScroll: "trimSnaps",
            }}
            className="w-full max-w-5xl mx-auto relative px-14"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial._id}
                  className="pl-4 basis-full sm:basis-1/2"
                >
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 md:left-2" />
            <CarouselNext className="right-0 md:right-2" />
          </Carousel>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto px-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className={
                  testimonials.length === 1
                    ? "w-full max-w-md"
                    : "w-full md:w-[calc(50%-0.75rem)] max-w-md"
                }
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
