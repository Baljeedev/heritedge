# v0 Prompt: HeritEdge Admin Dashboard

Create a comprehensive admin dashboard web application for managing a heritage tourism platform. The application should be built with React, TypeScript, and use modern UI components (shadcn/ui or similar).

## Tech Stack Requirements
- React 18+ with TypeScript
- React Router for navigation
- React Query (@tanstack/react-query) for data fetching
- shadcn/ui components (or similar modern component library)
- Tailwind CSS for styling
- Axios for API calls
- Clerk for authentication (admin role check)

## Application Structure

### Main Layout
- Sidebar navigation with links to all admin sections
- Top header with admin user info and logout
- Main content area with breadcrumbs
- Responsive design (mobile-friendly)

### Dashboard Overview Page (`/admin`)
- Statistics cards showing:
  - Total Heritage Sites
  - Total Guides (including interns)
  - Total Experiences (music shows + workshops)
  - Total Hotels
  - Total Trips
  - Total Reviews
  - Pending Internship Applications
- Recent activity feed
- Quick action buttons

## Admin Pages & CRUD Operations

### 1. Heritage Sites Management (`/admin/heritage-sites`)

**List View:**
- Grid/table view of all heritage sites
- Search by name, location, city, state
- Filter by status (Preserved, Under Restoration, At Risk, Ruins)
- Filter by UNESCO World Heritage status
- Sort by rating, review count, annual visitors
- Each card shows: image, name, location, status badge, rating, UNESCO badge if applicable

**Create/Edit Form:**
All fields from `IHeritageSite` interface:
- **Basic Info:**
  - `name` (string, required)
  - `location` (string, required)
  - `city` (string, optional)
  - `state` (string, optional)
  - `country` (string, required, default: "India")
  - `image` (string URL, required)
  - `description` (textarea, required)
  - `historicalWriteup` (textarea, required)
  
- **Details:**
  - `era` (string, required)
  - `status` (select: "Preserved" | "Under Restoration" | "At Risk" | "Ruins")
  - `annualVisitors` (number in millions, optional)
  - `yearOfConstruction` (string, optional)
  - `creator` (string, optional)
  - `architecturalStyle` (string, optional)
  
- **Location:**
  - `coordinates.latitude` (number, required)
  - `coordinates.longitude` (number, required)
  
- **Additional:**
  - `keyFacts` (array of strings - use tag input or comma-separated)
  - `materials` (array of strings - use tag input or comma-separated)
  - `unescoWorldHeritage` (checkbox, boolean)
  - `rating` (number 0-5, default: 0)
  - `reviewCount` (number, default: 0)

**Actions:**
- Create new site
- Edit existing site
- Delete site (with confirmation)
- View site details in modal/drawer
- Preview image URL

---

### 2. Guides Management (`/admin/guides`)

**List View:**
- Grid/table view of all guides
- Search by name, specialization
- Filter by:
  - Active/Inactive status
  - Intern status (isIntern: true/false)
  - Internship status (pending, approved, rejected, completed)
- Sort by rating, price, experience
- Each card shows: avatar, name, specialization, rating, price per day, intern badge if applicable

**Create/Edit Form:**
All fields from `IGuide` interface:
- **Basic Info:**
  - `clerkUserId` (string, required) - Clerk user ID
  - `name` (string, required)
  - `image` (string URL, optional)
  - `video` (string URL, optional) - YouTube embed URL
  - `bio` (textarea, required)
  - `specialization` (string, required)
  
- **Experience & Pricing:**
  - `experience` (number, years of experience, default: 0)
  - `pricePerDay` (number, required, min: 0)
  - `languages` (array of strings - tag input)
  
- **Heritage Sites:**
  - `sites` (multi-select from Heritage Sites list)
  
- **Intern Fields:**
  - `isIntern` (checkbox, boolean)
  - `age` (number, 13-17, only if isIntern is true)
  - `internshipStatus` (select: "pending" | "approved" | "rejected" | "completed")
  - `internshipTestScore` (number, 0-100, optional)
  
- **Certifications:**
  - Dynamic list of certifications with fields:
    - `name` (string, required)
    - `issuingAuthority` (string, required)
    - `certificateNumber` (string, required)
    - `issueDate` (date, required)
    - `expiryDate` (date, optional)
    - `verified` (checkbox, boolean) - Admin verification status
    - `verificationDate` (date, optional)
  - Add/remove certification entries
  
- **Status:**
  - `isActive` (checkbox, boolean, default: true)
  - `rating` (number 0-5, default: 0)
  - `reviewCount` (number, default: 0)

**Actions:**
- Create new guide
- Edit existing guide
- Delete guide
- Verify certifications
- Approve/reject internship applications
- Activate/deactivate guide

---

### 3. Experiences Management (`/admin/experiences`)

**List View:**
- Grid/table view of all experiences
- Search by name, description
- Filter by type (music, workshop)
- Filter by active status
- Sort by rating, price
- Each card shows: image, name, type badge, rating, price

**Create/Edit Form:**
All fields from `IExperience` interface:
- **Basic Info:**
  - `type` (select: "music" | "workshop", required)
  - `name` (string, required)
  - `image` (string URL, required)
  - `video` (string URL, optional) - YouTube embed URL
  - `description` (textarea, required)
  - `price` (number, required, min: 0)
  - `sites` (multi-select from Heritage Sites list)
  - `isActive` (checkbox, boolean, default: true)
  
- **Music Show Fields** (only if type === "music"):
  - `duration` (string, e.g., "90 minutes")
  - `venue` (string)
  - `genre` (string)
  - `performers` (array of strings - tag input)
  - `schedule` (array of strings - tag input, e.g., ["Every Friday 7 PM", "Every Saturday 7 PM"])
  - `guideId` (optional - select from Guides list if guide is hosting)
  
- **Workshop Fields** (only if type === "workshop"):
  - `instructor` (string)
  - `skillLevel` (select: "beginner" | "intermediate" | "advanced")
  - `materialsIncluded` (checkbox, boolean)
  - `maxParticipants` (number)
  - `topics` (array of strings - tag input)
  - `guideId` (optional - select from Guides list if guide is hosting)
  
- **Ratings:**
  - `rating` (number 0-5, default: 0)
  - `reviewCount` (number, default: 0)

**Actions:**
- Create new experience
- Edit existing experience
- Delete experience
- Toggle active status
- Show/hide conditional fields based on type selection

---

### 4. Hotels Management (`/admin/hotels`)

**List View:**
- Grid/table view of all hotels
- Search by name, location, city, chain
- Filter by:
  - Partnership type (listing, referral, premium)
  - Active status
  - Has Living History rooms
- Sort by rating, price
- Each card shows: first image, name, chain badge, location, price range, partnership type badge

**Create/Edit Form:**
All fields from `IHotel` interface:
- **Basic Info:**
  - `name` (string, required)
  - `chain` (string, optional) - e.g., "Neemrana", "WelcomHeritage", "HeritEdge"
  - `location` (string, required)
  - `city` (string, required)
  - `state` (string, required)
  - `country` (string, required, default: "India")
  - `description` (textarea, required)
  - `images` (array of string URLs - allow multiple image inputs)
  
- **Location:**
  - `coordinates.latitude` (number, required)
  - `coordinates.longitude` (number, required)
  
- **Pricing:**
  - `pricePerNight.min` (number, required)
  - `pricePerNight.max` (number, required)
  - `pricePerNight.currency` (string, default: "INR")
  
- **Amenities:**
  - `amenities` (array of strings - tag input or multi-select)
  
- **Room Types:**
  - Dynamic list of room types with fields:
    - `name` (string, required)
    - `description` (textarea)
    - `pricePerNight` (number, required)
    - `maxOccupancy` (number, required)
    - `isLivingHistory` (checkbox, boolean)
    - `theme` (string, optional) - e.g., "Mughal Era", "Rajputana", "Colonial"
  - Add/remove room type entries
  
- **Heritage Features:**
  - `heritageFeatures.hasLivingHistoryRooms` (checkbox)
  - `heritageFeatures.hasHistoryLectures` (checkbox)
  - `heritageFeatures.hasCulturalMeals` (checkbox)
  - `heritageFeatures.hasStorytellingEvenings` (checkbox)
  - `heritageFeatures.historicalTimelinePosters` (checkbox)
  
- **Partnership:**
  - `partnershipType` (select: "listing" | "referral" | "premium")
  - `listingFee` (number, optional)
  - `referralFee` (number, optional) - Percentage
  - `discountPercentage` (number, 0-100, default: 0)
  
- **Nearby Sites:**
  - `nearbySites` (multi-select from Heritage Sites list)
  
- **Status:**
  - `isActive` (checkbox, boolean, default: true)
  - `rating` (number 0-5, default: 0)
  - `reviewCount` (number, default: 0)

**Actions:**
- Create new hotel
- Edit existing hotel
- Delete hotel
- Manage room types
- Update partnership details

---

### 5. Trips Management (`/admin/trips`)

**List View:**
- Grid/table view of all trips
- Search by name, location
- Filter by:
  - Featured status
  - Status (draft, planned, booked, completed, cancelled)
  - Budget (Budget, Moderate, Luxury)
  - AI-generated flag
- Sort by creation date, start date
- Each card shows: image, name, location, duration, budget badge, featured badge, status badge

**Create/Edit Form:**
All fields from `ITrip` interface:
- **Basic Info:**
  - `name` (string, required)
  - `location` (string, required)
  - `duration` (string, required) - e.g., "3 Days"
  - `image` (string URL, optional)
  - `description` (textarea, required)
  - `budget` (select: "Budget" | "Moderate" | "Luxury", required)
  - `bestTimeToVisit` (string, optional)
  - `isFeatured` (checkbox, boolean)
  - `status` (select: "draft" | "planned" | "booked" | "completed" | "cancelled")
  
- **Highlights:**
  - `highlights` (array of strings - tag input)
  
- **Itinerary:**
  - Dynamic list of day plans (`IDayPlan[]`):
    - `day` (number, required)
    - `title` (string, required)
    - `activities` (array of activity objects):
      - `time` (string, required) - e.g., "9:00 AM"
      - `activity` (string, required)
      - `location` (string, required)
      - `description` (string, optional)
    - Add/remove day plans
    - Add/remove activities within each day
  
- **Selected Items:**
  - `selectedSites` (multi-select from Heritage Sites)
  - `selectedHotels` (dynamic list):
    - `hotelId` (select from Hotels)
    - `checkIn` (date)
    - `checkOut` (date)
    - `roomType` (string, optional)
  - `selectedGuides` (dynamic list):
    - `guideId` (select from Guides)
    - `date` (date)
    - `siteId` (select from Heritage Sites)
  - `selectedExperiences` (dynamic list):
    - `experienceId` (select from Experiences)
    - `date` (date)
    - `time` (string, optional)
  
- **AI Generation:**
  - `isAIGenerated` (checkbox, boolean)
  - `aiPrompt` (textarea, optional) - Original prompt used
  
- **Dates:**
  - `startDate` (date, optional)
  - `endDate` (date, optional)
  
- **System:**
  - `clerkUserId` (string, default: "system" for featured trips)

**Actions:**
- Create new trip
- Edit existing trip
- Delete trip
- Mark as featured
- Build complex itinerary with day-by-day activities
- Link sites, hotels, guides, and experiences

---

### 6. Reviews Management (`/admin/reviews`)

**List View:**
- Table view of all reviews
- Search by comment, user ID
- Filter by:
  - Review type (site, guide, hotel, experience)
  - Rating (1-5 stars)
  - Verified status
  - Visibility status
- Sort by date, rating, helpful count
- Each row shows: review type badge, target name (linked), user ID, rating stars, comment preview, images count, helpful count, verified badge, visibility toggle

**Actions:**
- View full review details
- Toggle visibility (hide/show inappropriate reviews)
- Mark as verified
- Delete review
- View associated images
- Link to reviewed item

**Review Details Modal:**
- Full comment text
- All images in gallery
- Visit date
- Helpful count
- User information
- Reviewed item details

---

## TypeScript Interfaces

Include these exact interfaces in your code:

```typescript
// Heritage Site
interface IHeritageSite {
  _id: string;
  name: string;
  location: string;
  city?: string;
  state?: string;
  country: string;
  image: string;
  rating: number;
  reviewCount: number;
  era: string;
  status: "Preserved" | "Under Restoration" | "At Risk" | "Ruins";
  annualVisitors?: number;
  description: string;
  historicalWriteup: string;
  keyFacts: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  unescoWorldHeritage?: boolean;
  yearOfConstruction?: string;
  creator?: string;
  architecturalStyle?: string;
  materials?: string[];
  createdAt: string;
  updatedAt: string;
}

// Guide
interface IGuide {
  _id: string;
  clerkUserId: string;
  name: string;
  image?: string;
  video?: string;
  specialization: string;
  sites: string[] | IHeritageSite[];
  rating: number;
  reviewCount: number;
  pricePerDay: number;
  languages: string[];
  experience: number;
  bio: string;
  certifications: {
    name: string;
    issuingAuthority: string;
    certificateNumber: string;
    issueDate: string;
    expiryDate?: string;
    verified: boolean;
    verificationDate?: string;
  }[];
  isIntern: boolean;
  age?: number;
  internshipStatus?: "pending" | "approved" | "rejected" | "completed";
  internshipTestScore?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Experience
interface IExperience {
  _id: string;
  type: "guide" | "music" | "workshop";
  name: string;
  image: string;
  video?: string;
  sites: string[] | IHeritageSite[];
  rating: number;
  reviewCount: number;
  price: number;
  description: string;
  guideId?: string | IGuide;
  // Music-specific
  duration?: string;
  venue?: string;
  performers?: string[];
  genre?: string;
  schedule?: string[];
  // Workshop-specific
  instructor?: string;
  skillLevel?: "beginner" | "intermediate" | "advanced";
  materialsIncluded?: boolean;
  maxParticipants?: number;
  topics?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Hotel
interface IHotel {
  _id: string;
  name: string;
  chain?: string;
  location: string;
  city: string;
  state: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  rating: number;
  reviewCount: number;
  pricePerNight: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  amenities: string[];
  roomTypes: {
    name: string;
    description: string;
    pricePerNight: number;
    maxOccupancy: number;
    isLivingHistory: boolean;
    theme?: string;
  }[];
  heritageFeatures: {
    hasLivingHistoryRooms: boolean;
    hasHistoryLectures: boolean;
    hasCulturalMeals: boolean;
    hasStorytellingEvenings: boolean;
    historicalTimelinePosters?: boolean;
  };
  nearbySites: string[] | IHeritageSite[];
  partnershipType: "listing" | "referral" | "premium";
  listingFee?: number;
  referralFee?: number;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Trip
interface IDayPlan {
  day: number;
  title: string;
  activities: {
    time: string;
    activity: string;
    location: string;
    description?: string;
  }[];
}

interface ITrip {
  _id: string;
  clerkUserId: string;
  name: string;
  location: string;
  duration: string;
  image?: string;
  description: string;
  highlights: string[];
  itinerary: IDayPlan[];
  budget: "Budget" | "Moderate" | "Luxury";
  bestTimeToVisit: string;
  isFeatured: boolean;
  selectedSites: string[] | IHeritageSite[];
  selectedHotels: {
    hotelId: string | IHotel;
    checkIn: string;
    checkOut: string;
    roomType?: string;
  }[];
  selectedGuides: {
    guideId: string | IGuide;
    date: string;
    siteId: string | IHeritageSite;
  }[];
  selectedExperiences: {
    experienceId: string | IExperience;
    date: string;
    time?: string;
  }[];
  isAIGenerated: boolean;
  aiPrompt?: string;
  status: "draft" | "planned" | "booked" | "completed" | "cancelled";
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Review
interface IReview {
  _id: string;
  clerkUserId: string;
  rating: number;
  comment: string;
  images?: string[];
  reviewType: "site" | "guide" | "hotel" | "experience";
  targetId: string;
  visitDate?: string;
  helpfulCount: number;
  isVerified: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints Structure

Base URL: `http://localhost:3000` (or from env variable)

All endpoints require authentication (Bearer token from Clerk).

### Heritage Sites
- `GET /api/heritage-sites` - List all (with pagination, search, filters)
- `GET /api/heritage-sites/:id` - Get single site
- `POST /api/heritage-sites` - Create site
- `PUT /api/heritage-sites/:id` - Update site
- `DELETE /api/heritage-sites/:id` - Delete site

### Guides
- `GET /api/guides` - List all (with pagination, search, filters)
- `GET /api/guides/:id` - Get single guide
- `POST /api/guides` - Create guide
- `PUT /api/guides/:id` - Update guide
- `DELETE /api/guides/:id` - Delete guide

### Experiences
- `GET /api/experiences` - List all (with pagination, search, filters)
- `GET /api/experiences/:id` - Get single experience
- `POST /api/experiences` - Create experience
- `PUT /api/experiences/:id` - Update experience
- `DELETE /api/experiences/:id` - Delete experience

### Hotels
- `GET /api/hotels` - List all (with pagination, search, filters)
- `GET /api/hotels/:id` - Get single hotel
- `POST /api/hotels` - Create hotel
- `PUT /api/hotels/:id` - Update hotel
- `DELETE /api/hotels/:id` - Delete hotel

### Trips
- `GET /api/trips` - List all (with pagination, search, filters)
- `GET /api/trips/:id` - Get single trip
- `POST /api/trips` - Create trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Reviews
- `GET /api/reviews` - List all (with pagination, search, filters)
- `GET /api/reviews/:id` - Get single review
- `PUT /api/reviews/:id` - Update review (mainly visibility, verified status)
- `DELETE /api/reviews/:id` - Delete review

## Design Requirements

1. **Color Scheme:**
   - Primary: Heritage/earthy tones (browns, golds, terracotta)
   - Use shadcn/ui default theme with customizations
   - Dark mode support

2. **UI Components:**
   - Use shadcn/ui components (Button, Card, Dialog, Form, Input, Select, Table, etc.)
   - Consistent spacing and typography
   - Loading states with skeletons
   - Error states with clear messages
   - Success toasts for actions

3. **Forms:**
   - Validation using react-hook-form + zod
   - Clear field labels and help text
   - Required field indicators
   - Inline error messages
   - Submit button with loading state

4. **Data Tables/Lists:**
   - Pagination for large datasets
   - Search functionality
   - Sortable columns
   - Filter chips/badges
   - Row actions (edit, delete, view)

5. **Modals/Dialogs:**
   - Use for create/edit forms
   - Scrollable content for long forms
   - Clear cancel/submit actions
   - Prevent accidental closes during editing

6. **Responsive Design:**
   - Mobile-first approach
   - Collapsible sidebar on mobile
   - Stack form fields on small screens
   - Touch-friendly buttons and inputs

## Features to Implement

1. **Bulk Actions:**
   - Select multiple items and delete/activate/deactivate
   - Export data to CSV

2. **Image Management:**
   - Image URL input with preview
   - Multiple image uploads for hotels
   - Image gallery viewer

3. **Rich Text Editing:**
   - Textarea for descriptions (consider markdown support)
   - Character count for long fields

4. **Date/Time Pickers:**
   - Use proper date picker components
   - Time inputs for schedules

5. **Map Integration:**
   - Show coordinates on map (optional, for heritage sites and hotels)
   - Geocode address to coordinates

6. **Search & Filters:**
   - Debounced search
   - Persistent filter state
   - Clear all filters button

7. **Confirmation Dialogs:**
   - Confirm before delete actions
   - Warn about cascading deletes

8. **Activity Log:**
   - Track changes (optional enhancement)
   - Show who made changes and when

## Authentication & Authorization

- Use Clerk for authentication
- Check for admin role before allowing access
- Protect all routes with admin check
- Show unauthorized message if not admin

## Error Handling

- Display user-friendly error messages
- Handle network errors gracefully
- Show retry options
- Log errors for debugging

## Performance

- Implement pagination for large lists
- Use React Query caching
- Optimize re-renders
- Lazy load images
- Debounce search inputs

---

## Additional Notes

- All timestamps are ISO strings from API
- Object IDs can be strings or populated objects
- Handle both cases in type definitions
- Use React Query mutations for create/update/delete
- Show optimistic updates where appropriate
- Implement proper loading and error states
- Use TypeScript strictly - no `any` types unless absolutely necessary

Generate a complete, production-ready admin dashboard with all the above features and pages.