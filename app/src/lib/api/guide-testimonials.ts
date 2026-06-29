import { apiClient } from './client';

export interface GuideTestimonialGuide {
  _id: string;
  name: string;
  image?: string;
  leadCount: number;
  specialization?: string;
  cities?: string[] | { _id: string; name: string; state: string }[];
}

export interface GuideTestimonial {
  _id: string;
  guideId: string | GuideTestimonialGuide;
  quote: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GuideTestimonialsResponse {
  testimonials: GuideTestimonial[];
  total: number;
  totalLeads: number;
}

export const guideTestimonialsApi = {
  getAll: async (params?: { limit?: number }): Promise<GuideTestimonialsResponse> => {
    const response = await apiClient.get<GuideTestimonialsResponse>('/api/guide-testimonials', {
      params,
    });
    return response.data;
  },
};
