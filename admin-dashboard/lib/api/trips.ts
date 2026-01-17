import apiClient from "../api-client"
import type { ITrip } from "../types"

export interface TripsResponse {
  trips: ITrip[]
  total: number
  limit: number
  skip: number
}

export interface TripsFilters {
  userId?: string
  status?: string
  limit?: number
  skip?: number
}

export const tripsApi = {
  // Get all trips (admin can see all)
  getAll: async (filters?: TripsFilters): Promise<TripsResponse> => {
    const params = new URLSearchParams()
    if (filters?.userId) params.append("userId", filters.userId)
    if (filters?.status) params.append("status", filters.status)
    if (filters?.limit) params.append("limit", filters.limit.toString())
    if (filters?.skip) params.append("skip", filters.skip.toString())

    const response = await apiClient.get<TripsResponse>(`/api/trips?${params.toString()}`)
    return response.data
  },

  // Get featured trips
  getFeatured: async (limit?: number, skip?: number): Promise<TripsResponse> => {
    const params = new URLSearchParams()
    if (limit) params.append("limit", limit.toString())
    if (skip) params.append("skip", skip.toString())

    const response = await apiClient.get<TripsResponse>(`/api/trips/featured?${params.toString()}`)
    return response.data
  },

  // Get single trip
  getById: async (id: string): Promise<ITrip> => {
    const response = await apiClient.get<ITrip>(`/api/trips/${id}`)
    return response.data
  },

  // Create trip
  create: async (data: Partial<ITrip>): Promise<ITrip> => {
    const response = await apiClient.post<ITrip>("/api/trips", data)
    return response.data
  },

  // Update trip
  update: async (id: string, data: Partial<ITrip>): Promise<ITrip> => {
    const response = await apiClient.put<ITrip>(`/api/trips/${id}`, data)
    return response.data
  },

  // Delete trip
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/trips/${id}`)
  },
}