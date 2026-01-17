import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { experiencesApi, type Experience, type ExperiencesQueryParams } from '../experiences';

// Query keys
export const experiencesKeys = {
  all: ['experiences'] as const,
  lists: () => [...experiencesKeys.all, 'list'] as const,
  list: (params?: ExperiencesQueryParams) => [...experiencesKeys.lists(), params] as const,
  details: () => [...experiencesKeys.all, 'detail'] as const,
  detail: (id: string) => [...experiencesKeys.details(), id] as const,
};

// Get all experiences
export const useExperiences = (params?: ExperiencesQueryParams) => {
  return useQuery({
    queryKey: experiencesKeys.list(params),
    queryFn: () => experiencesApi.getAll(params),
  });
};

// Get a specific experience
export const useExperience = (id: string, enabled = true) => {
  return useQuery({
    queryKey: experiencesKeys.detail(id),
    queryFn: () => experiencesApi.getById(id),
    enabled: enabled && !!id,
  });
};

// Create experience mutation
export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Experience>) => experiencesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experiencesKeys.lists() });
    },
  });
};

// Update experience mutation
export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Experience> }) =>
      experiencesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: experiencesKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: experiencesKeys.lists() });
    },
  });
};

// Delete experience mutation
export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => experiencesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experiencesKeys.lists() });
    },
  });
};

