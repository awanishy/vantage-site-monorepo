// user.controller.ts
import { Request, Response } from "express";
import { User } from "@users/user.model";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { EmailTemplateService } from "@/config/email/templates/emailTemplates.config";
import {
  CreateGuestUserRequest,
  CreateGuestUserResponse,
  GetOrCreateGuestUserResponse,
  UserProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  IUser,
} from "@/types/users/user.types";

/**
 * Get user posts with pagination
 */
// Removed blog getUserPosts

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = ["uploads/avatars", "uploads/covers"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Initialize directories
ensureUploadDirs();

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/avatars";
    if (file.fieldname === "coverImage") {
      uploadPath = "uploads/covers";
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Middleware for handling file uploads
export const uploadMiddleware = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

/**
 * Get user profile with stats
 */
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("name phone userType role isActive isVerified lastLoginAt")
      .lean();

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Get user stats
    const postsCount = 0;
    const followersCount = 0;
    const followingCount = 0;

    res.status(200).json({
      success: true,
      data: {
        ...user,
        stats: {
          postsCount,
          followersCount,
          followingCount,
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Update User Profile
 */
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { name, email, phone, currentPassword, newPassword } = req.body;
    const files =
      (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check if email is being changed and if it's available
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: "Email already taken",
        });
        return;
      }
    }

    // Handle password change
    if (currentPassword && newPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
        return;
      }

      user.password = await bcrypt.hash(newPassword, 12);
    }

    // Handle file uploads
    // File uploads removed

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ============================================================================
// GUEST USER MANAGEMENT
// ============================================================================

/**
 * Create or reactivate guest user
 */
export const createGuestUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, name, phone }: CreateGuestUserRequest = req.body;

    // Validate required fields
    if (!email || !name) {
      res.status(400).json({
        success: false,
        message: "Email and name are required",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // If user exists and is not a guest, return error
      if (existingUser.userType !== "STUDENT" || existingUser.isActive) {
        res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
        return;
      }

      // If user exists but is inactive (guest), reactivate them (but don't change password or send email)
      existingUser.isActive = true;
      existingUser.isVerified = false;
      existingUser.name = name;
      existingUser.phone = phone || "";
      existingUser.userType = "STUDENT";
      existingUser.role = "STUDENT";

      await existingUser.save();

      const response: CreateGuestUserResponse = {
        userId: (existingUser._id as any).toString(),
        email: existingUser.email,
        name: existingUser.name,
        isGuest: true,
        message: "Guest user reactivated (using existing credentials)",
      };

      res.status(200).json({
        success: true,
        data: response,
      });
      return;
    }

    // Create new guest user
    const tempPassword = crypto.randomBytes(8).toString("hex");
    const guestUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: tempPassword,
      phone: phone || "",
      userType: "STUDENT",
      role: "STUDENT",
      isActive: true,
      isVerified: false,
    });

    // Send credentials email
    try {
      await EmailTemplateService.sendTemplatedEmail({
        templateType: "guest_credentials",
        to: email,
        subject: "Your Vantage Institute Account Credentials",
        data: {
          name: name,
          email: email,
          password: tempPassword,
          loginUrl: `${process.env.FRONTEND_URL}/login`,
        },
      });
    } catch (emailError) {
      console.error("Failed to send guest credentials email:", emailError);
      // Don't fail the request if email fails
    }

    const response: CreateGuestUserResponse = {
      userId: (guestUser._id as any).toString(),
      email: guestUser.email,
      name: guestUser.name,
      isGuest: true,
      message: "Guest user created and credentials sent to email",
    };

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Create guest user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create guest user",
      error: error.message,
    });
  }
};

/**
 * Get or create guest user (internal method for payment handlers)
 */
export const getOrCreateGuestUser = async (
  email: string,
  name: string,
  phone?: string
): Promise<GetOrCreateGuestUserResponse> => {
  // Check if user already exists
  let user = await User.findOne({ email: email.toLowerCase() });
  let isNewUser = false;

  if (!user) {
    // Create new guest user
    const tempPassword = crypto.randomBytes(8).toString("hex");
    user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: tempPassword,
      phone: phone || "",
      userType: "STUDENT",
      role: "STUDENT",
      isActive: true,
      isVerified: false,
    });
    isNewUser = true;

    // Send credentials email
    try {
      await EmailTemplateService.sendTemplatedEmail({
        templateType: "guest_credentials",
        to: email,
        subject: "Your Vantage Institute Account Credentials",
        data: {
          name: name,
          email: email,
          password: tempPassword,
          loginUrl: `${process.env.FRONTEND_URL}/login`,
        },
      });
    } catch (emailError) {
      console.error("Failed to send guest credentials email:", emailError);
      // Don't fail the request if email fails
    }
  } else if (user.userType !== "STUDENT" || !user.isActive) {
    // Reactivate existing user if needed (but don't change password or send email)
    user.isActive = true;
    user.isVerified = false;
    user.name = name;
    user.phone = phone || "";
    user.userType = "STUDENT";
    user.role = "STUDENT";

    await user.save();
    // Note: No password change or email sending for existing users
  }

  return { user, isNewUser };
};
