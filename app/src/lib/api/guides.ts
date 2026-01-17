import { apiClient } from './client';

export interface Guide {
  _id: string;
  clerkUserId: string;
  name: string;
  email: string;
  phone?: string;
  bio: string;
  specialization: string[];
  languages: string[];
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  sites: string[] | { _id: string; name: string; location: any; image?: string }[];
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    verified: boolean;
    verificationDate?: string;
  }>;
  isIntern: boolean;
  isActive: boolean;
  age?: number;
  internshipStatus?: 'pending' | 'approved' | 'rejected';
  internshipTestScore?: number;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuidesQueryParams {
  siteId?: string;
  specialization?: string;
  minRating?: number;
  maxPrice?: number;
  languages?: string;
  isIntern?: boolean;
  verifiedOnly?: boolean;
  limit?: number;
  skip?: number;
}

export interface CreateGuideData {
  name: string;
  email: string;
  phone?: string;
  bio: string;
  specialization: string[];
  languages: string[];
  pricePerDay: number;
  sites?: string[];
  certifications?: Guide['certifications'];
  avatar?: string;
}

export interface InternshipApplicationData {
  name: string;
  email: string;
  phone?: string;
  bio: string;
  specialization: string[];
  languages: string[];
  age: number;
  testScore: number;
  sites?: string[];
}

export const guidesApi = {
  // Get all guides with optional filters
  getAll: async (params?: GuidesQueryParams) => {
    const response = await apiClient.get<{ guides: Guide[]; total: number; limit: number; skip: number }>(
      '/api/guides',
      { params }
    );
    return response.data;
  },

  // Get a specific guide
  getById: async (id: string) => {
    const response = await apiClient.get<Guide>(`/api/guides/${id}`);
    return response.data;
  },

  // Register as a guide
  create: async (data: CreateGuideData) => {
    const response = await apiClient.post<Guide>('/api/guides', data);
    return response.data;
  },

  // Update guide profile
  update: async (id: string, data: Partial<CreateGuideData>) => {
    const response = await apiClient.put<Guide>(`/api/guides/${id}`, data);
    return response.data;
  },

  // Add certification
  addCertification: async (id: string, certification: Guide['certifications'][0]) => {
    const response = await apiClient.post<Guide>(`/api/guides/${id}/certifications`, certification);
    return response.data;
  },

  // Verify certification (Admin only)
  verifyCertification: async (id: string, certIndex: number) => {
    const response = await apiClient.post<Guide>(
      `/api/guides/${id}/verify-certification/${certIndex}`
    );
    return response.data;
  },

  // Apply for internship
  applyInternship: async (data: InternshipApplicationData) => {
    const response = await apiClient.post<Guide>('/api/guides/apply-internship', data);
    return response.data;
  },
};

