import { Request, Response } from "express";
import { PricingService } from "@/payments-backup/services/pricing.service";
import { OrderModel } from "@/payments-backup/models/order.model";
import { OrderNumberGenerator } from "@/utils/orderNumberGenerator";
import { User } from "@/users/user.model";
import { EmailTemplateService } from "@/config/email/templates/emailTemplates.config";
import { ProgramModel } from "@/courses/courses.model";

export const createOrderHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { programId, selectedCurrency, userId } = req.body || {};
    // authorize() middleware now guarantees req.user for this route
    const authUserId = (req as any).user?.userId || userId;
    if (!programId) {
      res
        .status(400)
        .json({ success: false, message: "programId is required" });
      return;
    }

    const user = await User.findById(authUserId).lean();
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Compute pricing with currency conversion and snapshot
    const pricing = await PricingService.compute({
      programId,
      selectedCurrency,
    });

    // Resolve program ObjectId from provided identifier (id/programId/slug)
    const programDoc = await ProgramModel.findOne({
      $or: [
        {
          _id: ((): any => {
            try {
              return new (require("mongoose").Types.ObjectId)(programId);
            } catch {
              return null;
            }
          })(),
        },
        { programId: programId },
        { slug: programId },
      ],
    }).lean();
    if (!programDoc) {
      res.status(400).json({ success: false, message: "Invalid programId" });
      return;
    }

    // Generate our own order ID and order number
    const ourOrderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const orderNumber = await OrderNumberGenerator.generate();

    // Create our order first (without Cashfree)
    const orderDoc = await OrderModel.create({
      userId: user._id,
      programId: (programDoc as any)._id,
      orderNumber: orderNumber,
      orderType: "PROGRAM_PURCHASE",
      orderAmount: pricing.orderAmount,
      merchantOrderId: ourOrderId, // Our own order ID
      orderCurrency: pricing.orderCurrency,
      programCurrency: pricing.programCurrency,
      selectedCurrency: pricing.selectedCurrency,
      fx: pricing.fx,
      pricingSnapshot: pricing.pricingSnapshot,
      status: "ACTIVE",
      orderNote: "Program purchase",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      metadata: {
        source: "authenticated_user",
        programSlug: (programDoc as any).slug,
        pricingVersion: "v1",
      },
    });

    // Don't create placeholder payment - only create when we have actual payment data
    // Payment records will be created by webhooks or manual verification when user actually pays

    // Respond immediately with our order details
    res.status(201).json({
      success: true,
      data: {
        orderId: orderDoc._id,
        orderNumber: orderDoc.orderNumber,
        merchantOrderId: orderDoc.merchantOrderId,
        amount: orderDoc.orderAmount,
        currency: orderDoc.orderCurrency,
        status: orderDoc.status,
        expiresAt: orderDoc.expiresAt,
        // No payment session yet - will be created when user wants to pay
      },
    });

    // Send order-created email asynchronously (non-blocking)
    try {
      await EmailTemplateService.sendTemplatedEmail({
        templateType: "order-created",
        userId: String(user._id),
        to: user.email,
        subject: "Your order has been created",
        data: {
          name: user.name,
          orderId: String(orderDoc._id),
          amount: orderDoc.orderAmount,
          currency: orderDoc.orderCurrency,
        },
      }).catch(() => {});
    } catch (e) {
      // swallow email errors
    }
  } catch (error: any) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};
