import { apiClient } from './client';

export interface Guide {
  _id: string;
  clerkUserId: string;
  name: string;
  image?: string;
  video?: string;
  specialization: string;
  sites: string[] | { _id: string; name: string; location: string; city?: string; state?: string; image?: string }[];
  cities?: string[] | { _id: string; name: string; state: string }[];
  rating: number;
  reviewCount: number;
  pricePerDay: number;
  languages: string[];
  experience: number; // years of experience
  bio: string;
  certifications: Array<{
    name: string;
    issuingAuthority: string;
    certificateNumber: string;
    issueDate: string;
    expiryDate?: string;
    verified: boolean;
    verificationDate?: string;
  }>;
  isIntern: boolean;
  age?: number;
  internshipStatus?: "pending" | "approved" | "rejected" | "completed";
  internshipTestScore?: number;
  whatsappNumber?: string;
  leadCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuidesQueryParams {
  siteId?: string;
  cityId?: string;
  search?: string;
  specialization?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  languages?: string;
  isIntern?: boolean;
  verifiedOnly?: boolean;
  limit?: number;
  skip?: number;
}

export interface CreateGuideData {
  name: string;
  bio: string;
  specialization: string;
  languages: string[];
  pricePerDay: number;
  sites?: string[];
  certifications?: Guide['certifications'];
  image?: string;
  experience?: number;
}

export interface InternshipApplicationData {
  name: string;
  bio: string;
  specialization: string;
  languages: string[];
  age: number;
  testScore: number;
  sites?: string[];
}

export const guidesApi = {
  // Get all guides with optional filters
  getAll: async (params?: GuidesQueryParams) => {
    console.log("guidesApi.getAll - Calling /api/guides with params:", params);
    const response = await apiClient.get<{ guides: Guide[]; total: number; limit: number; skip: number }>(
      '/api/guides',
      { params }
    );
    console.log("guidesApi.getAll - Response:", response.data);
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

  // Record a contact lead when user clicks Contact Guide
  recordLead: async (id: string) => {
    const response = await apiClient.post<{ leadCount: number }>(`/api/guides/${id}/leads`);
    return response.data;
  },
};

