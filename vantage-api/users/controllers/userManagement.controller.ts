import { Response, NextFunction } from "express";
import { User, UserType, UserRole } from "@users/user.model";
import { APIError } from "@/utils/APIError";
import { AuthRequest } from "@/types/request.types";
import { EmailTemplateService } from "@/config/email/templates/emailTemplates.config";

/**
 * Get all users with pagination and filtering
 */
export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const userType = (req.query.userType as UserType) || "";
    const isActive = (req.query.isActive as string) || "";
    const isVerified = (req.query.isVerified as string) || "";

    // Build filter query
    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (userType) {
      filter.userType = userType;
    }

    if (isActive !== "") {
      filter.isActive = isActive === "true";
    }

    if (isVerified !== "") {
      filter.isVerified = isVerified === "true";
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Transform _id to id for frontend compatibility
    const transformedUsers = users.map((user) => ({
      ...user,
      id: user._id.toString(),
    }));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    // Get statistics
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: ["$isActive", 1, 0] } },
          verifiedUsers: { $sum: { $cond: ["$isVerified", 1, 0] } },
          adminUsers: {
            $sum: { $cond: [{ $eq: ["$userType", "ADMIN"] }, 1, 0] },
          },
          studentUsers: {
            $sum: { $cond: [{ $eq: ["$userType", "STUDENT"] }, 1, 0] },
          },
          pendingUsers: {
            $sum: {
              $cond: [{ $and: ["$isVerified", { $not: "$isActive" }] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: transformedUsers,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        stats: stats[0] || {
          totalUsers: 0,
          activeUsers: 0,
          verifiedUsers: 0,
          adminUsers: 0,
          studentUsers: 0,
          pendingUsers: 0,
        },
      },
    });
  } catch (error: any) {
    console.error("Get all users error:", error);
    next(APIError.InternalError("Failed to fetch users"));
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password -otpTokens")
      .lean();

    if (!user) {
      return next(APIError.NotFound("User not found"));
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    console.error("Get user by ID error:", error);
    next(APIError.InternalError("Failed to fetch user"));
  }
};

/**
 * Activate/Deactivate user
 */
export const toggleUserStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return next(APIError.BadRequest("isActive must be a boolean value"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(APIError.NotFound("User not found"));
    }

    // Prevent deactivating super admin
    if (user.role === "SUPER_ADMIN" && !isActive) {
      return next(APIError.Forbidden("Cannot deactivate super admin"));
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
        },
      },
    });

    // Send email notification after response
    try {
      await EmailTemplateService.sendTemplatedEmail({
        templateType: "account-status-change",
        userId: (user._id as any).toString(),
        to: user.email,
        subject: `Account ${
          isActive ? "Activated" : "Deactivated"
        } - Futred Blog`,
        data: {
          name: user.name,
          email: user.email,
          status: isActive ? "activated" : "deactivated",
        },
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the operation if email fails
    }
  } catch (error: any) {
    console.error("Toggle user status error:", error);
    next(APIError.InternalError("Failed to update user status"));
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role, userType } = req.body;

    if (!role || !userType) {
      return next(APIError.BadRequest("role and userType are required"));
    }

    const validRoles: UserRole[] = ["STUDENT", "ADMIN", "SUPER_ADMIN"];
    const validUserTypes: UserType[] = ["STUDENT", "ADMIN"];

    if (!validRoles.includes(role)) {
      return next(APIError.BadRequest("Invalid role"));
    }

    if (!validUserTypes.includes(userType)) {
      return next(APIError.BadRequest("Invalid userType"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(APIError.NotFound("User not found"));
    }

    // Prevent changing super admin role
    if (user.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
      return next(APIError.Forbidden("Cannot change super admin role"));
    }

    // Only super admin can assign super admin role
    if (role === "SUPER_ADMIN" && req.user?.role !== "SUPER_ADMIN") {
      return next(
        APIError.Forbidden("Only super admin can assign super admin role")
      );
    }

    const oldRole = user.role;
    const oldUserType = user.userType;

    user.role = role;
    user.userType = userType;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
        },
      },
    });

    // Send email notification after response
    try {
      await EmailTemplateService.sendTemplatedEmail({
        templateType: "role-change",
        userId: (user._id as any).toString(),
        to: user.email,
        subject: "Role Updated - Futred Blog",
        data: {
          name: user.name,
          email: user.email,
          oldRole,
          newRole: role,
          oldUserType,
          newUserType: userType,
        },
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the operation if email fails
    }
  } catch (error: any) {
    console.error("Update user role error:", error);
    next(APIError.InternalError("Failed to update user role"));
  }
};

/**
 * Delete user (soft delete by deactivating)
 */
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return next(APIError.NotFound("User not found"));
    }

    // Prevent deleting super admin
    if (user.role === "SUPER_ADMIN") {
      return next(APIError.Forbidden("Cannot delete super admin"));
    }

    // Soft delete by deactivating
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    next(APIError.InternalError("Failed to delete user"));
  }
};

/**
 * Get pending users (verified but not active)
 */
export const getPendingUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const users = await User.find({
      isVerified: true,
      isActive: false,
    })
      .select("-password -otpTokens")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments({
      isVerified: true,
      isActive: false,
    });

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error: any) {
    console.error("Get pending users error:", error);
    next(APIError.InternalError("Failed to fetch pending users"));
  }
};

/**
 * Bulk activate users
 */
export const bulkActivateUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return next(APIError.BadRequest("userIds must be a non-empty array"));
    }

    const result = await User.updateMany(
      {
        _id: { $in: userIds },
        role: { $ne: "SUPER_ADMIN" }, // Don't update super admins
      },
      { isActive: true }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} users activated successfully`,
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error: any) {
    console.error("Bulk activate users error:", error);
    next(APIError.InternalError("Failed to activate users"));
  }
};
