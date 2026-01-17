import apiClient from "../api-client"
import type { IHeritageSite } from "../types"

export interface HeritageSitesResponse {
  sites: IHeritageSite[]
  total: number
  limit: number
  skip: number
}

export interface HeritageSitesFilters {
  search?: string
  city?: string
  state?: string
  status?: string
  unesco?: boolean
  minRating?: number
  limit?: number
  skip?: number
}

export const heritageSitesApi = {
  // Get all heritage sites
  getAll: async (filters?: HeritageSitesFilters): Promise<HeritageSitesResponse> => {
    const params = new URLSearchParams()
    if (filters?.search) params.append("search", filters.search)
    if (filters?.city) params.append("city", filters.city)
    if (filters?.state) params.append("state", filters.state)
    if (filters?.status) params.append("status", filters.status)
    if (filters?.unesco) params.append("unesco", "true")
    if (filters?.minRating) params.append("minRating", filters.minRating.toString())
    if (filters?.limit) params.append("limit", filters.limit.toString())
    if (filters?.skip) params.append("skip", filters.skip.toString())

    const response = await apiClient.get<HeritageSitesResponse>(
      `/api/heritage-sites?${params.toString()}`
    )
    return response.data
  },

  // Get single heritage site
  getById: async (id: string): Promise<IHeritageSite> => {
    const response = await apiClient.get<IHeritageSite>(`/api/heritage-sites/${id}`)
    return response.data
  },

  // Create heritage site
  create: async (data: Partial<IHeritageSite>): Promise<IHeritageSite> => {
    const response = await apiClient.post<IHeritageSite>("/api/heritage-sites", data)
    return response.data
  },

  // Update heritage site
  update: async (id: string, data: Partial<IHeritageSite>): Promise<IHeritageSite> => {
    const response = await apiClient.put<IHeritageSite>(`/api/heritage-sites/${id}`, data)
    return response.data
  },

  // Delete heritage site
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/heritage-sites/${id}`)
  },
}