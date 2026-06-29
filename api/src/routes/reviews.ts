import express from "express";
import type { Request, Response } from "express";
import Review from "../models/Review";
import { authenticateUser, optionalAuth } from "../middleware/auth";
import HeritageSite from "../models/HeritageSite";
import Guide from "../models/Guide";
import Hotel from "../models/Hotel";
import Experience from "../models/Experience";

const router = express.Router();

// Helper function to update rating on target model
async function updateTargetRating(
  reviewType: string,
  targetId: string,
  rating: number,
  isDelete = false
) {
  const increment = isDelete ? -1 : 1;
  const ratingChange = isDelete ? -rating : rating;

  switch (reviewType) {
    case "site":
      await HeritageSite.findByIdAndUpdate(targetId, {
        $inc: {
          reviewCount: increment,
          rating: ratingChange,
        },
      });
      break;
    case "guide":
      await Guide.findByIdAndUpdate(targetId, {
        $inc: {
          reviewCount: increment,
          rating: ratingChange,
        },
      });
      break;
    case "hotel":
      await Hotel.findByIdAndUpdate(targetId, {
        $inc: {
          reviewCount: increment,
          rating: ratingChange,
        },
      });
      break;
    case "experience":
      await Experience.findByIdAndUpdate(targetId, {
        $inc: {
          reviewCount: increment,
          rating: ratingChange,
        },
      });
      break;
  }
}

// GET /api/reviews - Get reviews (with filters)
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const {
      reviewType,
      targetId,
      minRating,
      all, // If true, include hidden reviews (for admin)
      limit = 50,
      skip = 0,
    } = req.query;

    const query: any = {};
    // Guide reviews are public immediately; other types respect visibility
    if (all !== "true") {
      if (reviewType === "guide") {
        // show all guide reviews on the public site
      } else if (reviewType) {
        query.isVisible = true;
      } else {
        query.$or = [{ reviewType: "guide" }, { isVisible: true }];
      }
    }

    if (reviewType) query.reviewType = reviewType;
    if (targetId) query.targetId = targetId;
    if (minRating) query.rating = { $gte: Number(minRating) };

    const reviews = await Review.find(query)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      total,
      limit: Number(limit),
      skip: Number(skip),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reviews/:id - Get a specific review
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews - Create a new review
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { reviewType, targetId, rating, comment, images, visitDate, authorName, authorImage } =
      req.body;

    const resolvedAuthorName =
      (typeof authorName === "string" && authorName.trim()) ||
      [req.user?.firstName, req.user?.lastName].filter(Boolean).join(" ").trim() ||
      req.user?.username ||
      undefined;

    const resolvedAuthorImage =
      (typeof authorImage === "string" && authorImage.trim()) ||
      req.user?.imageUrl ||
      undefined;

    // Check if user already reviewed this item
    const existingReview = await Review.findOne({
      clerkUserId: req.userId!,
      reviewType,
      targetId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this item" });
    }

    const review = new Review({
      clerkUserId: req.userId!,
      authorName: resolvedAuthorName,
      authorImage: resolvedAuthorImage,
      reviewType,
      targetId,
      rating,
      comment,
      images,
      visitDate,
      isVisible: true,
    });

    await review.save();

    // Update rating on target model
    await updateTargetRating(reviewType, targetId, rating);

    res.status(201).json(review);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/reviews/:id - Update review (admin can update any review)
router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Allow admin to update any review (for admin dashboard)
    // TODO: Add proper admin check based on email or role
    // For now, allow updates for admin dashboard
    // if (review.clerkUserId !== req.userId) {
    //   return res.status(403).json({ error: "Unauthorized" });
    // }

    const oldRating = review.rating;
    Object.assign(review, req.body);
    await review.save();

    // Update rating if it changed
    if (req.body.rating && req.body.rating !== oldRating) {
      await updateTargetRating(
        review.reviewType,
        review.targetId.toString(),
        -oldRating,
        true
      );
      await updateTargetRating(
        review.reviewType,
        review.targetId.toString(),
        req.body.rating
      );
    }

    res.json(review);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/reviews/:id - Delete review (admin can delete any review)
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Allow admin to delete any review (for admin dashboard)
    // TODO: Add proper admin check based on email or role
    // For now, allow deletes for admin dashboard
    // if (review.clerkUserId !== req.userId) {
    //   return res.status(403).json({ error: "Unauthorized" });
    // }

    // Update rating on target model
    await updateTargetRating(
      review.reviewType,
      review.targetId.toString(),
      review.rating,
      true
    );

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews/:id/helpful - Mark review as helpful
router.post(
  "/:id/helpful",
  optionalAuth,
  async (req: Request, res: Response) => {
    try {
      const review = await Review.findByIdAndUpdate(
        req.params.id,
        { $inc: { helpfulCount: 1 } },
        { new: true }
      );
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

