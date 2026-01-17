import apiClient from "../api-client"
import type { IReview } from "../types"

export interface ReviewsResponse {
  reviews: IReview[]
  total: number
  limit: number
  skip: number
}

export interface ReviewsFilters {
  reviewType?: "site" | "guide" | "hotel" | "experience"
  targetId?: string
  minRating?: number
  all?: boolean // Include hidden reviews (for admin)
  limit?: number
  skip?: number
}

export const reviewsApi = {
  // Get all reviews (admin can see all, including hidden)
  getAll: async (filters?: ReviewsFilters): Promise<ReviewsResponse> => {
    const params = new URLSearchParams()
    if (filters?.reviewType) params.append("reviewType", filters.reviewType)
    if (filters?.targetId) params.append("targetId", filters.targetId)
    if (filters?.minRating) params.append("minRating", filters.minRating.toString())
    if (filters?.all) params.append("all", "true") // Include hidden reviews
    if (filters?.limit) params.append("limit", filters.limit.toString())
    if (filters?.skip) params.append("skip", filters.skip.toString())

    const response = await apiClient.get<ReviewsResponse>(`/api/reviews?${params.toString()}`)
    return response.data
  },

  // Get single review
  getById: async (id: string): Promise<IReview> => {
    const response = await apiClient.get<IReview>(`/api/reviews/${id}`)
    return response.data
  },

  // Update review (admin can update visibility, verified status)
  update: async (id: string, data: Partial<IReview>): Promise<IReview> => {
    const response = await apiClient.put<IReview>(`/api/reviews/${id}`, data)
    return response.data
  },

  // Delete review
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/reviews/${id}`)
  },
}