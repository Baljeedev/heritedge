import type React from "react"
import { ArrowRight, BadgePercent, HandHelping, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Navigation } from "@/core/components/navigation"
import { useHeritageSites } from "@/lib/api"
import { useI18n } from "@/lib/i18n/context"

export default function HomePage() {
  const { t } = useI18n()
  const { data } = useHeritageSites({ limit: 1 })
  const heroImage = data?.sites?.[0]?.image

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Banner */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/40 to-background" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,oklch(0.42_0.15_35/0.25),transparent)]" />

        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-16 w-72 h-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-28 text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance leading-[1.08] tracking-tight drop-shadow-sm">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-white/85 mb-12 text-pretty leading-relaxed max-w-2xl mx-auto">
            {t("heroDescription")}
          </p>

          <div className="flex items-center justify-center">
            <Link to="/experiences?category=guides">
              <Button
                size="lg"
                className="h-14 px-10 text-base gap-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_8px_32px_oklch(0.42_0.15_35/0.5)] hover:shadow-[0_12px_40px_oklch(0.42_0.15_35/0.6)] hover:scale-[1.03] transition-all"
              >
                {t("bookAGuideNow")}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Why We Are Different */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              HeritEdge
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {t("whyWeAreDifferent")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <MissionPillar
              icon={<BadgePercent className="w-6 h-6" />}
              title={t("noCommissionFees")}
              description={t("noCommissionFeesDescription")}
            />
            <MissionPillar
              icon={<HandHelping className="w-6 h-6" />}
              title={t("friendlyForAllGuides")}
              description={t("friendlyForAllGuidesDescription")}
            />
            <MissionPillar
              icon={<MessageCircle className="w-6 h-6" />}
              title={t("directCommunication")}
              description={t("directCommunicationDescription")}
            />
          </div>
        </div>
      </section>

      {/* Mission + SDG + CTA */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-size-[20px_20px]" />
        <div className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center text-primary-foreground">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-10 tracking-tight leading-snug">
            {t("homeMissionStatement")}
          </h2>

          <Link to="/experiences">
            <Button
              variant="secondary"
              size="lg"
              className="h-14 px-12 text-base gap-2 rounded-full shadow-xl shadow-black/20 hover:scale-[1.03] transition-all font-semibold"
            >
              {t("exploreExperiences")}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function MissionPillar({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col p-8 rounded-2xl border border-border bg-card h-full transition-all duration-300 hover:border-primary/30 hover:shadow-[0_12px_40px_oklch(0.42_0.15_35/0.1)] hover:-translate-y-1">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center text-primary mb-5">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{description}</p>
    </div>
  )
}
