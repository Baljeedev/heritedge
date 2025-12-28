"use client"

import { MapPin, Star } from "lucide-react"
import { Link } from "react-router-dom"

const featuredSites = [
  {
    id: 1,
    name: "Taj Mahal",
    location: "Agra, India",
    image: "/taj-mahal-marble-monument.jpg",
    rating: 4.9,
    reviews: 12453,
    era: "Mughal Era (1632)",
  },
  {
    id: 2,
    name: "Machu Picchu",
    location: "Cusco Region, Peru",
    image: "/machu-picchu-incan-ruins-mountains.jpg",
    rating: 4.8,
    reviews: 8932,
    era: "Incan (1450)",
  },
  {
    id: 3,
    name: "Colosseum",
    location: "Rome, Italy",
    image: "/colosseum-roman-amphitheater-ancient.jpg",
    rating: 4.7,
    reviews: 15234,
    era: "Roman Era (80 AD)",
  },
  {
    id: 4,
    name: "Great Wall of China",
    location: "Northern China",
    image: "/great-wall-china-mountains-landscape.jpg",
    rating: 4.6,
    reviews: 19875,
    era: "Ming Dynasty (1368-1644)",
  },
]

export function FeaturedSites() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredSites.map((site) => (
        <Link key={site.id} to={`/map?site=${site.id}`}>
          <div className="group cursor-pointer">
            <div className="relative h-64 overflow-hidden rounded-lg mb-4 bg-muted">
              <img
                src={site.image || "/placeholder.svg"}
                alt={site.name}
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {site.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              {site.location}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-semibold">{site.rating}</span>
              </div>
              <span className="text-muted-foreground">({site.reviews.toLocaleString()})</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{site.era}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
