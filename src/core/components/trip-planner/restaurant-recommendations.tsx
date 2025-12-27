"use client"

import { Star, Clock } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const RESTAURANTS = [
  {
    id: 1,
    name: "Taj Garden Restaurant",
    nearSites: [1],
    cuisine: "Mughal",
    rating: 4.7,
    reviews: 234,
    image: "/placeholder.svg?key=rest1",
    description: "Authentic Mughal cuisine with heritage ambiance",
    waitTime: "15-20 min",
  },
  {
    id: 2,
    name: "Incan Kitchen",
    nearSites: [2],
    cuisine: "Peruvian",
    rating: 4.8,
    reviews: 189,
    image: "/placeholder.svg?key=rest2",
    description: "Traditional Andean recipes with modern twist",
    waitTime: "10-15 min",
  },
  {
    id: 3,
    name: "Colosseum Trattoria",
    nearSites: [3],
    cuisine: "Italian",
    rating: 4.6,
    reviews: 312,
    image: "/placeholder.svg?key=rest3",
    description: "Classic Roman cuisine near historic sites",
    waitTime: "20-25 min",
  },
  {
    id: 4,
    name: "Dragon's Feast",
    nearSites: [4],
    cuisine: "Chinese",
    rating: 4.9,
    reviews: 267,
    image: "/placeholder.svg?key=rest4",
    description: "Traditional Beijing specialties",
    waitTime: "10-15 min",
  },
]

interface RestaurantRecommendationsProps {
  sites: number[]
  selectedRestaurants: number[]
  onSelect: (restaurants: number[]) => void
}

export function RestaurantRecommendations({ sites, selectedRestaurants, onSelect }: RestaurantRecommendationsProps) {
  const relevantRestaurants = RESTAURANTS.filter((rest) => rest.nearSites.some((siteId) => sites.includes(siteId)))

  const handleToggle = (restId: number) => {
    if (selectedRestaurants.includes(restId)) {
      onSelect(selectedRestaurants.filter((id) => id !== restId))
    } else {
      onSelect([...selectedRestaurants, restId])
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Culinary Experiences</h2>
      <p className="text-muted-foreground mb-6">Dine like a local - Restaurants near your heritage sites</p>

      <div className="grid md:grid-cols-2 gap-6">
        {relevantRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className={`border-2 rounded-lg overflow-hidden transition-all cursor-pointer ${
              selectedRestaurants.includes(restaurant.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => handleToggle(restaurant.id)}
          >
            <div className="relative h-40 bg-muted">
              <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} className="object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-serif font-bold text-foreground">{restaurant.name}</h3>
                  <p className="text-xs text-muted-foreground">{restaurant.cuisine}</p>
                </div>
                <Checkbox
                  checked={selectedRestaurants.includes(restaurant.id)}
                  onCheckedChange={() => handleToggle(restaurant.id)}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-3">{restaurant.description}</p>

              <div className="flex items-center gap-1 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(restaurant.rating) ? "fill-accent text-accent" : "text-border"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{restaurant.rating}</span>
                <span className="text-xs text-muted-foreground">({restaurant.reviews})</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {restaurant.waitTime}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
