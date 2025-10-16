import { Request, Response } from "express";
import { PaymentModel } from "@/payments-backup/models/payment.model";

export const getPaymentHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const authUserId = (req as any).user?.userId;

    const payment = await PaymentModel.findById(id).populate("orderId").lean();
    if (!payment) {
      res.status(404).json({ success: false, message: "Payment not found" });
      return;
    }

    // Verify payment belongs to user (if authenticated)
    if (
      authUserId &&
      payment.orderId &&
      String((payment.orderId as any).userId) !== String(authUserId)
    ) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

    res.status(200).json({ success: true, data: payment });
  } catch (err) {
    console.error("Get payment error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch payment" });
  }
};
