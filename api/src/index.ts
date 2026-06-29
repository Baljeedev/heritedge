//reset 
import express from "express";
import cors from "cors";
import connectDB from "./config/database";

// Bun automatically loads .env files, no need for dotenv

// Import routes
import heritageSitesRouter from "./routes/heritageSites";
import guidesRouter from "./routes/guides";
import hotelsRouter from "./routes/hotels";
import experiencesRouter from "./routes/experiences";
import tripsRouter from "./routes/trips";
import reviewsRouter from "./routes/reviews";
import uploadRouter from "./routes/upload";
import bookingsRouter from "./routes/bookings";
import applicationsRouter from "./routes/applications";
import citiesRouter from "./routes/cities";
import instrumentsRouter from "./routes/instruments";
import artFormsRouter from "./routes/artForms";
import adminUsersRouter from "./routes/adminUsers";
import guideTestimonialsRouter from "./routes/guideTestimonials";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "HeritEdge API",
    version: "1.0.0",
    status: "running",
  });
});

// API Routes
app.use("/api/heritage-sites", heritageSitesRouter);
app.use("/api/guides", guidesRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/experiences", experiencesRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/cities", citiesRouter);
app.use("/api/instruments", instrumentsRouter);
app.use("/api/art-forms", artFormsRouter);
app.use("/api/admin-users", adminUsersRouter);
app.use("/api/guide-testimonials", guideTestimonialsRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3001;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   GET    /api/heritage-sites`);
  console.log(`   GET    /api/guides`);
  console.log(`   GET    /api/hotels`);
  console.log(`   GET    /api/experiences`);
  console.log(`   GET    /api/trips`);
  console.log(`   GET    /api/trips/featured (open to all)`);
  console.log(`   POST   /api/trips/generate (AI trip generation)`);
  console.log(`   POST   /api/trips/:id/edit (AI trip editing)`);
  console.log(`   GET    /api/reviews`);
  console.log(`   GET    /api/bookings`);
  console.log(`   GET    /api/applications`);
  console.log(`   POST   /api/applications`);
});
