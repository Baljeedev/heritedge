"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog"
import { bookingsApi, type CreateBookingData } from "@/lib/api/bookings"
import { useAuth } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

interface BookingFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookingType: "guide" | "music" | "workshop"
  guideId?: string
  experienceId?: string
  itemName: string
  itemPrice: number
}

export function BookingForm({
  open,
  onOpenChange,
  bookingType,
  guideId,
  experienceId,
  itemName,
  itemPrice,
}: BookingFormProps) {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    bookingDate: "",
    numberOfPeople: 1,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
  })

  // Reset numberOfPeople to 1 when booking type is guide
  useEffect(() => {
    if (bookingType === "guide") {
      setFormData((prev) => ({ ...prev, numberOfPeople: 1 }))
    }
  }, [bookingType])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfPeople" ? parseInt(value) || 1 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isSignedIn) {
      navigate("/sign-in?redirect_url=" + encodeURIComponent(window.location.pathname))
      return
    }

    setIsSubmitting(true)

    try {
      const bookingData: CreateBookingData = {
        bookingType,
        guideId: bookingType === "guide" ? guideId : undefined,
        experienceId: bookingType !== "guide" ? experienceId : undefined,
        bookingDate: new Date(formData.bookingDate).toISOString(),
        numberOfPeople: bookingType === "guide" ? 1 : formData.numberOfPeople,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        notes: formData.notes || undefined,
      }

      await bookingsApi.create(bookingData)
      setShowSuccess(true)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create booking. Please try again."
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!showSuccess) {
      onOpenChange(false)
      setFormData({
        bookingDate: "",
        numberOfPeople: bookingType === "guide" ? 1 : 1,
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        notes: "",
      })
      setError(null)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    onOpenChange(false)
    setFormData({
      bookingDate: "",
      numberOfPeople: bookingType === "guide" ? 1 : 1,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      notes: "",
    })
    setError(null)
  }

  // Calculate minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleSuccessClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">{t('bookingConfirmed')}</DialogTitle>
            <DialogDescription className="text-center">
              {t('bookingSubmitted')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">{t('paymentInformation')}</p>
                  <p>
                    {t('paymentNote')}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <span className="font-semibold">{t('item')}:</span> {itemName}
              </p>
              <p>
                <span className="font-semibold">{t('bookingDate')}:</span>{" "}
                {new Date(formData.bookingDate).toLocaleDateString()}
              </p>
              {bookingType !== "guide" && (
                <p>
                  <span className="font-semibold">{t('numberOfPeople')}:</span> {formData.numberOfPeople}
                </p>
              )}
              <p>
                <span className="font-semibold">{t('estimatedTotalLabel')}:</span> $
                {bookingType === "guide" ? itemPrice : itemPrice * formData.numberOfPeople}
              </p>
            </div>

            <div className="w-full flex ">
              <Button onClick={handleSuccessClose} className="w-1/2">
                {t('close')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleSuccessClose()
                  navigate("/my-bookings")
                }}
                className="w-1/2"
              >
                {t('viewMyBookings')}
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('book')} {itemName}</DialogTitle>
          <DialogDescription>
            {t('fillDetails')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={bookingType === "guide" ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 gap-4"}>
            <div>
              <label htmlFor="bookingDate" className="block text-sm font-medium mb-1">
                {t('bookingDateTime')} *
              </label>
              <Input
                id="bookingDate"
                name="bookingDate"
                type="datetime-local"
                value={formData.bookingDate}
                onChange={handleChange}
                min={today}
                required
                className="w-full"
              />
            </div>
            {bookingType !== "guide" && (
              <div>
                <label htmlFor="numberOfPeople" className="block text-sm font-medium mb-1">
                  {t('numberOfPeople')} *
                </label>
                <Input
                  id="numberOfPeople"
                  name="numberOfPeople"
                  type="number"
                  min="1"
                  value={formData.numberOfPeople}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="contactName" className="block text-sm font-medium mb-1">
              {t('fullName')} *
            </label>
            <Input
              id="contactName"
              name="contactName"
              type="text"
              value={formData.contactName}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">
                {t('email')} *
              </label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium mb-1">
                {t('phone')} *
              </label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleChange}
                required
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              {t('specialRequirements')}
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Any special requirements or notes..."
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            {bookingType === "guide" ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('pricePerDay')}:</span>
                  <span className="font-semibold">${itemPrice}</span>
                </div>
                <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-border">
                  <span>{t('estimatedTotal')}:</span>
                  <span>${itemPrice}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('pricePerPerson')}:</span>
                  <span className="font-semibold">${itemPrice}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">{t('numberOfPeople')}:</span>
                  <span className="font-semibold">{formData.numberOfPeople}</span>
                </div>
                <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-border">
                  <span>{t('estimatedTotal')}:</span>
                  <span>${itemPrice * formData.numberOfPeople}</span>
                </div>
              </>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {t('finalPaymentNote')}
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              {t('close')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('submitting') : t('confirmBooking')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
