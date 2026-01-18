"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, Users, Phone, Mail, User, Music, Hammer, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { bookingsApi, type Booking } from "@/lib/api/bookings"
import { toast } from "sonner"

const bookingTypeColors: Record<string, string> = {
  guide: "bg-blue-100 text-blue-700",
  music: "bg-purple-100 text-purple-700",
  workshop: "bg-green-100 text-green-700",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
}

export function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingsApi.getAll({ all: true })
      setBookings(response.bookings)
    } catch (error: any) {
      toast.error(`Failed to load bookings: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.contactPhone.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || booking.bookingType === typeFilter
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [bookings, searchTerm, typeFilter, statusFilter])

  const handleStatusUpdate = async (booking: Booking, newStatus: "pending" | "confirmed" | "cancelled") => {
    try {
      await bookingsApi.update(booking._id, { status: newStatus })
      toast.success(`Booking status updated to ${newStatus}`)
      await loadBookings()
    } catch (error: any) {
      toast.error(`Failed to update booking: ${error.message}`)
    }
  }

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case "guide":
        return <User className="w-4 h-4" />
      case "music":
        return <Music className="w-4 h-4" />
      case "workshop":
        return <Hammer className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getBookingTypeLabel = (type: string) => {
    switch (type) {
      case "guide":
        return "Local Guide"
      case "music":
        return "Music Show"
      case "workshop":
        return "Workshop"
      default:
        return "Booking"
    }
  }

  const getItemName = (booking: Booking) => {
    if (booking.bookingType === "guide" && typeof booking.guideId === "object" && booking.guideId !== null) {
      return booking.guideId.name
    }
    if (
      (booking.bookingType === "music" || booking.bookingType === "workshop") &&
      typeof booking.experienceId === "object" &&
      booking.experienceId !== null
    ) {
      return booking.experienceId.name
    }
    return "Unknown"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage all user bookings</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Booking type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="guide">Guides</SelectItem>
              <SelectItem value="music">Music Shows</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">Showing {filteredBookings.length} bookings</p>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Bookings Table */}
      {!loading && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Item</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Date & People</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getBookingTypeIcon(booking.bookingType)}
                        <Badge className={bookingTypeColors[booking.bookingType]}>
                          {getBookingTypeLabel(booking.bookingType)}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{getItemName(booking)}</p>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{booking.contactName}</p>
                        <p className="text-xs text-muted-foreground">{booking.contactEmail}</p>
                        <p className="text-xs text-muted-foreground">{booking.contactPhone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {booking.numberOfPeople} {booking.numberOfPeople === 1 ? "person" : "people"}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[booking.status]}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(booking, "confirmed")}
                              title="Confirm booking"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(booking, "cancelled")}
                              title="Cancel booking"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(booking, "cancelled")}
                            title="Cancel booking"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setSelectedBooking(booking)}>
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!loading && filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bookings found</p>
        </div>
      )}

      {/* Booking Detail Dialog */}
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Booking Type</p>
                  <div className="flex items-center gap-2">
                    {getBookingTypeIcon(selectedBooking.bookingType)}
                    <Badge className={bookingTypeColors[selectedBooking.bookingType]}>
                      {getBookingTypeLabel(selectedBooking.bookingType)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Status</p>
                  <Badge className={statusColors[selectedBooking.status]}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Item</p>
                <p className="font-medium">{getItemName(selectedBooking)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Booking Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p>{new Date(selectedBooking.bookingDate).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Number of People</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <p>{selectedBooking.numberOfPeople}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">Contact Information</p>
                <div className="space-y-2 bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <p>{selectedBooking.contactName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p>{selectedBooking.contactEmail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p>{selectedBooking.contactPhone}</p>
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Notes</p>
                  <p className="bg-muted p-3 rounded-lg">{selectedBooking.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {selectedBooking.status === "pending" && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => {
                        handleStatusUpdate(selectedBooking, "confirmed")
                        setSelectedBooking(null)
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleStatusUpdate(selectedBooking, "cancelled")
                        setSelectedBooking(null)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Booking
                    </Button>
                  </>
                )}
                {selectedBooking.status === "confirmed" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleStatusUpdate(selectedBooking, "cancelled")
                      setSelectedBooking(null)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
