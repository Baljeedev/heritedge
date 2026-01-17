import { apiClient } from './client';

export interface HeritageSite {
  _id: string;
  name: string;
  description: string;
  location: {
    city: string;
    state: string;
    country: string;
    address?: string;
  };
  coordinates: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  image: string;
  images?: string[];
  category: string;
  era?: string;
  unescoWorldHeritage: boolean;
  status: 'active' | 'restoration' | 'closed';
  rating: number;
  reviewCount: number;
  openingHours?: {
    [key: string]: string;
  };
  admissionFee?: {
    adult: number;
    child: number;
    senior?: number;
  };
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeritageSitesQueryParams {
  search?: string;
  city?: string;
  state?: string;
  status?: string;
  unesco?: boolean;
  minRating?: number;
  limit?: number;
  skip?: number;
}

export interface NearbySitesParams {
  latitude: number;
  longitude: number;
  maxDistance?: number; // in meters
}

export const heritageSitesApi = {
  // Get all heritage sites with optional filters
  getAll: async (params?: HeritageSitesQueryParams) => {
    const response = await apiClient.get<{ sites: HeritageSite[]; total: number; limit: number; skip: number }>(
      '/api/heritage-sites',
      { params }
    );
    return response.data;
  },

  // Get nearby heritage sites
  getNearby: async (params: NearbySitesParams) => {
    const response = await apiClient.get<{ sites: HeritageSite[] }>(
      '/api/heritage-sites/nearby',
      { params }
    );
    return response.data.sites;
  },

  // Get a specific heritage site
  getById: async (id: string) => {
    const response = await apiClient.get<HeritageSite>(`/api/heritage-sites/${id}`);
    return response.data;
  },

  // Create a new heritage site (Admin only)
  create: async (data: Partial<HeritageSite>) => {
    const response = await apiClient.post<HeritageSite>('/api/heritage-sites', data);
    return response.data;
  },

  // Update a heritage site
  update: async (id: string, data: Partial<HeritageSite>) => {
    const response = await apiClient.put<HeritageSite>(`/api/heritage-sites/${id}`, data);
    return response.data;
  },

  // Delete a heritage site
  delete: async (id: string) => {
    const response = await apiClient.delete<{ message: string }>(`/api/heritage-sites/${id}`);
    return response.data;
  },
};

