import express from "express";
import type { Request, Response } from "express";
import City from "../models/City";
import { optionalAuth } from "../middleware/auth";

const router = express.Router();

// GET /api/cities
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { search, state, isActive, limit = 200, skip = 0 } = req.query;
    const query: any = {};
    if (search) query.$text = { $search: search as string };
    if (state) query.state = state;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const cities = await City.find(query)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ state: 1, name: 1 });

    const total = await City.countDocuments(query);
    res.json({ cities, total });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cities/:id
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ error: "City not found" });
    res.json(city);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cities
router.post("/", async (req: Request, res: Response) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json(city);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/cities/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!city) return res.status(404).json({ error: "City not found" });
    res.json(city);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/cities/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ error: "City not found" });
    res.json({ message: "City deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
