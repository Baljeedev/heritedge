"use client"

import { Star, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useHotels } from "@/lib/api"

interface HotelRecommendationsProps {
  sites: string[]
  selectedHotels: string[]
  onSelect: (hotels: string[]) => void
}

export function HotelRecommendations({ sites, selectedHotels, onSelect }: HotelRecommendationsProps) {
  // Fetch hotels for the selected sites
  const { data, isLoading, error } = useHotels({
    siteId: sites[0], // For now, just use the first site
    limit: 20
  })

  const handleToggle = (hotelId: string) => {
    if (selectedHotels.includes(hotelId)) {
      onSelect(selectedHotels.filter((id) => id !== hotelId))
    } else {
      onSelect([...selectedHotels, hotelId])
    }
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl  font-bold text-foreground mb-2">Recommended Hotels</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading hotels...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl  font-bold text-foreground mb-2">Recommended Hotels</h2>
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground mb-2">Unable to load hotels</p>
          <p className="text-sm text-muted-foreground">Please make sure the backend API is running</p>
        </div>
      </div>
    )
  }

  const hotels = data?.hotels || []

  return (
    <div>
      <h2 className="text-2xl  font-bold text-foreground mb-2">Recommended Hotels</h2>
      <p className="text-muted-foreground mb-6">
        Stay with Stories - Premium heritage accommodations near your selected sites
      </p>

      {hotels.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground mb-2">No hotels found for selected sites</p>
          <p className="text-sm text-muted-foreground">Try selecting different heritage sites</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className={`border-2 rounded-lg overflow-hidden transition-all cursor-pointer ${
                selectedHotels.includes(hotel._id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleToggle(hotel._id)}
            >
              <div className="relative h-40 bg-muted">
                <img 
                  src={hotel.images?.[0] || "/placeholder.svg"} 
                  alt={hotel.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className=" font-bold text-foreground">{hotel.name}</h3>
                  <Checkbox 
                    checked={selectedHotels.includes(hotel._id)} 
                    onCheckedChange={() => handleToggle(hotel._id)} 
                  />
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
                  <span className="text-xs text-muted-foreground">({hotel.reviewCount})</span>
                </div>

                <div className="flex gap-2 mb-4 flex-wrap">
                  {hotel.amenities?.slice(0, 2).map((amenity, i) => (
                    <span key={i} className="text-xs bg-muted text-foreground px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    {hotel.pricePerNight?.currency || '₹'}{hotel.pricePerNight?.min || 'N/A'}
                  </span>
                  <span className="text-sm text-muted-foreground">per night</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
