import express from "express";
import type { Request, Response } from "express";
import Experience from "../models/Experience";
import { optionalAuth } from "../middleware/auth";
import { resolveCityToSiteIds } from "../utils/cityFilter";

const router = express.Router();

// GET /api/experiences - Get all experiences (with filters)
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const {
      type, siteId, minRating, minPrice, maxPrice, skillLevel,
      instrumentId, artFormId, cityId,
      all, limit = 50, skip = 0,
    } = req.query;

    const query: any = {};
    if (all !== "true") query.isActive = true;
    if (type) query.type = type;
    if (siteId) query.sites = siteId;
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (skillLevel) query.skillLevel = skillLevel;
    if (instrumentId) query.instruments = instrumentId;
    if (artFormId) query.artForms = artFormId;

    if (cityId && !siteId) {
      const siteIds = await resolveCityToSiteIds(cityId as string);
      const cityConditions: Record<string, unknown>[] = [
        { city: cityId },
        { workshopCity: cityId },
      ];
      if (siteIds.length > 0) {
        cityConditions.push({ sites: { $in: siteIds } });
      }
      query.$or = cityConditions;
    }

    const experiences = await Experience.find(query)
      .populate("sites", "name location city state")
      .populate("guideId", "name specialization rating")
      .populate("instruments", "name category")
      .populate("artForms", "name category")
      .populate("city", "name state")
      .populate("workshopCity", "name state")
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ rating: -1, reviewCount: -1 });

    const total = await Experience.countDocuments(query);
    res.json({ experiences, total, limit: Number(limit), skip: Number(skip) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/experiences/:id
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate("sites", "name location image")
      .populate("guideId", "name specialization bio rating languages")
      .populate("instruments", "name category origin description")
      .populate("artForms", "name category origin description")
      .populate("city", "name state")
      .populate("workshopCity", "name state");
    if (!experience) return res.status(404).json({ error: "Experience not found" });
    res.json(experience);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/experiences
router.post("/", async (req: Request, res: Response) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    res.status(201).json(experience);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/experiences/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!experience) return res.status(404).json({ error: "Experience not found" });
    res.json(experience);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/experiences/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) return res.status(404).json({ error: "Experience not found" });
    res.json({ message: "Experience deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
