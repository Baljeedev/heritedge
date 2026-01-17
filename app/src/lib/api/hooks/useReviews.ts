import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi, type Review, type ReviewsQueryParams, type CreateReviewData } from '../reviews';

// Query keys
export const reviewsKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewsKeys.all, 'list'] as const,
  list: (params?: ReviewsQueryParams) => [...reviewsKeys.lists(), params] as const,
  details: () => [...reviewsKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewsKeys.details(), id] as const,
};

// Get all reviews
export const useReviews = (params?: ReviewsQueryParams) => {
  return useQuery({
    queryKey: reviewsKeys.list(params),
    queryFn: () => reviewsApi.getAll(params),
  });
};

// Get a specific review
export const useReview = (id: string, enabled = true) => {
  return useQuery({
    queryKey: reviewsKeys.detail(id),
    queryFn: () => reviewsApi.getById(id),
    enabled: enabled && !!id,
  });
};

// Create review mutation
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewsApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.lists() });
      // Invalidate related queries based on review type
      if (variables.reviewType === 'site') {
        queryClient.invalidateQueries({ queryKey: ['heritage-sites'] });
      } else if (variables.reviewType === 'guide') {
        queryClient.invalidateQueries({ queryKey: ['guides'] });
      } else if (variables.reviewType === 'hotel') {
        queryClient.invalidateQueries({ queryKey: ['hotels'] });
      } else if (variables.reviewType === 'experience') {
        queryClient.invalidateQueries({ queryKey: ['experiences'] });
      }
    },
  });
};

// Update review mutation
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateReviewData> }) =>
      reviewsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: reviewsKeys.lists() });
    },
  });
};

// Delete review mutation
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => reviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.lists() });
    },
  });
};

// Mark review as helpful mutation
export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => reviewsApi.markHelpful(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: reviewsKeys.lists() });
    },
  });
};

