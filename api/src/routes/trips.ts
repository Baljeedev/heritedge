import express, { Request, Response } from "express";
import Trip from "../models/Trip";
import HeritageSite from "../models/HeritageSite";
import Hotel from "../models/Hotel";
import Guide from "../models/Guide";
import Experience from "../models/Experience";
import { authenticateUser, optionalAuth } from "../middleware/auth";
import { generateItinerary, editItinerary } from "../services/openai";

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

    // If authenticated, show ONLY user's trips (not featured/system trips unless they own them)
    if (req.userId) {
      query.clerkUserId = req.userId;
    } else if (userId) {
      // Allow querying by userId if provided (for admin dashboard)
      query.clerkUserId = userId;
    } else {
      // If not authenticated and no userId provided, show only featured/system trips
      query.$or = [
        { isFeatured: true },
        { clerkUserId: "system" },
      ];
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

    // Only allow users to view their own trips (unless it's a featured/system trip)
    if (trip.clerkUserId !== "system" && !trip.isFeatured) {
      if (!req.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if (trip.clerkUserId !== req.userId) {
        return res.status(403).json({ error: "Unauthorized: You can only view your own trips" });
      }
    }

    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/trips - Create a new trip
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    // Allow admin to set clerkUserId (e.g., "system" for featured trips)
    // Otherwise use the authenticated user's ID
    const trip = new Trip({
      ...req.body,
      clerkUserId: req.body.clerkUserId || req.userId!,
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

    // Only allow users to update their own trips (unless it's a system trip)
    if (trip.clerkUserId !== "system" && trip.clerkUserId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized: You can only update your own trips" });
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

    // Only allow users to delete their own trips (unless it's a system trip)
    if (trip.clerkUserId !== "system" && trip.clerkUserId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized: You can only delete your own trips" });
    }

    await trip.deleteOne();
    res.json({ message: "Trip deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/trips/generate - Generate AI trip itinerary
router.post("/generate", authenticateUser, async (req: Request, res: Response) => {
  try {
    let { budget, numberOfDays, siteId, siteIds, selectedHotelIds } = req.body;

    // Support both siteId (single) and siteIds (multiple); normalize to array
    const resolvedSiteIds: string[] = siteIds?.length ? siteIds : siteId ? [siteId] : [];

    // Validate input
    if (!budget || !numberOfDays || resolvedSiteIds.length === 0) {
      return res.status(400).json({ error: "Missing required fields: budget, numberOfDays, siteId (or siteIds)" });
    }

    // Use first site as primary for backward compat
    siteId = resolvedSiteIds[0];

    // Map user-friendly budget values to model values
    const budgetMap: Record<string, "Budget" | "Moderate" | "Luxury"> = {
      low: "Budget",
      medium: "Moderate",
      high: "Luxury",
      budget: "Budget",
      moderate: "Moderate",
      luxury: "Luxury",
    };

    const normalizedBudget = budgetMap[budget.toLowerCase()] || budget;
    if (!["Budget", "Moderate", "Luxury"].includes(normalizedBudget)) {
      return res.status(400).json({ error: "Budget must be one of: Budget/Moderate/Luxury or high/medium/low" });
    }

    budget = normalizedBudget;

    if (numberOfDays < 1 || numberOfDays > 30) {
      return res.status(400).json({ error: "Number of days must be between 1 and 30" });
    }

    // Fetch all selected heritage sites
    const allSites = await HeritageSite.find({ _id: { $in: resolvedSiteIds } });
    if (allSites.length === 0) {
      return res.status(404).json({ error: "No heritage sites found" });
    }
    // Primary site (first selected)
    const site = allSites.find(s => s._id.toString() === siteId) || allSites[0];

    // Fetch hotels - use selectedHotelIds if provided, otherwise fetch by nearbySites
    let hotels;
    if (selectedHotelIds && Array.isArray(selectedHotelIds) && selectedHotelIds.length > 0) {
      // Use user-selected hotels
      hotels = await Hotel.find({
        _id: { $in: selectedHotelIds },
        isActive: true,
      })
        .select("name location city state pricePerNight description")
        .sort({ rating: -1 });
    } else {
      // Fetch hotels near any of the selected sites (by nearbySites or by city/state)
      const hotelQuery: any = { isActive: true };
      hotelQuery.$or = [
        { nearbySites: { $in: resolvedSiteIds } },
        { city: site.city },
        { state: site.state },
      ];

      // Filter hotels by budget
      if (budget === "Budget") {
        hotelQuery["pricePerNight.max"] = { $lte: 3000 };
      } else if (budget === "Moderate") {
        hotelQuery["pricePerNight.max"] = { $lte: 8000 };
      }
      // Luxury: no price filter

      hotels = await Hotel.find(hotelQuery)
        .select("name location city state pricePerNight description")
        .limit(10)
        .sort({ rating: -1 });
    }

    // Fetch guides for any of the selected sites
    const guides = await Guide.find({
      isActive: true,
      sites: { $in: resolvedSiteIds },
    })
      .select("name specialization pricePerDay bio languages rating")
      .limit(10)
      .sort({ rating: -1 });

    // Fetch experiences (music shows and workshops) for any of the selected sites
    const experiences = await Experience.find({
      isActive: true,
      sites: { $in: resolvedSiteIds },
      type: { $in: ["music", "workshop"] },
    })
      .select("name type price description venue duration")
      .limit(10)
      .sort({ rating: -1 });

    // Generate itinerary using OpenAI
    const siteNamesStr = allSites.map(s => s.name).join(", ");
    const siteDescriptionsStr = allSites.map(s => `${s.name}: ${s.description}`).join("\n\n");
    const itinerary = await generateItinerary({
      siteName: siteNamesStr,
      siteLocation: site.location,
      siteDescription: siteDescriptionsStr,
      numberOfDays: Number(numberOfDays),
      budget: budget as "Budget" | "Moderate" | "Luxury",
      hotels: hotels.map((h) => ({
        _id: h._id.toString(),
        name: h.name,
        location: h.location,
        pricePerNight: h.pricePerNight,
        description: h.description,
      })),
      guides: guides.map((g) => ({
        _id: g._id.toString(),
        name: g.name,
        specialization: g.specialization,
        pricePerDay: g.pricePerDay,
        bio: g.bio,
        languages: g.languages,
        rating: g.rating,
      })),
      experiences: experiences.map((e) => ({
        _id: e._id.toString(),
        name: e.name,
        type: e.type as "music" | "workshop",
        price: e.price,
        description: e.description,
        venue: e.venue,
        duration: e.duration,
      })),
    });

    // Calculate start and end dates (using current date as start)
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + numberOfDays - 1);

    // Create the trip
    const tripName = allSites.length > 1
      ? `${site.city || site.location} Heritage Tour - ${numberOfDays} Days`
      : `${site.name} - ${numberOfDays} Day Trip`;
    const tripDescription = allSites.length > 1
      ? `AI-generated ${numberOfDays}-day itinerary covering ${siteNamesStr}`
      : `AI-generated ${numberOfDays}-day itinerary for ${site.name} in ${site.location}`;

    const trip = new Trip({
      clerkUserId: req.userId!,
      name: tripName,
      location: site.location,
      duration: `${numberOfDays} Days`,
      image: site.image,
      description: tripDescription,
      highlights: site.keyFacts.slice(0, 5),
      itinerary,
      budget: budget as "Budget" | "Moderate" | "Luxury",
      bestTimeToVisit: "Year-round",
      selectedSites: resolvedSiteIds,
      selectedHotels: [],
      selectedGuides: [],
      selectedExperiences: [],
      isAIGenerated: true,
      aiPrompt: `Generate a ${numberOfDays}-day ${budget} budget trip covering ${siteNamesStr}`,
      isFeatured: false,
      status: "draft",
      startDate,
      endDate,
    });

    await trip.save();

    // Populate the trip before returning
    const populatedTrip = await Trip.findById(trip._id)
      .populate("selectedSites", "name location image description")
      .populate("selectedHotels.hotelId", "name location images pricePerNight")
      .populate("selectedGuides.guideId", "name specialization bio rating languages")
      .populate("selectedGuides.siteId", "name location")
      .populate("selectedExperiences.experienceId", "name type price description");

    res.status(201).json(populatedTrip);
  } catch (error: any) {
    console.error("Error generating trip:", error);
    res.status(500).json({ error: error.message || "Failed to generate trip itinerary" });
  }
});

// POST /api/trips/:id/edit - Edit trip itinerary with custom prompt
router.post("/:id/edit", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { customPrompt } = req.body;

    if (!customPrompt || typeof customPrompt !== "string" || customPrompt.trim().length === 0) {
      return res.status(400).json({ error: "customPrompt is required and must be a non-empty string" });
    }

    const trip = await Trip.findById(req.params.id)
      .populate("selectedSites", "name location")
      .populate("selectedHotels.hotelId", "name location")
      .populate("selectedGuides.guideId", "name specialization")
      .populate("selectedExperiences.experienceId", "name type");

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Only allow users to edit their own trips
    if (trip.clerkUserId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized: You can only edit your own trips" });
    }

    if (!trip.isAIGenerated) {
      return res.status(400).json({ error: "This trip was not AI-generated and cannot be edited with AI" });
    }

    // Get site information for context
    const site = trip.selectedSites[0];
    if (!site || typeof site === "string") {
      return res.status(400).json({ error: "Trip must have at least one selected site" });
    }

    const siteName = (site as any).name || "the heritage site";
    const siteLocation = (site as any).location || trip.location;

    // Calculate number of days from start and end dates
    let numberOfDays = trip.itinerary.length;
    if (trip.startDate && trip.endDate) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      numberOfDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    // Edit itinerary using OpenAI
    const updatedItinerary = await editItinerary({
      existingItinerary: trip.itinerary,
      customPrompt: customPrompt.trim(),
      siteName,
      siteLocation,
      numberOfDays,
      budget: trip.budget,
    });

    // Update the trip
    trip.itinerary = updatedItinerary;
    trip.aiPrompt = trip.aiPrompt ? `${trip.aiPrompt}\n\nEdit: ${customPrompt}` : `Edit: ${customPrompt}`;
    trip.updatedAt = new Date();

    await trip.save();

    // Populate the trip before returning
    const populatedTrip = await Trip.findById(trip._id)
      .populate("selectedSites", "name location image description")
      .populate("selectedHotels.hotelId", "name location images pricePerNight")
      .populate("selectedGuides.guideId", "name specialization bio rating languages")
      .populate("selectedGuides.siteId", "name location")
      .populate("selectedExperiences.experienceId", "name type price description");

    res.json(populatedTrip);
  } catch (error: any) {
    console.error("Error editing trip:", error);
    res.status(500).json({ error: error.message || "Failed to edit trip itinerary" });
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

