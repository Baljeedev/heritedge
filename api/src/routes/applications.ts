import express from "express";
import type { Request, Response } from "express";
import Application from "../models/Application";
import Guide from "../models/Guide";
import Hotel from "../models/Hotel";
import Experience from "../models/Experience";
import { authenticateUser } from "../middleware/auth";

const router = express.Router();

// GET /api/applications/check-status - Check if user is registered as guide/hotel/experience
router.get("/check-status", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const email = req.user?.primaryEmailAddress?.emailAddress || "";

    // Check if user is registered as guide
    const guide = await Guide.findOne({ clerkUserId: userId, isActive: true });
    
    // Check if user is registered as hotel (by email)
    const hotel = await Hotel.findOne({ email: email, isActive: true });
    
    // Check if user is registered as experience (by email)
    const experience = await Experience.findOne({ email: email, isActive: true });

    // Check for pending applications
    const pendingApplication = await Application.findOne({
      clerkUserId: userId,
      status: "pending",
    });

    res.json({
      isGuide: !!guide,
      isHotel: !!hotel,
      isExperience: !!experience,
      guideId: guide?._id,
      hotelId: hotel?._id,
      experienceId: experience?._id,
      hasPendingApplication: !!pendingApplication,
      pendingApplicationType: pendingApplication?.type,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/applications - Submit a new application
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const email = req.user?.primaryEmailAddress?.emailAddress || "";
    const { type, applicationData } = req.body;

    if (!type || !["guide", "hotel", "experience"].includes(type)) {
      return res.status(400).json({ error: "Invalid application type" });
    }

    // Check if user already has a pending application
    const existingPending = await Application.findOne({
      clerkUserId: userId,
      status: "pending",
    });

    if (existingPending) {
      return res.status(400).json({
        error: "You already have a pending application",
        applicationId: existingPending._id,
      });
    }

    // Check if user is already registered
    if (type === "guide") {
      const existingGuide = await Guide.findOne({ clerkUserId: userId, isActive: true });
      if (existingGuide) {
        return res.status(400).json({ error: "You are already registered as a guide" });
      }
    } else if (type === "hotel") {
      const existingHotel = await Hotel.findOne({ email: email, isActive: true });
      if (existingHotel) {
        return res.status(400).json({ error: "You are already registered as a hotel" });
      }
    } else if (type === "experience") {
      const existingExperience = await Experience.findOne({ email: email, isActive: true });
      if (existingExperience) {
        return res.status(400).json({ error: "You are already registered as an experience" });
      }
    }

    const application = new Application({
      type,
      clerkUserId: userId,
      email,
      applicationData,
      status: "pending",
      submittedAt: new Date(),
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application: application,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/applications - Get all applications (admin only)
router.get("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { status, type } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const applications = await Application.find(query)
      .sort({ submittedAt: -1 })
      .limit(100);

    res.json({ applications });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/applications/:id - Get a specific application
router.get("/:id", authenticateUser, async (req: Request, res: Response) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Users can only view their own applications unless admin
    if (application.clerkUserId !== req.userId) {
      // TODO: Add admin check
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ application });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/applications/:id/approve - Approve an application
router.post("/:id/approve", authenticateUser, async (req: Request, res: Response) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.status !== "pending") {
      return res.status(400).json({ error: "Application is not pending" });
    }

    // Create the actual record based on application type
    if (application.type === "guide") {
      const guideData = application.applicationData;
      const guide = new Guide({
        clerkUserId: application.clerkUserId,
        name: guideData.name,
        image: guideData.image || "",
        video: guideData.video,
        specialization: guideData.specialization,
        sites: guideData.sites || [],
        cities: guideData.cities || [],
        bio: guideData.bio,
        experience: guideData.experience || 0,
        pricePerDay: guideData.pricePerDay,
        languages: guideData.languages || [],
        certifications: guideData.certifications || [],
        isIntern: guideData.isIntern || false,
        age: guideData.age,
        email: application.email,
        isActive: true,
        rating: 0,
        reviewCount: 0,
      });
      await guide.save();
    } else if (application.type === "hotel") {
      const hotelData = application.applicationData;
      const hotel = new Hotel({
        name: hotelData.name,
        chain: hotelData.chain,
        location: hotelData.location,
        city: hotelData.city,
        state: hotelData.state,
        country: hotelData.country || "India",
        coordinates: hotelData.coordinates,
        images: hotelData.images || [],
        pricePerNight: hotelData.pricePerNight,
        description: hotelData.description,
        amenities: hotelData.amenities || [],
        roomTypes: hotelData.roomTypes || [],
        heritageFeatures: hotelData.heritageFeatures || {
          hasLivingHistoryRooms: false,
          hasHistoryLectures: false,
          hasCulturalMeals: false,
          hasStorytellingEvenings: false,
        },
        nearbySites: hotelData.nearbySites || [],
        partnershipType: hotelData.partnershipType || "listing",
        listingFee: hotelData.listingFee,
        referralFee: hotelData.referralFee,
        discountPercentage: hotelData.discountPercentage || 0,
        email: application.email,
        isActive: true,
        rating: 0,
        reviewCount: 0,
      });
      await hotel.save();
    } else if (application.type === "experience") {
      const experienceData = application.applicationData;
      const experience = new Experience({
        type: experienceData.type || "music",
        name: experienceData.name,
        image: experienceData.image,
        video: experienceData.video,
        sites: experienceData.sites || [],
        price: experienceData.price,
        description: experienceData.description,
        duration: experienceData.duration,
        venue: experienceData.venue,
        performers: experienceData.performers,
        genre: experienceData.genre,
        schedule: experienceData.schedule,
        instructor: experienceData.instructor,
        skillLevel: experienceData.skillLevel,
        materialsIncluded: experienceData.materialsIncluded,
        maxParticipants: experienceData.maxParticipants,
        topics: experienceData.topics,
        guideId: experienceData.guideId,
        email: application.email,
        isActive: true,
        rating: 0,
        reviewCount: 0,
      });
      await experience.save();
    }

    // Update application status
    application.status = "approved";
    application.reviewedAt = new Date();
    application.reviewedBy = req.userId;
    await application.save();

    res.json({
      message: "Application approved and record created",
      application: application,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/applications/:id/reject - Reject an application
router.post("/:id/reject", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { rejectionReason } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.status !== "pending") {
      return res.status(400).json({ error: "Application is not pending" });
    }

    application.status = "rejected";
    application.reviewedAt = new Date();
    application.reviewedBy = req.userId;
    if (rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    await application.save();

    res.json({
      message: "Application rejected",
      application: application,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
