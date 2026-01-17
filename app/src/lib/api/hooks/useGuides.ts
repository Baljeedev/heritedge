import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guidesApi, type Guide, type GuidesQueryParams, type CreateGuideData, type InternshipApplicationData } from '../guides';

// Query keys
export const guidesKeys = {
  all: ['guides'] as const,
  lists: () => [...guidesKeys.all, 'list'] as const,
  list: (params?: GuidesQueryParams) => [...guidesKeys.lists(), params] as const,
  details: () => [...guidesKeys.all, 'detail'] as const,
  detail: (id: string) => [...guidesKeys.details(), id] as const,
};

// Get all guides
export const useGuides = (params?: GuidesQueryParams) => {
  return useQuery({
    queryKey: guidesKeys.list(params),
    queryFn: () => guidesApi.getAll(params),
  });
};

// Get a specific guide
export const useGuide = (id: string, enabled = true) => {
  return useQuery({
    queryKey: guidesKeys.detail(id),
    queryFn: () => guidesApi.getById(id),
    enabled: enabled && !!id,
  });
};

// Create guide mutation
export const useCreateGuide = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateGuideData) => guidesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guidesKeys.lists() });
    },
  });
};

// Update guide mutation
export const useUpdateGuide = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGuideData> }) =>
      guidesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: guidesKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: guidesKeys.lists() });
    },
  });
};

// Add certification mutation
export const useAddCertification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, certification }: { id: string; certification: Guide['certifications'][0] }) =>
      guidesApi.addCertification(id, certification),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: guidesKeys.detail(variables.id) });
    },
  });
};

// Apply for internship mutation
export const useApplyInternship = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: InternshipApplicationData) => guidesApi.applyInternship(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guidesKeys.lists() });
    },
  });
};

