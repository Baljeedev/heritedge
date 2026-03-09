import mongoose from "mongoose";
import City from "../models/City";

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


const INDIAN_CITIES = [
  // Andhra Pradesh
  { name: "Visakhapatnam", state: "Andhra Pradesh" },
  { name: "Vijayawada", state: "Andhra Pradesh" },
  { name: "Guntur", state: "Andhra Pradesh" },
  { name: "Tirupati", state: "Andhra Pradesh" },
  { name: "Kurnool", state: "Andhra Pradesh" },
  { name: "Amaravati", state: "Andhra Pradesh" },

  // Arunachal Pradesh
  { name: "Itanagar", state: "Arunachal Pradesh" },

  // Assam
  { name: "Guwahati", state: "Assam" },
  { name: "Dibrugarh", state: "Assam" },
  { name: "Silchar", state: "Assam" },
  { name: "Jorhat", state: "Assam" },

  // Bihar
  { name: "Patna", state: "Bihar" },
  { name: "Gaya", state: "Bihar" },
  { name: "Bhagalpur", state: "Bihar" },
  { name: "Muzaffarpur", state: "Bihar" },
  { name: "Nalanda", state: "Bihar" },
  { name: "Bodh Gaya", state: "Bihar" },

  // Chhattisgarh
  { name: "Raipur", state: "Chhattisgarh" },
  { name: "Bhilai", state: "Chhattisgarh" },
  { name: "Bilaspur", state: "Chhattisgarh" },

  // Goa
  { name: "Panaji", state: "Goa" },
  { name: "Margao", state: "Goa" },
  { name: "Vasco da Gama", state: "Goa" },

  // Gujarat
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Surat", state: "Gujarat" },
  { name: "Vadodara", state: "Gujarat" },
  { name: "Rajkot", state: "Gujarat" },
  { name: "Gandhinagar", state: "Gujarat" },
  { name: "Junagadh", state: "Gujarat" },
  { name: "Dwarka", state: "Gujarat" },
  { name: "Somnath", state: "Gujarat" },
  { name: "Kutch", state: "Gujarat" },
  { name: "Bhavnagar", state: "Gujarat" },

  // Haryana
  { name: "Gurugram", state: "Haryana" },
  { name: "Faridabad", state: "Haryana" },
  { name: "Chandigarh", state: "Haryana" },
  { name: "Panipat", state: "Haryana" },
  { name: "Ambala", state: "Haryana" },
  { name: "Kurukshetra", state: "Haryana" },

  // Himachal Pradesh
  { name: "Shimla", state: "Himachal Pradesh" },
  { name: "Manali", state: "Himachal Pradesh" },
  { name: "Dharamshala", state: "Himachal Pradesh" },
  { name: "Kullu", state: "Himachal Pradesh" },
  { name: "Mandi", state: "Himachal Pradesh" },

  // Jharkhand
  { name: "Ranchi", state: "Jharkhand" },
  { name: "Jamshedpur", state: "Jharkhand" },
  { name: "Dhanbad", state: "Jharkhand" },

  // Karnataka
  { name: "Bengaluru", state: "Karnataka" },
  { name: "Mysuru", state: "Karnataka" },
  { name: "Hubli", state: "Karnataka" },
  { name: "Mangaluru", state: "Karnataka" },
  { name: "Belagavi", state: "Karnataka" },
  { name: "Hampi", state: "Karnataka" },
  { name: "Badami", state: "Karnataka" },
  { name: "Pattadakal", state: "Karnataka" },
  { name: "Aihole", state: "Karnataka" },
  { name: "Hassan", state: "Karnataka" },

  // Kerala
  { name: "Thiruvananthapuram", state: "Kerala" },
  { name: "Kochi", state: "Kerala" },
  { name: "Kozhikode", state: "Kerala" },
  { name: "Thrissur", state: "Kerala" },
  { name: "Alappuzha", state: "Kerala" },
  { name: "Munnar", state: "Kerala" },
  { name: "Wayanad", state: "Kerala" },

  // Madhya Pradesh
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Gwalior", state: "Madhya Pradesh" },
  { name: "Jabalpur", state: "Madhya Pradesh" },
  { name: "Ujjain", state: "Madhya Pradesh" },
  { name: "Khajuraho", state: "Madhya Pradesh" },
  { name: "Sanchi", state: "Madhya Pradesh" },
  { name: "Orchha", state: "Madhya Pradesh" },
  { name: "Mandu", state: "Madhya Pradesh" },

  // Maharashtra
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Nagpur", state: "Maharashtra" },
  { name: "Nashik", state: "Maharashtra" },
  { name: "Aurangabad", state: "Maharashtra" },
  { name: "Solapur", state: "Maharashtra" },
  { name: "Kolhapur", state: "Maharashtra" },
  { name: "Ajanta", state: "Maharashtra" },
  { name: "Ellora", state: "Maharashtra" },

  // Manipur
  { name: "Imphal", state: "Manipur" },

  // Meghalaya
  { name: "Shillong", state: "Meghalaya" },
  { name: "Cherrapunji", state: "Meghalaya" },

  // Mizoram
  { name: "Aizawl", state: "Mizoram" },

  // Nagaland
  { name: "Kohima", state: "Nagaland" },
  { name: "Dimapur", state: "Nagaland" },

  // Odisha
  { name: "Bhubaneswar", state: "Odisha" },
  { name: "Cuttack", state: "Odisha" },
  { name: "Puri", state: "Odisha" },
  { name: "Rourkela", state: "Odisha" },
  { name: "Konark", state: "Odisha" },

  // Punjab
  { name: "Ludhiana", state: "Punjab" },
  { name: "Amritsar", state: "Punjab" },
  { name: "Jalandhar", state: "Punjab" },
  { name: "Patiala", state: "Punjab" },
  { name: "Bathinda", state: "Punjab" },

  // Rajasthan
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Jodhpur", state: "Rajasthan" },
  { name: "Udaipur", state: "Rajasthan" },
  { name: "Ajmer", state: "Rajasthan" },
  { name: "Kota", state: "Rajasthan" },
  { name: "Bikaner", state: "Rajasthan" },
  { name: "Pushkar", state: "Rajasthan" },
  { name: "Jaisalmer", state: "Rajasthan" },
  { name: "Chittorgarh", state: "Rajasthan" },
  { name: "Mount Abu", state: "Rajasthan" },
  { name: "Ranthambore", state: "Rajasthan" },

  // Sikkim
  { name: "Gangtok", state: "Sikkim" },

  // Tamil Nadu
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Coimbatore", state: "Tamil Nadu" },
  { name: "Madurai", state: "Tamil Nadu" },
  { name: "Tiruchirappalli", state: "Tamil Nadu" },
  { name: "Salem", state: "Tamil Nadu" },
  { name: "Tirunelveli", state: "Tamil Nadu" },
  { name: "Thanjavur", state: "Tamil Nadu" },
  { name: "Mahabalipuram", state: "Tamil Nadu" },
  { name: "Kanchipuram", state: "Tamil Nadu" },
  { name: "Rameswaram", state: "Tamil Nadu" },
  { name: "Ooty", state: "Tamil Nadu" },

  // Telangana
  { name: "Hyderabad", state: "Telangana" },
  { name: "Warangal", state: "Telangana" },
  { name: "Nizamabad", state: "Telangana" },

  // Tripura
  { name: "Agartala", state: "Tripura" },

  // Uttar Pradesh
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Kanpur", state: "Uttar Pradesh" },
  { name: "Agra", state: "Uttar Pradesh" },
  { name: "Varanasi", state: "Uttar Pradesh" },
  { name: "Allahabad", state: "Uttar Pradesh" },
  { name: "Meerut", state: "Uttar Pradesh" },
  { name: "Noida", state: "Uttar Pradesh" },
  { name: "Mathura", state: "Uttar Pradesh" },
  { name: "Vrindavan", state: "Uttar Pradesh" },
  { name: "Ayodhya", state: "Uttar Pradesh" },
  { name: "Fatehpur Sikri", state: "Uttar Pradesh" },
  { name: "Sarnath", state: "Uttar Pradesh" },
  { name: "Jhansi", state: "Uttar Pradesh" },

  // Uttarakhand
  { name: "Dehradun", state: "Uttarakhand" },
  { name: "Haridwar", state: "Uttarakhand" },
  { name: "Rishikesh", state: "Uttarakhand" },
  { name: "Nainital", state: "Uttarakhand" },
  { name: "Mussoorie", state: "Uttarakhand" },

  // West Bengal
  { name: "Kolkata", state: "West Bengal" },
  { name: "Asansol", state: "West Bengal" },
  { name: "Siliguri", state: "West Bengal" },
  { name: "Darjeeling", state: "West Bengal" },
  { name: "Murshidabad", state: "West Bengal" },
  { name: "Bishnupur", state: "West Bengal" },

  // Union Territories
  { name: "New Delhi", state: "Delhi" },
  { name: "Delhi", state: "Delhi" },
  { name: "Puducherry", state: "Puducherry" },
  { name: "Port Blair", state: "Andaman and Nicobar Islands" },
  { name: "Leh", state: "Ladakh" },
  { name: "Kargil", state: "Ladakh" },
  { name: "Srinagar", state: "Jammu & Kashmir" },
  { name: "Jammu", state: "Jammu & Kashmir" },
  { name: "Daman", state: "Dadra and Nagar Haveli and Daman and Diu" },
  { name: "Silvassa", state: "Dadra and Nagar Haveli and Daman and Diu" },
  { name: "Kavaratti", state: "Lakshadweep" },
];

async function seedCities() {
  try {
    await connectDB();
    console.log("🌆 Starting Indian cities seed...");

    let created = 0;
    let skipped = 0;

    for (const cityData of INDIAN_CITIES) {
      try {
        await City.findOneAndUpdate(
          { name: cityData.name, state: cityData.state },
          { ...cityData, country: "India", isActive: true },
          { upsert: true, new: true }
        );
        created++;
      } catch (err) {
        console.warn(`⚠️  Skipped ${cityData.name}: already exists or error`);
        skipped++;
      }
    }

    console.log(`✅ Cities seeded: ${created} created/updated, ${skipped} skipped`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seedCities();
