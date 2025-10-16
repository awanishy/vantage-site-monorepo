// ============================================================================
// USER TYPES
// ============================================================================

import { Document } from "mongoose";

// Define user types and roles
export type UserType = "STUDENT" | "ADMIN";
export type UserRole = "STUDENT" | "ADMIN" | "SUPER_ADMIN" | "GUEST";

// Define OTP Token interface
export interface IOTPToken {
  _id?: any;
  token: string;
  purpose: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType: UserType;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: Date;
  otpTokens: IOTPToken[];
  createdAt: Date;
  updatedAt: Date;
  createOTP(purpose: "email" | "phone"): Promise<string>;
  verifyOTP(purpose: string, otp: string): Promise<boolean>;
}

export interface CreateGuestUserRequest {
  email: string;
  name: string;
  phone?: string;
}

export interface CreateGuestUserResponse {
  userId: string;
  email: string;
  name: string;
  isGuest: boolean;
  message: string;
}

export interface GetOrCreateGuestUserResponse {
  user: IUser;
  isNewUser: boolean;
}

export interface UserProfileResponse {
  _id: string;
  name: string;
  phone: string;
  userType: "STUDENT" | "ADMIN";
  role: "STUDENT" | "ADMIN" | "SUPER_ADMIN" | "GUEST";
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: Date;
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  updatedUser: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}
