"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, Search, Star } from "lucide-react"
import type { ITrip } from "@/lib/types"
import { TripForm } from "./trip-form"

const mockTrips: ITrip[] = [
  {
    _id: "1",
    clerkUserId: "system",
    name: "Golden Triangle Heritage Tour",
    location: "Delhi, Agra, Jaipur",
    duration: "5 Days",
    image: "/trip-placeholder.png",
    description: "Classic heritage tour visiting India's most iconic monuments",
    highlights: ["Taj Mahal", "Red Fort", "City Palace"],
    itinerary: [
      {
        day: 1,
        title: "Delhi Arrival",
        activities: [
          { time: "2:00 PM", activity: "Arrive in Delhi", location: "Hotel", description: "Check-in and rest" },
        ],
      },
    ],
    budget: "Moderate",
    bestTimeToVisit: "October to March",
    isFeatured: true,
    selectedSites: [],
    selectedHotels: [],
    selectedGuides: [],
    selectedExperiences: [],
    isAIGenerated: false,
    status: "planned",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
]

const budgetColors: Record<string, string> = {
  Budget: "bg-green-100 text-green-700",
  Moderate: "bg-blue-100 text-blue-700",
  Luxury: "bg-amber-100 text-amber-700",
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  planned: "bg-blue-100 text-blue-700",
  booked: "bg-green-100 text-green-700",
  completed: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
}

export function TripList() {
  const [trips, setTrips] = useState<ITrip[]>(mockTrips)
  const [searchTerm, setSearchTerm] = useState("")
  const [budgetFilter, setBudgetFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<ITrip | null>(null)

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBudget = budgetFilter === "all" || trip.budget === budgetFilter
      const matchesStatus = statusFilter === "all" || trip.status === statusFilter

      return matchesSearch && matchesBudget && matchesStatus
    })
  }, [trips, searchTerm, budgetFilter, statusFilter])

  const handleSave = (trip: ITrip) => {
    if (editingTrip) {
      setTrips(trips.map((t) => (t._id === editingTrip._id ? trip : t)))
    } else {
      setTrips([...trips, { ...trip, _id: Date.now().toString() }])
    }
    setIsFormOpen(false)
    setEditingTrip(null)
  }

  const handleDelete = (id: string) => {
    setTrips(trips.filter((t) => t._id !== id))
  }

  const handleEdit = (trip: ITrip) => {
    setEditingTrip(trip)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trips</h1>
          <p className="text-muted-foreground mt-1">Manage heritage tours and itineraries</p>
        </div>
        <Button
          onClick={() => {
            setEditingTrip(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Trip
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={budgetFilter} onValueChange={setBudgetFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Budgets</SelectItem>
              <SelectItem value="Budget">Budget</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setBudgetFilter("all")
              setStatusFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">Showing {filteredTrips.length} trips</p>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => (
          <Card key={trip._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted overflow-hidden relative">
              <img src={trip.image || "/placeholder.svg"} alt={trip.name} className="w-full h-full object-cover" />
              {trip.isFeatured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-100 text-yellow-700">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{trip.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{trip.location}</p>

              <div className="space-y-2 mb-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge className={budgetColors[trip.budget]}>{trip.budget}</Badge>
                  <Badge className={statusColors[trip.status]}>{trip.status}</Badge>
                </div>

                <div className="text-sm text-muted-foreground">{trip.duration}</div>
                {trip.startDate && (
                  <div className="text-xs text-muted-foreground">
                    {new Date(trip.startDate).toLocaleDateString()} -
                    {trip.endDate && new Date(trip.endDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{trip.description}</p>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => handleEdit(trip)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(trip._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTrip ? "Edit Trip" : "Create New Trip"}</DialogTitle>
          </DialogHeader>
          <TripForm trip={editingTrip} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
