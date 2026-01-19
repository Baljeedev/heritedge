import apiClient from '../api-client';

export interface RegistrationStatus {
  isGuide: boolean;
  isHotel: boolean;
  isExperience: boolean;
  guideId?: string;
  hotelId?: string;
  experienceId?: string;
  hasPendingApplication: boolean;
  pendingApplicationType?: 'guide' | 'hotel' | 'experience';
}

export interface Application {
  _id: string;
  type: 'guide' | 'hotel' | 'experience';
  status: 'pending' | 'approved' | 'rejected';
  clerkUserId: string;
  email: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  applicationData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export const applicationsApi = {
  // Check registration status
  checkStatus: async (): Promise<RegistrationStatus> => {
    const response = await apiClient.get<RegistrationStatus>('/api/applications/check-status');
    return response.data;
  },

  // Submit application
  submit: async (type: 'guide' | 'hotel' | 'experience', applicationData: Record<string, any>): Promise<{ message: string; application: Application }> => {
    const response = await apiClient.post<{ message: string; application: Application }>('/api/applications', {
      type,
      applicationData,
    });
    return response.data;
  },

  // Get all applications (admin)
  getAll: async (status?: string, type?: string): Promise<{ applications: Application[] }> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    const response = await apiClient.get<{ applications: Application[] }>(`/api/applications?${params.toString()}`);
    return response.data;
  },

  // Get single application
  getById: async (id: string): Promise<{ application: Application }> => {
    const response = await apiClient.get<{ application: Application }>(`/api/applications/${id}`);
    return response.data;
  },

  // Approve application
  approve: async (id: string): Promise<{ message: string; application: Application }> => {
    const response = await apiClient.post<{ message: string; application: Application }>(`/api/applications/${id}/approve`);
    return response.data;
  },

  // Reject application
  reject: async (id: string, rejectionReason?: string): Promise<{ message: string; application: Application }> => {
    const response = await apiClient.post<{ message: string; application: Application }>(`/api/applications/${id}/reject`, {
      rejectionReason,
    });
    return response.data;
  },
};
