"use client"
import { Checkbox } from "@/components/ui/checkbox"

const FLIGHTS = [
  {
    id: 1,
    airline: "Global Airways",
    from: "New York",
    to: "Agra",
    departure: "10:30 AM",
    arrival: "11:45 PM (+1)",
    duration: "16h 15m",
    stops: 1,
    price: 850,
    rating: 4.5,
  },
  {
    id: 2,
    airline: "Sky International",
    from: "New York",
    to: "Agra",
    departure: "2:00 PM",
    arrival: "8:30 AM (+1)",
    duration: "17h 30m",
    stops: 2,
    price: 620,
    rating: 4.2,
  },
  {
    id: 3,
    airline: "Heritage Airlines",
    from: "New York",
    to: "Lima",
    departure: "11:45 PM",
    arrival: "10:20 AM",
    duration: "10h 35m",
    stops: 0,
    price: 950,
    rating: 4.7,
  },
  {
    id: 4,
    airline: "Comfort Flights",
    from: "New York",
    to: "Rome",
    departure: "6:30 PM",
    arrival: "7:15 AM (+1)",
    duration: "9h 45m",
    stops: 0,
    price: 780,
    rating: 4.6,
  },
]

interface FlightOptionsProps {
  selectedFlight: number | null
  onSelect: (flightId: number) => void
  travelers: number
}

export function FlightOptions({ selectedFlight, onSelect, travelers }: FlightOptionsProps) {
  return (
    <div>
      <h2 className="text-2xl  font-bold text-foreground mb-2">Flight Options</h2>
      <p className="text-muted-foreground mb-6">Select the best flight for your group of {travelers}</p>

      <div className="space-y-3">
        {FLIGHTS.map((flight) => (
          <div
            key={flight.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedFlight === flight.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onClick={() => onSelect(flight.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Checkbox checked={selectedFlight === flight.id} onCheckedChange={() => onSelect(flight.id)} />
                <div>
                  <h3 className=" font-bold text-foreground">{flight.airline}</h3>
                  <p className="text-xs text-muted-foreground">
                    {flight.from} → {flight.to}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">${flight.price * travelers}</p>
                <p className="text-xs text-muted-foreground">Total for {travelers}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Departure</p>
                <p className="font-semibold text-foreground">{flight.departure}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Arrival</p>
                <p className="font-semibold text-foreground">{flight.arrival}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Duration</p>
                <p className="font-semibold text-foreground">{flight.duration}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Stops</p>
                <p className="font-semibold text-foreground">
                  {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
