import connectDB from "../config/database";
import Trip from "../models/Trip";

// Premade trips data (from frontend)
const PREMADE_TRIPS = [
  {
    id: "delhi",
    name: "Delhi Heritage Trail",
    location: "Delhi, India",
    duration: "3 Days",
    image: "/placeholder.jpg",
    description: "Explore the rich Mughal and British colonial heritage of India's capital city, from ancient forts to modern monuments.",
    highlights: [
      "Red Fort - UNESCO World Heritage Site",
      "Qutub Minar - 12th century minaret",
      "Humayun's Tomb - Precursor to Taj Mahal",
      "India Gate - War memorial",
      "Lotus Temple - Modern architectural marvel"
    ],
    budget: "Moderate",
    bestTimeToVisit: "October to March",
    itinerary: [
      {
        day: 1,
        title: "Mughal Heritage",
        activities: [
          {
            time: "9:00 AM",
            activity: "Red Fort Visit",
            location: "Red Fort, Old Delhi",
            description: "Explore the magnificent Mughal fort, a UNESCO World Heritage Site built by Shah Jahan"
          },
          {
            time: "12:00 PM",
            activity: "Lunch at Karim's",
            location: "Jama Masjid area",
            description: "Authentic Mughlai cuisine in the heart of Old Delhi"
          },
          {
            time: "2:00 PM",
            activity: "Jama Masjid",
            location: "Old Delhi",
            description: "India's largest mosque, built by Shah Jahan"
          },
          {
            time: "4:00 PM",
            activity: "Chandni Chowk Walk",
            location: "Old Delhi",
            description: "Explore the bustling markets and narrow lanes"
          }
        ]
      },
      {
        day: 2,
        title: "Ancient Monuments",
        activities: [
          {
            time: "9:00 AM",
            activity: "Qutub Minar Complex",
            location: "Mehrauli",
            description: "Visit the 73-meter tall minaret and surrounding archaeological sites"
          },
          {
            time: "12:00 PM",
            activity: "Lunch Break",
            location: "Mehrauli",
          },
          {
            time: "2:00 PM",
            activity: "Humayun's Tomb",
            location: "Nizamuddin",
            description: "UNESCO World Heritage Site, architectural inspiration for Taj Mahal"
          },
          {
            time: "4:30 PM",
            activity: "Lodi Gardens",
            location: "Lodi Estate",
            description: "Peaceful walk among 15th-century tombs"
          }
        ]
      },
      {
        day: 3,
        title: "Modern Delhi & Departure",
        activities: [
          {
            time: "9:00 AM",
            activity: "India Gate",
            location: "Rajpath",
            description: "War memorial arch and surrounding gardens"
          },
          {
            time: "11:00 AM",
            activity: "Lotus Temple",
            location: "Kalkaji",
            description: "Modern Bahá'í House of Worship with stunning architecture"
          },
          {
            time: "1:00 PM",
            activity: "Lunch & Shopping",
            location: "Connaught Place",
            description: "Modern shopping district and lunch"
          },
          {
            time: "3:00 PM",
            activity: "Departure",
            location: "Airport/Hotel",
          }
        ]
      }
    ]
  },
  {
    id: "jaipur",
    name: "Pink City Royalty",
    location: "Jaipur, Rajasthan",
    duration: "4 Days",
    image: "/placeholder.jpg",
    description: "Experience the royal heritage of Rajasthan through magnificent palaces, forts, and vibrant culture.",
    highlights: [
      "Amber Fort - Hilltop fortress",
      "City Palace - Royal residence",
      "Hawa Mahal - Palace of Winds",
      "Jantar Mantar - Ancient observatory",
      "Traditional Rajasthani cuisine"
    ],
    budget: "Moderate",
    bestTimeToVisit: "October to March",
    itinerary: [
      {
        day: 1,
        title: "Arrival & City Palace",
        activities: [
          {
            time: "10:00 AM",
            activity: "Check-in & Rest",
            location: "Hotel",
          },
          {
            time: "2:00 PM",
            activity: "City Palace",
            location: "Old City",
            description: "Explore the royal residence with museums and courtyards"
          },
          {
            time: "4:00 PM",
            activity: "Hawa Mahal",
            location: "Old City",
            description: "The iconic Palace of Winds with 953 windows"
          },
          {
            time: "7:00 PM",
            activity: "Traditional Dinner",
            location: "Chokhi Dhani",
            description: "Rajasthani cultural village experience"
          }
        ]
      },
      {
        day: 2,
        title: "Amber Fort & Nahargarh",
        activities: [
          {
            time: "8:00 AM",
            activity: "Amber Fort",
            location: "Amber",
            description: "Elephant or jeep ride to the hilltop fort, explore palaces and temples"
          },
          {
            time: "12:00 PM",
            activity: "Lunch",
            location: "Amber",
          },
          {
            time: "2:00 PM",
            activity: "Jal Mahal",
            location: "Man Sagar Lake",
            description: "Water palace in the middle of a lake"
          },
          {
            time: "4:00 PM",
            activity: "Nahargarh Fort",
            location: "Aravalli Hills",
            description: "Sunset views over the Pink City"
          }
        ]
      },
      {
        day: 3,
        title: "Jantar Mantar & Markets",
        activities: [
          {
            time: "9:00 AM",
            activity: "Jantar Mantar",
            location: "Old City",
            description: "UNESCO World Heritage Site - ancient astronomical observatory"
          },
          {
            time: "11:00 AM",
            activity: "Shopping at Bapu Bazaar",
            location: "Old City",
            description: "Traditional textiles, jewelry, and handicrafts"
          },
          {
            time: "1:00 PM",
            activity: "Lunch",
            location: "Old City",
          },
          {
            time: "3:00 PM",
            activity: "Albert Hall Museum",
            location: "Ram Niwas Garden",
            description: "Indo-Saracenic architecture and art collection"
          },
          {
            time: "7:00 PM",
            activity: "Cultural Show",
            location: "Raj Mandir Cinema or Cultural Center",
            description: "Traditional music and dance performance"
          }
        ]
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          {
            time: "9:00 AM",
            activity: "Breakfast & Check-out",
            location: "Hotel",
          },
          {
            time: "11:00 AM",
            activity: "Last-minute Shopping",
            location: "Johari Bazaar",
            description: "Jewelry and gemstones"
          },
          {
            time: "1:00 PM",
            activity: "Departure",
            location: "Airport",
          }
        ]
      }
    ]
  },
  {
    id: "hampi",
    name: "Hampi Ruins & Temples",
    location: "Hampi, Karnataka",
    duration: "3 Days",
    image: "/placeholder.jpg",
    description: "Discover the ruins of the magnificent Vijayanagara Empire, a UNESCO World Heritage Site.",
    highlights: [
      "Virupaksha Temple - Ancient temple complex",
      "Vittala Temple - Musical pillars",
      "Hampi Bazaar - Ancient market",
      "Royal Enclosure - Palace ruins",
      "Sunrise at Matanga Hill"
    ],
    budget: "Budget",
    bestTimeToVisit: "October to February",
    itinerary: [
      {
        day: 1,
        title: "Temple Complexes",
        activities: [
          {
            time: "8:00 AM",
            activity: "Virupaksha Temple",
            location: "Hampi Bazaar",
            description: "Active temple dedicated to Lord Shiva, dating back to 7th century"
          },
          {
            time: "10:00 AM",
            activity: "Hampi Bazaar",
            location: "Near Virupaksha Temple",
            description: "Ancient market street with stone structures"
          },
          {
            time: "12:00 PM",
            activity: "Lunch",
            location: "Local restaurant",
          },
          {
            time: "2:00 PM",
            activity: "Vittala Temple",
            location: "Hampi",
            description: "Famous for its musical pillars and stone chariot"
          },
          {
            time: "5:00 PM",
            activity: "Sunset at Hemakuta Hill",
            location: "Near Virupaksha Temple",
            description: "Panoramic views of the ruins"
          }
        ]
      },
      {
        day: 2,
        title: "Royal Enclosure & Monuments",
        activities: [
          {
            time: "6:00 AM",
            activity: "Sunrise at Matanga Hill",
            location: "Matanga Hill",
            description: "Early morning hike for stunning sunrise views"
          },
          {
            time: "9:00 AM",
            activity: "Royal Enclosure",
            location: "Hampi",
            description: "Explore the ruins of the royal palace complex"
          },
          {
            time: "11:00 AM",
            activity: "Lotus Mahal",
            location: "Zenana Enclosure",
            description: "Beautiful palace with Indo-Islamic architecture"
          },
          {
            time: "1:00 PM",
            activity: "Lunch Break",
            location: "Hampi",
          },
          {
            time: "3:00 PM",
            activity: "Elephant Stables",
            location: "Royal Enclosure",
            description: "11 domed chambers for royal elephants"
          },
          {
            time: "4:30 PM",
            activity: "Hazara Rama Temple",
            location: "Royal Enclosure",
            description: "Temple with intricate carvings depicting Ramayana"
          }
        ]
      },
      {
        day: 3,
        title: "Riverside & Departure",
        activities: [
          {
            time: "8:00 AM",
            activity: "Achyutaraya Temple",
            location: "Hampi",
            description: "Large temple complex with impressive architecture"
          },
          {
            time: "10:00 AM",
            activity: "Tungabhadra River",
            location: "Hampi",
            description: "Coracle ride or riverside walk"
          },
          {
            time: "12:00 PM",
            activity: "Lunch",
            location: "Hampi",
          },
          {
            time: "2:00 PM",
            activity: "Archaeological Museum",
            location: "Kamalapura",
            description: "Artifacts and sculptures from the Vijayanagara period"
          },
          {
            time: "4:00 PM",
            activity: "Departure",
            location: "Hospet/Hampi",
          }
        ]
      }
    ]
  },
  {
    id: "agra",
    name: "Taj Mahal & Mughal Heritage",
    location: "Agra, Uttar Pradesh",
    duration: "2 Days",
    image: "/taj-mahal-marble-monument.jpg",
    description: "Witness the iconic Taj Mahal and explore the rich Mughal heritage of Agra.",
    highlights: [
      "Taj Mahal - Wonder of the World",
      "Agra Fort - Red sandstone fortress",
      "Fatehpur Sikri - Abandoned Mughal city",
      "Itimad-ud-Daulah - Baby Taj",
      "Mughlai cuisine"
    ],
    budget: "Moderate",
    bestTimeToVisit: "October to March",
    itinerary: [
      {
        day: 1,
        title: "Taj Mahal & Agra Fort",
        activities: [
          {
            time: "6:00 AM",
            activity: "Taj Mahal at Sunrise",
            location: "Taj Mahal",
            description: "Early morning visit to avoid crowds, best lighting for photography"
          },
          {
            time: "9:00 AM",
            activity: "Breakfast",
            location: "Hotel/Restaurant",
          },
          {
            time: "11:00 AM",
            activity: "Agra Fort",
            location: "Agra",
            description: "UNESCO World Heritage Site, red sandstone fort with palaces and mosques"
          },
          {
            time: "1:00 PM",
            activity: "Lunch",
            location: "Agra",
            description: "Traditional Mughlai cuisine"
          },
          {
            time: "3:00 PM",
            activity: "Itimad-ud-Daulah",
            location: "Agra",
            description: "Baby Taj - precursor to Taj Mahal with intricate inlay work"
          },
          {
            time: "5:00 PM",
            activity: "Mehtab Bagh",
            location: "Across Yamuna River",
            description: "Sunset views of Taj Mahal from the gardens"
          }
        ]
      },
      {
        day: 2,
        title: "Fatehpur Sikri & Departure",
        activities: [
          {
            time: "8:00 AM",
            activity: "Fatehpur Sikri",
            location: "40 km from Agra",
            description: "UNESCO World Heritage Site - abandoned Mughal capital with stunning architecture"
          },
          {
            time: "12:00 PM",
            activity: "Lunch",
            location: "Fatehpur Sikri or Agra",
          },
          {
            time: "2:00 PM",
            activity: "Shopping",
            location: "Agra",
            description: "Marble inlay work and handicrafts"
          },
          {
            time: "4:00 PM",
            activity: "Departure",
            location: "Agra",
          }
        ]
      }
    ]
  }
];

async function seedTrips() {
  try {
    console.log("🌱 Starting trip seeding...");
    
    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");

    // Clear existing featured trips
    await Trip.deleteMany({ isFeatured: true });
    console.log("🗑️  Cleared existing featured trips");

    // Insert premade trips
    const tripsToInsert = PREMADE_TRIPS.map((trip) => ({
      clerkUserId: "system", // System user for featured trips
      name: trip.name,
      location: trip.location,
      duration: trip.duration,
      image: trip.image,
      description: trip.description,
      highlights: trip.highlights,
      itinerary: trip.itinerary,
      budget: trip.budget,
      bestTimeToVisit: trip.bestTimeToVisit,
      isFeatured: true,
      status: "planned" as const,
      selectedSites: [],
      selectedHotels: [],
      selectedGuides: [],
      selectedExperiences: [],
    }));

    const insertedTrips = await Trip.insertMany(tripsToInsert);
    console.log(`✅ Successfully seeded ${insertedTrips.length} featured trips`);
    
    // Log inserted trips
    insertedTrips.forEach((trip) => {
      console.log(`   - ${trip.name} (${trip.location})`);
    });

    console.log("🎉 Trip seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding trips:", error);
    process.exit(1);
  }
}

// Run the seed function
seedTrips();

