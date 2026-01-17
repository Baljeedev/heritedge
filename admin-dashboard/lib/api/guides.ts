import apiClient from "../api-client"
import type { IGuide } from "../types"

export interface GuidesResponse {
  guides: IGuide[]
  total: number
  limit: number
  skip: number
}

export interface GuidesFilters {
  siteId?: string
  specialization?: string
  minRating?: number
  maxPrice?: number
  languages?: string
  isIntern?: boolean
  verifiedOnly?: boolean
  all?: boolean // Include inactive guides (for admin)
  limit?: number
  skip?: number
}

export const guidesApi = {
  // Get all guides
  getAll: async (filters?: GuidesFilters): Promise<GuidesResponse> => {
    const params = new URLSearchParams()
    if (filters?.siteId) params.append("siteId", filters.siteId)
    if (filters?.specialization) params.append("specialization", filters.specialization)
    if (filters?.minRating) params.append("minRating", filters.minRating.toString())
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
    if (filters?.languages) params.append("languages", filters.languages)
    if (filters?.isIntern !== undefined) params.append("isIntern", filters.isIntern.toString())
    if (filters?.verifiedOnly) params.append("verifiedOnly", "true")
    if (filters?.all) params.append("all", "true") // Include inactive guides
    if (filters?.limit) params.append("limit", filters.limit.toString())
    if (filters?.skip) params.append("skip", filters.skip.toString())

    const response = await apiClient.get<GuidesResponse>(`/api/guides?${params.toString()}`)
    return response.data
  },

  // Get single guide
  getById: async (id: string): Promise<IGuide> => {
    const response = await apiClient.get<IGuide>(`/api/guides/${id}`)
    return response.data
  },

  // Create guide (admin can create any guide)
  create: async (data: Partial<IGuide>): Promise<IGuide> => {
    const response = await apiClient.post<IGuide>("/api/guides", data)
    return response.data
  },

  // Update guide (admin can update any guide)
  update: async (id: string, data: Partial<IGuide>): Promise<IGuide> => {
    const response = await apiClient.put<IGuide>(`/api/guides/${id}`, data)
    return response.data
  },

  // Delete guide (need to add endpoint)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/guides/${id}`)
  },

  // Verify certification
  verifyCertification: async (guideId: string, certIndex: number): Promise<IGuide> => {
    const response = await apiClient.post<IGuide>(
      `/api/guides/${guideId}/verify-certification/${certIndex}`
    )
    return response.data
  },
}