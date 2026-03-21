import apiClient from "../api-client"

export interface IArtForm {
  _id: string
  name: string
  category: string
  origin?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ArtFormsResponse {
  artForms: IArtForm[]
  total: number
}

export const artFormsApi = {
  getAll: async (filters?: { search?: string; category?: string }): Promise<ArtFormsResponse> => {
    const params = new URLSearchParams()
    if (filters?.search) params.append("search", filters.search)
    if (filters?.category) params.append("category", filters.category)
    const res = await apiClient.get<ArtFormsResponse>(`/api/art-forms?${params.toString()}`)
    return res.data
  },
  getById: async (id: string): Promise<IArtForm> => {
    const res = await apiClient.get<IArtForm>(`/api/art-forms/${id}`)
    return res.data
  },
  create: async (data: Partial<IArtForm>): Promise<IArtForm> => {
    const res = await apiClient.post<IArtForm>("/api/art-forms", data)
    return res.data
  },
  update: async (id: string, data: Partial<IArtForm>): Promise<IArtForm> => {
    const res = await apiClient.put<IArtForm>(`/api/art-forms/${id}`, data)
    return res.data
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/art-forms/${id}`)
  },
}
