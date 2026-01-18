import { apiClient } from './client';

export interface Booking {
  _id: string;
  userId: string;
  bookingType: "guide" | "music" | "workshop";
  guideId?: string | { _id: string; name: string; specialization: string; image?: string; rating: number };
  experienceId?: string | { _id: string; name: string; type: string; image?: string; price: number; description?: string; duration?: string; venue?: string };
  bookingDate: string;
  numberOfPeople: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  bookingType: "guide" | "music" | "workshop";
  guideId?: string;
  experienceId?: string;
  bookingDate: string;
  numberOfPeople: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
}

export interface BookingsQueryParams {
  status?: "pending" | "confirmed" | "cancelled";
  bookingType?: "guide" | "music" | "workshop";
  all?: boolean; // For admin to get all bookings
}

export const bookingsApi = {
  // Get all bookings (user's own bookings by default)
  getAll: async (params?: BookingsQueryParams) => {
    const response = await apiClient.get<{ bookings: Booking[] }>(
      '/api/bookings',
      { params }
    );
    return response.data;
  },

  // Get a specific booking
  getById: async (id: string) => {
    const response = await apiClient.get<Booking>(`/api/bookings/${id}`);
    return response.data;
  },

  // Create a new booking
  create: async (data: CreateBookingData) => {
    const response = await apiClient.post<Booking>('/api/bookings', data);
    return response.data;
  },

  // Update booking
  update: async (id: string, data: Partial<CreateBookingData & { status?: "pending" | "confirmed" | "cancelled" }>) => {
    const response = await apiClient.put<Booking>(`/api/bookings/${id}`, data);
    return response.data;
  },

  // Cancel booking
  cancel: async (id: string) => {
    const response = await apiClient.delete<{ message: string; booking: Booking }>(`/api/bookings/${id}`);
    return response.data;
  },
};
