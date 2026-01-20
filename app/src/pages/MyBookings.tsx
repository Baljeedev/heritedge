"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { Navigation } from "@/core/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { bookingsApi, type Booking } from "@/lib/api/bookings"
import { Loader2, Calendar, Users, Phone, Mail, Music, Hammer, User, AlertCircle } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/core/components/ui/alert-dialog"
import { useI18n } from "@/lib/i18n/context"

export default function MyBookingsPage() {
  const { t } = useI18n()
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/sign-in?redirect_url=/my-bookings")
      return
    }

    loadBookings()
  }, [isSignedIn, navigate])

  const loadBookings = async () => {
    try {
      setIsLoading(true)
      const data = await bookingsApi.getAll()
      setBookings(data.bookings)
      setError(null)
    } catch (err: any) {
      setError(err.message || t('failedToLoadBookings'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async (bookingId: string) => {
    try {
      await bookingsApi.cancel(bookingId)
      await loadBookings()
    } catch (err: any) {
      setError(err.message || t('failedToCancelBooking'))
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
        return t('guide')
      case "music":
        return t('music')
      case "workshop":
        return t('workshop')
      default:
        return "Booking"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return t('confirmed')
      case "pending":
        return t('pending')
      case "cancelled":
        return t('cancelled')
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getItemName = (booking: Booking) => {
    if (booking.bookingType === "guide" && typeof booking.guideId === "object" && booking.guideId !== null) {
      return booking.guideId.name
    }
    if ((booking.bookingType === "music" || booking.bookingType === "workshop") && typeof booking.experienceId === "object" && booking.experienceId !== null) {
      return booking.experienceId.name
    }
    return "Unknown"
  }

  const getItemPrice = (booking: Booking) => {
    if (booking.bookingType === "guide") {
      // For guides, we'd need to fetch the guide to get pricePerDay
      // For now, show estimated total
      return "Contact for pricing"
    }
    if (typeof booking.experienceId === "object" && booking.experienceId !== null) {
      return `$${booking.experienceId.price} per person`
    }
    return "Contact for pricing"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">{t('loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t('bookings')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('manageBookings')}
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {bookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{t('noBookingsYet')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('startExploring')}
                </p>
                <Button onClick={() => navigate("/experiences")}>
                  {t('browseExperiences')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getBookingTypeIcon(booking.bookingType)}
                          <CardTitle className="text-xl">{getItemName(booking)}</CardTitle>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getBookingTypeLabel(booking.bookingType)}
                        </p>
                      </div>
                      {booking.status === "pending" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              {t('cancelBooking')}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('cancelBookingTitle')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('cancelBookingDescription')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('keepBooking')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancel(booking._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {t('cancelBookingConfirm')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{t('bookingDate')}:</span>
                          <span className="font-medium">
                            {new Date(booking.bookingDate).toLocaleString()}
                          </span>
                        </div>
                        {booking.bookingType !== "guide" && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{t('numberOfPeople')}:</span>
                            <span className="font-medium">{booking.numberOfPeople}</span>
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="text-muted-foreground">Price:</span>{" "}
                          <span className="font-medium">{getItemPrice(booking)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Contact:</span>
                          <span className="font-medium">{booking.contactName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{booking.contactEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{booking.contactPhone}</span>
                        </div>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">{t('notes')}:</span> {booking.notes}
                        </p>
                      </div>
                    )}
                    {booking.status === "pending" && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-amber-800">
                              <p className="font-semibold mb-1">{t('paymentInformation')}</p>
                              <p>
                                {t('paymentNote')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
