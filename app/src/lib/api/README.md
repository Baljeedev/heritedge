# API Integration with React Query

This directory contains the API client and React Query hooks for integrating with the HeritEdge backend API.

## Setup

The API client is automatically configured in `main.tsx` with:
- React Query provider
- Clerk authentication token integration
- Axios interceptors for error handling

## Environment Variables

Make sure to set the following in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

## Usage Examples

### Heritage Sites

```tsx
import { useHeritageSites, useHeritageSite, useCreateHeritageSite } from '@/lib/api';

function HeritageSitesList() {
  // Get all heritage sites with filters
  const { data, isLoading, error } = useHeritageSites({
    city: 'Delhi',
    minRating: 4,
    limit: 10
  });

  // Get a specific site
  const { data: site } = useHeritageSite('site-id-here');

  // Create mutation
  const createMutation = useCreateHeritageSite();

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        name: 'Taj Mahal',
        description: '...',
        // ... other fields
      });
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.sites.map(site => (
        <div key={site._id}>{site.name}</div>
      ))}
    </div>
  );
}
```

### Guides

```tsx
import { useGuides, useCreateGuide } from '@/lib/api';

function GuidesList() {
  const { data } = useGuides({
    siteId: 'site-id',
    minRating: 4,
    languages: 'English,Hindi'
  });

  const createGuide = useCreateGuide();

  // ... use the data
}
```

### Trips

```tsx
import { useTrips, useCreateTrip, useUpdateTrip } from '@/lib/api';

function MyTrips() {
  // Get user's trips (automatically uses auth token)
  const { data: tripsData } = useTrips();
  
  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();

  const handleCreate = async () => {
    await createTrip.mutateAsync({
      name: 'My Heritage Tour',
      startDate: '2024-06-01',
      endDate: '2024-06-07',
      selectedSites: ['site1', 'site2']
    });
  };

  // ... render trips
}
```

### Reviews

```tsx
import { useReviews, useCreateReview } from '@/lib/api';

function SiteReviews({ siteId }: { siteId: string }) {
  const { data } = useReviews({
    reviewType: 'site',
    targetId: siteId
  });

  const createReview = useCreateReview();

  const handleSubmit = async (rating: number, comment: string) => {
    await createReview.mutateAsync({
      reviewType: 'site',
      targetId: siteId,
      rating,
      comment
    });
  };

  // ... render reviews
}
```

## Available Hooks

### Heritage Sites
- `useHeritageSites(params?)` - Get all sites
- `useNearbyHeritageSites(params, enabled?)` - Get nearby sites
- `useHeritageSite(id, enabled?)` - Get single site
- `useCreateHeritageSite()` - Create mutation
- `useUpdateHeritageSite()` - Update mutation
- `useDeleteHeritageSite()` - Delete mutation

### Guides
- `useGuides(params?)` - Get all guides
- `useGuide(id, enabled?)` - Get single guide
- `useCreateGuide()` - Create mutation
- `useUpdateGuide()` - Update mutation
- `useAddCertification()` - Add certification
- `useApplyInternship()` - Apply for internship

### Hotels
- `useHotels(params?)` - Get all hotels
- `useNearbyHotels(params, enabled?)` - Get nearby hotels
- `useHotel(id, enabled?)` - Get single hotel
- `useCreateHotel()` - Create mutation
- `useUpdateHotel()` - Update mutation
- `useDeleteHotel()` - Delete mutation

### Experiences
- `useExperiences(params?)` - Get all experiences
- `useExperience(id, enabled?)` - Get single experience
- `useCreateExperience()` - Create mutation
- `useUpdateExperience()` - Update mutation
- `useDeleteExperience()` - Delete mutation

### Trips
- `useTrips(params?)` - Get all trips
- `useTrip(id, enabled?)` - Get single trip
- `useCreateTrip()` - Create mutation
- `useUpdateTrip()` - Update mutation
- `useDeleteTrip()` - Delete mutation
- `useGenerateItinerary()` - Generate AI itinerary

### Reviews
- `useReviews(params?)` - Get all reviews
- `useReview(id, enabled?)` - Get single review
- `useCreateReview()` - Create mutation
- `useUpdateReview()` - Update mutation
- `useDeleteReview()` - Delete mutation
- `useMarkReviewHelpful()` - Mark as helpful

## Authentication

The API client automatically includes the Clerk authentication token in all requests. The token is obtained from Clerk and added to the `Authorization` header as `Bearer <token>`.

## Error Handling

All API errors are automatically handled by the axios interceptor and converted to Error objects with meaningful messages. React Query will handle the error states in your components.

