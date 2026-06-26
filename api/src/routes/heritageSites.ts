import express from "express";
import type { Request, Response } from "express";
import HeritageSite from "../models/HeritageSite";
import { optionalAuth } from "../middleware/auth";

const router = express.Router();

// GET /api/heritage-sites - Get all heritage sites (with optional filters)
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const {
      search,
      city,
      state,
      status,
      unesco,
      minRating,
      limit = 50,
      skip = 0,
    } = req.query;

    const query: any = {};

    if (search) {
      query.$text = { $search: search as string };
    }
    if (city) query.city = city;
    if (state) query.state = state;
    if (status) query.status = status;
    if (unesco === "true") query.unescoWorldHeritage = true;
    if (minRating) query.rating = { $gte: Number(minRating) };

    const sites = await HeritageSite.find(query)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ rating: -1, reviewCount: -1 });

    const total = await HeritageSite.countDocuments(query);

    res.json({
      sites,
      total,
      limit: Number(limit),
      skip: Number(skip),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/heritage-sites/nearby - Get sites near a location
router.get("/nearby", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, maxDistance = 50000 } = req.query; // maxDistance in meters

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "latitude and longitude are required" });
    }

    const sites = await HeritageSite.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: Number(maxDistance),
        },
      },
    }).limit(20);

    res.json({ sites });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/heritage-sites/:id - Get a specific heritage site
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const site = await HeritageSite.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ error: "Heritage site not found" });
    }
    res.json(site);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/heritage-sites - Create a new heritage site (Admin only - add admin check later)
router.post("/", async (req: Request, res: Response) => {
  try {
    const site = new HeritageSite(req.body);
    await site.save();
    res.status(201).json(site);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/heritage-sites/:id - Update a heritage site
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const site = await HeritageSite.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!site) {
      return res.status(404).json({ error: "Heritage site not found" });
    }
    res.json(site);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/heritage-sites/:id - Delete a heritage site
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const site = await HeritageSite.findByIdAndDelete(req.params.id);
    if (!site) {
      return res.status(404).json({ error: "Heritage site not found" });
    }
    res.json({ message: "Heritage site deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

