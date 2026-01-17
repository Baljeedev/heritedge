"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import type { IHotel } from "@/lib/types"
import { HotelForm } from "./hotel-form"

const mockHotels: IHotel[] = [
  {
    _id: "1",
    name: "Neemrana Fort Palace",
    chain: "Neemrana Hotels",
    location: "Neemrana",
    city: "Alwar",
    state: "Rajasthan",
    country: "India",
    coordinates: { latitude: 27.6, longitude: 76.5 },
    images: ["/hotel-placeholder.png"],
    rating: 4.8,
    reviewCount: 234,
    pricePerNight: { min: 5000, max: 15000, currency: "INR" },
    description: "Historic fort palace with heritage experiences",
    amenities: ["WiFi", "Restaurant", "Pool", "Spa"],
    roomTypes: [
      {
        name: "Heritage Room",
        description: "Traditional themed room",
        pricePerNight: 5000,
        maxOccupancy: 2,
        isLivingHistory: true,
        theme: "Mughal Era",
      },
    ],
    heritageFeatures: {
      hasLivingHistoryRooms: true,
      hasHistoryLectures: true,
      hasCulturalMeals: true,
      hasStorytellingEvenings: true,
    },
    nearbySites: [],
    partnershipType: "premium",
    discountPercentage: 10,
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
]

const partnershipColors: Record<string, string> = {
  listing: "bg-gray-100 text-gray-700",
  referral: "bg-blue-100 text-blue-700",
  premium: "bg-amber-100 text-amber-700",
}

export function HotelList() {
  const [hotels, setHotels] = useState<IHotel[]>(mockHotels)
  const [searchTerm, setSearchTerm] = useState("")
  const [partnershipFilter, setPartnershipFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<IHotel | null>(null)

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPartnership = partnershipFilter === "all" || hotel.partnershipType === partnershipFilter
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? hotel.isActive : !hotel.isActive)

      return matchesSearch && matchesPartnership && matchesStatus
    })
  }, [hotels, searchTerm, partnershipFilter, statusFilter])

  const handleSave = (hotel: IHotel) => {
    if (editingHotel) {
      setHotels(hotels.map((h) => (h._id === editingHotel._id ? hotel : h)))
    } else {
      setHotels([...hotels, { ...hotel, _id: Date.now().toString() }])
    }
    setIsFormOpen(false)
    setEditingHotel(null)
  }

  const handleDelete = (id: string) => {
    setHotels(hotels.filter((h) => h._id !== id))
  }

  const handleEdit = (hotel: IHotel) => {
    setEditingHotel(hotel)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hotels</h1>
          <p className="text-muted-foreground mt-1">Manage heritage and partner hotels</p>
        </div>
        <Button
          onClick={() => {
            setEditingHotel(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Hotel
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
          <Select value={partnershipFilter} onValueChange={setPartnershipFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Partnership type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="listing">Listing</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setPartnershipFilter("all")
              setStatusFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">Showing {filteredHotels.length} hotels</p>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <Card key={hotel._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted overflow-hidden">
              <img
                src={hotel.images[0] || "/placeholder.svg"}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{hotel.name}</h3>

              {hotel.chain && <p className="text-sm text-muted-foreground mb-2">{hotel.chain}</p>}

              <p className="text-sm text-muted-foreground mb-3">
                {hotel.city}, {hotel.state}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex gap-2">
                  <Badge className={partnershipColors[hotel.partnershipType]}>
                    {hotel.partnershipType.charAt(0).toUpperCase() + hotel.partnershipType.slice(1)}
                  </Badge>
                  {hotel.heritageFeatures.hasLivingHistoryRooms && <Badge variant="secondary">Living History</Badge>}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">★ {hotel.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ₹{hotel.pricePerNight.min}-{hotel.pricePerNight.max}/night
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => handleEdit(hotel)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(hotel._id)}>
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
            <DialogTitle>{editingHotel ? "Edit Hotel" : "Create New Hotel"}</DialogTitle>
          </DialogHeader>
          <HotelForm hotel={editingHotel} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
