"use client"

import { Star } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const HOTELS = [
  {
    id: 1,
    name: "Heritage Palace Hotel",
    nearSites: [1],
    rating: 4.8,
    reviews: 234,
    price: 180,
    image: "/placeholder.svg?key=hotel1",
    amenities: ["WiFi", "Restaurant", "Pool"],
    description: "Luxury heritage hotel with traditional architecture",
  },
  {
    id: 2,
    name: "Sacred Views Resort",
    nearSites: [1],
    rating: 4.7,
    reviews: 189,
    price: 150,
    image: "/placeholder.svg?key=hotel2",
    amenities: ["WiFi", "Cafe", "Spa"],
    description: "Modern comfort with cultural touches",
  },
  {
    id: 3,
    name: "Inca Lodge Retreat",
    nearSites: [2],
    rating: 4.9,
    reviews: 156,
    price: 200,
    image: "/placeholder.svg?key=hotel3",
    amenities: ["WiFi", "Restaurant", "Mountain Views"],
    description: "Premium mountain experience near Machu Picchu",
  },
  {
    id: 4,
    name: "Roman Elegance Hotel",
    nearSites: [3],
    rating: 4.6,
    reviews: 312,
    price: 140,
    image: "/placeholder.svg?key=hotel4",
    amenities: ["WiFi", "Restaurant", "Terrace"],
    description: "Boutique hotel in historic Rome",
  },
]

interface HotelRecommendationsProps {
  sites: number[]
  selectedHotels: number[]
  onSelect: (hotels: number[]) => void
}

export function HotelRecommendations({ sites, selectedHotels, onSelect }: HotelRecommendationsProps) {
  const relevantHotels = HOTELS.filter((hotel) => hotel.nearSites.some((siteId) => sites.includes(siteId)))

  const handleToggle = (hotelId: number) => {
    if (selectedHotels.includes(hotelId)) {
      onSelect(selectedHotels.filter((id) => id !== hotelId))
    } else {
      onSelect([...selectedHotels, hotelId])
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Recommended Hotels</h2>
      <p className="text-muted-foreground mb-6">
        Stay with Stories - Premium heritage accommodations near your selected sites
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {relevantHotels.map((hotel) => (
          <div
            key={hotel.id}
            className={`border-2 rounded-lg overflow-hidden transition-all cursor-pointer ${
              selectedHotels.includes(hotel.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => handleToggle(hotel.id)}
          >
            <div className="relative h-40 bg-muted">
              <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif font-bold text-foreground">{hotel.name}</h3>
                <Checkbox checked={selectedHotels.includes(hotel.id)} onCheckedChange={() => handleToggle(hotel.id)} />
              </div>
              <p className="text-sm text-muted-foreground mb-3">{hotel.description}</p>

              <div className="flex items-center gap-1 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(hotel.rating) ? "fill-accent text-accent" : "text-border"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{hotel.rating}</span>
                <span className="text-xs text-muted-foreground">({hotel.reviews})</span>
              </div>

              <div className="flex gap-2 mb-4 flex-wrap">
                {hotel.amenities.slice(0, 2).map((amenity, i) => (
                  <span key={i} className="text-xs bg-muted text-foreground px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">${hotel.price}</span>
                <span className="text-sm text-muted-foreground">per night</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
