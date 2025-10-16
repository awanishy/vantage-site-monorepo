import { Request, Response, NextFunction } from "express";
import { User } from "@users/user.model";
import { APIError } from "@/utils/APIError";
import { EmailTemplateService } from "@/config/email/templates/emailTemplates.config";
import { IOTPToken } from "@/types/users/user.types";

/**
 * Send OTP for password reset
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(APIError.BadRequest("Email is required"));
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(APIError.NotFound("User not found"));
    }

    // Generate OTP for password reset
    const otp = await user.createOTP("email");

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email address",
    });

    // Send password reset email after response
    try {
      await EmailTemplateService.sendTemplatedEmail({
        templateType: "password-reset",
        userId: (user._id as any).toString(),
        to: email,
        subject: "Password Reset - Futred Blog",
        data: {
          name: user.name,
          email: user.email,
          otp,
        },
      });
    } catch (emailError) {
      console.error("Password reset email error:", emailError);
      // Don't fail the request if email fails
    }
  } catch (error: any) {
    console.error("Forgot password error:", error);
    next(APIError.InternalError("Failed to process password reset request"));
  }
};

/**
 * Verify OTP for password reset
 */
export const verifyResetOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(APIError.BadRequest("Email and OTP are required"));
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(APIError.NotFound("User not found"));
    }

    // Verify OTP
    const isValidOTP = await user.verifyOTP("email", otp);
    if (!isValidOTP) {
      return next(APIError.BadRequest("Invalid or expired OTP"));
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error: any) {
    console.error("Verify reset OTP error:", error);
    next(APIError.InternalError("Failed to verify OTP"));
  }
};

/**
 * Reset password with OTP
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return next(APIError.BadRequest("Email, OTP, and password are required"));
    }

    if (password.length < 6) {
      return next(
        APIError.BadRequest("Password must be at least 6 characters long")
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(APIError.NotFound("User not found"));
    }

    // Check if OTP was already verified (from the verify step)
    const verifiedOTP = user.otpTokens.find(
      (token: IOTPToken) =>
        token.purpose === "email" &&
        token.token === otp &&
        token.expiresAt > new Date() &&
        token.verified === true
    );

    if (!verifiedOTP) {
      return next(
        APIError.BadRequest(
          "Invalid or expired OTP. Please verify your OTP first."
        )
      );
    }

    // Hash new password
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and remove used OTP
    user.password = hashedPassword;
    user.otpTokens = user.otpTokens.filter(
      (token: IOTPToken) =>
        token._id?.toString() !== verifiedOTP._id?.toString()
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

    // Send password reset confirmation email after response
    try {
      await EmailTemplateService.sendTemplatedEmail({
        templateType: "password-reset-success",
        userId: (user._id as any).toString(),
        to: email,
        subject: "Password Reset Successful - Futred Blog",
        data: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (emailError) {
      console.error("Password reset success email error:", emailError);
      // Don't fail the request if email fails
    }
  } catch (error: any) {
    console.error("Reset password error:", error);
    next(APIError.InternalError("Failed to reset password"));
  }
};
