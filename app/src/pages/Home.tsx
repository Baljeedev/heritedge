import type React from "react"
import { Search, MapPin, Users, Heart, Music, Hammer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { Navigation } from "@/core/components/navigation"
import { FeaturedSites } from "@/core/components/home/featured-sites"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl  font-bold text-foreground mb-6 text-balance">
            Preserve the Past, Experience Tomorrow
          </h1>
          <p className="text-xl text-muted-foreground mb-12 text-pretty">
            Discover world heritage sites through immersive trips and experiences. Book local guides, attend cultural shows, join workshops, and help restore our shared cultural treasures.
          </p>

          {/* Search Bar */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search monuments, historical sites, destinations..."
                className="pl-12 py-6 text-base"
              />
            </div>
            <Button className="bg-primary text-primary-foreground px-8 py-6">Search</Button>
          </div>
        </div>
      </section>

      {/* Featured Sites */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl  font-bold text-foreground mb-4">Featured Experiences</h2>
          <p className="text-muted-foreground mb-8">Handpicked destinations waiting for your discovery</p>
          <FeaturedSites />
        </div>
      </section>

      {/* Experiences Section */}
      <section className="pb-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl  font-bold text-foreground mb-2">Trips & Experiences</h2>
              <p className="text-muted-foreground">Immerse yourself in culture through curated experiences</p>
            </div>
            <Link to="/experiences">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ExperienceTypeCard
              icon={<Users className="w-6 h-6" />}
              title="Local Guides"
              description="Connect with certified guides who bring history to life with authentic stories and deep cultural knowledge."
              link="/experiences?category=guides"
            />
            <ExperienceTypeCard
              icon={<Music className="w-6 h-6" />}
              title="Music Shows"
              description="Experience traditional music performances and cultural shows that celebrate the heritage of each region."
              link="/experiences?category=music"
            />
            <ExperienceTypeCard
              icon={<Hammer className="w-6 h-6" />}
              title="Workshops"
              description="Learn traditional crafts, artisanal techniques, and cultural practices from master craftspeople."
              link="/experiences?category=workshops"
            />
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl  font-bold text-foreground mb-12 text-center">Why Choose HeritEdge</h2>
          <div className="space-y-6">
            <FeatureListItem
              icon={<MapPin className="w-6 h-6" />}
              title="Curated Heritage Map"
              description="Explore carefully selected heritage sites with rich historical context and verified information."
            />
            <FeatureListItem
              icon={<Users className="w-6 h-6" />}
              title="Curated Experiences"
              description="Discover local guides, cultural music shows, artisan workshops, and immersive experiences that bring heritage to life."
            />
            <FeatureListItem
              icon={<Heart className="w-6 h-6" />}
              title="Support Restoration"
              description="Contribute to active heritage restoration projects and help preserve these treasures."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl  font-bold mb-4">Start Your Heritage Journey</h2>
          <p className="text-lg mb-8 opacity-90">
            Plan your next adventure with AI-powered recommendations tailored to your interests.
          </p>
          <Link to="/trip-planner">
            <Button variant="secondary" className="px-8 py-6 text-base">
              Plan Your Trip Now
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
