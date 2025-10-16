import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  updateUserRole,
  deleteUser,
  getPendingUsers,
  bulkActivateUsers,
} from "@/users/controllers/userManagement.controller";
import { adminAuth, superAdminAuth } from "@/middlewares/authorize";

const router = Router();

// All routes require admin authentication
router.use(adminAuth);

// Get all users with pagination and filtering
router.get("/", getAllUsers);

// Get pending users (verified but not active)
router.get("/pending", getPendingUsers);

// Get user by ID
router.get("/:userId", getUserById);

// Toggle user active status
router.patch("/:userId/toggle-status", toggleUserStatus);

// Update user role (requires admin auth)
router.patch("/:userId/role", updateUserRole);

// Delete user (soft delete)
router.delete("/:userId", deleteUser);

// Bulk activate users (requires super admin auth)
router.post("/bulk-activate", superAdminAuth, bulkActivateUsers);

export default router;
