# Architecture Overview

## System Design

The HeritEdge Admin Dashboard follows a modern Next.js architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│           Frontend (React 19 + TypeScript)           │
├─────────────────────────────────────────────────────┤
│  Pages (SSR/CSR)  │  Components  │  Hooks           │
├─────────────────────────────────────────────────────┤
│         API Client Layer (Axios + Interceptors)      │
├─────────────────────────────────────────────────────┤
│      Next.js API Routes (Backend Handlers)           │
├─────────────────────────────────────────────────────┤
│   Database / External Services / Third-party APIs    │
└─────────────────────────────────────────────────────┘
```

## Layered Architecture

### 1. Presentation Layer (Components)

- **Page Components** (`app/*/page.tsx`) - Route handlers
- **Feature Components** (`components/*/`) - Feature-specific UI
- **UI Components** (`components/ui/`) - Reusable shadcn components
- **Layout Components** (`Sidebar`, `Header`) - Shared layouts

### 2. Data Fetching Layer

- **Hooks** (`hooks/use-*.ts`) - Custom data fetching hooks
- **API Client** (`lib/api-client.ts`) - Axios instance with interceptors
- **Request Utilities** (`lib/request.ts`) - HTTP request helpers

### 3. Business Logic Layer

- **Utilities** (`lib/`) - Helper functions and utilities
- **Validation** (`lib/validation.ts`) - Input validation
- **Error Handling** (`lib/error-handler.ts`) - Centralized error management
- **Authentication** (`lib/auth.ts`) - Auth state management

### 4. API Layer

- **Route Handlers** (`app/api/*/route.ts`) - Next.js API endpoints
- **Middleware** (`proxy.ts`) - Request/response middleware
- **Response Formatting** - Standardized API responses

## Data Flow

```
User Action (Click/Submit)
    ↓
Component/Hook
    ↓
useApi or useFormHandler Hook
    ↓
API Client (Axios)
    ↓
Next.js API Route Handler
    ↓
Database / External Service
    ↓
API Response (Standardized JSON)
    ↓
Hook Processing (Error/Loading/Success)
    ↓
Component State Update
    ↓
UI Re-render
```

## State Management

### Local State
- Component-level state with `useState`
- Form state with `react-hook-form`

### Global State
- Can be extended with Redux, Zustand, or Jotai
- Currently uses React Context for theme

### Server State
- Managed through API calls and hooks
- Cached with SWR or similar libraries (optional)

## File Organization

```
Feature Structure (Example: Heritage Sites)
├── app/admin/heritage-sites/page.tsx     # Route handler
├── components/heritage-sites/
│   ├── site-list.tsx                     # List view
│   ├── site-form.tsx                     # Form component
│   └── site-details.tsx                  # Details modal
├── app/api/heritage-sites/route.ts       # API endpoint
└── lib/types.ts                          # Type definitions
```

## API Response Format

All API endpoints follow this standardized response format:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  statusCode: number
}
```

## Error Handling Strategy

1. **Request Level** - Axios interceptors for auth/retry
2. **Route Level** - Try-catch in API handlers
3. **Component Level** - Error boundaries and UI feedback
4. **Global Level** - Logger utility and monitoring

## Performance Considerations

1. **Code Splitting** - Dynamic imports for large components
2. **Image Optimization** - Next.js Image component
3. **Caching** - API response caching with headers
4. **Lazy Loading** - React lazy + Suspense
5. **Bundle Analysis** - Monitor with `@next/bundle-analyzer`

## Security Layers

1. **Environment Variables** - Sensitive data in `.env.local`
2. **Authentication** - Token-based auth in headers
3. **Authorization** - Role-based access control
4. **Input Validation** - Zod schemas on client and server
5. **CSRF Protection** - CSRF tokens for state-changing operations
6. **Rate Limiting** - API rate limiting (to be added)

## Scalability Patterns

### Current Architecture Supports:

- **Horizontal Scaling** - Stateless Next.js app
- **Database Scaling** - SQL queries can be optimized with indexes
- **API Scaling** - API routes can be split into microservices
- **Caching** - Redis integration for session/data caching
- **CDN** - Static assets served via CDN

### Future Improvements:

- Add Redis for session management
- Implement GraphQL API layer
- Add message queues for async processing
- Implement CQRS pattern for complex features

## Testing Strategy

### Unit Tests
- Test utilities and validators
- Use Jest and React Testing Library

### Integration Tests
- Test API routes with mock database
- Test component interactions

### E2E Tests
- Test user flows with Playwright or Cypress
- Validate full feature workflows

## Monitoring & Logging

- **Application Logs** - `lib/logger.ts`
- **Analytics** - Vercel Analytics
- **Error Tracking** - Integration with Sentry (optional)
- **Performance Monitoring** - Web Vitals tracking

## Third-party Integrations

### Current
- Vercel Analytics
- Next.js framework
- Tailwind CSS styling
- shadcn/ui components

### Future Ready
- Authentication (Clerk, Auth0)
- Database (Supabase, Neon, MongoDB)
- File Storage (Vercel Blob, AWS S3)
- Email (SendGrid, Resend)
- Payment (Stripe)

---

For more details, refer to individual component and module documentation.
