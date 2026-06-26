import { apiClient } from './client';

export interface Experience {
  _id: string;
  type: "guide" | "music" | "workshop";
  name: string;
  image: string;
  video?: string;
  sites: string[] | { _id: string; name: string; location: any; image?: string }[];
  rating: number;
  reviewCount: number;
  price: number;
  description: string;
  
  // Guide-specific fields
  guideId?: string | { _id: string; name: string; specialization: string; rating: number; languages?: string[] };
  
  // Music-specific fields
  duration?: string;
  venue?: string;
  performers?: string[];
  genre?: string;
  schedule?: string[];
  
  // Workshop-specific fields
  instructor?: string;
  skillLevel?: "beginner" | "intermediate" | "advanced";
  materialsIncluded?: boolean;
  maxParticipants?: number;
  topics?: string[];
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExperiencesQueryParams {
  type?: string;
  siteId?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  skillLevel?: string;
  limit?: number;
  skip?: number;
  cityId?: string;
  instrumentId?: string;
  artFormId?: string;
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

