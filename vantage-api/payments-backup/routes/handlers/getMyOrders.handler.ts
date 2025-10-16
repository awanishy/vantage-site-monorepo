import { Request, Response } from "express";
import { OrderModel } from "@/payments-backup/models/order.model";

export const getMyOrdersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authUserId = (req as any).user?.userId;

    if (!authUserId) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    // Get all orders for the user with populated payments, sorted by creation date (newest first)
    const orders = await OrderModel.find({
      userId: authUserId,
    })
      .populate("payments")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: orders,
    });
  } catch (error: unknown) {
    console.error("Get my orders error:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch orders",
    });
  }
};
