import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelsApi, type Hotel, type HotelsQueryParams, type NearbyHotelsParams } from '../hotels';

// Query keys
export const hotelsKeys = {
  all: ['hotels'] as const,
  lists: () => [...hotelsKeys.all, 'list'] as const,
  list: (params?: HotelsQueryParams) => [...hotelsKeys.lists(), params] as const,
  details: () => [...hotelsKeys.all, 'detail'] as const,
  detail: (id: string) => [...hotelsKeys.details(), id] as const,
  nearby: (params: NearbyHotelsParams) => [...hotelsKeys.all, 'nearby', params] as const,
};

// Get all hotels
export const useHotels = (params?: HotelsQueryParams) => {
  return useQuery({
    queryKey: hotelsKeys.list(params),
    queryFn: () => hotelsApi.getAll(params),
  });
};

// Get nearby hotels
export const useNearbyHotels = (params: NearbyHotelsParams, enabled = true) => {
  return useQuery({
    queryKey: hotelsKeys.nearby(params),
    queryFn: () => hotelsApi.getNearby(params),
    enabled: enabled && (!!params.latitude || !!params.siteId),
  });
};

// Get a specific hotel
export const useHotel = (id: string, enabled = true) => {
  return useQuery({
    queryKey: hotelsKeys.detail(id),
    queryFn: () => hotelsApi.getById(id),
    enabled: enabled && !!id,
  });
};

// Create hotel mutation
export const useCreateHotel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Hotel>) => hotelsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelsKeys.lists() });
    },
  });
};

// Update hotel mutation
export const useUpdateHotel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Hotel> }) =>
      hotelsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: hotelsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: hotelsKeys.lists() });
    },
  });
};

// Delete hotel mutation
export const useDeleteHotel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => hotelsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelsKeys.lists() });
    },
  });
};

