import express from "express";
import type { Request, Response } from "express";
import Guide from "../models/Guide";
import HeritageSite from "../models/HeritageSite";
import { authenticateUser, optionalAuth } from "../middleware/auth";

const router = express.Router();
const SITE_POPULATE_FIELDS = "name location city state image";
const CITY_POPULATE_FIELDS = "name state";

const ALLOWED_GUIDE_UPDATE_FIELDS = [
  "name",
  "image",
  "video",
  "specialization",
  "sites",
  "cities",
  "bio",
  "experience",
  "pricePerDay",
  "languages",
  "certifications",
  "isIntern",
  "age",
  "internshipStatus",
  "internshipTestScore",
  "email",
  "whatsappNumber",
  "isActive",
] as const;

function pickAllowedGuideFields(body: Record<string, unknown>) {
  const updates: Record<string, unknown> = {};
  for (const field of ALLOWED_GUIDE_UPDATE_FIELDS) {
    if (field in body) {
      updates[field] = body[field];
    }
  }
  return updates;
}

// GET /api/guides - Get all guides (with filters)
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const {
      siteId,
      cityId,
      search,
      specialization,
      minRating,
      minPrice,
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

    if (siteId) {
      const site = await HeritageSite.findById(siteId).select("name").lean();
      if (site?.name) {
        const terms = [
          site.name.trim(),
          site.name.replace(/\s*\([^)]*\)/g, "").trim(),
        ].filter(Boolean);
        const uniqueTerms = [...new Set(terms)];
        query.$or = [
          { sites: siteId },
          ...uniqueTerms.map((term) => ({
            specialization: {
              $regex: term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
              $options: "i",
            },
          })),
        ];
      } else {
        query.sites = siteId;
      }
    }

    if (cityId) {
      query.cities = cityId;
    }

    if (search) {
      const matchingSites = await HeritageSite.find({
        $text: { $search: search as string },
      }).distinct("_id");
      query.$or = [
        { $text: { $search: search as string } },
        { sites: { $in: matchingSites } },
      ];
    } else if (specialization) {
      const escaped = (specialization as string)
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (escaped) {
        // Match start of full string or start of a comma/semicolon-separated segment
        query.specialization = {
          $regex: `(^|[,;|]\\s*)${escaped}`,
          $options: "i",
        };
      }
    }

    if (minRating) query.rating = { $gte: Number(minRating) };

    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    if (languages) {
      query.languages = { $in: (languages as string).split(",") };
    }
    if (isIntern === "true") query.isIntern = true;
    if (isIntern === "false") query.isIntern = false;
    if (verifiedOnly === "true") {
      query["certifications.verified"] = true;
    }

    const guides = await Guide.find(query)
      .populate("sites", SITE_POPULATE_FIELDS)
      .populate("cities", CITY_POPULATE_FIELDS)
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
    console.error("Error fetching guides:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/guides/:id/leads - Record a contact lead (public)
router.post("/:id/leads", async (req: Request, res: Response) => {
  try {
    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { $inc: { leadCount: 1 } },
      { new: true }
    );
    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }
    res.json({ leadCount: guide.leadCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/guides/:id - Get a specific guide
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const guide = await Guide.findById(req.params.id)
      .populate("sites", SITE_POPULATE_FIELDS)
      .populate("cities", CITY_POPULATE_FIELDS);
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
    const updates = pickAllowedGuideFields(req.body);

    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("sites", SITE_POPULATE_FIELDS)
      .populate("cities", CITY_POPULATE_FIELDS);

    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

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

