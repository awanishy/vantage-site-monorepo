import { Request, Response } from "express";
import { OrderModel } from "@/payments-backup/models/order.model";

export const checkActiveOrdersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { programId, selectedCurrency } = req.body || {};
    const authUserId = (req as any).user?.userId;

    if (!programId) {
      res.status(400).json({ success: false, message: "Program ID required" });
      return;
    }

    if (!authUserId) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    // Find active orders for the same user, program, and currency with populated payments
    const activeOrders = await OrderModel.find({
      userId: authUserId,
      programId: programId,
      selectedCurrency: selectedCurrency || "USD",
      status: { $in: ["ACTIVE", "PENDING"] },
    })
      .populate("payments")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        hasActiveOrders: activeOrders.length > 0,
        activeOrders,
        count: activeOrders.length,
      },
    });
  } catch (error: unknown) {
    console.error("Check active orders error:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to check active orders",
    });
  }
};
