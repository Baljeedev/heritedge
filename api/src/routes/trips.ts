import express, { Request, Response } from "express";
import Trip from "../models/Trip";
import { authenticateUser, optionalAuth } from "../middleware/auth";

const router = express.Router();

// GET /api/trips/featured - Get featured/premade trips (open to all users)
router.get("/featured", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const trips = await Trip.find({ isFeatured: true })
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });

    const total = await Trip.countDocuments({ isFeatured: true });

    res.json({
      trips,
      total,
      limit: Number(limit),
      skip: Number(skip),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/trips - Get user's trips (requires auth) or public trips
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { userId, status, limit = 50, skip = 0 } = req.query;

    const query: any = {};

    // If authenticated, show user's trips; otherwise show public/example trips
    if (req.userId) {
      query.clerkUserId = req.userId;
    } else if (userId) {
      query.clerkUserId = userId;
    }

    if (status) query.status = status;

    const trips = await Trip.find(query)
      .populate("selectedSites", "name location image")
      .populate("selectedHotels.hotelId", "name location images")
      .populate("selectedGuides.guideId", "name specialization rating")
      .populate("selectedGuides.siteId", "name location")
      .populate("selectedExperiences.experienceId", "name type price")
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });

    const total = await Trip.countDocuments(query);

    res.json({
      trips,
      total,
      limit: Number(limit),
      skip: Number(skip),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/trips/:id - Get a specific trip
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("selectedSites", "name location image description")
      .populate("selectedHotels.hotelId", "name location images pricePerNight")
      .populate("selectedGuides.guideId", "name specialization bio rating languages")
      .populate("selectedGuides.siteId", "name location")
      .populate("selectedExperiences.experienceId", "name type price description");

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Check if user owns this trip or if it's public
    if (trip.clerkUserId !== req.userId && trip.status !== "planned") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/trips - Create a new trip
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const trip = new Trip({
      ...req.body,
      clerkUserId: req.userId!,
    });
    await trip.save();
    res.status(201).json(trip);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/trips/:id - Update trip
router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    if (trip.clerkUserId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    Object.assign(trip, req.body);
    await trip.save();
    res.json(trip);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/trips/:id - Delete trip
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    if (trip.clerkUserId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await trip.deleteOne();
    res.json({ message: "Trip deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/trips/:id/generate-itinerary - AI-based itinerary generation (placeholder)
router.post(
  "/:id/generate-itinerary",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const trip = await Trip.findById(req.params.id);
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }

      if (trip.clerkUserId !== req.userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const { prompt } = req.body;

      // TODO: Integrate with AI service (OpenAI, etc.) to generate itinerary
      // For now, return a placeholder response
      res.json({
        message: "AI itinerary generation will be implemented here",
        prompt,
        note: "This endpoint will use AI to generate a detailed itinerary based on selected sites, hotels, and experiences",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

