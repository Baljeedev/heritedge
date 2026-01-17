# Admin Dashboard API Integration

## Overview

The admin dashboard has been fully integrated with the backend API. All mock data has been removed and replaced with real API calls.

## API Base URL

The admin dashboard connects to the API at:
- **Default**: `http://localhost:3001`
- **Configurable**: Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local`

## Authentication

- Uses Clerk authentication tokens
- Tokens are automatically added to API requests via `ApiProvider` component
- All API calls include the `Authorization: Bearer <token>` header

## API Client Setup

### Files Created
- `lib/api-client.ts` - Axios client with Clerk token integration
- `lib/api/heritage-sites.ts` - Heritage sites API functions
- `lib/api/guides.ts` - Guides API functions
- `lib/api/hotels.ts` - Hotels API functions
- `lib/api/experiences.ts` - Experiences API functions
- `lib/api/trips.ts` - Trips API functions
- `lib/api/reviews.ts` - Reviews API functions
- `lib/api/index.ts` - Centralized exports
- `components/api-provider.tsx` - Sets up Clerk token getter

### Components Updated
All list components now use real API data:
- ✅ `components/hotels/hotel-list.tsx`
- ✅ `components/guides/guide-list.tsx`
- ✅ `components/experiences/experience-list.tsx`
- ✅ `components/heritage-sites/site-list.tsx`
- ✅ `components/trips/trip-list.tsx`
- ✅ `components/reviews/review-list.tsx`
- ✅ `app/admin/page.tsx` (Dashboard with real stats)

## API Endpoints Used

### Heritage Sites
- `GET /api/heritage-sites` - List all sites
- `GET /api/heritage-sites/:id` - Get single site
- `POST /api/heritage-sites` - Create site
- `PUT /api/heritage-sites/:id` - Update site
- `DELETE /api/heritage-sites/:id` - Delete site

### Guides
- `GET /api/guides?all=true` - List all guides (including inactive)
- `GET /api/guides/:id` - Get single guide
- `POST /api/guides` - Create guide
- `PUT /api/guides/:id` - Update guide (admin can update any)
- `DELETE /api/guides/:id` - Delete guide
- `POST /api/guides/:id/verify-certification/:certIndex` - Verify certification

### Hotels
- `GET /api/hotels?all=true` - List all hotels (including inactive)
- `GET /api/hotels/:id` - Get single hotel
- `POST /api/hotels` - Create hotel
- `PUT /api/hotels/:id` - Update hotel
- `DELETE /api/hotels/:id` - Delete hotel

### Experiences
- `GET /api/experiences?all=true` - List all experiences (including inactive)
- `GET /api/experiences/:id` - Get single experience
- `POST /api/experiences` - Create experience
- `PUT /api/experiences/:id` - Update experience
- `DELETE /api/experiences/:id` - Delete experience

### Trips
- `GET /api/trips` - List all trips (admin can see all)
- `GET /api/trips/featured` - Get featured trips
- `GET /api/trips/:id` - Get single trip
- `POST /api/trips` - Create trip (can set clerkUserId to "system" for featured)
- `PUT /api/trips/:id` - Update trip (admin can update any)
- `DELETE /api/trips/:id` - Delete trip (admin can delete any)

### Reviews
- `GET /api/reviews?all=true` - List all reviews (including hidden)
- `GET /api/reviews/:id` - Get single review
- `PUT /api/reviews/:id` - Update review (admin can update visibility/verified status)
- `DELETE /api/reviews/:id` - Delete review (admin can delete any)

## Backend Changes

### Added Admin Support
1. **Guides Route** (`api/src/routes/guides.ts`):
   - Added `DELETE /api/guides/:id` endpoint
   - Removed ownership checks for PUT (admin can update any guide)
   - Added `all` parameter to GET to include inactive guides

2. **Hotels Route** (`api/src/routes/hotels.ts`):
   - Added `all` parameter to GET to include inactive hotels

3. **Experiences Route** (`api/src/routes/experiences.ts`):
   - Added `all` parameter to GET to include inactive experiences

4. **Trips Route** (`api/src/routes/trips.ts`):
   - Modified POST to allow setting `clerkUserId` (for featured trips)
   - Removed ownership checks for PUT/DELETE (admin can manage any trip)
   - Modified GET to allow admin to see all trips

5. **Reviews Route** (`api/src/routes/reviews.ts`):
   - Added `all` parameter to GET to include hidden reviews
   - Removed ownership checks for PUT/DELETE (admin can manage any review)

## Features

### Dashboard
- Real-time statistics from API
- Counts for all entities
- Pending internship applications count

### All Management Pages
- ✅ Real data from API (no mock data)
- ✅ Loading states
- ✅ Error handling with toast notifications
- ✅ Create, Read, Update, Delete operations
- ✅ Search and filtering
- ✅ Empty states

### Form Components
- All forms updated to accept `Partial<T>` types
- Proper data submission to API
- Success/error notifications

## Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Testing

1. Make sure the API server is running on port 3001
2. Make sure MongoDB is connected
3. Sign in to admin dashboard with `harshit.rai.verma@gmail.com`
4. All pages should load real data from the database
5. You can create, edit, and delete all entities

## Notes

- All API calls require authentication (Clerk token)
- Admin can manage all entities regardless of ownership
- Featured trips are created with `clerkUserId: "system"`
- Inactive/hidden items are shown in admin dashboard (via `all=true` parameter)