import { apiClient } from './client';

export interface Experience {
  _id: string;
  name: string;
  description: string;
  type: 'workshop' | 'tour' | 'activity' | 'event';
  sites: string[] | { _id: string; name: string; location: any; image?: string }[];
  guideId?: string | { _id: string; name: string; specialization: string; rating: number; languages?: string[] };
  price: number;
  duration: number; // in minutes
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  maxParticipants?: number;
  rating: number;
  reviewCount: number;
  images?: string[];
  isActive: boolean;
  schedule?: {
    startDate: string;
    endDate?: string;
    recurring?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExperiencesQueryParams {
  type?: string;
  siteId?: string;
  minRating?: number;
  maxPrice?: number;
  skillLevel?: string;
  limit?: number;
  skip?: number;
}

export const experiencesApi = {
  // Get all experiences with optional filters
  getAll: async (params?: ExperiencesQueryParams) => {
    const response = await apiClient.get<{ experiences: Experience[]; total: number; limit: number; skip: number }>(
      '/api/experiences',
      { params }
    );
    return response.data;
  },

  // Get a specific experience
  getById: async (id: string) => {
    const response = await apiClient.get<Experience>(`/api/experiences/${id}`);
    return response.data;
  },

  // Create a new experience
  create: async (data: Partial<Experience>) => {
    const response = await apiClient.post<Experience>('/api/experiences', data);
    return response.data;
  },

  // Update experience
  update: async (id: string, data: Partial<Experience>) => {
    const response = await apiClient.put<Experience>(`/api/experiences/${id}`, data);
    return response.data;
  },

  // Delete experience
  delete: async (id: string) => {
    const response = await apiClient.delete<{ message: string }>(`/api/experiences/${id}`);
    return response.data;
  },
};

