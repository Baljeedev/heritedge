import express, { Request, Response } from "express";
import Instrument from "../models/Instrument";
import { optionalAuth } from "../middleware/auth";

const router = express.Router();

// GET /api/instruments
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { search, category, isActive, limit = 200, skip = 0 } = req.query;
    const query: any = {};
    if (search) query.$text = { $search: search as string };
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const instruments = await Instrument.find(query)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ category: 1, name: 1 });

    const total = await Instrument.countDocuments(query);
    res.json({ instruments, total });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/instruments/:id
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const instrument = await Instrument.findById(req.params.id);
    if (!instrument) return res.status(404).json({ error: "Instrument not found" });
    res.json(instrument);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/instruments
router.post("/", async (req: Request, res: Response) => {
  try {
    const instrument = new Instrument(req.body);
    await instrument.save();
    res.status(201).json(instrument);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/instruments/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const instrument = await Instrument.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!instrument) return res.status(404).json({ error: "Instrument not found" });
    res.json(instrument);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/instruments/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const instrument = await Instrument.findByIdAndDelete(req.params.id);
    if (!instrument) return res.status(404).json({ error: "Instrument not found" });
    res.json({ message: "Instrument deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
