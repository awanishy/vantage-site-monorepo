import mongoose, { Schema } from "mongoose";
import crypto from "crypto";
import { IUser, UserType, UserRole } from "@/types/users/user.types";

// Re-export types for convenience
export type { UserType, UserRole };

// Define the User schema for blog system
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // userName removed – we now authenticate with email only
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    userType: {
      type: String,
      enum: ["STUDENT", "ADMIN"],
      default: "STUDENT",
    },
    role: {
      type: String,
      enum: ["STUDENT", "ADMIN", "SUPER_ADMIN", "GUEST"],
      default: "STUDENT",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
    },
    // OTP storage for email verification
    otpTokens: [
      {
        token: String,
        purpose: String,
        expiresAt: Date,
        attempts: { type: Number, default: 0 },
        verified: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create indexes for commonly queried fields
// Note: email index is automatically created by unique: true
userSchema.index({ isActive: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isVerified: 1 });

// OTP Methods
userSchema.methods.createOTP = async function (
  purpose: "email" | "phone"
): Promise<string> {
  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Set expiration time (5 minutes from now)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Remove any existing OTPs for this purpose
  this.otpTokens = this.otpTokens.filter(
    (token: any) => token.purpose !== purpose
  );

  // Add new OTP
  this.otpTokens.push({
    token: otp,
    purpose,
    expiresAt,
    attempts: 0,
    verified: false,
  });

  await this.save();
  return otp;
};

userSchema.methods.verifyOTP = async function (
  purpose: string,
  otp: string
): Promise<boolean> {
  const otpToken = this.otpTokens.find(
    (token: any) =>
      token.purpose === purpose &&
      token.token === otp &&
      token.expiresAt > new Date() &&
      !token.verified
  );

  if (!otpToken) {
    return false;
  }

  // Mark as verified
  otpToken.verified = true;
  await this.save();

  return true;
};

// Create and export the User model
export const User = mongoose.model<IUser>("User", userSchema);
