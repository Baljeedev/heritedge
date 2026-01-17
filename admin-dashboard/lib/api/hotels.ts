import apiClient from "../api-client"
import type { IHotel } from "../types"

export interface HotelsResponse {
  hotels: IHotel[]
  total: number
  limit: number
  skip: number
}

export interface HotelsFilters {
  city?: string
  state?: string
  siteId?: string
  chain?: string
  minRating?: number
  maxPrice?: number
  hasLivingHistory?: boolean
  hasHistoryLectures?: boolean
  hasCulturalMeals?: boolean
  all?: boolean // Include inactive hotels (for admin)
  limit?: number
  skip?: number
}

export const hotelsApi = {
  // Get all hotels
  getAll: async (filters?: HotelsFilters): Promise<HotelsResponse> => {
    const params = new URLSearchParams()
    if (filters?.city) params.append("city", filters.city)
    if (filters?.state) params.append("state", filters.state)
    if (filters?.siteId) params.append("siteId", filters.siteId)
    if (filters?.chain) params.append("chain", filters.chain)
    if (filters?.minRating) params.append("minRating", filters.minRating.toString())
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
    if (filters?.hasLivingHistory) params.append("hasLivingHistory", "true")
    if (filters?.hasHistoryLectures) params.append("hasHistoryLectures", "true")
    if (filters?.hasCulturalMeals) params.append("hasCulturalMeals", "true")
    if (filters?.all) params.append("all", "true") // Include inactive hotels
    if (filters?.limit) params.append("limit", filters.limit.toString())
    if (filters?.skip) params.append("skip", filters.skip.toString())

    const response = await apiClient.get<HotelsResponse>(`/api/hotels?${params.toString()}`)
    return response.data
  },

  // Get single hotel
  getById: async (id: string): Promise<IHotel> => {
    const response = await apiClient.get<IHotel>(`/api/hotels/${id}`)
    return response.data
  },

  // Create hotel
  create: async (data: Partial<IHotel>): Promise<IHotel> => {
    const response = await apiClient.post<IHotel>("/api/hotels", data)
    return response.data
  },

  // Update hotel
  update: async (id: string, data: Partial<IHotel>): Promise<IHotel> => {
    const response = await apiClient.put<IHotel>(`/api/hotels/${id}`, data)
    return response.data
  },

  // Delete hotel
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/hotels/${id}`)
  },
}