import { apiClient } from './client';

export interface Review {
  _id: string;
  clerkUserId: string;
  authorName?: string;
  authorImage?: string;
  reviewType: 'site' | 'guide' | 'hotel' | 'experience';
  targetId: string;
  rating: number;
  comment?: string;
  images?: string[];
  visitDate?: string;
  helpfulCount: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsQueryParams {
  reviewType?: string;
  targetId?: string;
  minRating?: number;
  limit?: number;
  skip?: number;
}

export interface CreateReviewData {
  reviewType: 'site' | 'guide' | 'hotel' | 'experience';
  targetId: string;
  rating: number;
  comment?: string;
  authorName?: string;
  authorImage?: string;
  images?: string[];
  visitDate?: string;
}

export const reviewsApi = {
  // Get all reviews with optional filters
  getAll: async (params?: ReviewsQueryParams) => {
    const response = await apiClient.get<{ reviews: Review[]; total: number; limit: number; skip: number }>(
      '/api/reviews',
      { params }
    );
    return response.data;
  },

  // Get a specific review
  getById: async (id: string) => {
    const response = await apiClient.get<Review>(`/api/reviews/${id}`);
    return response.data;
  },

  // Create a new review
  create: async (data: CreateReviewData) => {
    const response = await apiClient.post<Review>('/api/reviews', data);
    return response.data;
  },

  // Update review
  update: async (id: string, data: Partial<CreateReviewData>) => {
    const response = await apiClient.put<Review>(`/api/reviews/${id}`, data);
    return response.data;
  },

  // Delete review
  delete: async (id: string) => {
    const response = await apiClient.delete<{ message: string }>(`/api/reviews/${id}`);
    return response.data;
  },

  // Mark review as helpful
  markHelpful: async (id: string) => {
    const response = await apiClient.post<Review>(`/api/reviews/${id}/helpful`);
    return response.data;
  },
};

