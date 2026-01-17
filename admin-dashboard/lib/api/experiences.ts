import apiClient from "../api-client"
import type { IExperience } from "../types"

export interface ExperiencesResponse {
  experiences: IExperience[]
  total: number
  limit: number
  skip: number
}

export interface ExperiencesFilters {
  type?: "guide" | "music" | "workshop"
  siteId?: string
  minRating?: number
  maxPrice?: number
  skillLevel?: "beginner" | "intermediate" | "advanced"
  all?: boolean // Include inactive experiences (for admin)
  limit?: number
  skip?: number
}

export const experiencesApi = {
  // Get all experiences
  getAll: async (filters?: ExperiencesFilters): Promise<ExperiencesResponse> => {
    const params = new URLSearchParams()
    if (filters?.type) params.append("type", filters.type)
    if (filters?.siteId) params.append("siteId", filters.siteId)
    if (filters?.minRating) params.append("minRating", filters.minRating.toString())
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
    if (filters?.skillLevel) params.append("skillLevel", filters.skillLevel)
    if (filters?.all) params.append("all", "true") // Include inactive experiences
    if (filters?.limit) params.append("limit", filters.limit.toString())
    if (filters?.skip) params.append("skip", filters.skip.toString())

    const response = await apiClient.get<ExperiencesResponse>(`/api/experiences?${params.toString()}`)
    return response.data
  },

  // Get single experience
  getById: async (id: string): Promise<IExperience> => {
    const response = await apiClient.get<IExperience>(`/api/experiences/${id}`)
    return response.data
  },

  // Create experience
  create: async (data: Partial<IExperience>): Promise<IExperience> => {
    const response = await apiClient.post<IExperience>("/api/experiences", data)
    return response.data
  },

  // Update experience
  update: async (id: string, data: Partial<IExperience>): Promise<IExperience> => {
    const response = await apiClient.put<IExperience>(`/api/experiences/${id}`, data)
    return response.data
  },

  // Delete experience
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/experiences/${id}`)
  },
}