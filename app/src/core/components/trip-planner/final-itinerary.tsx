"use client"
import { Calendar, Users, MapPin, DollarSign, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHeritageSites } from "@/lib/api"
import { useMemo } from "react"

interface FinalItineraryProps {
  sites: string[]
  hotels: number[]
  restaurants: number[]
  flight: number | null
  dates: { start: string; end: string }
  travelers: number
}

export function FinalItinerary({ sites, hotels, restaurants, flight, dates, travelers }: FinalItineraryProps) {
  const { data, isLoading } = useHeritageSites({ limit: 100 })
  const selectedSites = useMemo(() => {
    if (!data?.sites) return []
    return data.sites.filter((s) => sites.includes(s._id))
  }, [data?.sites, sites])

  const calculateDays = () => {
    if (!dates.start || !dates.end) return 0
    const start = new Date(dates.start)
    const end = new Date(dates.end)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const tripDays = calculateDays()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl  font-bold text-foreground">Your Complete Itinerary</h2>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <Calendar className="w-5 h-5 text-primary mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Duration</p>
          <p className="text-lg font-semibold text-foreground">{tripDays} Days</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <Users className="w-5 h-5 text-primary mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Travelers</p>
          <p className="text-lg font-semibold text-foreground">{travelers}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <MapPin className="w-5 h-5 text-primary mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Sites</p>
          <p className="text-lg font-semibold text-foreground">{sites.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <DollarSign className="w-5 h-5 text-primary mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Est. Cost</p>
          <p className="text-lg font-semibold text-primary">$5,240</p>
        </div>
      </div>

      {/* Detailed Itinerary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg  font-bold text-foreground mb-4">Day-by-Day Plan</h3>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading itinerary...</div>
        ) : selectedSites.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No sites selected</div>
        ) : (
          <div className="space-y-4">
            {selectedSites.map((site, index) => (
              <div key={site._id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    Day {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className=" font-bold text-foreground mb-1">{site.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{site.location}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>📍 {site.era}</span>
                    <span>⭐ {site.rating} rating</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Download & Share */}
      <div className="flex gap-4">
        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          <CheckCircle className="w-4 h-4 mr-2" />
          Confirm & Book
        </Button>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-sm text-foreground">
        <p className="font-semibold mb-2">Next Steps:</p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
          <li>Confirm your selections</li>
          <li>Proceed to booking with payment</li>
          <li>Receive detailed travel guides for each site</li>
          <li>Book experiences including guides, music shows, and workshops</li>
        </ol>
      </div>
    </div>
  )
}
