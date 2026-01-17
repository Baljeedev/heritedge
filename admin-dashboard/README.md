# HeritEdge Admin Dashboard

A comprehensive admin dashboard for managing heritage tourism platform operations. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

- **Heritage Sites Management** - Manage UNESCO world heritage sites, preserve status, visitor information
- **Guides Management** - Manage professional guides, interns, certifications, languages, and pricing
- **Experiences Management** - Create music shows, workshops, and guided tours with pricing and scheduling
- **Hotels Management** - Manage heritage hotel partnerships with room types, amenities, and special features
- **Trips Management** - Create and manage heritage trip itineraries with day-by-day planning
- **Reviews Management** - Monitor, verify, and moderate user reviews across all content types
- **Dashboard Analytics** - Real-time stats, health metrics, ratings, and recent activity

## Tech Stack

- **Framework**: Next.js 16.0.10
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: shadcn/ui (40+ components)
- **Forms**: react-hook-form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Theme**: next-themes (light/dark mode)
- **Notifications**: Sonner toast
- **Analytics**: Vercel Analytics
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ (recommended 20+)
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd heri-edge-admin
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Setup environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API URL and other configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
API_SECRET_KEY=your_secret_key
NODE_ENV=development
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will redirect to `/admin`.

### Build

Create a production build:
```bash
npm run build
npm start
```

### Lint

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
├── app/
│   ├── admin/                 # Admin dashboard pages
│   │   ├── layout.tsx        # Admin layout with sidebar
│   │   ├── page.tsx          # Dashboard home
│   │   ├── heritage-sites/
│   │   ├── guides/
│   │   ├── experiences/
│   │   ├── hotels/
│   │   ├── trips/
│   │   └── reviews/
│   ├── api/                   # API routes
│   │   ├── health/
│   │   ├── heritage-sites/
│   │   ├── guides/
│   │   ├── experiences/
│   │   ├── hotels/
│   │   ├── trips/
│   │   └── reviews/
│   ├── globals.css           # Global styles & theme
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Root redirect
│   ├── not-found.tsx         # 404 page
│   ├── error.tsx             # Error boundary
│
├── components/
│   ├── ui/                    # shadcn/ui components (40+)
│   ├── heritage-sites/        # Heritage sites components
│   ├── guides/                # Guides management components
│   ├── experiences/           # Experiences components
│   ├── hotels/                # Hotels components
│   ├── trips/                 # Trips components
│   ├── reviews/               # Reviews components
│   ├── sidebar.tsx           # Navigation sidebar
│   ├── header.tsx            # Top header
│   └── theme-provider.tsx    # Theme provider
│
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── api-client.ts         # Axios API client
│   ├── constants.ts          # App constants
│   ├── env.ts                # Environment variables
│   ├── request.ts            # HTTP request utilities
│   ├── storage.ts            # Local storage utilities
│   ├── error-handler.ts      # Error handling
│   ├── validation.ts         # Form validation
│   ├── auth.ts               # Authentication utilities
│   ├── logger.ts             # Logging utility
│   └── utils.ts              # General utilities
│
├── hooks/
│   ├── use-api.ts            # API data fetching hook
│   ├── use-form-handler.ts   # Form submission hook
│   ├── use-pagination.ts     # Pagination hook
│   ├── use-filter.ts         # Filtering hook
│   ├── use-mobile.ts         # Mobile detection hook
│   └── use-toast.ts          # Toast notification hook
│
├── public/
│   ├── icons/                # App icons
│   ├── taj-mahal-mausoleum.png
│   ├── music-show.jpg
│   └── heritage-hotel.jpg
│
├── proxy.ts                   # Middleware for routing
├── middleware.ts              # (deprecated - use proxy.ts)
├── next.config.mjs           # Next.js configuration
├── postcss.config.mjs        # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
├── components.json           # shadcn/ui configuration
├── package.json              # Dependencies
├── .env.example              # Environment template
├── .env.local                # Local environment (git ignored)
└── README.md                 # This file
```

## API Routes

All API routes return standardized responses:

```json
{
  "success": true,
  "data": { ... },
  "statusCode": 200
}
```

### Health Check
- `GET /api/health` - Check API health status

### Heritage Sites
- `GET /api/heritage-sites` - List all sites
- `POST /api/heritage-sites` - Create new site
- `GET /api/heritage-sites/[id]` - Get site details
- `PUT /api/heritage-sites/[id]` - Update site
- `DELETE /api/heritage-sites/[id]` - Delete site

### Guides
- `GET /api/guides` - List all guides
- `POST /api/guides` - Create guide
- `GET /api/guides/[id]` - Get guide details
- `PUT /api/guides/[id]` - Update guide
- `DELETE /api/guides/[id]` - Delete guide

### Experiences
- `GET /api/experiences` - List experiences
- `POST /api/experiences` - Create experience
- `GET /api/experiences/[id]` - Get experience details
- `PUT /api/experiences/[id]` - Update experience
- `DELETE /api/experiences/[id]` - Delete experience

### Hotels
- `GET /api/hotels` - List hotels
- `POST /api/hotels` - Create hotel
- `GET /api/hotels/[id]` - Get hotel details
- `PUT /api/hotels/[id]` - Update hotel
- `DELETE /api/hotels/[id]` - Delete hotel

### Trips
- `GET /api/trips` - List trips
- `POST /api/trips` - Create trip
- `GET /api/trips/[id]` - Get trip details
- `PUT /api/trips/[id]` - Update trip
- `DELETE /api/trips/[id]` - Delete trip

### Reviews
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/[id]` - Get review details
- `PUT /api/reviews/[id]` - Verify/hide review
- `DELETE /api/reviews/[id]` - Delete review

## Hooks

### useApi
Fetch and manage API data with loading and error states.

```tsx
const { data, loading, error, get, post, put, delete: remove } = useApi({
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error),
  showNotification: true,
})

await get('/api/heritage-sites')
```

### useFormHandler
Handle form submission with loading and error states.

```tsx
const { handleSubmit, loading, error } = useFormHandler({
  onSubmit: async (data) => {
    await apiClient.post('/api/heritage-sites', data)
  },
  onSuccess: () => console.log('Form submitted'),
})

await handleSubmit(formData)
```

### usePagination
Manage pagination state and navigation.

```tsx
const { page, limit, total, nextPage, previousPage, goToPage } = usePagination(10)
```

### useFilter
Manage filter state and apply filters.

```tsx
const { filters, setFilter, clearFilters } = useFilter({
  status: 'active',
})

setFilter('status', 'inactive')
```

## Authentication

Currently configured for development mode. For production:

1. Implement JWT token validation in `proxy.ts`
2. Add authentication provider (Clerk, Auth0, etc.)
3. Update `lib/auth.ts` with real authentication logic
4. Add protected route checks in middleware

## Styling

The app uses Tailwind CSS v4 with CSS variables for theming:

- **Light theme**: White background, dark text
- **Dark theme**: Dark background, light text
- **Colors**: Defined in `app/globals.css`
- **Components**: All styled with semantic Tailwind classes

To customize theme colors, edit the CSS variables in `app/globals.css`.

## Error Handling

The application has multiple error handling layers:

1. **API Layer** (`lib/request.ts`) - HTTP request errors with retries
2. **Application Layer** (`lib/error-handler.ts`) - Standardized error responses
3. **UI Layer** (`app/error.tsx`, `app/admin/error.tsx`) - Error boundaries
4. **Logging** (`lib/logger.ts`) - Structured logging

## Performance Optimization

- Server-side rendering (SSR) for pages
- Client-side data fetching with Axios
- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Vercel Analytics for monitoring

## Security Considerations

- Environment variables are kept secure in `.env.local`
- API routes validate input with Zod
- Cross-Origin Resource Sharing (CORS) configured
- SQL injection prevention with parameterized queries (when using database)
- XSS protection through React's built-in escaping

## Database Integration

The project is ready for database integration:

1. **Supabase** - Recommended for PostgreSQL + Auth
2. **Neon** - PostgreSQL serverless
3. **MongoDB** - For document-based storage
4. **AWS RDS** - Managed database services

Currently uses mock data. To connect a database:

1. Set `DATABASE_URL` in `.env.local`
2. Update API routes in `app/api/[resource]/route.ts`
3. Replace mock data with actual database queries

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in project settings
4. Deploy automatically on push

### Deploy to Other Platforms

The app can be deployed to:
- Netlify (with serverless functions)
- AWS Amplify
- Railway
- Heroku
- DigitalOcean App Platform

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a pull request

## License

This project is proprietary and confidential.

## Support

For issues and support, please contact the development team.

## Changelog

### Version 1.0.0
- Initial release
- Complete admin dashboard functionality
- 7 main management modules
- Responsive design
- Dark mode support
- API routes with mock data
- Full TypeScript support

---

**Built with ❤️ by the HeritEdge team**
