import { apiClient } from './client';

export interface Instrument {
  _id: string;
  name: string;
  category: string;
  origin?: string;
}

export const instrumentsApi = {
  getAll: async (): Promise<{ instruments: Instrument[] }> => {
    const response = await apiClient.get<{ instruments: Instrument[] }>('/api/instruments');
    return response.data;
  },
};
