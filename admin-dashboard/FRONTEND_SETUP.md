# Frontend-Only Setup Guide

This is now a **frontend-only** Next.js application. All backend code has been removed and it connects to your live backend API.

## Configuration

### Update API Endpoint

Edit `.env.local` and update `NEXT_PUBLIC_API_URL` with your actual backend API URL:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## API Endpoints Expected

Your backend API should provide these endpoints:

### Heritage Sites
- `GET /api/heritage-sites` - List all sites
- `POST /api/heritage-sites` - Create new site
- `GET /api/heritage-sites/{id}` - Get site details
- `PUT /api/heritage-sites/{id}` - Update site
- `DELETE /api/heritage-sites/{id}` - Delete site

### Guides
- `GET /api/guides` - List all guides
- `POST /api/guides` - Create guide
- `GET /api/guides/{id}` - Get guide details
- `PUT /api/guides/{id}` - Update guide
- `DELETE /api/guides/{id}` - Delete guide

### Experiences
- `GET /api/experiences` - List experiences
- `POST /api/experiences` - Create experience
- `GET /api/experiences/{id}` - Get details
- `PUT /api/experiences/{id}` - Update
- `DELETE /api/experiences/{id}` - Delete

### Hotels
- `GET /api/hotels` - List hotels
- `POST /api/hotels` - Create hotel
- `GET /api/hotels/{id}` - Get details
- `PUT /api/hotels/{id}` - Update
- `DELETE /api/hotels/{id}` - Delete

### Trips
- `GET /api/trips` - List trips
- `POST /api/trips` - Create trip
- `GET /api/trips/{id}` - Get details
- `PUT /api/trips/{id}` - Update
- `DELETE /api/trips/{id}` - Delete

### Reviews
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/{id}` - Get details
- `PUT /api/reviews/{id}` - Verify/hide review
- `DELETE /api/reviews/{id}` - Delete review

## API Response Format

Your backend should return responses in this format:

```json
{
  "success": true,
  "data": { ... },
  "statusCode": 200
}
```

For errors:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  },
  "statusCode": 400
}
```

## CORS Configuration

Make sure your backend has CORS enabled to accept requests from this frontend domain.

## Running the Frontend

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000` and automatically redirect to `/admin`.

## Deployment

Deploy this frontend to:
- **Vercel** (recommended)
- Netlify
- AWS Amplify
- Railway
- Any Node.js hosting

Set the `NEXT_PUBLIC_API_URL` environment variable in your deployment platform.

## Removed Files

The following backend files have been removed:
- `/app/api/*` - All API route handlers
- `/proxy.ts` - Backend middleware

Everything else is pure frontend code.
