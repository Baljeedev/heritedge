import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi, type Trip, type TripsQueryParams, type CreateTripData, type GenerateItineraryData } from '../trips';

// Query keys
export const tripsKeys = {
  all: ['trips'] as const,
  lists: () => [...tripsKeys.all, 'list'] as const,
  list: (params?: TripsQueryParams) => [...tripsKeys.lists(), params] as const,
  featured: (params?: { limit?: number; skip?: number }) => [...tripsKeys.all, 'featured', params] as const,
  details: () => [...tripsKeys.all, 'detail'] as const,
  detail: (id: string) => [...tripsKeys.details(), id] as const,
};

// Get featured/premade trips (open to all users)
export const useFeaturedTrips = (params?: { limit?: number; skip?: number }) => {
  return useQuery({
    queryKey: tripsKeys.featured(params),
    queryFn: () => tripsApi.getFeatured(params),
  });
};

// Get all trips
export const useTrips = (params?: TripsQueryParams) => {
  return useQuery({
    queryKey: tripsKeys.list(params),
    queryFn: () => tripsApi.getAll(params),
  });
};

// Get a specific trip
export const useTrip = (id: string, enabled = true) => {
  return useQuery({
    queryKey: tripsKeys.detail(id),
    queryFn: () => tripsApi.getById(id),
    enabled: enabled && !!id,
  });
};

// Create trip mutation
export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTripData) => tripsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripsKeys.lists() });
    },
  });
};

// Update trip mutation
export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTripData> }) =>
      tripsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tripsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: tripsKeys.lists() });
    },
  });
};

// Delete trip mutation
export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => tripsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripsKeys.lists() });
    },
  });
};

// Generate itinerary mutation
export const useGenerateItinerary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: GenerateItineraryData }) =>
      tripsApi.generateItinerary(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tripsKeys.detail(variables.id) });
    },
  });
};

