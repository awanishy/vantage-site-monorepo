import { Router } from "express";
import {
  signup,
  login,
  checkAuth,
  logout,
  verifyEmail,
  resendOTP,
} from "@/users/controllers/auth.controller";
import {
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "@/users/controllers/passwordReset.controller";
import { createGuestUser } from "@/users/controllers/user.controller";

const router = Router();

// Authentication routes (public)
router.post("/signup", signup);
router.post("/guest/user", createGuestUser);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", checkAuth);

// Email verification routes (public)
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendOTP);

// Password reset routes (public)
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

export default router;
