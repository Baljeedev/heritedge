import { apiClient } from './client';

export interface Hotel {
  _id: string;
  name: string;
  chain?: string;
  location: string;
  city: string;
  state: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  rating: number;
  reviewCount: number;
  pricePerNight: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  amenities: string[];
  roomTypes?: {
    name: string;
    description: string;
    pricePerNight: number;
    maxOccupancy: number;
    isLivingHistory: boolean;
    theme?: string;
  }[];
  heritageFeatures: {
    hasLivingHistoryRooms: boolean;
    hasHistoryLectures: boolean;
    hasCulturalMeals: boolean;
    hasStorytellingEvenings?: boolean;
    historicalTimelinePosters?: boolean;
  };
  nearbySites: string[] | { _id: string; name: string; location: any; image?: string }[];
  partnershipType?: "listing" | "referral" | "premium";
  listingFee?: number;
  referralFee?: number;
  discountPercentage?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HotelsQueryParams {
  city?: string;
  state?: string;
  siteId?: string;
  chain?: string;
  minRating?: number;
  maxPrice?: number;
  hasLivingHistory?: boolean;
  hasHistoryLectures?: boolean;
  hasCulturalMeals?: boolean;
  limit?: number;
  skip?: number;
}

export interface NearbyHotelsParams {
  latitude?: number;
  longitude?: number;
  siteId?: string;
  maxDistance?: number; // in meters
}

export const hotelsApi = {
  // Get all hotels with optional filters
  getAll: async (params?: HotelsQueryParams) => {
    const response = await apiClient.get<{ hotels: Hotel[]; total: number; limit: number; skip: number }>(
      '/api/hotels',
      { params }
    );
    return response.data;
  },

  // Get nearby hotels
  getNearby: async (params: NearbyHotelsParams) => {
    const response = await apiClient.get<{ hotels: Hotel[] }>(
      '/api/hotels/nearby',
      { params }
    );
    return response.data.hotels;
  },

  // Get a specific hotel
  getById: async (id: string) => {
    const response = await apiClient.get<Hotel>(`/api/hotels/${id}`);
    return response.data;
  },

  // Create a new hotel (Admin/Hotel Partner only)
  create: async (data: Partial<Hotel>) => {
    const response = await apiClient.post<Hotel>('/api/hotels', data);
    return response.data;
  },

  // Update hotel
  update: async (id: string, data: Partial<Hotel>) => {
    const response = await apiClient.put<Hotel>(`/api/hotels/${id}`, data);
    return response.data;
  },

  // Delete hotel
  delete: async (id: string) => {
    const response = await apiClient.delete<{ message: string }>(`/api/hotels/${id}`);
    return response.data;
  },
};

