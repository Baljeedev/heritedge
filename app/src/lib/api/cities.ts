import { apiClient } from './client';

export interface City {
  _id: string;
  name: string;
  state: string;
  country: string;
  isActive: boolean;
}

export const citiesApi = {
  getAll: async (params?: { limit?: number; search?: string }): Promise<{ cities: City[] }> => {
    const response = await apiClient.get<{ cities: City[] }>('/api/cities', {
      params: { limit: params?.limit ?? 2000, ...params },
    });
    return response.data;
  },
};
