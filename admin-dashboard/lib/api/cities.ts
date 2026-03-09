import apiClient from "../api-client"

export interface ICity {
  _id: string
  name: string
  state: string
  country: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CitiesResponse {
  cities: ICity[]
  total: number
}

export const citiesApi = {
  getAll: async (filters?: { search?: string; state?: string }): Promise<CitiesResponse> => {
    const params = new URLSearchParams()
    if (filters?.search) params.append("search", filters.search)
    if (filters?.state) params.append("state", filters.state)
    const res = await apiClient.get<CitiesResponse>(`/api/cities?${params.toString()}`)
    return res.data
  },
  getById: async (id: string): Promise<ICity> => {
    const res = await apiClient.get<ICity>(`/api/cities/${id}`)
    return res.data
  },
  create: async (data: Partial<ICity>): Promise<ICity> => {
    const res = await apiClient.post<ICity>("/api/cities", data)
    return res.data
  },
  update: async (id: string, data: Partial<ICity>): Promise<ICity> => {
    const res = await apiClient.put<ICity>(`/api/cities/${id}`, data)
    return res.data
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/cities/${id}`)
  },
}
