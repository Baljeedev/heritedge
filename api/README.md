# HeritEdge API

Backend API for the HeritEdge heritage travel platform.

## Setup

### Install dependencies:

```bash
bun install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/heritedge
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/heritedge

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# API Keys (for future integrations)
# GOOGLE_MAPS_API_KEY=your_google_maps_api_key
# OPENAI_API_KEY=your_openai_api_key_for_ai_features
```

A `.env.example` file is provided as a template. Copy it to `.env` and fill in your values.

### Run the server:

```bash
bun run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Heritage Sites
- `GET /api/heritage-sites` - Get all heritage sites
- `GET /api/heritage-sites/nearby` - Get sites near a location
- `GET /api/heritage-sites/:id` - Get a specific site
- `POST /api/heritage-sites` - Create a new site
- `PUT /api/heritage-sites/:id` - Update a site
- `DELETE /api/heritage-sites/:id` - Delete a site

### Guides
- `GET /api/guides` - Get all guides
- `GET /api/guides/:id` - Get a specific guide
- `POST /api/guides` - Register as a guide
- `PUT /api/guides/:id` - Update guide profile
- `POST /api/guides/apply-internship` - Apply for internship (ages 13-17)

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/nearby` - Get hotels near a location
- `GET /api/hotels/:id` - Get a specific hotel
- `POST /api/hotels` - Create a new hotel
- `PUT /api/hotels/:id` - Update hotel
- `DELETE /api/hotels/:id` - Delete hotel

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get a specific experience
- `POST /api/experiences` - Create a new experience
- `PUT /api/experiences/:id` - Update experience
- `DELETE /api/experiences/:id` - Delete experience

### Trips
- `GET /api/trips` - Get user's trips
- `GET /api/trips/:id` - Get a specific trip
- `POST /api/trips` - Create a new trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/generate-itinerary` - Generate AI itinerary

### Reviews
- `GET /api/reviews` - Get reviews
- `GET /api/reviews/:id` - Get a specific review
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

## Authentication

Most endpoints support optional authentication. Protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <clerk_jwt_token>
```

## Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Language**: TypeScript

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
