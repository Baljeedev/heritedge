import { apiClient } from './client';

export interface ArtForm {
  _id: string;
  name: string;
  category: string;
  origin?: string;
}

export const artFormsApi = {
  getAll: async (): Promise<{ artForms: ArtForm[] }> => {
    const response = await apiClient.get<{ artForms: ArtForm[] }>('/api/art-forms');
    return response.data;
  },
};
