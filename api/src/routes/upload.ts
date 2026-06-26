import express from "express";
import type { Request, Response } from "express";
import multer from "multer";
import { authenticateUser } from "../middleware/auth";
import { uploadToR2 } from "../services/r2-upload";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    const allowedMimes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      // Videos
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo", // .avi
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedMimes.join(", ")}`));
    }
  },
});

/**
 * POST /api/upload/:type
 * Upload a file to R2
 * @param type - Type of upload: "trip", "monument", "guide", "experience", "hotel", "review"
 */
router.post(
  "/:type",
  authenticateUser,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const { type } = req.params;
      const validTypes = ["trip", "monument", "guide", "experience", "hotel", "review"];

      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(", ")}` });
      }

      // Map type to folder name
      const folderMap: Record<string, string> = {
        trip: "trips",
        monument: "monuments",
        guide: "guides",
        experience: "experiences",
        hotel: "hotels",
        review: "reviews",
      };

      const folder = folderMap[type];
      const result = await uploadToR2(
        req.file.buffer,
        folder,
        req.file.originalname,
        req.file.mimetype
      );

      res.json({
        url: result.url,
        key: result.key,
        type: req.file.mimetype.startsWith("image/") ? "image" : "video",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload file" });
    }
  }
);

/**
 * POST /api/upload/:type/multiple
 * Upload multiple files to R2
 */
router.post(
  "/:type/multiple",
  authenticateUser,
  upload.array("files", 10), // Max 10 files
  async (req: Request, res: Response) => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ error: "No files provided" });
      }

      const { type } = req.params;
      const validTypes = ["trip", "monument", "guide", "experience", "hotel", "review"];

      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(", ")}` });
      }

      const folderMap: Record<string, string> = {
        trip: "trips",
        monument: "monuments",
        guide: "guides",
        experience: "experiences",
        hotel: "hotels",
        review: "reviews",
      };

      const folder = folderMap[type];
      const files = req.files as Express.Multer.File[];

      const uploadPromises = files.map((file) =>
        uploadToR2(file.buffer, folder, file.originalname, file.mimetype)
      );

      const results = await Promise.all(uploadPromises);

      res.json({
        files: results.map((result, index) => ({
          url: result.url,
          key: result.key,
          type: files[index].mimetype.startsWith("image/") ? "image" : "video",
          originalName: files[index].originalname,
        })),
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload files" });
    }
  }
);

export default router;