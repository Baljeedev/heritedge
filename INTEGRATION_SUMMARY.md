# Backend-Frontend Integration Summary

## ✅ Completed Integration

The backend API has been successfully integrated with the frontend using React Query (@tanstack/react-query).

### What Was Done

1. **Installed React Query**
   - Added `@tanstack/react-query` to dependencies

2. **Created API Client** (`app/src/lib/api/client.ts`)
   - Axios instance configured with base URL
   - Automatic authentication token injection from Clerk
   - Error handling interceptors
   - Configurable via `VITE_API_BASE_URL` environment variable

3. **Created API Service Functions**
   - `heritageSites.ts` - Heritage sites API
   - `guides.ts` - Tour guides API
   - `hotels.ts` - Hotels API
   - `experiences.ts` - Experiences API
   - `trips.ts` - Trip planning API
   - `reviews.ts` - Reviews API

4. **Created React Query Hooks** (`app/src/lib/api/hooks/`)
   - `useHeritageSites.ts` - All heritage site hooks
   - `useGuides.ts` - All guide hooks
   - `useHotels.ts` - All hotel hooks
   - `useExperiences.ts` - All experience hooks
   - `useTrips.ts` - All trip hooks
   - `useReviews.ts` - All review hooks

5. **Set Up React Query Provider**
   - Added `QueryClientProvider` in `main.tsx`
   - Configured default query options (staleTime, retry, etc.)

6. **Authentication Integration**
   - Created `AuthTokenProvider` component
   - Automatically injects Clerk auth tokens into API requests
   - Works seamlessly with authenticated and unauthenticated requests

### File Structure

```
app/src/
├── lib/
│   └── api/
│       ├── client.ts              # Axios client configuration
│       ├── heritageSites.ts       # Heritage sites API
│       ├── guides.ts              # Guides API
│       ├── hotels.ts              # Hotels API
│       ├── experiences.ts         # Experiences API
│       ├── trips.ts               # Trips API
│       ├── reviews.ts             # Reviews API
│       ├── hooks/                 # React Query hooks
│       │   ├── useHeritageSites.ts
│       │   ├── useGuides.ts
│       │   ├── useHotels.ts
│       │   ├── useExperiences.ts
│       │   ├── useTrips.ts
│       │   ├── useReviews.ts
│       │   └── index.ts
│       ├── index.ts               # Main export file
│       └── README.md              # Usage documentation
├── components/
│   └── AuthTokenProvider.tsx     # Auth token setup
└── main.tsx                      # Updated with React Query provider
```

### Environment Variables Required

Add to `app/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

### Usage Example

```tsx
import { useHeritageSites, useCreateHeritageSite } from '@/lib/api';

function MyComponent() {
  // Fetch data
  const { data, isLoading, error } = useHeritageSites({
    city: 'Delhi',
    minRating: 4
  });

  // Mutations
  const createMutation = useCreateHeritageSite();

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        name: 'Taj Mahal',
        description: '...',
      });
    } catch (error) {
      console.error(error);
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

### Next Steps

1. **Update existing components** to use the new React Query hooks instead of static data
2. **Add error boundaries** for better error handling
3. **Add loading states** in UI components
4. **Test the integration** by running both backend and frontend

### Backend API Endpoints

The backend runs on `http://localhost:3000` by default and provides:

- `GET /api/heritage-sites` - List heritage sites
- `GET /api/guides` - List guides
- `GET /api/hotels` - List hotels
- `GET /api/experiences` - List experiences
- `GET /api/trips` - List trips
- `GET /api/reviews` - List reviews

See `api/src/routes/` for full API documentation.

### Notes

- All API requests automatically include authentication tokens when user is logged in
- React Query handles caching, refetching, and state management
- Error handling is centralized in the axios interceptor
- TypeScript types are provided for all API responses

