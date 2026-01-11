# Heritage Sites Seed Data

This directory contains scripts to populate the database with Indian heritage monuments.

## Available Scripts

### Heritage Sites Seeding

Seeds the database with 10 famous Indian heritage monuments.

```bash
cd api
bun run seed:sites
```

**Monuments included:**
- Taj Mahal (Agra, Uttar Pradesh)
- Red Fort (Delhi)
- Qutub Minar (Delhi)
- Humayun's Tomb (Delhi)
- Hawa Mahal (Jaipur, Rajasthan)
- Mysore Palace (Mysore, Karnataka)
- Khajuraho Temples (Khajuraho, Madhya Pradesh)
- Hampi Ruins (Hampi, Karnataka)
- Konark Sun Temple (Konark, Odisha)
- Gateway of India (Mumbai, Maharashtra)

### Trip Seeding

Seeds the database with featured heritage trips.

```bash
cd api
bun run seed:trips
```

## Prerequisites

1. Make sure MongoDB is running
2. Set up your `.env` file with `MONGODB_URI`
3. Ensure the API server dependencies are installed (`bun install`)

## Environment Variables

Create a `.env` file in the `api` directory:

```env
MONGODB_URI=mongodb://localhost:27017/heritedge
PORT=3000
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

## Running the Seeds

1. **Start MongoDB** (if running locally)
2. **Navigate to the API directory**:
   ```bash
   cd api
   ```
3. **Run the heritage sites seed**:
   ```bash
   bun run seed:sites
   ```
4. **Run the trips seed** (optional):
   ```bash
   bun run seed:trips
   ```

## Data Structure

Each heritage site includes:
- Basic information (name, location, city, state)
- Ratings and visitor statistics
- Historical details and descriptions
- Architectural information
- GPS coordinates
- UNESCO World Heritage status
- High-quality images
- Key facts and construction details

## Notes

- The seed scripts will **clear existing data** before inserting new records
- All coordinates are accurate GPS locations
- Images paths are provided but you'll need to add actual image files to the frontend public directory
- The data includes a mix of UNESCO World Heritage Sites and other significant monuments
- Each monument has detailed historical writeups and architectural information