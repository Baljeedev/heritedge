import mongoose from "mongoose";
import Guide from "../models/Guide";
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

// Indian Tour Guides Data
const INDIAN_GUIDES = [
  {
    clerkUserId: "system_guide_1",
    name: "Rajesh Kumar",
    email: "baljeelovesmemes@gmail.com",
    image: "https://www.shutterstock.com/image-photo/young-asian-woman-professional-entrepreneur-600nw-2127014192.jpg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    specialization: "Mughal Architecture & History",
    rating: 4.8,
    reviewCount: 342,
    pricePerDay: 2500,
    languages: ["Hindi", "English", "Urdu"],
    experience: 12,
    bio: "A passionate historian and certified guide with over 12 years of experience specializing in Mughal architecture. Rajesh brings the stories of the Taj Mahal and Red Fort to life with detailed historical narratives and architectural insights.",
    certifications: [
      {
        name: "Certified Tourist Guide",
        issuingAuthority: "Ministry of Tourism, India",
        certificateNumber: "CG-UP-2011-0456",
        issueDate: new Date("2011-06-15"),
        verified: true,
        verificationDate: new Date("2011-06-20"),
      },
      {
        name: "Heritage Site Specialist",
        issuingAuthority: "Archaeological Survey of India",
        certificateNumber: "ASI-HS-2015-0789",
        issueDate: new Date("2015-03-10"),
        verified: true,
        verificationDate: new Date("2015-03-15"),
      },
    ],
    isIntern: false,
    isActive: true,
  },
  {
    clerkUserId: "system_guide_2",
    name: "Priya Sharma",
    email: "baljeelovesmemes@gmail.com",
    image: "https://p1.piqsels.com/preview/333/874/540/nature-outdoors-people-summer-person-man.jpg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    specialization: "Delhi Heritage & Culture",
    rating: 4.9,
    reviewCount: 512,
    pricePerDay: 2800,
    languages: ["Hindi", "English", "Punjabi"],
    experience: 15,
    bio: "Priya is a Delhi native with deep knowledge of the city's rich history spanning from the Delhi Sultanate to modern times. Her tours of Qutub Minar and Humayun's Tomb are known for their engaging storytelling and cultural context.",
    certifications: [
      {
        name: "Certified Tourist Guide",
        issuingAuthority: "Ministry of Tourism, India",
        certificateNumber: "CG-DL-2008-0234",
        issueDate: new Date("2008-04-20"),
        verified: true,
        verificationDate: new Date("2008-04-25"),
      },
    ],
    isIntern: false,
    isActive: true,
  },
  {
    clerkUserId: "system_guide_3",
    name: "Amit Patel",
    email: "baljeelovesmemes@gmail.com",
    image: "https://static.vecteezy.com/system/resources/thumbnails/071/408/430/small/portrait-of-positive-young-guy-in-t-shirt-looking-at-camera-on-light-grey-studio-background-confident-millennial-man-with-dark-hair-wearing-casual-clothes-posing-and-smiling-photo.jpg",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    specialization: "Rajasthan Heritage & Rajput History",
    rating: 4.7,
    reviewCount: 289,
    pricePerDay: 2200,
    languages: ["Hindi", "English", "Rajasthani"],
    experience: 8,
    bio: "Amit specializes in Rajasthan's royal heritage and Rajput architecture. His tours of Hawa Mahal and other Jaipur monuments combine historical facts with fascinating stories of Rajput valor and culture.",
    certifications: [
      {
        name: "Certified Tourist Guide",
        issuingAuthority: "Ministry of Tourism, India",
        certificateNumber: "CG-RJ-2015-0890",
        issueDate: new Date("2015-08-12"),
        verified: true,
        verificationDate: new Date("2015-08-18"),
      },
    ],
    isIntern: false,
    isActive: true,
  },
  {
    clerkUserId: "system_guide_4",
    name: "Deepak Singh",
    email: "baljeelovesmemes@gmail.com",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    specialization: "South Indian Temples & Architecture",
    rating: 4.6,
    reviewCount: 198,
    pricePerDay: 2000,
    languages: ["Hindi", "English", "Kannada", "Tamil"],
    experience: 10,
    bio: "Deepak is an expert in South Indian temple architecture and the Vijayanagara Empire. His knowledge of Hampi's ruins and Mysore Palace architecture provides visitors with deep insights into Dravidian and Indo-Saracenic styles.",
    certifications: [
      {
        name: "Certified Tourist Guide",
        issuingAuthority: "Ministry of Tourism, India",
        certificateNumber: "CG-KA-2013-0567",
        issueDate: new Date("2013-11-05"),
        verified: true,
        verificationDate: new Date("2013-11-10"),
      },
    ],
    isIntern: false,
    isActive: true,
  },
  {
    clerkUserId: "system_guide_5",
    name: "Meera Devi",
    email: "baljeelovesmemes@gmail.com",
    image: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?semt=ais_hybrid&w=740&q=80",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    specialization: "Medieval Indian Architecture & Sculpture",
    rating: 4.8,
    reviewCount: 156,
    pricePerDay: 1800,
    languages: ["Hindi", "English", "Bhojpuri"],
    experience: 7,
    bio: "Meera specializes in medieval Indian architecture, particularly the Khajuraho temples. Her expertise in Nagara-style architecture and understanding of temple symbolism makes her tours both educational and inspiring.",
    certifications: [
      {
        name: "Certified Tourist Guide",
        issuingAuthority: "Ministry of Tourism, India",
        certificateNumber: "CG-MP-2016-0123",
        issueDate: new Date("2016-02-14"),
        verified: true,
        verificationDate: new Date("2016-02-20"),
      },
    ],
    isIntern: false,
    isActive: true,
  },
  {
    clerkUserId: "system_guide_6",
    name: "Vikram Rao",
    email: "baljeelovesmemes@gmail.com",
    image: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?semt=ais_hybrid&w=740&q=80",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    specialization: "Odisha Heritage & Kalinga Architecture",
    rating: 4.5,
    reviewCount: 124,
    pricePerDay: 1900,
    languages: ["Hindi", "English", "Odia"],
    experience: 6,
    bio: "Vikram is passionate about Odisha's rich cultural heritage and the Konark Sun Temple. His tours explain the intricate Kalinga architecture and the temple's astronomical significance.",
    certifications: [
      {
        name: "Certified Tourist Guide",
        issuingAuthority: "Ministry of Tourism, India",
        certificateNumber: "CG-OD-2017-0345",
        issueDate: new Date("2017-05-22"),
        verified: true,
        verificationDate: new Date("2017-05-28"),
      },
    ],
    isIntern: false,
    isActive: true,
  },
  {
    clerkUserId: "system_guide_7",
    name: "Anjali Mehta",
    email: "baljeelovesmemes@gmail.com",
    image: "https://img.freepik.com/free-photo/close-up-portrait-handsome-smiling-young-man-white-t-shirt-blurry-outdoor-nature_176420-6305.jpg?semt=ais_hybrid&w=740&q=80",
    video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    specialization: "Mumbai Heritage & Colonial Architecture",
    rating: 4.4,
    reviewCount: 98,
    pricePerDay: 2100,
    languages: ["Hindi", "English", "Marathi", "Gujarati"],
    experience: 5,
    bio: "Anjali specializes in Mumbai's colonial heritage and the Gateway of India. Her tours explore the city's transformation from a fishing village to India's financial capital, with focus on Indo-Saracenic architecture.",
    certifications: [
      {
        name: "Certified Tourist Guide",
        issuingAuthority: "Ministry of Tourism, India",
        certificateNumber: "CG-MH-2018-0678",
        issueDate: new Date("2018-09-10"),
        verified: true,
        verificationDate: new Date("2018-09-15"),
      },
    ],
    isIntern: false,
    isActive: true,
  },
];

// Seed function
const seedGuides = async () => {
  try {
    console.log("🌱 Starting guides seeding...");

    // Get heritage sites to link guides
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

    // Clear existing system guides
    await Guide.deleteMany({ clerkUserId: /^system_/ });
    console.log("🗑️  Cleared existing system guides");

    // Assign sites to guides based on their specialization
    const guidesWithSites = INDIAN_GUIDES.map((guide) => {
      const siteIds: mongoose.Types.ObjectId[] = [];

      // Assign sites based on specialization
      if (guide.specialization.includes("Mughal")) {
        const tajMahal = siteMap.get("Taj Mahal");
        const redFort = siteMap.get("Red Fort (Lal Qila)");
        if (tajMahal) siteIds.push(tajMahal);
        if (redFort) siteIds.push(redFort);
      } else if (guide.specialization.includes("Delhi")) {
        const qutub = siteMap.get("Qutub Minar");
        const humayun = siteMap.get("Humayun's Tomb");
        const redFort = siteMap.get("Red Fort (Lal Qila)");
        if (qutub) siteIds.push(qutub);
        if (humayun) siteIds.push(humayun);
        if (redFort) siteIds.push(redFort);
      } else if (guide.specialization.includes("Rajasthan")) {
        const hawaMahal = siteMap.get("Hawa Mahal");
        if (hawaMahal) siteIds.push(hawaMahal);
      } else if (guide.specialization.includes("South Indian")) {
        const hampi = siteMap.get("Hampi Ruins");
        const mysore = siteMap.get("Mysore Palace");
        if (hampi) siteIds.push(hampi);
        if (mysore) siteIds.push(mysore);
      } else if (guide.specialization.includes("Medieval")) {
        const khajuraho = siteMap.get("Khajuraho Temples");
        if (khajuraho) siteIds.push(khajuraho);
      } else if (guide.specialization.includes("Odisha")) {
        const konark = siteMap.get("Konark Sun Temple");
        if (konark) siteIds.push(konark);
      } else if (guide.specialization.includes("Mumbai")) {
        const gateway = siteMap.get("Gateway of India");
        if (gateway) siteIds.push(gateway);
      }

      return {
        ...guide,
        sites: siteIds,
      };
    });

    // Insert guides
    const createdGuides = await Guide.insertMany(guidesWithSites);
    console.log(`✅ Successfully seeded ${createdGuides.length} guides`);

    // Log the seeded guides
    createdGuides.forEach((guide) => {
      console.log(`   - ${guide.name} (${guide.specialization})`);
    });

    console.log("🎉 Guides seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding guides:", error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await seedGuides();
  await mongoose.connection.close();
  console.log("🔌 Database connection closed");
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { seedGuides, INDIAN_GUIDES };