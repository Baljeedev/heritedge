import apiClient from "../api-client"
import type { IGuide, IGuideTestimonial } from "../types"

export interface GuideTestimonialsResponse {
  testimonials: IGuideTestimonial[]
  total: number
  totalLeads: number
}

export const guideTestimonialsApi = {
  getAll: async (params?: { all?: boolean; limit?: number }): Promise<GuideTestimonialsResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.all) searchParams.append("all", "true")
    if (params?.limit) searchParams.append("limit", String(params.limit))
    const res = await apiClient.get<GuideTestimonialsResponse>(
      `/api/guide-testimonials?${searchParams.toString()}`
    )
    return res.data
  },

  getById: async (id: string): Promise<IGuideTestimonial> => {
    const res = await apiClient.get<IGuideTestimonial>(`/api/guide-testimonials/${id}`)
    return res.data
  },

  create: async (data: Partial<IGuideTestimonial>): Promise<IGuideTestimonial> => {
    const res = await apiClient.post<IGuideTestimonial>("/api/guide-testimonials", data)
    return res.data
  },

  update: async (id: string, data: Partial<IGuideTestimonial>): Promise<IGuideTestimonial> => {
    const res = await apiClient.put<IGuideTestimonial>(`/api/guide-testimonials/${id}`, data)
    return res.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/guide-testimonials/${id}`)
  },
}

export type { IGuideTestimonial }
