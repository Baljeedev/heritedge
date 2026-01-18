import type React from "react"
import { MapPin, Users, Heart, Music, Hammer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Navigation } from "@/core/components/navigation"
import { FeaturedSites } from "@/core/components/home/featured-sites"
import { SearchBar } from "@/core/components/home/search-bar"
import { useI18n } from "@/lib/i18n/context"

export default function HomePage() {
  const { t } = useI18n()
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl  font-bold text-foreground mb-6 text-balance">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-muted-foreground mb-12 text-pretty">
            {t('heroDescription')}
          </p>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </section>

      {/* Featured Sites */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl  font-bold text-foreground mb-4">{t('featuredExperiences')}</h2>
          <p className="text-muted-foreground mb-8">{t('featuredDescription')}</p>
          <FeaturedSites />
        </div>
      </section>

      {/* Experiences Section */}
      <section className="pb-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl  font-bold text-foreground mb-2">{t('tripsAndExperiences')}</h2>
              <p className="text-muted-foreground">{t('tripsDescription')}</p>
            </div>
            <Link to="/experiences">
              <Button variant="outline">{t('viewAll')}</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ExperienceTypeCard
              icon={<Users className="w-6 h-6" />}
              title={t('localGuides')}
              description={t('localGuidesDescription')}
              link="/experiences?category=guides"
            />
            <ExperienceTypeCard
              icon={<Music className="w-6 h-6" />}
              title={t('musicShows')}
              description={t('musicShowsDescription')}
              link="/experiences?category=music"
            />
            <ExperienceTypeCard
              icon={<Hammer className="w-6 h-6" />}
              title={t('workshops')}
              description={t('workshopsDescription')}
              link="/experiences?category=workshops"
            />
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl  font-bold text-foreground mb-12 text-center">{t('whyChooseHeritEdge')}</h2>
          <div className="space-y-6">
            <FeatureListItem
              icon={<MapPin className="w-6 h-6" />}
              title={t('curatedHeritageMap')}
              description={t('curatedHeritageMapDescription')}
            />
            <FeatureListItem
              icon={<Users className="w-6 h-6" />}
              title={t('curatedExperiences')}
              description={t('curatedExperiencesDescription')}
            />
            <FeatureListItem
              icon={<Heart className="w-6 h-6" />}
              title={t('supportRestoration')}
              description={t('supportRestorationDescription')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl  font-bold mb-4">{t('startYourJourney')}</h2>
          <p className="text-lg mb-8 opacity-90">
            {t('startYourJourneyDescription')}
          </p>
          <Link to="/trip-planner">
            <Button variant="secondary" className="px-8 py-6 text-base">
              {t('getStarted')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function ExperienceTypeCard({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}) {
  return (
    <Link to={link} className="block">
      <div className="p-6 border border-border rounded-lg hover:border-primary transition-all hover:shadow-lg bg-background h-full">
        <div className="text-primary mb-4">{icon}</div>
        <h3 className="text-xl  font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}

function FeatureListItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-6 p-6 bg-background rounded-lg border-l-4 border-primary shadow-sm hover:shadow-md transition-all">
      <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl  font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
