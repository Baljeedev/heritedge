import { apiClient } from './client';

export interface City {
  _id: string;
  name: string;
  state: string;
  country: string;
  isActive: boolean;
}

export const citiesApi = {
  getAll: async (): Promise<{ cities: City[] }> => {
    const response = await apiClient.get<{ cities: City[] }>('/api/cities');
    return response.data;
  },
};
