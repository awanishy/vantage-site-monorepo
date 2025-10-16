import { Router } from "express";
import {
  getUserProfile,
  updateProfile,
  uploadMiddleware,
} from "@/users/controllers/user.controller";
import { authorize } from "@/middlewares/authorize";

const router = Router();

// Public user routes
router.get("/:userId/profile", getUserProfile);

// Protected user routes (require authentication)
router.put("/:userId/profile", authorize(), uploadMiddleware, updateProfile);

export default router;
