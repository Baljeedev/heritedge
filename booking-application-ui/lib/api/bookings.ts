import apiClient from "../api-client"

export interface Booking {
  _id: string
  userId: string
  bookingType: "guide" | "music" | "workshop"
  guideId?: string | { _id: string; name: string; specialization: string; image?: string; rating: number; email?: string }
  experienceId?: string | { _id: string; name: string; type: string; image?: string; price: number; email?: string }
  bookingDate: string
  numberOfPeople: number
  contactName: string
  contactEmail: string
  contactPhone: string
  notes?: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface BookingsQueryParams {
  status?: "pending" | "confirmed" | "cancelled"
  bookingType?: "guide" | "music" | "workshop"
  providerEmail?: string
}

export const bookingsApi = {
  // Get bookings by provider email
  getByProviderEmail: async (email: string, params?: Omit<BookingsQueryParams, "providerEmail">) => {
    const response = await apiClient.get<{ bookings: Booking[] }>("/api/bookings", {
      params: { ...params, providerEmail: email },
    })
    return response.data
  },
}
