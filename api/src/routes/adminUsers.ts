import express, { Request, Response } from "express";
import AdminUser from "../models/AdminUser";

const router = express.Router();

// GET /api/admin-users - List all admin users (admin only)
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await AdminUser.find().sort({ role: 1, createdAt: -1 });
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin-users/check/:clerkUserId - Check if a user has admin/manager access
router.get("/check/:clerkUserId", async (req: Request, res: Response) => {
  try {
    const user = await AdminUser.findOne({
      clerkUserId: req.params.clerkUserId,
      isActive: true,
    });
    if (!user) return res.json({ authorized: false, role: null });
    res.json({ authorized: true, role: user.role, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin-users - Add a new manager (admin only)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { clerkUserId, email, name, role = "manager", addedBy } = req.body;
    const existing = await AdminUser.findOne({ $or: [{ clerkUserId }, { email }] });
    if (existing) {
      return res.status(400).json({ error: "User already has admin/manager access" });
    }
    const user = new AdminUser({ clerkUserId, email, name, role, addedBy, isActive: true });
    await user.save();
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/admin-users/:id - Update a user's role or status (admin only)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const user = await AdminUser.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: "Admin user not found" });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/admin-users/:id - Remove manager access (admin only)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user = await AdminUser.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "Admin user not found" });
    res.json({ message: "Admin user removed successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
