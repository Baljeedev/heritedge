import { apiClient } from './client';

export interface UploadResponse {
  url: string;
  key: string;
  type: 'image' | 'video';
}

export const uploadApi = {
  upload: async (
    type: 'trip' | 'monument' | 'guide' | 'experience' | 'hotel' | 'review',
    file: File
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>(`/api/upload/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },
};
