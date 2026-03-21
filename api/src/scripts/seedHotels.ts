import mongoose from "mongoose";
import Hotel from "../models/Hotel";
import HeritageSite from "../models/HeritageSite";

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/heritedge";
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to database");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

// Helper function to generate nearby coordinates (within 2-5 km radius)
const generateNearbyCoordinates = (lat: number, lon: number, index: number) => {
  // Add small random offset (approximately 0.01-0.05 degrees = ~1-5 km)
  const offsetLat = (Math.random() * 0.04 + 0.01) * (index % 2 === 0 ? 1 : -1);
  const offsetLon = (Math.random() * 0.04 + 0.01) * (index % 2 === 0 ? 1 : -1);
  return {
    latitude: lat + offsetLat,
    longitude: lon + offsetLon,
  };
};

// Hotel data templates
const HOTEL_TEMPLATES = [
  {
    namePrefix: "Heritage",
    nameSuffix: "Palace",
    chain: "WelcomHeritage",
    amenities: ["Wi-Fi", "Swimming Pool", "Spa", "Restaurant", "Bar", "Parking", "Room Service", "Laundry"],
    hasLivingHistory: true,
    hasHistoryLectures: true,
    hasCulturalMeals: true,
    hasStorytellingEvenings: true,
    partnershipType: "premium" as const,
    discountPercentage: 15,
  },
  {
    namePrefix: "Royal",
    nameSuffix: "Resort",
    chain: "Neemrana",
    amenities: ["Wi-Fi", "Swimming Pool", "Gym", "Restaurant", "Parking", "Room Service", "Concierge"],
    hasLivingHistory: true,
    hasHistoryLectures: false,
    hasCulturalMeals: true,
    hasStorytellingEvenings: false,
    partnershipType: "referral" as const,
    discountPercentage: 10,
  },
  {
    namePrefix: "Grand",
    nameSuffix: "Hotel",
    chain: "HeritEdge",
    amenities: ["Wi-Fi", "Restaurant", "Bar", "Parking", "Room Service", "Laundry", "Business Center"],
    hasLivingHistory: false,
    hasHistoryLectures: false,
    hasCulturalMeals: false,
    hasStorytellingEvenings: false,
    partnershipType: "listing" as const,
    discountPercentage: 5,
  },
  {
    namePrefix: "Heritage",
    nameSuffix: "Inn",
    chain: undefined,
    amenities: ["Wi-Fi", "Restaurant", "Parking", "Room Service"],
    hasLivingHistory: false,
    hasHistoryLectures: false,
    hasCulturalMeals: true,
    hasStorytellingEvenings: false,
    partnershipType: "listing" as const,
    discountPercentage: 0,
  },
];

// Room type templates
const ROOM_TYPES = [
  {
    name: "Standard Room",
    description: "Comfortable room with basic amenities",
    priceMultiplier: 1.0,
    maxOccupancy: 2,
    isLivingHistory: false,
  },
  {
    name: "Deluxe Room",
    description: "Spacious room with enhanced amenities",
    priceMultiplier: 1.5,
    maxOccupancy: 3,
    isLivingHistory: false,
  },
  {
    name: "Heritage Suite",
    description: "Luxurious suite with heritage-themed decor",
    priceMultiplier: 2.5,
    maxOccupancy: 4,
    isLivingHistory: true,
    theme: "Mughal Era",
  },
  {
    name: "Royal Suite",
    description: "Premium suite with royal treatment",
    priceMultiplier: 3.5,
    maxOccupancy: 4,
    isLivingHistory: true,
    theme: "Rajputana",
  },
];

// Seed function
const seedHotels = async () => {
  try {
    console.log("🌱 Starting hotels seeding...");

    // Get all heritage sites from database
    const sites = await HeritageSite.find({});
    if (sites.length === 0) {
      console.log("⚠️  No heritage sites found. Please seed heritage sites first.");
      return;
    }

    console.log(`📍 Found ${sites.length} heritage sites`);

    // Clear existing hotels
    await Hotel.deleteMany({});
    console.log("🗑️  Cleared existing hotels");

    const hotelsToInsert: any[] = [];

    // Create 2-3 hotels near each heritage site
    for (const site of sites) {
      const numHotels = Math.floor(Math.random() * 2) + 2; // 2-3 hotels per site

      for (let i = 0; i < numHotels; i++) {
        const template = HOTEL_TEMPLATES[i % HOTEL_TEMPLATES.length];
        const coords = generateNearbyCoordinates(site.coordinates.latitude, site.coordinates.longitude, i);
        
        // Generate price range based on city and template
        const basePrice = site.city === "Mumbai" || site.city === "Delhi" ? 3000 : 2000;
        const minPrice = Math.floor(basePrice * (0.8 + Math.random() * 0.4));
        const maxPrice = Math.floor(minPrice * (1.3 + Math.random() * 0.4));

        // Generate room types
        const numRoomTypes = Math.floor(Math.random() * 2) + 2; // 2-3 room types
        const selectedRoomTypes = ROOM_TYPES.slice(0, numRoomTypes);
        const roomTypes = selectedRoomTypes.map((rt) => ({
          name: rt.name,
          description: rt.description,
          pricePerNight: Math.floor(minPrice * rt.priceMultiplier),
          maxOccupancy: rt.maxOccupancy,
          isLivingHistory: rt.isLivingHistory || false,
          theme: rt.theme,
        }));

        const hotelName = `${template.namePrefix} ${site.city} ${template.nameSuffix}`;
        const location = `${site.city}, ${site.state}, India`;

        const hotel = {
          name: hotelName,
          chain: template.chain,
          location: location,
          city: site.city,
          state: site.state,
          country: "India",
          coordinates: coords,
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
          ],
          rating: 4.0 + Math.random() * 1.0, // 4.0 to 5.0
          reviewCount: Math.floor(Math.random() * 500) + 50,
          pricePerNight: {
            min: minPrice,
            max: maxPrice,
            currency: "INR",
          },
          description: `A ${template.partnershipType === "premium" ? "luxurious" : "comfortable"} heritage hotel located near ${site.name}. Experience the rich history and culture of ${site.city} while enjoying modern amenities and ${template.hasCulturalMeals ? "authentic local cuisine" : "excellent service"}.`,
          amenities: template.amenities,
          roomTypes: roomTypes,
          heritageFeatures: {
            hasLivingHistoryRooms: template.hasLivingHistory,
            hasHistoryLectures: template.hasHistoryLectures,
            hasCulturalMeals: template.hasCulturalMeals,
            hasStorytellingEvenings: template.hasStorytellingEvenings,
            historicalTimelinePosters: template.hasHistoryLectures,
          },
          nearbySites: [site._id],
          partnershipType: template.partnershipType,
          discountPercentage: template.discountPercentage,
          email: "baljeelovesmemes@gmail.com",
          isActive: true,
        };

        hotelsToInsert.push(hotel);
      }
    }

    // Insert all hotels
    const hotels = await Hotel.insertMany(hotelsToInsert);
    console.log(`✅ Successfully seeded ${hotels.length} hotels`);

    // Log summary by city
    const hotelsByCity: Record<string, number> = {};
    hotels.forEach((hotel) => {
      hotelsByCity[hotel.city] = (hotelsByCity[hotel.city] || 0) + 1;
    });

    console.log("\n📊 Hotels by city:");
    Object.entries(hotelsByCity).forEach(([city, count]) => {
      console.log(`   - ${city}: ${count} hotels`);
    });

    // Log hotels near each site
    console.log("\n🏨 Hotels near heritage sites:");
    for (const site of sites) {
      const nearbyHotels = hotels.filter((h) =>
        h.nearbySites.some((siteId) => siteId.toString() === site._id.toString())
      );
      console.log(`   - ${site.name} (${site.city}): ${nearbyHotels.length} hotels`);
      nearbyHotels.forEach((h) => {
        console.log(`     • ${h.name} (${h.partnershipType}, ₹${h.pricePerNight.min}-${h.pricePerNight.max}/night)`);
      });
    }

    console.log("\n🎉 Hotels seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding hotels:", error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await seedHotels();
  await mongoose.connection.close();
  console.log("🔌 Database connection closed");
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { seedHotels };
