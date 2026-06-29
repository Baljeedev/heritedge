import express from "express";
import type { Request, Response } from "express";
import GuideTestimonial from "../models/GuideTestimonial";
import Guide from "../models/Guide";
import { optionalAuth } from "../middleware/auth";

const router = express.Router();

const GUIDE_POPULATE_FIELDS = "name image leadCount specialization cities";

async function getTotalLeads(): Promise<number> {
  const result = await Guide.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: "$leadCount" } } },
  ]);
  return result[0]?.total ?? 0;
}

// GET /api/guide-testimonials
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { all, limit = 100, skip = 0 } = req.query;
    const query: Record<string, unknown> = {};
    if (all !== "true") {
      query.isActive = true;
    }

    const testimonials = await GuideTestimonial.find(query)
      .populate("guideId", GUIDE_POPULATE_FIELDS)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ displayOrder: 1, createdAt: -1 });

    const total = await GuideTestimonial.countDocuments(query);
    const totalLeads = await getTotalLeads();

    res.json({ testimonials, total, totalLeads });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/guide-testimonials/:id
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const testimonial = await GuideTestimonial.findById(req.params.id).populate(
      "guideId",
      GUIDE_POPULATE_FIELDS
    );
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/guide-testimonials
router.post("/", async (req: Request, res: Response) => {
  try {
    const testimonial = new GuideTestimonial(req.body);
    await testimonial.save();
    await testimonial.populate("guideId", GUIDE_POPULATE_FIELDS);
    res.status(201).json(testimonial);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/guide-testimonials/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const testimonial = await GuideTestimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("guideId", GUIDE_POPULATE_FIELDS);

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/guide-testimonials/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const testimonial = await GuideTestimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
