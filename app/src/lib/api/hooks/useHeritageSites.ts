import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { heritageSitesApi, type HeritageSite, type HeritageSitesQueryParams, type NearbySitesParams } from '../heritageSites';

// Query keys
export const heritageSitesKeys = {
  all: ['heritage-sites'] as const,
  lists: () => [...heritageSitesKeys.all, 'list'] as const,
  list: (params?: HeritageSitesQueryParams) => [...heritageSitesKeys.lists(), params] as const,
  details: () => [...heritageSitesKeys.all, 'detail'] as const,
  detail: (id: string) => [...heritageSitesKeys.details(), id] as const,
  nearby: (params: NearbySitesParams) => [...heritageSitesKeys.all, 'nearby', params] as const,
};

// Get all heritage sites
export const useHeritageSites = (params?: HeritageSitesQueryParams) => {
  return useQuery({
    queryKey: heritageSitesKeys.list(params),
    queryFn: () => heritageSitesApi.getAll(params),
  });
};

// Get nearby heritage sites
export const useNearbyHeritageSites = (params: NearbySitesParams, enabled = true) => {
  return useQuery({
    queryKey: heritageSitesKeys.nearby(params),
    queryFn: () => heritageSitesApi.getNearby(params),
    enabled: enabled && !!params.latitude && !!params.longitude,
  });
};

// Get a specific heritage site
export const useHeritageSite = (id: string, enabled = true) => {
  return useQuery({
    queryKey: heritageSitesKeys.detail(id),
    queryFn: () => heritageSitesApi.getById(id),
    enabled: enabled && !!id,
  });
};

// Create heritage site mutation
export const useCreateHeritageSite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<HeritageSite>) => heritageSitesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heritageSitesKeys.lists() });
    },
  });
};

// Update heritage site mutation
export const useUpdateHeritageSite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HeritageSite> }) =>
      heritageSitesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: heritageSitesKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: heritageSitesKeys.lists() });
    },
  });
};

// Delete heritage site mutation
export const useDeleteHeritageSite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => heritageSitesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heritageSitesKeys.lists() });
    },
  });
};

