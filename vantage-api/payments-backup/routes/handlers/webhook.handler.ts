import { Request, Response } from "express";
import { OrderModel } from "@/payments-backup/models/order.model";
import { PaymentModel } from "@/payments-backup/models/payment.model";
import { RefundModel } from "@/payments-backup/models/refund.model";
import { EntitlementsService } from "@/payments-backup/services/entitlements.service";
import { EmailTemplateService } from "@/config/email/templates/emailTemplates.config";

// Minimal webhook handler. Assumes raw body middleware provides req.rawBody in production.
export const paymentsWebhookHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const signature = req.headers["x-webhook-signature"] as string | undefined;
    const timestamp = req.headers["x-webhook-timestamp"] as string | undefined;

    // In production, verify the signature here using Cashfree SDK when available
    // Example (pseudo): Cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp)
    const rawBody =
      (req as any).rawBody ||
      (Buffer.isBuffer(req.body)
        ? req.body.toString("utf8")
        : JSON.stringify(req.body || {}));
    if (process.env.CF_VERIFY_WEBHOOK === "true") {
      try {
        const { Cashfree } = await import("cashfree-pg").catch(() => ({
          Cashfree: undefined as any,
        }));
        if (Cashfree?.PGVerifyWebhookSignature) {
          Cashfree.PGVerifyWebhookSignature(
            signature || "",
            rawBody,
            timestamp || ""
          );
        }
      } catch (e) {
        // If verification fails, reject
        res
          .status(400)
          .json({ success: false, message: "Invalid webhook signature" });
        return;
      }
    }

    const event = Buffer.isBuffer(req.body)
      ? (() => {
          try {
            return JSON.parse(req.body.toString("utf8"));
          } catch {
            return {} as any;
          }
        })()
      : req.body;
    const type = event?.type as string | undefined;
    const data = event?.data || {};
    const order = data.order || {};
    const payment = data.payment || {};
    const refund = data.refund || {};

    if (!type) {
      res.status(400).json({ success: false, message: "Missing event type" });
      return;
    }

    // Common identifiers
    const orderId: string | undefined = order.order_id || payment.order_id;
    const cfPaymentId: string | undefined = payment.cf_payment_id;

    if (!orderId) {
      res.status(200).json({ success: true });
      return;
    }

    console.log("Webhook received:", {
      type,
      orderId,
      cfPaymentId,
      paymentStatus: payment.payment_status,
      paymentMessage: payment.payment_message,
      errorDetails: payment.error_details,
      paymentData: payment,
      orderData: order,
    });

    // Update payment for all webhook types (success, failed, user_dropped)
    // Find order by merchantOrderId only (no Cashfree metadata lookup)
    const orderDoc = await OrderModel.findOne({
      merchantOrderId: orderId,
    }).lean();

    console.log(
      "Found orderDoc:",
      orderDoc
        ? {
            _id: orderDoc._id,
            merchantOrderId: orderDoc.merchantOrderId,
            status: orderDoc.status,
          }
        : "No order found"
    );

    if (orderDoc) {
      // Create or update payment record with actual data from Cashfree
      if (cfPaymentId) {
        console.log("Creating/updating payment with cfPaymentId:", cfPaymentId);
        const paymentData = {
          // Don't update cfPaymentId - keep it consistent
          paymentGroup: payment.payment_group,
          methodPayload: payment.payment_method,
          amount: payment.payment_amount || orderDoc.orderAmount,
          currency: payment.payment_currency || orderDoc.orderCurrency,
          status: payment.payment_status,
          paymentMessage: payment.payment_message,
          bankReference: payment.bank_reference,
          authorization: payment.authorization || null,
          paymentTime: payment.payment_time
            ? new Date(payment.payment_time)
            : undefined,
          paymentCompletionTime: payment.payment_completion_time
            ? new Date(payment.payment_completion_time)
            : undefined,
          errorDetails: payment.error_details || null,
        };

        // Find existing payment record for this order (created during payment session)
        const existingPayment = await PaymentModel.findOne({
          orderId: orderDoc._id,
          "metadata.cf_order_id": cfPaymentId, // Find by Cashfree order ID in metadata
        });

        if (existingPayment) {
          // Update existing payment record with actual payment data
          const updatedPayment = await PaymentModel.updateOne(
            { _id: existingPayment._id },
            { $set: paymentData }
          );
          console.log(
            "Updated existing payment record with cfPaymentId:",
            cfPaymentId
          );
        } else {
          // Create new payment record if none exists (fallback)
          const updatedPayment = await PaymentModel.findOneAndUpdate(
            { cfPaymentId },
            { $set: paymentData },
            { upsert: true, new: true }
          );
          console.log(
            "Created new payment record with cfPaymentId:",
            cfPaymentId
          );

          // Add payment reference to order if it doesn't exist
          if (updatedPayment) {
            await OrderModel.updateOne(
              { _id: orderDoc._id },
              { $addToSet: { payments: updatedPayment._id } }
            );
          }
        }
      } else {
        // For webhooks without cfPaymentId, create a payment record with available data
        console.log(
          "Creating payment without cfPaymentId for order:",
          orderDoc._id
        );

        // Determine status and message based on webhook type
        let paymentStatus = payment.payment_status || "FAILED";
        let paymentMessage = payment.payment_message || "Payment failed";

        if (type === "PAYMENT_FAILED_WEBHOOK") {
          paymentStatus = "FAILED";
          paymentMessage = payment.payment_message || "Payment failed";
          console.log("Processing failed payment webhook");
        } else if (type === "PAYMENT_USER_DROPPED_WEBHOOK") {
          paymentStatus = "USER_DROPPED";
          paymentMessage = payment.payment_message || "User dropped payment";
          console.log("Processing user dropped payment webhook");
        }

        const paymentData = {
          orderId: orderDoc._id,
          cfPaymentId: null,
          paymentGroup: payment.payment_group,
          methodPayload: payment.payment_method,
          amount: payment.payment_amount || orderDoc.orderAmount,
          currency: payment.payment_currency || orderDoc.orderCurrency,
          status: paymentStatus,
          paymentMessage: paymentMessage,
          bankReference: payment.bank_reference,
          authorization: payment.authorization || null,
          paymentTime: payment.payment_time
            ? new Date(payment.payment_time)
            : new Date(),
          paymentCompletionTime: payment.payment_completion_time
            ? new Date(payment.payment_completion_time)
            : undefined,
          errorDetails: payment.error_details || null,
        };

        const createdPayment = await PaymentModel.create(paymentData);
        console.log(
          `Created payment without cfPaymentId successfully - Status: ${paymentStatus}`
        );

        // Add payment reference to order
        if (createdPayment) {
          await OrderModel.updateOne(
            { _id: orderDoc._id },
            { $addToSet: { payments: createdPayment._id } }
          );
        }
      }
    }

    // Update order status based on event type
    if (type === "PAYMENT_SUCCESS_WEBHOOK") {
      const updated = await OrderModel.findOneAndUpdate(
        { merchantOrderId: orderId },
        { $set: { status: "PAID" } },
        { new: true }
      );
      if (updated) {
        // Grant access asynchronously
        EntitlementsService.grantCourseAccess(
          String((updated as any).userId),
          String((updated as any).programId)
        ).catch(() => {});
        // Send payment success email
        try {
          const { User } = await import("@/users/user.model");
          const user = await User.findById((updated as any).userId).lean();
          if (user) {
            EmailTemplateService.sendTemplatedEmail({
              templateType: "payment-success",
              userId: String(user._id),
              to: user.email,
              subject: "Payment successful",
              data: {
                name: user.name,
                orderId: String((updated as any)._id),
                orderNumber: (updated as any).orderNumber,
                amount: (updated as any).orderAmount,
                currency: (updated as any).orderCurrency,
              },
            }).catch(() => {});
          }
        } catch {}
      }
    } else if (type === "PAYMENT_FAILED_WEBHOOK") {
      // Only update to ACTIVE if current status is not PAID
      await OrderModel.findOneAndUpdate(
        {
          merchantOrderId: orderId,
          status: { $ne: "PAID" }, // Don't overwrite PAID status
        },
        { $set: { status: "ACTIVE" } }
      );
      try {
        const { EmailTemplateService } = await import(
          "@/config/email/templates/emailTemplates.config"
        );
        if (orderDoc) {
          const { User } = await import("@/users/user.model");
          const user = await User.findById((orderDoc as any).userId).lean();
          if (user) {
            EmailTemplateService.sendTemplatedEmail({
              templateType: "payment-failed",
              userId: String(user._id),
              to: user.email,
              subject: "Payment failed",
              data: {
                name: user.name,
                orderId: String((orderDoc as any)._id),
                orderNumber: (orderDoc as any).orderNumber,
                amount: (orderDoc as any).orderAmount,
                currency: (orderDoc as any).orderCurrency,
              },
            }).catch(() => {});
          }
        }
      } catch {}
    } else if (type === "PAYMENT_USER_DROPPED_WEBHOOK") {
      // Keep order ACTIVE, record attempt already handled above
    } else if (
      type === "REFUND_SUCCESS_WEBHOOK" ||
      type === "REFUND_FAILED_WEBHOOK" ||
      type === "REFUND_PENDING_WEBHOOK"
    ) {
      // Upsert refund doc
      const upsertedRefund = await RefundModel.findOneAndUpdate(
        { cfRefundId: refund.cf_refund_id || refund.refund_id },
        {
          $set: {
            cfPaymentId: refund.cf_payment_id,
            cfRefundId: refund.cf_refund_id,
            refundId: refund.refund_id,
            amount: refund.refund_amount,
            currency: refund.refund_currency,
            status: refund.refund_status,
            arn: refund.refund_arn || null,
            charge: refund.refund_charge || null,
            statusDescription: refund.status_description || null,
            mode: refund.refund_mode || null,
            createdAtCF: refund.created_at ? new Date(refund.created_at) : null,
            processedAtCF: refund.processed_at
              ? new Date(refund.processed_at)
              : null,
            speed: refund.refund_speed || null,
            splits: refund.refund_splits || null,
            metadata: refund.metadata || null,
          },
        },
        { upsert: true, new: true }
      );

      // Attach orderId if we can find the order
      const relatedOrder = await OrderModel.findOne({
        merchantOrderId: orderId,
      }).lean();
      if (relatedOrder && upsertedRefund && !(upsertedRefund as any).orderId) {
        await RefundModel.updateOne(
          { _id: (upsertedRefund as any)._id },
          { $set: { orderId: (relatedOrder as any)._id } }
        );
      }

      // Send refund emails (non-blocking)
      try {
        const { EmailTemplateService } = await import(
          "@/config/email/templates/emailTemplates.config"
        );
        const effectiveOrder =
          relatedOrder ||
          (await OrderModel.findOne({
            merchantOrderId: orderId,
          }).lean());
        if (effectiveOrder) {
          const { User } = await import("@/users/user.model");
          const user = await User.findById(
            (effectiveOrder as any).userId
          ).lean();
          if (user) {
            const templateType =
              refund.refund_status === "SUCCESS"
                ? "refund-success"
                : refund.refund_status === "FAILED"
                ? "refund-failed"
                : "refund-pending";
            EmailTemplateService.sendTemplatedEmail({
              templateType,
              userId: String(user._id),
              to: user.email,
              subject:
                templateType === "refund-success"
                  ? "Refund processed"
                  : templateType === "refund-failed"
                  ? "Refund failed"
                  : "Refund in progress",
              data: {
                name: user.name,
                orderId: String((effectiveOrder as any)._id),
                orderNumber: (effectiveOrder as any).orderNumber,
                refundId: String(refund.refund_id || refund.cf_refund_id || ""),
                amount: refund.refund_amount,
                currency: refund.refund_currency,
                status: refund.refund_status,
              },
            }).catch(() => {});
          }
        }
      } catch {}
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(200).json({ success: true }); // Acknowledge to avoid retries; log for investigation
  }
};
