import mongoose from "mongoose";
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

// Indian Heritage Sites Data
const INDIAN_HERITAGE_SITES = [
  {
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh, India",
    city: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    image: "/taj-mahal-marble-monument.jpg",
    rating: 4.9,
    reviewCount: 12453,
    era: "Mughal Era",
    status: "Preserved",
    annualVisitors: 7.5,
    description: "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the Yamuna river in Agra. It was commissioned in 1631 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.",
    historicalWriteup: "Built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal, the Taj Mahal was constructed between 1632 and 1653 by a workforce of approximately 20,000 artisans. The monument seamlessly blends architectural styles from Persian, Islamic, and Indian traditions. Its perfect symmetry, intricate marble inlay work, and timeless beauty have made it the crown jewel of Indo-Islamic architecture.",
    keyFacts: [
      "Built between 1632-1653",
      "White marble structure with semi-precious stone inlays",
      "Perfect symmetrical design",
      "UNESCO World Heritage Site since 1983",
      "One of the New Seven Wonders of the World"
    ],
    coordinates: {
      latitude: 27.1751,
      longitude: 78.0421
    },
    unescoWorldHeritage: true,
    yearOfConstruction: "1632-1653",
    creator: "Shah Jahan",
    architecturalStyle: "Indo-Islamic",
    materials: ["White marble", "Red sandstone", "Semi-precious stones"]
  },
  {
    name: "Red Fort (Lal Qila)",
    location: "Delhi, India",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    image: "/red-fort-delhi.jpg",
    rating: 4.6,
    reviewCount: 8932,
    era: "Mughal Era",
    status: "Preserved",
    annualVisitors: 9.5,
    description: "The Red Fort is a historic walled city in Delhi, India, that served as the main residence of the Mughal Emperors for nearly 200 years. It is a UNESCO World Heritage Site and a symbol of India.",
    historicalWriteup: "Constructed by the Mughal Emperor Shah Jahan between 1638 and 1648, the Red Fort served as the ceremonial and political center of Mughal government and the setting for events which directly shaped Indian history and politics. The fort represents the zenith of Mughal creativity which, under the Shah Jahan, was brought to a new level of refinement.",
    keyFacts: [
      "Built between 1638-1648",
      "Made of red sandstone",
      "Covers an area of 254.67 acres",
      "UNESCO World Heritage Site since 2007",
      "Site of India's Independence Day celebrations"
    ],
    coordinates: {
      latitude: 28.6562,
      longitude: 77.2410
    },
    unescoWorldHeritage: true,
    yearOfConstruction: "1638-1648",
    creator: "Shah Jahan",
    architecturalStyle: "Indo-Islamic",
    materials: ["Red sandstone", "Marble"]
  },
  {
    name: "Qutub Minar",
    location: "Delhi, India",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    image: "/qutub-minar-delhi.jpg",
    rating: 4.5,
    reviewCount: 6742,
    era: "Delhi Sultanate",
    status: "Preserved",
    annualVisitors: 3.9,
    description: "The Qutub Minar is a minaret and victory tower that forms part of the Qutb complex, a UNESCO World Heritage Site in the Mehrauli area of Delhi, India.",
    historicalWriteup: "Construction of the Qutub Minar was begun by Qutb-ud-Din Aibak in 1199 and completed by his successor Iltutmish. The tower is 72.5 meters tall and is the tallest brick minaret in the world. It represents the beginning of Muslim rule in India and showcases early Indo-Islamic architecture.",
    keyFacts: [
      "Started in 1199, completed by 1220",
      "72.5 meters tall",
      "World's tallest brick minaret",
      "UNESCO World Heritage Site since 1993",
      "Five distinct stories with balconies"
    ],
    coordinates: {
      latitude: 28.5245,
      longitude: 77.1855
    },
    unescoWorldHeritage: true,
    yearOfConstruction: "1199-1220",
    creator: "Qutb-ud-Din Aibak",
    architecturalStyle: "Indo-Islamic",
    materials: ["Red sandstone", "Marble"]
  },
  {
    name: "Humayun's Tomb",
    location: "Delhi, India",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    image: "/humayuns-tomb-delhi.jpg",
    rating: 4.4,
    reviewCount: 4521,
    era: "Mughal Era",
    status: "Preserved",
    annualVisitors: 2.8,
    description: "Humayun's tomb is the tomb of the Mughal Emperor Humayun in Delhi, India. The tomb was commissioned by Humayun's first wife and chief consort, Empress Bega Begum, in 1558.",
    historicalWriteup: "Built in 1570, nine years after Humayun's death, this tomb is of particular cultural significance as it was the first garden-tomb on the Indian subcontinent. It inspired several major architectural innovations, culminating in the construction of the Taj Mahal. The tomb is an excellent example of Persian architecture in India.",
    keyFacts: [
      "Built in 1570",
      "First garden-tomb in India",
      "Inspired the design of Taj Mahal",
      "UNESCO World Heritage Site since 1993",
      "Persian-style architecture"
    ],
    coordinates: {
      latitude: 28.5933,
      longitude: 77.2507
    },
    unescoWorldHeritage: true,
    yearOfConstruction: "1570",
    creator: "Empress Bega Begum",
    architecturalStyle: "Persian-Mughal",
    materials: ["Red sandstone", "White marble"]
  },
  {
    name: "Hawa Mahal",
    location: "Jaipur, Rajasthan, India",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    image: "/hawa-mahal-jaipur.jpg",
    rating: 4.3,
    reviewCount: 7834,
    era: "Rajput Era",
    status: "Preserved",
    annualVisitors: 4.2,
    description: "Hawa Mahal is a palace in the city of Jaipur, India. Built from red and pink sandstone, it is on the edge of the City Palace, Jaipur, and extends to the Zenana, or women's chambers.",
    historicalWriteup: "Built in 1799 by Maharaja Sawai Pratap Singh, the Hawa Mahal was designed by Lal Chand Ustad in the form of the crown of Krishna, the Hindu god. Its unique five-story exterior is akin to a honeycomb with its 953 small windows called Jharokhas decorated with intricate latticework, designed to allow royal ladies to observe everyday life in the street below without being seen.",
    keyFacts: [
      "Built in 1799",
      "953 small windows (Jharokhas)",
      "Five-story pyramid shape",
      "Made of red and pink sandstone",
      "Designed for royal women's privacy"
    ],
    coordinates: {
      latitude: 26.9239,
      longitude: 75.8267
    },
    unescoWorldHeritage: false,
    yearOfConstruction: "1799",
    creator: "Maharaja Sawai Pratap Singh",
    architecturalStyle: "Rajput",
    materials: ["Red sandstone", "Pink sandstone"]
  },
  {
    name: "Mysore Palace",
    location: "Mysore, Karnataka, India",
    city: "Mysore",
    state: "Karnataka",
    country: "India",
    image: "/mysore-palace-karnataka.jpg",
    rating: 4.7,
    reviewCount: 9123,
    era: "Modern Era",
    status: "Preserved",
    annualVisitors: 6.1,
    description: "Mysore Palace, also known as Amba Vilas Palace, is a historical palace and a royal residence at Mysore in the Indian State of Karnataka. It is the official residence of the Wadiyar dynasty.",
    historicalWriteup: "The current structure was built between 1912 and 1940, after the previous wooden palace was destroyed by fire. The palace is a magnificent example of Indo-Saracenic architecture, blending Hindu, Muslim, Rajput, and Gothic styles. It served as the seat of the Kingdom of Mysore for many centuries.",
    keyFacts: [
      "Built between 1912-1940",
      "Indo-Saracenic architecture",
      "Official residence of Wadiyar dynasty",
      "Illuminated with 97,000 light bulbs on Sundays",
      "One of India's most visited monuments"
    ],
    coordinates: {
      latitude: 12.3051,
      longitude: 76.6551
    },
    unescoWorldHeritage: false,
    yearOfConstruction: "1912-1940",
    creator: "Wadiyar Dynasty",
    architecturalStyle: "Indo-Saracenic",
    materials: ["Stone", "Wood", "Metal"]
  },
  {
    name: "Khajuraho Temples",
    location: "Khajuraho, Madhya Pradesh, India",
    city: "Khajuraho",
    state: "Madhya Pradesh",
    country: "India",
    image: "/khajuraho-temples-mp.jpg",
    rating: 4.6,
    reviewCount: 5234,
    era: "Medieval Period",
    status: "Preserved",
    annualVisitors: 1.2,
    description: "The Khajuraho Group of Monuments is a group of Hindu and Jain temples in Chhatarpur district, Madhya Pradesh, India. They are a UNESCO World Heritage Site.",
    historicalWriteup: "Built between 950 and 1050 CE by the Chandela dynasty, the Khajuraho temples are famous for their nagara-style architectural symbolism and their erotic sculptures. Originally, there were 85 temples, but only 20 have survived. These temples represent the pinnacle of Indian architectural achievement and showcase the religious and cultural values of medieval India.",
    keyFacts: [
      "Built between 950-1050 CE",
      "Originally 85 temples, 20 survive",
      "Famous for erotic sculptures",
      "UNESCO World Heritage Site since 1986",
      "Nagara-style architecture"
    ],
    coordinates: {
      latitude: 24.8318,
      longitude: 79.9199
    },
    unescoWorldHeritage: true,
    yearOfConstruction: "950-1050 CE",
    creator: "Chandela Dynasty",
    architecturalStyle: "Nagara",
    materials: ["Sandstone"]
  },
  {
    name: "Hampi Ruins",
    location: "Hampi, Karnataka, India",
    city: "Hampi",
    state: "Karnataka",
    country: "India",
    image: "/hampi-ruins-karnataka.jpg",
    rating: 4.8,
    reviewCount: 6789,
    era: "Vijayanagara Empire",
    status: "Ruins",
    annualVisitors: 0.8,
    description: "Hampi is an ancient village in the south Indian state of Karnataka. It's dotted with numerous ruined temple complexes from the Vijayanagara Empire.",
    historicalWriteup: "Hampi was the capital of the Vijayanagara Empire from 1336 to 1565. At its peak, it was one of the largest cities in the world with a population of over 500,000. The city was destroyed by the Deccan Muslim confederacy in 1565, but its ruins remain as a testament to the grandeur of the Vijayanagara Empire. The site contains more than 1,600 surviving remains.",
    keyFacts: [
      "Capital of Vijayanagara Empire (1336-1565)",
      "Once one of the world's largest cities",
      "Over 1,600 surviving remains",
      "UNESCO World Heritage Site since 1986",
      "Dravidian architecture"
    ],
    coordinates: {
      latitude: 15.3350,
      longitude: 76.4600
    },
    unescoWorldHeritage: true,
    yearOfConstruction: "1336-1565",
    creator: "Vijayanagara Empire",
    architecturalStyle: "Dravidian",
    materials: ["Granite", "Stone"]
  },
  {
    name: "Konark Sun Temple",
    location: "Konark, Odisha, India",
    city: "Konark",
    state: "Odisha",
    country: "India",
    image: "/konark-sun-temple-odisha.jpg",
    rating: 4.5,
    reviewCount: 4567,
    era: "Medieval Period",
    status: "Under Restoration",
    annualVisitors: 1.5,
    description: "The Konark Sun Temple is a 13th-century CE Hindu Sun temple at Konark about 35 kilometres northeast of Puri on the coastline of Odisha, India.",
    historicalWriteup: "Built in the 13th century by King Narasimhadeva I of the Eastern Ganga Dynasty, the temple is designed in the shape of a gigantic chariot with elaborately carved stone wheels, pillars, and walls. The temple is dedicated to the Hindu sun god Surya and is renowned for its architectural splendor and sculptural richness. It represents the pinnacle of Kalinga architecture.",
    keyFacts: [
      "Built in 13th century",
      "Designed as a giant chariot",
      "Dedicated to Sun God Surya",
      "UNESCO World Heritage Site since 1984",
      "Kalinga architecture style"
    ],
    coordinates: {
      latitude: 19.8876,
      longitude: 86.0947
    },
    unescoWorldHeritage: true,
    yearOfConstruction: "1250 CE",
    creator: "King Narasimhadeva I",
    architecturalStyle: "Kalinga",
    materials: ["Sandstone"]
  },
  {
    name: "Gateway of India",
    location: "Mumbai, Maharashtra, India",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    image: "/gateway-of-india-mumbai.jpg",
    rating: 4.2,
    reviewCount: 11234,
    era: "British Colonial",
    status: "Preserved",
    annualVisitors: 15.2,
    description: "The Gateway of India is an arch-monument built in the early 20th century in the city of Mumbai, India. It was erected to commemorate the landing of King-Emperor George V and Queen-Empress Mary at Apollo Bunder on their visit to India in 1911.",
    historicalWriteup: "Designed by Scottish architect George Wittet and built between 1913 and 1924, the Gateway of India combines Hindu and Muslim architectural styles with triumphant arch architecture. The monument has become an iconic symbol of Mumbai and India. It was the ceremonial entrance to British India for Viceroys and new Governors, and ironically, it was also the point from which the last British troops departed India in 1948.",
    keyFacts: [
      "Built between 1913-1924",
      "Designed by George Wittet",
      "Commemorates visit of King George V",
      "Last departure point of British troops (1948)",
      "Indo-Saracenic architecture"
    ],
    coordinates: {
      latitude: 18.9220,
      longitude: 72.8347
    },
    unescoWorldHeritage: false,
    yearOfConstruction: "1913-1924",
    creator: "George Wittet",
    architecturalStyle: "Indo-Saracenic",
    materials: ["Yellow basalt", "Reinforced concrete"]
  }
];

// Seed function
const seedHeritageSites = async () => {
  try {
    console.log("🌱 Starting heritage sites seeding...");
    
    // Clear existing heritage sites
    await HeritageSite.deleteMany({});
    console.log("🗑️  Cleared existing heritage sites");

    // Insert new heritage sites
    const sites = await HeritageSite.insertMany(INDIAN_HERITAGE_SITES);
    console.log(`✅ Successfully seeded ${sites.length} heritage sites`);
    
    // Log the seeded sites
    sites.forEach(site => {
      console.log(`   - ${site.name} (${site.city}, ${site.state})`);
    });

    console.log("🎉 Heritage sites seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding heritage sites:", error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await seedHeritageSites();
  await mongoose.connection.close();
  console.log("🔌 Database connection closed");
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { seedHeritageSites, INDIAN_HERITAGE_SITES };