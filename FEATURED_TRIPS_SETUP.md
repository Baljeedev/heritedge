# Featured Trips Setup

This document explains how to set up and use the featured trips feature that integrates the frontend premade trips with the backend database.

## Overview

The featured trips feature allows you to:
1. Seed premade trips from the frontend into the database
2. Access featured trips via a public API endpoint (no authentication required)
3. Display featured trips on the frontend using React Query

## Backend Changes

### 1. Trip Model Updates
- Added `isFeatured: boolean` field to mark featured/premade trips
- Added index on `isFeatured` for efficient queries
- Featured trips use `clerkUserId: "system"` to distinguish them from user-created trips

### 2. New Endpoint
- **GET `/api/trips/featured`** - Returns all featured trips (open to all users, no authentication required)
  - Query parameters: `limit`, `skip` (optional)
  - Returns: `{ trips: Trip[], total: number, limit: number, skip: number }`

### 3. Seed Script
- Location: `api/src/scripts/seedTrips.ts`
- Command: `bun run seed:trips`
- What it does:
  - Connects to MongoDB
  - Deletes existing featured trips
  - Inserts premade trips from frontend data
  - Sets `isFeatured: true` and `status: "planned"`

## Frontend Changes

### 1. API Integration
- Added `getFeatured()` method to `tripsApi` in `app/src/lib/api/trips.ts`
- Created `useFeaturedTrips()` hook in `app/src/lib/api/hooks/useTrips.ts`

### 2. Component Updates
- **TripPlanner.tsx**: Now fetches featured trips from API instead of using static data
  - Shows loading state while fetching
  - Handles errors gracefully
  - Displays trips from database
  
- **TripDetail.tsx**: Now fetches trip details from API using trip ID
  - Uses `useTrip()` hook to fetch by ID
  - Handles loading and error states

## Setup Instructions

### Step 1: Run the Seed Script

Make sure your MongoDB is running and configured in `.env`:

```bash
cd api
bun run seed:trips
```

You should see output like:
```
🌱 Starting trip seeding...
✅ Connected to database
🗑️  Cleared existing featured trips
✅ Successfully seeded 4 featured trips
   - Delhi Heritage Trail (Delhi, India)
   - Pink City Royalty (Jaipur, Rajasthan)
   - Hampi Ruins & Temples (Hampi, Karnataka)
   - Taj Mahal & Mughal Heritage (Agra, Uttar Pradesh)
🎉 Trip seeding completed!
```

### Step 2: Start the Backend

```bash
cd api
bun run dev
```

The API will be available at `http://localhost:3000`

### Step 3: Start the Frontend

```bash
cd app
yarn dev
```

Make sure your `.env` file in the `app` directory has:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Step 4: Verify

1. Visit `http://localhost:5173/trip-planner` (or your frontend URL)
2. You should see the featured trips loaded from the database
3. Click on any trip to see its details

## API Usage

### Fetch Featured Trips

```typescript
import { useFeaturedTrips } from '@/lib/api';

function MyComponent() {
  const { data, isLoading, error } = useFeaturedTrips();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.trips.map(trip => (
        <div key={trip._id}>{trip.name}</div>
      ))}
    </div>
  );
}
```

### Fetch Single Trip

```typescript
import { useTrip } from '@/lib/api';

function TripDetail({ tripId }: { tripId: string }) {
  const { data: trip, isLoading } = useTrip(tripId);
  
  // Use trip data...
}
```

## Data Structure

Featured trips have the following structure (matching the Trip model):

```typescript
{
  _id: string;
  clerkUserId: "system";
  name: string;
  location: string;
  duration: string;
  image?: string;
  description: string;
  highlights: string[];
  itinerary: DayPlan[];
  budget: "Budget" | "Moderate" | "Luxury";
  bestTimeToVisit: string;
  isFeatured: true;
  status: "planned";
  selectedSites: [];
  selectedHotels: [];
  selectedGuides: [];
  selectedExperiences: [];
  createdAt: Date;
  updatedAt: Date;
}
```

## Troubleshooting

### Trips not showing on frontend
1. Check if backend is running: `curl http://localhost:3000/api/trips/featured`
2. Verify seed script ran successfully
3. Check browser console for errors
4. Verify `VITE_API_BASE_URL` is set correctly

### Seed script fails
1. Check MongoDB connection string in `.env`
2. Ensure MongoDB is running
3. Check database permissions

### API returns empty array
- Run the seed script again: `bun run seed:trips`
- Check MongoDB to verify trips were inserted

## Notes

- Featured trips are public and accessible to all users (no authentication required)
- The seed script will replace all existing featured trips when run
- To add new featured trips, update the `PREMADE_TRIPS` array in `seedTrips.ts` and run the script again

