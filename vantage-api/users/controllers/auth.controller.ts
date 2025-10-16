import { Request, Response, NextFunction } from "express";
import { User } from "@users/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { EmailTemplateService } from "@/config/email/templates/emailTemplates.config";

// Local JWT generator to avoid missing util imports
const generateToken = (payload: { userId: string; email: string }) => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

// File uploads removed from auth; signup accepts JSON only

/**
 * User Registration with Email Verification
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phone, bio, site } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        res.status(409).json({
          success: false,
          message: "User with this email already exists and is verified",
        });
        return;
      } else {
        // User exists but not verified, delete the old record and create new one
        await User.findByIdAndDelete(existingUser._id);
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // File uploads removed; set derived defaults

    // Create new user (active but not verified until email OTP)
    const newUser = new User({
      name,
      // no username field anymore
      email,
      password: hashedPassword,
      phone: phone || "",
      bio: bio || "",
      site: site || "",
      userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random&size=256`,
      coverImage: "",
      userType: "STUDENT",
      role: "STUDENT",
      isActive: true,
      isVerified: false,
      followingIDs: [],
      followersIDs: [],
      followingTags: [],
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
        role: newUser.role,
        isActive: newUser.isActive,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
};

/**
 * Verify Email with OTP
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    // Validate required fields
    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check if user is already verified
    if (user.isVerified) {
      res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
      return;
    }

    // Verify OTP
    const isValidOTP = await user.verifyOTP("email", otp);
    if (!isValidOTP) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
      return;
    }

    // Mark email as verified and activate user (auto-activate for better UX)
    user.isVerified = true;
    user.isActive = true; // Auto-activate user after email verification
    await user.save();

    // Generate JWT token for auto-login
    const token = generateToken({
      userId: user._id as string,
      email: user.email,
    });

    // Send welcome email
    try {
      await EmailTemplateService.sendTemplatedEmail({
        templateType: "signup-welcome",
        to: email,
        subject: "Welcome to The Vantage Institute!",
        data: {
          name: user.name,
          email: user.email,
          // username removed
          loginUrl: `${
            process.env.CLIENT_URL || "http://localhost:3000"
          }/signin`,
        },
      });
    } catch (emailError) {
      console.error("Welcome email error:", emailError);
      // Don't fail the verification if welcome email fails
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You are now logged in.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: true,
        isActive: true,
      },
      token, // Return token for auto-login
    });
  } catch (error: any) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during email verification",
    });
  }
};

/**
 * Resend OTP for Email Verification
 */
export const resendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    // Validate required fields
    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check if user is already verified
    if (user.isVerified) {
      res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
      return;
    }

    // Send new verification email
    try {
      await EmailTemplateService.sendTemplatedEmail({
        templateType: "email-verify",
        userId: (user._id as any).toString(),
        to: email,
        subject: "Verify Your Email - The Vantage Institute",
        data: {
          name: user.name,
          email: user.email,
          // username removed
        },
      });

      console.log("Verification code sent successfully!");

      res.status(200).json({
        success: true,
        message:
          "Verification code sent successfully! Please check your email.",
      });
    } catch (emailError) {
      console.error("Resend OTP email error:", emailError);
      res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during OTP resend",
    });
  }
};

/**
 * User Login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Send verification email
      try {
        await EmailTemplateService.sendTemplatedEmail({
          templateType: "email-verify",
          userId: (user._id as any).toString(),
          to: email,
          subject: "Verify Your Email - The Vantage Institute",
          data: {
            name: user.name,
            email: user.email,
          },
        });
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
      }

      res.status(401).json({
        success: false,
        message:
          "Please verify your email before logging in. We've sent a verification code to your email.",
        requiresVerification: true,
        email: user.email,
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
      return;
    }

    // Verify password
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (e) {
      console.error("bcrypt compare error:", e);
      throw e;
    }
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Generate JWT token
    let token = "";
    try {
      token = generateToken({
        userId: user._id as string,
        email: user.email,
      });
    } catch (e) {
      console.error("JWT sign error:", e);
      throw e;
    }

    // Update lastLoginAt
    user.lastLoginAt = new Date();
    await user.save();

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};

/**
 * Check Authentication Status
 */
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bearer =
      (req.headers.authorization as string | undefined) ||
      (req.headers as any).Authorization;
    const token =
      (bearer && bearer.startsWith("Bearer ") && bearer.slice(7)) ||
      (req as any).cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "No authentication token provided",
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken -verificationTokens"
    );

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User authenticated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    console.error("Auth check error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/**
 * User Logout
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during logout",
    });
  }
};
