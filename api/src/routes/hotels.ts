import express from "express";
import type { Request, Response } from "express";
import Hotel from "../models/Hotel";
import { optionalAuth } from "../middleware/auth";

const router = express.Router();

// GET /api/hotels - Get all hotels (with filters)
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const {
      city,
      state,
      siteId,
      chain,
      minRating,
      maxPrice,
      hasLivingHistory,
      hasHistoryLectures,
      hasCulturalMeals,
      all, // If true, include inactive hotels (for admin)
      limit = 50,
      skip = 0,
    } = req.query;

    const query: any = {};
    // Only filter by isActive if 'all' parameter is not set
    if (all !== "true") {
      query.isActive = true;
    }

    if (city) query.city = city;
    if (state) query.state = state;
    if (chain) query.chain = chain;
    if (siteId) query.nearbySites = siteId;
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (maxPrice) query["pricePerNight.max"] = { $lte: Number(maxPrice) };
    if (hasLivingHistory === "true")
      query["heritageFeatures.hasLivingHistoryRooms"] = true;
    if (hasHistoryLectures === "true")
      query["heritageFeatures.hasHistoryLectures"] = true;
    if (hasCulturalMeals === "true")
      query["heritageFeatures.hasCulturalMeals"] = true;

    const hotels = await Hotel.find(query)
      .populate("nearbySites", "name location")
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ rating: -1, reviewCount: -1 });

    const total = await Hotel.countDocuments(query);

    res.json({
      hotels,
      total,
      limit: Number(limit),
      skip: Number(skip),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/hotels/nearby - Get hotels near a location or site
router.get("/nearby", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, siteId, maxDistance = 50000 } = req.query;

    const query: any = { isActive: true };

    if (siteId) {
      query.nearbySites = siteId;
    }

    if (latitude && longitude) {
      query.coordinates = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: Number(maxDistance),
        },
      };
    }

    const hotels = await Hotel.find(query)
      .populate("nearbySites", "name location")
      .limit(20);

    res.json({ hotels });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/hotels/:id - Get a specific hotel
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate(
      "nearbySites",
      "name location image"
    );
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/hotels - Create a new hotel (Admin/Hotel Partner only)
router.post("/", async (req: Request, res: Response) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/hotels/:id - Update hotel
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/hotels/:id - Delete hotel
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json({ message: "Hotel deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

