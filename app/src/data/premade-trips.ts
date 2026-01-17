export interface DayPlan {
  day: number
  title: string
  activities: {
    time: string
    activity: string
    location: string
    description?: string
  }[]
}

export interface PremadeTrip {
  id: string
  name: string
  location: string
  duration: string
  image: string
  description: string
  highlights: string[]
  itinerary: DayPlan[]
  budget: "Budget" | "Moderate" | "Luxury"
  bestTimeToVisit: string
}

