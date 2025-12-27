import type React from "react"
import { Search, MapPin, Users, Heart } from "lucide-react"
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
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 text-balance">
            Preserve the Past, Experience Tomorrow
          </h1>
          <p className="text-xl text-muted-foreground mb-12 text-pretty">
            Discover world heritage sites through immersive journeys, support local communities, and help restore our
            shared cultural treasures.
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

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Link to="/map" className="text-primary hover:underline">
              Explore Map
            </Link>
            <span className="text-border">•</span>
            <Link to="/trip-planner" className="text-primary hover:underline">
              Plan Trip
            </Link>
            <span className="text-border">•</span>
            <Link to="/guides" className="text-primary hover:underline">
              Local Guides
            </Link>
            <span className="text-border">•</span>
            <Link to="/donate" className="text-primary hover:underline">
              Support Restoration
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Sites */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Featured Heritage Sites</h2>
          <p className="text-muted-foreground mb-8">Handpicked destinations waiting for your discovery</p>
          <FeaturedSites />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-12 text-center">Why Choose HeritEdge</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-8 h-8" />}
              title="Curated Heritage Map"
              description="Explore carefully selected heritage sites with rich historical context and verified information."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Connect with Locals"
              description="Book certified local guides and artisans who share authentic stories and cultural wisdom."
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8" />}
              title="Support Restoration"
              description="Contribute to active heritage restoration projects and help preserve these treasures."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Start Your Heritage Journey</h2>
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 border border-border rounded-lg hover:border-primary transition-colors">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-serif font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
