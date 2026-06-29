"use client"

import { useState } from "react"
import { Loader2, Quote, TrendingUp } from "lucide-react"
import { useGuideTestimonials } from "@/lib/api"
import type { GuideTestimonial, GuideTestimonialGuide } from "@/lib/api/guide-testimonials"
import { useI18n } from "@/lib/i18n/context"

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
    <article className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all flex flex-col h-full">
      <div className="p-6 flex flex-col flex-1">
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

  const testimonials = data?.testimonials || []
  const totalLeads = data?.totalLeads ?? 0

  if (isLoading) {
    return (
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <span className="text-muted-foreground">{t("loadingImpact")}</span>
        </div>
      </section>
    )
  }

  if (error || (totalLeads === 0 && testimonials.length === 0)) return null

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            {t("ourImpact")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            {t("guideTestimonialsTitle")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("guideTestimonialsDescription")}
          </p>
        </div>

        {totalLeads > 0 && (
          <div className="mb-14 flex justify-center">
            <div className="inline-flex items-center gap-4 px-8 py-6 rounded-2xl border border-primary/20 bg-primary/5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-3xl md:text-4xl font-bold text-foreground">{totalLeads}+</p>
                <p className="text-sm text-muted-foreground">{t("totalLeadsGenerated")}</p>
              </div>
            </div>
          </div>
        )}

        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial._id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
