import apiClient from "../api-client"

export interface IAdminUser {
  _id: string
  clerkUserId: string
  email: string
  name: string
  role: "admin" | "manager"
  isActive: boolean
  addedBy?: string
  createdAt: string
  updatedAt: string
}

export const adminUsersApi = {
  getAll: async (): Promise<{ users: IAdminUser[] }> => {
    const res = await apiClient.get<{ users: IAdminUser[] }>("/api/admin-users")
    return res.data
  },
  create: async (data: { clerkUserId: string; email: string; name: string; role: "admin" | "manager"; addedBy?: string }): Promise<IAdminUser> => {
    const res = await apiClient.post<IAdminUser>("/api/admin-users", data)
    return res.data
  },
  update: async (id: string, data: Partial<IAdminUser>): Promise<IAdminUser> => {
    const res = await apiClient.put<IAdminUser>(`/api/admin-users/${id}`, data)
    return res.data
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/admin-users/${id}`)
  },
}
