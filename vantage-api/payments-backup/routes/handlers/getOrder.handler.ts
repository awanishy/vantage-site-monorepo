import { Request, Response } from "express";
import { OrderModel } from "@/payments-backup/models/order.model";

export const getOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const authUserId = (req as any).user?.userId;

    const order = await OrderModel.findById(id).populate("payments").lean();
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    // Verify order belongs to user (if authenticated)
    if (authUserId && String(order.userId) !== String(authUserId)) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};
