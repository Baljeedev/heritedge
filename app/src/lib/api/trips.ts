import { apiClient } from './client';

export interface Trip {
  _id: string;
  clerkUserId: string;
  name: string;
  // Featured/premade trip fields (used by Trip Planner / Trip Detail)
  location?: string;
  duration?: string; // e.g., "3 Days"
  image?: string;
  budget?: "Budget" | "Moderate" | "Luxury";
  bestTimeToVisit?: string;
  highlights?: string[];
  description?: string;
  startDate?: string;
  endDate?: string;
  status: 'draft' | 'planned' | 'booked' | 'completed' | 'cancelled';
  selectedSites: string[] | Array<{ _id: string; name: string; location: unknown; image?: string; description?: string }>;
  selectedHotels: Array<{
    hotelId: string | { _id: string; name: string; location: unknown; images?: string[]; pricePerNight?: unknown };
    checkIn: string;
    checkOut: string;
  }>;
  selectedGuides: Array<{
    guideId: string | { _id: string; name: string; specialization: string; rating: number; languages?: string[]; bio?: string };
    siteId: string | { _id: string; name: string; location: unknown };
    date: string;
  }>;
  selectedExperiences: Array<{
    experienceId: string | { _id: string; name: string; type: string; price: number; description?: string };
    date: string;
    // backend supports time; some client code used participants earlier
    time?: string;
    participants?: number;
  }>;
  itinerary?: Array<{
    day: number;
    title: string;
    activities: Array<{
      time: string;
      activity: string;
      location: string;
      description?: string;
    }>;
  }>;
  totalBudget?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripsQueryParams {
  userId?: string;
  status?: string;
  limit?: number;
  skip?: number;
}

export interface CreateTripData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  selectedSites?: string[];
  selectedHotels?: Trip['selectedHotels'];
  selectedGuides?: Trip['selectedGuides'];
  selectedExperiences?: Trip['selectedExperiences'];
  notes?: string;
}

export interface GenerateItineraryData {
  prompt?: string;
}

export const tripsApi = {
  // Get featured/premade trips (open to all users)
  getFeatured: async (params?: { limit?: number; skip?: number }) => {
    const response = await apiClient.get<{ trips: Trip[]; total: number; limit: number; skip: number }>(
      '/api/trips/featured',
      { params }
    );
    return response.data;
  },

  // Get all trips (user's trips if authenticated, or public trips)
  getAll: async (params?: TripsQueryParams) => {
    const response = await apiClient.get<{ trips: Trip[]; total: number; limit: number; skip: number }>(
      '/api/trips',
      { params }
    );
    return response.data;
  },

  // Get a specific trip
  getById: async (id: string) => {
    const response = await apiClient.get<Trip>(`/api/trips/${id}`);
    return response.data;
  },

  // Create a new trip
  create: async (data: CreateTripData) => {
    const response = await apiClient.post<Trip>('/api/trips', data);
    return response.data;
  },

  // Update trip
  update: async (id: string, data: Partial<CreateTripData>) => {
    const response = await apiClient.put<Trip>(`/api/trips/${id}`, data);
    return response.data;
  },

  // Delete trip
  delete: async (id: string) => {
    const response = await apiClient.delete<{ message: string }>(`/api/trips/${id}`);
    return response.data;
  },

  // Generate AI itinerary
  generateItinerary: async (id: string, data?: GenerateItineraryData) => {
    const response = await apiClient.post<{ message: string; prompt?: string; note: string }>(
      `/api/trips/${id}/generate-itinerary`,
      data
    );
    return response.data;
  },
};

