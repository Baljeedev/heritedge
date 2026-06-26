import express from "express";
import type { Request, Response } from "express";
import Booking from "../models/Booking";
import { authenticateUser, optionalAuth } from "../middleware/auth";

const router = express.Router();

// GET /api/bookings - Get all bookings (user's own bookings or all for admin)
router.get("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { status, bookingType, all, providerEmail } = req.query;

    const query: any = {};
    
    // If providerEmail is provided, fetch bookings for that provider
    if (providerEmail) {
      // We'll need to populate and filter after fetching
      const allBookings = await Booking.find({})
        .populate("guideId", "name specialization image rating email")
        .populate("experienceId", "name type image price email")
        .sort({ createdAt: -1 });

      // Filter bookings where the provider's email matches
      const filteredBookings = allBookings.filter((booking) => {
        if (booking.bookingType === "guide" && booking.guideId) {
          const guide = booking.guideId as any;
          return guide.email === providerEmail;
        }
        if ((booking.bookingType === "music" || booking.bookingType === "workshop") && booking.experienceId) {
          const experience = booking.experienceId as any;
          return experience.email === providerEmail;
        }
        return false;
      });

      // Apply additional filters
      let result = filteredBookings;
      if (status) {
        result = result.filter((b) => b.status === status);
      }
      if (bookingType) {
        result = result.filter((b) => b.bookingType === bookingType);
      }

      return res.json({ bookings: result });
    }
    
    // If 'all' is not set, only return user's own bookings
    if (all !== "true") {
      query.userId = req.userId;
    }

    if (status) query.status = status;
    if (bookingType) query.bookingType = bookingType;

    const bookings = await Booking.find(query)
      .populate("guideId", "name specialization image rating email")
      .populate("experienceId", "name type image price email")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/bookings/:id - Get a specific booking
router.get("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("guideId", "name specialization image bio rating languages")
      .populate("experienceId", "name type image price description duration venue");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if user owns the booking or is admin
    if (booking.userId !== req.userId) {
      // TODO: Add admin check
      // For now, allow access (admin dashboard will use this)
    }

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/bookings - Create a new booking
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const {
      bookingType,
      guideId,
      experienceId,
      bookingDate,
      numberOfPeople,
      contactName,
      contactEmail,
      contactPhone,
      notes,
    } = req.body;

    // Validate required fields
    if (!bookingType || !["guide", "music", "workshop"].includes(bookingType)) {
      return res.status(400).json({ error: "Invalid booking type" });
    }

    if (bookingType === "guide" && !guideId) {
      return res.status(400).json({ error: "Guide ID is required for guide bookings" });
    }

    if ((bookingType === "music" || bookingType === "workshop") && !experienceId) {
      return res.status(400).json({ error: "Experience ID is required for experience bookings" });
    }

    if (!bookingDate || !numberOfPeople || !contactName || !contactEmail || !contactPhone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = new Booking({
      userId: req.userId!,
      bookingType,
      guideId: bookingType === "guide" ? guideId : undefined,
      experienceId: bookingType !== "guide" ? experienceId : undefined,
      bookingDate: new Date(bookingDate),
      numberOfPeople: Number(numberOfPeople),
      contactName,
      contactEmail,
      contactPhone,
      notes,
      status: "pending",
    });

    await booking.save();
    
    // Populate references before returning
    await booking.populate("guideId", "name specialization image rating");
    await booking.populate("experienceId", "name type image price");

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/bookings/:id - Update booking (status update, etc.)
router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if user owns the booking or is admin
    if (booking.userId !== req.userId) {
      // TODO: Add admin check
      // For now, allow updates (admin dashboard will use this)
    }

    // Only allow updating certain fields
    const allowedUpdates = ["status", "notes", "bookingDate", "numberOfPeople", "contactName", "contactEmail", "contactPhone"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates" });
    }

    Object.assign(booking, req.body);
    await booking.save();

    await booking.populate("guideId", "name specialization image rating");
    await booking.populate("experienceId", "name type image price");

    res.json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/bookings/:id - Cancel/delete booking
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if user owns the booking or is admin
    if (booking.userId !== req.userId) {
      // TODO: Add admin check
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Instead of deleting, mark as cancelled
    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
