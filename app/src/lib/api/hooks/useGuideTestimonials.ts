import { useQuery } from '@tanstack/react-query';
import { guideTestimonialsApi } from '../guide-testimonials';

export const guideTestimonialsKeys = {
  all: ['guide-testimonials'] as const,
  list: () => [...guideTestimonialsKeys.all, 'list'] as const,
};

export const useGuideTestimonials = () => {
  return useQuery({
    queryKey: guideTestimonialsKeys.list(),
    queryFn: () => guideTestimonialsApi.getAll({ limit: 100 }),
  });
};
