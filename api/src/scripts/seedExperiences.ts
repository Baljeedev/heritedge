import mongoose from "mongoose";
import Experience from "../models/Experience";
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

// Music Shows Data
const MUSIC_SHOWS = [
  {
    type: "music" as const,
    name: "Classical Indian Music at Taj Mahal",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.8,
    reviewCount: 142,
    price: 45,
    description: "Experience the soul-stirring sounds of classical Indian music performed by renowned musicians in the shadow of the Taj Mahal. This evening performance features traditional ragas and instruments like sitar, tabla, and sarangi, creating an unforgettable cultural experience.",
    duration: "90 minutes",
    venue: "Taj Mahal Gardens",
    performers: ["Rajesh Kumar (Sitar)", "Priya Devi (Tabla)", "Amit Sharma (Vocal)", "Suresh Joshi (Sarangi)"],
    genre: "Hindustani Classical",
    schedule: ["Daily at 6:00 PM", "Special performances on weekends at 7:00 PM"],
    isActive: true,
  },
  {
    type: "music" as const,
    name: "Qawwali Evening at Humayun's Tomb",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgwTqZJa4eQEYhb6J6P3c8bBNCCKUX0VavxQ&s",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.7,
    reviewCount: 98,
    price: 40,
    description: "Immerse yourself in the mystical sounds of Qawwali, a form of Sufi devotional music, performed in the serene setting of Humayun's Tomb. This spiritual musical experience connects you with the rich Sufi traditions of Delhi.",
    duration: "75 minutes",
    venue: "Humayun's Tomb Complex",
    performers: ["Delhi Qawwali Ensemble", "Sufi Music Group"],
    genre: "Sufi Qawwali",
    schedule: ["Friday and Saturday evenings at 7:30 PM"],
    isActive: true,
  },
  {
    type: "music" as const,
    name: "Rajasthani Folk Music at Hawa Mahal",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuDD8CIjBDuVukV24jBDSDnW6-DUu3qrzpeQ&s",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.6,
    reviewCount: 203,
    price: 35,
    description: "Enjoy vibrant Rajasthani folk music and dance performances featuring traditional instruments like dholak, khartal, and morchang. Experience the colorful culture of Rajasthan with authentic folk songs and dances.",
    duration: "60 minutes",
    venue: "Hawa Mahal Courtyard",
    performers: ["Jaipur Folk Ensemble", "Rajasthani Dance Troupe"],
    genre: "Rajasthani Folk",
    schedule: ["Daily at 5:00 PM", "Extended shows on weekends"],
    isActive: true,
  },
  {
    type: "music" as const,
    name: "Carnatic Music at Mysore Palace",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLyADkHVmysdaYefNY8J3KecQDfgvhkdlyqg&s",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.5,
    reviewCount: 156,
    price: 50,
    description: "Experience the classical music of South India with a Carnatic music performance in the magnificent setting of Mysore Palace. Features traditional instruments like veena, mridangam, and violin.",
    duration: "90 minutes",
    venue: "Mysore Palace Durbar Hall",
    performers: ["Mysore Carnatic Ensemble", "Veena Maestro", "Mridangam Artist"],
    genre: "Carnatic Classical",
    schedule: ["Wednesday, Friday, and Sunday at 6:30 PM"],
    isActive: true,
  },
  {
    type: "music" as const,
    name: "Temple Music at Khajuraho",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNemzzVQ4UCMR-JvvNhQcDqnq2FYJ2oi2weA&s",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.4,
    reviewCount: 87,
    price: 30,
    description: "Traditional temple music and devotional songs performed in the ancient Khajuraho temple complex. Experience the spiritual music that has been part of temple rituals for centuries.",
    duration: "45 minutes",
    venue: "Khajuraho Temple Complex",
    performers: ["Temple Music Ensemble"],
    genre: "Devotional/Temple Music",
    schedule: ["Daily at 5:30 PM during temple hours"],
    isActive: true,
  },
  {
    type: "music" as const,
    name: "Odissi Music & Dance at Konark",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/konark-temple-puri-odisha-2-attr-hero?qlt=82&ts=1726674676369",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.6,
    reviewCount: 112,
    price: 40,
    description: "Witness the graceful Odissi dance form accompanied by traditional Odissi music, performed against the backdrop of the magnificent Konark Sun Temple. A celebration of Odisha's rich cultural heritage.",
    duration: "60 minutes",
    venue: "Konark Sun Temple Amphitheater",
    performers: ["Odissi Dance Troupe", "Odissi Music Ensemble"],
    genre: "Odissi Classical",
    schedule: ["Tuesday, Thursday, and Saturday at 6:00 PM"],
    isActive: true,
  },
];

// Workshop Experiences Data
const WORKSHOPS = [
  {
    type: "workshop" as const,
    name: "Marble Inlay Art Workshop",
    image: "https://ichef.bbci.co.uk/images/ic/640x360/p09w0z2t.jpg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.9,
    reviewCount: 87,
    price: 120,
    description: "Learn the ancient art of marble inlay (Pietra Dura) used in the Taj Mahal. Master craftspeople will teach you techniques for creating intricate patterns with semi-precious stones. Take home your own handcrafted piece.",
    instructor: "Master Craftsman Ahmed Khan",
    skillLevel: "beginner" as const,
    materialsIncluded: true,
    maxParticipants: 12,
    topics: [
      "History of Pietra Dura art",
      "Stone cutting techniques",
      "Pattern design and layout",
      "Inlay techniques and finishing",
      "Creating your own piece"
    ],
    isActive: true,
  },
  {
    type: "workshop" as const,
    name: "Mughal Calligraphy Workshop",
    image: "https://ichef.bbci.co.uk/images/ic/640x360/p09w0z2t.jpg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.7,
    reviewCount: 64,
    price: 85,
    description: "Discover the beautiful art of Mughal calligraphy and learn to write in traditional Persian and Arabic scripts. This workshop covers the basics of Islamic calligraphy and its use in Mughal architecture.",
    instructor: "Calligraphy Master Zainab Ali",
    skillLevel: "beginner" as const,
    materialsIncluded: true,
    maxParticipants: 15,
    topics: [
      "Introduction to Islamic calligraphy",
      "Basic strokes and letterforms",
      "Persian script basics",
      "Creating decorative patterns",
      "Finishing techniques"
    ],
    isActive: true,
  },
  {
    type: "workshop" as const,
    name: "Traditional Textile Weaving",
    image: "https://ichef.bbci.co.uk/images/ic/640x360/p09w0z2t.jpg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.7,
    reviewCount: 71,
    price: 90,
    description: "Join local Rajasthani weavers to learn traditional textile techniques. Create your own woven piece using ancient patterns and natural dyes from the region. Experience the rich textile heritage of Rajasthan.",
    instructor: "Master Weaver Meera Devi",
    skillLevel: "beginner" as const,
    materialsIncluded: true,
    maxParticipants: 10,
    topics: [
      "Loom setup and basics",
      "Traditional Rajasthani patterns",
      "Natural dyeing techniques",
      "Weaving fundamentals",
      "Finishing your textile piece"
    ],
    isActive: true,
  },
  {
    type: "workshop" as const,
    name: "Stone Carving Workshop",
    image: "https://ichef.bbci.co.uk/images/ic/640x360/p09w0z2t.jpg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.8,
    reviewCount: 112,
    price: 95,
    description: "Learn the traditional stone carving techniques used in Indian temple architecture. Work with soft stone to create your own decorative piece inspired by the intricate carvings of Khajuraho and other temple sites.",
    instructor: "Master Sculptor Ramesh Kumar",
    skillLevel: "intermediate" as const,
    materialsIncluded: true,
    maxParticipants: 12,
    topics: [
      "Stone carving history and tools",
      "Basic carving techniques",
      "Design transfer methods",
      "Relief carving basics",
      "Finishing and polishing"
    ],
    isActive: true,
  },
  {
    type: "workshop" as const,
    name: "Traditional Pottery & Ceramics",
    image: "https://ichef.bbci.co.uk/images/ic/640x360/p09w0z2t.jpg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.6,
    reviewCount: 93,
    price: 75,
    description: "Experience traditional Indian pottery techniques including wheel throwing, hand-building, and glazing. Learn from skilled artisans and create your own ceramic piece using age-old methods.",
    instructor: "Master Potter Lakshmi Nair",
    skillLevel: "beginner" as const,
    materialsIncluded: true,
    maxParticipants: 10,
    topics: [
      "Clay preparation and properties",
      "Wheel throwing basics",
      "Hand-building techniques",
      "Glazing and decoration",
      "Kiln firing process"
    ],
    isActive: true,
  },
  {
    type: "workshop" as const,
    name: "Indian Miniature Painting",
    image: "https://ichef.bbci.co.uk/images/ic/640x360/p09w0z2t.jpg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.8,
    reviewCount: 78,
    price: 100,
    description: "Learn the intricate art of Indian miniature painting, a tradition that flourished during the Mughal and Rajput periods. Create your own miniature artwork using traditional techniques and natural pigments.",
    instructor: "Miniature Artist Kavita Sharma",
    skillLevel: "intermediate" as const,
    materialsIncluded: true,
    maxParticipants: 8,
    topics: [
      "History of Indian miniature painting",
      "Preparing paper and brushes",
      "Basic drawing and composition",
      "Color mixing with natural pigments",
      "Fine detailing techniques"
    ],
    isActive: true,
  },
  {
    type: "workshop" as const,
    name: "Traditional Jewelry Making",
    image: "https://ichef.bbci.co.uk/images/ic/640x360/p09w0z2t.jpg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.5,
    reviewCount: 56,
    price: 110,
    description: "Discover the art of traditional Indian jewelry making. Learn techniques for working with silver, creating traditional designs, and setting semi-precious stones. Create your own piece of heritage jewelry.",
    instructor: "Jewelry Master Sunil Mehta",
    skillLevel: "intermediate" as const,
    materialsIncluded: true,
    maxParticipants: 10,
    topics: [
      "Introduction to Indian jewelry traditions",
      "Basic metalworking techniques",
      "Design and pattern creation",
      "Stone setting methods",
      "Finishing and polishing"
    ],
    isActive: true,
  },
  {
    type: "workshop" as const,
    name: "Block Printing Workshop",
    image: "https://ichef.bbci.co.uk/images/ic/640x360/p09w0z2t.jpg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 4.7,
    reviewCount: 89,
    price: 80,
    description: "Learn the traditional art of block printing, a technique used for centuries in India. Create your own printed fabric using hand-carved wooden blocks and natural dyes.",
    instructor: "Block Print Master Arjun Singh",
    skillLevel: "beginner" as const,
    materialsIncluded: true,
    maxParticipants: 12,
    topics: [
      "History of block printing in India",
      "Block carving basics",
      "Fabric preparation",
      "Printing techniques",
      "Natural dyeing methods"
    ],
    isActive: true,
  },
];

// Seed function
const seedExperiences = async () => {
  try {
    console.log("🌱 Starting experiences seeding...");

    // Get heritage sites to link experiences
    const sites = await HeritageSite.find({});
    if (sites.length === 0) {
      console.log("⚠️  No heritage sites found. Please run seed:sites first.");
      return;
    }

    // Create a map of site names to IDs
    const siteMap = new Map();
    sites.forEach((site) => {
      siteMap.set(site.name, site._id);
    });

    // Clear existing system experiences
    await Experience.deleteMany({});
    console.log("🗑️  Cleared existing experiences");

    // Assign sites to music shows
    const musicShowsWithSites = MUSIC_SHOWS.map((show) => {
      const siteIds: mongoose.Types.ObjectId[] = [];

      if (show.name.includes("Taj Mahal")) {
        const tajMahal = siteMap.get("Taj Mahal");
        if (tajMahal) siteIds.push(tajMahal);
      } else if (show.name.includes("Humayun")) {
        const humayun = siteMap.get("Humayun's Tomb");
        if (humayun) siteIds.push(humayun);
      } else if (show.name.includes("Hawa Mahal")) {
        const hawaMahal = siteMap.get("Hawa Mahal");
        if (hawaMahal) siteIds.push(hawaMahal);
      } else if (show.name.includes("Mysore")) {
        const mysore = siteMap.get("Mysore Palace");
        if (mysore) siteIds.push(mysore);
      } else if (show.name.includes("Khajuraho")) {
        const khajuraho = siteMap.get("Khajuraho Temples");
        if (khajuraho) siteIds.push(khajuraho);
      } else if (show.name.includes("Konark")) {
        const konark = siteMap.get("Konark Sun Temple");
        if (konark) siteIds.push(konark);
      }

      return {
        ...show,
        sites: siteIds,
      };
    });

    // Assign sites to workshops (most workshops are general, but some are site-specific)
    const workshopsWithSites = WORKSHOPS.map((workshop) => {
      const siteIds: mongoose.Types.ObjectId[] = [];

      if (workshop.name.includes("Marble Inlay") || workshop.name.includes("Mughal Calligraphy")) {
        const tajMahal = siteMap.get("Taj Mahal");
        const redFort = siteMap.get("Red Fort (Lal Qila)");
        if (tajMahal) siteIds.push(tajMahal);
        if (redFort) siteIds.push(redFort);
      } else if (workshop.name.includes("Textile") || workshop.name.includes("Block Printing")) {
        const hawaMahal = siteMap.get("Hawa Mahal");
        if (hawaMahal) siteIds.push(hawaMahal);
      } else if (workshop.name.includes("Stone Carving")) {
        const khajuraho = siteMap.get("Khajuraho Temples");
        if (khajuraho) siteIds.push(khajuraho);
      } else {
        // General workshops - assign to multiple sites
        const tajMahal = siteMap.get("Taj Mahal");
        const redFort = siteMap.get("Red Fort (Lal Qila)");
        if (tajMahal) siteIds.push(tajMahal);
        if (redFort) siteIds.push(redFort);
      }

      return {
        ...workshop,
        sites: siteIds,
      };
    });

    // Insert all experiences
    const allExperiences = [...musicShowsWithSites, ...workshopsWithSites];
    const createdExperiences = await Experience.insertMany(allExperiences);

    console.log(`✅ Successfully seeded ${createdExperiences.length} experiences`);
    console.log(`   - ${musicShowsWithSites.length} music shows`);
    console.log(`   - ${workshopsWithSites.length} workshops`);

    // Log the seeded experiences
    createdExperiences.forEach((exp) => {
      console.log(`   - ${exp.name} (${exp.type})`);
    });

    console.log("🎉 Experiences seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding experiences:", error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await seedExperiences();
  await mongoose.connection.close();
  console.log("🔌 Database connection closed");
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { seedExperiences, MUSIC_SHOWS, WORKSHOPS };