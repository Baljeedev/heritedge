import express from "express";
import type { Request, Response } from "express";
import ArtForm from "../models/ArtForm";
import { optionalAuth } from "../middleware/auth";

const router = express.Router();

// GET /api/art-forms
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { search, category, isActive, limit = 200, skip = 0 } = req.query;
    const query: any = {};
    if (search) query.$text = { $search: search as string };
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const artForms = await ArtForm.find(query)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ category: 1, name: 1 });

    const total = await ArtForm.countDocuments(query);
    res.json({ artForms, total });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/art-forms/:id
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const artForm = await ArtForm.findById(req.params.id);
    if (!artForm) return res.status(404).json({ error: "Art form not found" });
    res.json(artForm);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/art-forms
router.post("/", async (req: Request, res: Response) => {
  try {
    const artForm = new ArtForm(req.body);
    await artForm.save();
    res.status(201).json(artForm);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/art-forms/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const artForm = await ArtForm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!artForm) return res.status(404).json({ error: "Art form not found" });
    res.json(artForm);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/art-forms/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const artForm = await ArtForm.findByIdAndDelete(req.params.id);
    if (!artForm) return res.status(404).json({ error: "Art form not found" });
    res.json({ message: "Art form deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
