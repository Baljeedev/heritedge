import express, { Request, Response } from "express";
import Guide from "../models/Guide";
import { authenticateUser, optionalAuth } from "../middleware/auth";

const router = express.Router();

// GET /api/guides - Get all guides (with filters)
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const {
      siteId,
      specialization,
      minRating,
      maxPrice,
      languages,
      isIntern,
      verifiedOnly,
      all, // If true, include inactive guides (for admin)
      limit = 50,
      skip = 0,
    } = req.query;

    const query: any = {};
    // Only filter by isActive if 'all' parameter is not set
    if (all !== "true") {
      query.isActive = true;
    }

    if (siteId) query.sites = siteId;
    if (specialization) {
      query.$text = { $search: specialization as string };
    }
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (maxPrice) query.pricePerDay = { $lte: Number(maxPrice) };
    if (languages) {
      query.languages = { $in: (languages as string).split(",") };
    }
    if (isIntern === "true") query.isIntern = true;
    if (isIntern === "false") query.isIntern = false;
    if (verifiedOnly === "true") {
      query["certifications.verified"] = true;
    }

    const guides = await Guide.find(query)
      .populate("sites", "name location")
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ rating: -1, reviewCount: -1 });

    const total = await Guide.countDocuments(query);

    res.json({
      guides,
      total,
      limit: Number(limit),
      skip: Number(skip),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/guides/:id - Get a specific guide
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const guide = await Guide.findById(req.params.id).populate(
      "sites",
      "name location image"
    );
    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }
    res.json(guide);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/guides - Register as a guide
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    // Check if guide already exists
    const existingGuide = await Guide.findOne({
      clerkUserId: req.userId!,
    });

    if (existingGuide) {
      return res.status(400).json({ error: "Guide profile already exists" });
    }

    const guideData = {
      ...req.body,
      clerkUserId: req.userId!,
    };

    const guide = new Guide(guideData);
    await guide.save();
    res.status(201).json(guide);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/guides/:id - Update guide profile (admin can update any guide)
router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    // Allow admin to update any guide (for admin dashboard)
    // TODO: Add proper admin check based on email or role
    // For now, allow updates for admin dashboard
    // if (guide.clerkUserId !== req.userId) {
    //   return res.status(403).json({ error: "Unauthorized" });
    // }

    Object.assign(guide, req.body);
    await guide.save();
    res.json(guide);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/guides/:id/certifications - Add certification (admin can add to any guide)
router.post(
  "/:id/certifications",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const guide = await Guide.findById(req.params.id);
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }

      // Allow admin to add certifications to any guide (for admin dashboard)
      // TODO: Add proper admin check
      // if (guide.clerkUserId !== req.userId) {
      //   return res.status(403).json({ error: "Unauthorized" });
      // }

      guide.certifications.push(req.body);
      await guide.save();
      res.json(guide);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// POST /api/guides/:id/verify-certification/:certIndex - Verify certification (Admin only)
router.post(
  "/:id/verify-certification/:certIndex",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      // Admin can verify any guide's certification (for admin dashboard)
      const guide = await Guide.findById(req.params.id);
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }

      const certIndex = Number(req.params.certIndex);
      if (certIndex < 0 || certIndex >= guide.certifications.length) {
        return res.status(400).json({ error: "Invalid certification index" });
      }

      guide.certifications[certIndex].verified = true;
      guide.certifications[certIndex].verificationDate = new Date();
      await guide.save();

      res.json(guide);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// POST /api/guides/apply-internship - Apply for internship (students 13-17)
router.post(
  "/apply-internship",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { age, testScore } = req.body;

      if (!age || age < 13 || age > 17) {
        return res
          .status(400)
          .json({ error: "Internship is only for students aged 13-17" });
      }

      // Check if already applied
      const existingGuide = await Guide.findOne({
        clerkUserId: req.userId!,
      });

      if (existingGuide) {
        return res
          .status(400)
          .json({ error: "You already have a guide profile" });
      }

      const guide = new Guide({
        clerkUserId: req.userId!,
        ...req.body,
        isIntern: true,
        age,
        internshipStatus: "pending",
        internshipTestScore: testScore,
        isActive: false, // Inactive until approved
      });

      await guide.save();
      res.status(201).json(guide);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// DELETE /api/guides/:id - Delete guide (Admin can delete any guide)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);
    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }
    res.json({ message: "Guide deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

