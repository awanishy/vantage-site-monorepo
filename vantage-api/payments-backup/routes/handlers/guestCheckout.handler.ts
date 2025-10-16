import { Request, Response } from "express";
import { PricingService } from "@/payments-backup/services/pricing.service";
import { OrderModel } from "@/payments-backup/models/order.model";
import { ProgramModel } from "@/courses/courses.model";
import { User } from "@/users/user.model";
import { OrderNumberGenerator } from "@/utils/orderNumberGenerator";
import bcrypt from "bcryptjs";
import { EmailTemplateService } from "@/config/email/templates/emailTemplates.config";

export const guestCheckoutHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, phone, programId, selectedCurrency } = req.body || {};
    const requestId = (req as any).requestId; // from requestIdMiddleware

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail || !programId) {
      res
        .status(400)
        .json({ success: false, message: "Email and programId are required" });
      return;
    }

    // Disallow placeholder/test emails to avoid accidental guest+example.com users
    if (
      normalizedEmail.endsWith("@example.com") ||
      normalizedEmail.startsWith("guest+")
    ) {
      res
        .status(400)
        .json({ success: false, message: "Please use a valid email address" });
      return;
    }

    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail }).lean();
    let isNewUser = false;
    let tempPassword: string | null = null;

    // If user exists, ask them to login instead of creating a guest order
    if (user) {
      res.status(200).json({
        success: true,
        message: "Account exists. Please sign in to continue checkout.",
        data: {
          needsLogin: true,
          user: {
            _id: String((user as any)._id),
            email: (user as any).email,
            name: (user as any).name,
          },
        },
      });
      return;
    }

    if (!user) {
      // Create new user
      tempPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const emailPrefix = normalizedEmail.split("@")[0];
      const newUser = await User.create({
        email: normalizedEmail,
        phone: phone || "",
        name: emailPrefix,
        password: hashedPassword,
        // App-aligned defaults for guest checkout
        userType: "STUDENT",
        role: "GUEST",
        isActive: true,
        isVerified: false,
      });
      user = newUser.toObject() as any;
      isNewUser = true;
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
      userId: user!._id,
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
      orderNote: "Program purchase - Guest checkout",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      metadata: {
        source: "guest_checkout",
        programSlug: (programDoc as any).slug,
        pricingVersion: "v1",
        isNewUser: isNewUser,
      },
    });

    // Don't create placeholder payment - only create when we have actual payment data
    // Payment records will be created by webhooks or manual verification when user actually pays

    res.status(201).json({
      success: true,
      message: "Guest checkout order created successfully",
      data: {
        orderId: orderDoc._id,
        orderNumber: orderDoc.orderNumber,
        merchantOrderId: orderDoc.merchantOrderId,
        amount: orderDoc.orderAmount,
        currency: orderDoc.orderCurrency,
        status: orderDoc.status,
        expiresAt: orderDoc.expiresAt,
        needsVerification: isNewUser && (user as any)?.isVerified === false,
        user: {
          _id: user!._id,
          email: user!.email,
          name: user!.name,
        },
        isNewUser,
        tempPassword, // Only returned for new users
        // No payment session yet - will be created when user wants to pay
      },
    });

    // Send guest welcome email asynchronously when a new user is created
    if (isNewUser && tempPassword) {
      try {
        await EmailTemplateService.sendTemplatedEmail({
          templateType: "guest-welcome",
          userId: String(user!._id),
          to: user!.email,
          subject: "Welcome to Vantage Institute - Your Account Details",
          data: {
            name: user!.name,
            email: user!.email,
            password: tempPassword,
            orderId: orderDoc._id,
            amount: orderDoc.orderAmount,
            currency: orderDoc.orderCurrency,
            paymentLink: `[Link to payment page using paymentSessionId]`,
          },
        });
      } catch (emailError) {
        console.error("Guest welcome email error:", emailError);
      }
    }

    // Send order-created email asynchronously
    try {
      await EmailTemplateService.sendTemplatedEmail({
        templateType: "order-created",
        userId: String(user!._id),
        to: user!.email,
        subject: "Your Order Has Been Created!",
        data: {
          name: user!.name,
          orderId: orderDoc._id,
          amount: orderDoc.orderAmount,
          currency: orderDoc.orderCurrency,
          paymentLink: `[Link to payment page using paymentSessionId]`,
        },
      });
    } catch (emailError) {
      console.error("Order creation email error:", emailError);
    }
  } catch (error: any) {
    console.error("Guest checkout error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create guest checkout order",
    });
  }
};

function generateRandomPassword(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
