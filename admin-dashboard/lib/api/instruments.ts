import apiClient from "../api-client"

export interface IInstrument {
  _id: string
  name: string
  category: string
  origin?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface InstrumentsResponse {
  instruments: IInstrument[]
  total: number
}

export const instrumentsApi = {
  getAll: async (filters?: { search?: string; category?: string }): Promise<InstrumentsResponse> => {
    const params = new URLSearchParams()
    if (filters?.search) params.append("search", filters.search)
    if (filters?.category) params.append("category", filters.category)
    const res = await apiClient.get<InstrumentsResponse>(`/api/instruments?${params.toString()}`)
    return res.data
  },
  getById: async (id: string): Promise<IInstrument> => {
    const res = await apiClient.get<IInstrument>(`/api/instruments/${id}`)
    return res.data
  },
  create: async (data: Partial<IInstrument>): Promise<IInstrument> => {
    const res = await apiClient.post<IInstrument>("/api/instruments", data)
    return res.data
  },
  update: async (id: string, data: Partial<IInstrument>): Promise<IInstrument> => {
    const res = await apiClient.put<IInstrument>(`/api/instruments/${id}`, data)
    return res.data
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/instruments/${id}`)
  },
}
