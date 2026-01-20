import mongoose from "mongoose";
import Booking from "../models/Booking";
import Experience from "../models/Experience";
import Guide from "../models/Guide";
import HeritageSite from "../models/HeritageSite";
import Hotel from "../models/Hotel";
import Review from "../models/Review";
import Trip from "../models/Trip";

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

// Clear all records from all collections
const clearDatabase = async () => {
  try {
    console.log("🗑️  Starting database cleanup...");

    // Delete all records from each collection
    const bookingResult = await Booking.deleteMany({});
    console.log(`✅ Deleted ${bookingResult.deletedCount} booking(s)`);

    const experienceResult = await Experience.deleteMany({});
    console.log(`✅ Deleted ${experienceResult.deletedCount} experience(s)`);

    const guideResult = await Guide.deleteMany({});
    console.log(`✅ Deleted ${guideResult.deletedCount} guide(s)`);

    const heritageSiteResult = await HeritageSite.deleteMany({});
    console.log(`✅ Deleted ${heritageSiteResult.deletedCount} heritage site(s)`);

    const hotelResult = await Hotel.deleteMany({});
    console.log(`✅ Deleted ${hotelResult.deletedCount} hotel(s)`);

    const reviewResult = await Review.deleteMany({});
    console.log(`✅ Deleted ${reviewResult.deletedCount} review(s)`);

    const tripResult = await Trip.deleteMany({});
    console.log(`✅ Deleted ${tripResult.deletedCount} trip(s)`);

    const totalDeleted =
      bookingResult.deletedCount +
      experienceResult.deletedCount +
      guideResult.deletedCount +
      heritageSiteResult.deletedCount +
      hotelResult.deletedCount +
      reviewResult.deletedCount +
      tripResult.deletedCount;

    console.log(`\n✨ Database cleanup completed! Total records deleted: ${totalDeleted}`);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await clearDatabase();
  await mongoose.connection.close();
  console.log("🔌 Database connection closed");
};

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
}

export { clearDatabase };
