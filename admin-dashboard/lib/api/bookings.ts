import apiClient from "../api-client"

export interface Booking {
  _id: string
  userId: string
  bookingType: "guide" | "music" | "workshop"
  guideId?: string | { _id: string; name: string; specialization: string; image?: string; rating: number }
  experienceId?: string | { _id: string; name: string; type: string; image?: string; price: number; description?: string; duration?: string; venue?: string }
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
  all?: boolean
}

export const bookingsApi = {
  // Get all bookings (with all=true for admin)
  getAll: async (params?: BookingsQueryParams) => {
    const response = await apiClient.get<{ bookings: Booking[] }>("/api/bookings", {
      params: { ...params, all: "true" },
    })
    return response.data
  },

  // Get a specific booking
  getById: async (id: string) => {
    const response = await apiClient.get<Booking>(`/api/bookings/${id}`)
    return response.data
  },

  // Update booking (e.g., change status)
  update: async (id: string, data: Partial<Booking>) => {
    const response = await apiClient.put<Booking>(`/api/bookings/${id}`, data)
    return response.data
  },

  // Cancel booking
  cancel: async (id: string) => {
    const response = await apiClient.delete<{ message: string; booking: Booking }>(`/api/bookings/${id}`)
    return response.data
  },
}
