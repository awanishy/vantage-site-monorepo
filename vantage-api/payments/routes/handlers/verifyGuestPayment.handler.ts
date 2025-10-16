import { Request, Response } from "express";
import { OrderModel } from "@/payments/models/order.model";
import { CashfreeOrderModel } from "@/payments/models/cashfreeOrder.model";
import { PaymentModel } from "@/payments/models/payment.model";
import { User } from "@/users/user.model";
import { cashfreeClient } from "@/payments/clients/cashfree.client";
import { VerifyPaymentResponse } from "@/types/payments/payments.types";

// Guest payment verification handler
// - Auth not required
// - Requires orderId (params) and email (body)
export const verifyGuestPaymentHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { email } = req.body as { email?: string };

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
      return;
    }

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    // Get order
    const order = await OrderModel.findById(orderId).lean();
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    // Verify email matches order's user
    const user = await User.findById(order.userId).lean();
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found for this order",
      });
      return;
    }

    if (user.email.toLowerCase() !== email.toLowerCase()) {
      res.status(403).json({
        success: false,
        message: "Email does not match the order",
      });
      return;
    }

    // Get Cashfree order (check both active and inactive)
    const cashfreeOrder = await CashfreeOrderModel.findOne({
      orderId: order._id,
    }).lean();

    if (!cashfreeOrder) {
      res.status(404).json({
        success: false,
        message: "No payment session found for this order",
      });
      return;
    }

    // If already PAID, return success from local records
    if (order.status === "PAID") {
      const successfulPayment = await PaymentModel.findOne({
        orderId: order._id,
        status: "SUCCESS",
      }).lean();

      if (successfulPayment) {
        const response: VerifyPaymentResponse = {
          success: true,
          message: "Payment already verified",
          data: {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            cfOrderId: cashfreeOrder.cfOrderId,
            paymentId: successfulPayment._id.toString(),
            paymentStatus: "SUCCESS",
            paymentAmount: successfulPayment.amount,
            paymentCurrency: successfulPayment.currency,
            paymentTime: successfulPayment.paymentTime?.toISOString(),
            paymentCompletionTime:
              successfulPayment.paymentCompletionTime?.toISOString(),
            bankReference: successfulPayment.bankReference,
            paymentMessage: successfulPayment.paymentMessage,
          },
        };
        res.status(200).json(response);
        return;
      }
    }

    try {
      // Fetch from Cashfree via merchantOrderId
      const cfOrder = await cashfreeClient.getOrder(
        cashfreeOrder.merchantOrderId
      );
      console.log("[VerifyGuestPayment] getOrder success via merchantOrderId", {
        merchantOrderId: cashfreeOrder.merchantOrderId,
      });

      // Fetch payments strictly via merchantOrderId
      const cfPayments = await cashfreeClient.getPayments(
        cashfreeOrder.merchantOrderId
      );
      console.log(
        "[VerifyGuestPayment] getPayments success via merchantOrderId",
        {
          merchantOrderId: cashfreeOrder.merchantOrderId,
          count: cfPayments.length,
        }
      );

      // Find successful payment
      const successfulPayment = cfPayments.find(
        (p: any) => p.payment_status === "SUCCESS"
      );
      console.log("[VerifyGuestPayment] successfulPayment lookup", {
        found: !!successfulPayment,
      });

      if (successfulPayment) {
        // Update or create payment record
        const existingPayment = await PaymentModel.findOne({
          orderId: order._id,
          cfOrderId: cashfreeOrder.cfOrderId,
        });

        if (existingPayment) {
          await PaymentModel.updateOne(
            { _id: existingPayment._id },
            {
              $set: {
                cfPaymentId: successfulPayment.cf_payment_id.toString(),
                status: "SUCCESS",
                paymentMessage: successfulPayment.payment_message,
                bankReference: successfulPayment.bank_reference,
                paymentTime: new Date(successfulPayment.payment_time),
                paymentCompletionTime: new Date(
                  successfulPayment.payment_completion_time
                ),
                paymentGroup: successfulPayment.payment_group,
                methodPayload: successfulPayment.payment_method,
                authorization: successfulPayment.authorization,
                isCaptured: successfulPayment.is_captured,
                metadata: {
                  ...existingPayment.metadata,
                  source: "guest_manual_verification",
                },
              },
            }
          );
        } else {
          await PaymentModel.create({
            orderId: order._id,
            cashfreeOrderId: cashfreeOrder._id,
            cfOrderId: cashfreeOrder.cfOrderId,
            cfPaymentId: successfulPayment.cf_payment_id.toString(),
            paymentSessionId: cashfreeOrder.paymentSessionId,
            amount: successfulPayment.payment_amount ?? order.orderAmount,
            currency: successfulPayment.payment_currency ?? order.orderCurrency,
            status: "SUCCESS",
            paymentMessage: successfulPayment.payment_message,
            bankReference: successfulPayment.bank_reference,
            paymentTime: new Date(successfulPayment.payment_time),
            paymentCompletionTime: new Date(
              successfulPayment.payment_completion_time ||
                successfulPayment.payment_time
            ),
            paymentGroup: successfulPayment.payment_group,
            methodPayload: successfulPayment.payment_method,
            authorization: successfulPayment.authorization,
            isCaptured: successfulPayment.is_captured,
            metadata: {
              source: "guest_manual_verification",
            },
          });
        }

        // Mark order paid and Cashfree order inactive/paid
        await OrderModel.updateOne(
          { _id: order._id },
          { $set: { status: "PAID" } }
        );

        await CashfreeOrderModel.updateOne(
          { _id: cashfreeOrder._id },
          {
            $set: {
              orderStatus: "PAID",
              isActive: false,
              lastUpdatedAt: new Date(),
            },
          }
        );

        const response: VerifyPaymentResponse = {
          success: true,
          message: "Payment verified successfully",
          data: {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            cfOrderId: cashfreeOrder.cfOrderId,
            paymentId: "", // not strictly needed for guest flow
            paymentStatus: "SUCCESS",
            paymentAmount:
              successfulPayment.payment_amount ?? order.orderAmount,
            paymentCurrency:
              successfulPayment.payment_currency ?? order.orderCurrency,
            paymentTime: successfulPayment.payment_time,
            paymentCompletionTime: successfulPayment.payment_completion_time,
            bankReference: successfulPayment.bank_reference,
            paymentMessage: successfulPayment.payment_message,
          },
        };

        res.status(200).json(response);
        return;
      }

      // No successful payment found
      const pendingResponse: VerifyPaymentResponse = {
        success: true,
        message: "No successful payment found for this order",
        data: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          cfOrderId: cashfreeOrder.cfOrderId,
          paymentId: "",
          paymentStatus: "PENDING",
          paymentAmount: 0,
          paymentCurrency: order.orderCurrency,
        },
      };
      res.status(200).json(pendingResponse);
    } catch (cfError: any) {
      // If Cashfree lookup fails, try alternative verification methods
      if (cfError?.code === "order_not_found") {
        console.log(
          "Order not found in Cashfree, trying alternative verification..."
        );

        // Get all payment records for this order
        const allPayments = await PaymentModel.find({
          orderId: order._id,
        }).lean();

        console.log("Found local payment records:", {
          orderId: order._id.toString(),
          totalPaymentsFound: allPayments.length,
          payments: allPayments.map((p: any) => ({
            id: p._id.toString(),
            status: p.status,
            cfPaymentId: p.cfPaymentId,
            amount: p.amount,
          })),
        });

        // Try to get payments directly from Cashfree using merchantOrderId only
        try {
          console.log(
            "[VerifyGuestPayment] Attempt getPayments via merchantOrderId",
            { merchantOrderId: cashfreeOrder.merchantOrderId }
          );

          const cfPayments = await cashfreeClient.getPayments(
            cashfreeOrder.merchantOrderId
          );

          console.log("[VerifyGuestPayment] getPayments fetched", {
            count: cfPayments.length,
          });

          // Find successful payment
          const successfulPayment = cfPayments.find(
            (p: any) => p.payment_status === "SUCCESS"
          );

          if (successfulPayment) {
            console.log("[VerifyGuestPayment] SUCCESS payment from Cashfree", {
              cfPaymentId: successfulPayment.cf_payment_id,
              status: successfulPayment.payment_status,
              amount: successfulPayment.payment_amount,
            });

            // Find or get the first local payment record to update
            let localPayment = allPayments[0];

            // Update local payment record with Cashfree data
            await PaymentModel.updateOne(
              { _id: localPayment._id },
              {
                $set: {
                  cfPaymentId: successfulPayment.cf_payment_id.toString(),
                  status: "SUCCESS",
                  paymentMessage: successfulPayment.payment_message,
                  bankReference: successfulPayment.bank_reference,
                  paymentTime: new Date(successfulPayment.payment_time),
                  paymentCompletionTime: new Date(
                    successfulPayment.payment_completion_time ||
                      successfulPayment.payment_time
                  ),
                  paymentGroup: successfulPayment.payment_group,
                  methodPayload: successfulPayment.payment_method,
                  authorization: successfulPayment.authorization,
                  isCaptured: successfulPayment.is_captured,
                },
              }
            );

            // Update order and cashfree order status
            await OrderModel.updateOne(
              { _id: order._id },
              { $set: { status: "PAID" } }
            );

            await CashfreeOrderModel.updateOne(
              { _id: cashfreeOrder._id },
              {
                $set: {
                  orderStatus: "PAID",
                  isActive: false,
                  lastUpdatedAt: new Date(),
                },
              }
            );

            const response: VerifyPaymentResponse = {
              success: true,
              message: "Payment verified successfully via direct lookup",
              data: {
                orderId: order._id.toString(),
                orderNumber: order.orderNumber,
                cfOrderId: cashfreeOrder.cfOrderId,
                paymentId: localPayment._id.toString(),
                paymentStatus: "SUCCESS",
                paymentAmount: successfulPayment.payment_amount,
                paymentCurrency: successfulPayment.payment_currency,
                paymentTime: successfulPayment.payment_time,
                paymentCompletionTime:
                  successfulPayment.payment_completion_time,
                bankReference: successfulPayment.bank_reference,
                paymentMessage: successfulPayment.payment_message,
              },
            };

            res.status(200).json(response);
            return;
          } else {
            console.log("No SUCCESS payment found in Cashfree payments");
          }
        } catch (paymentsError: any) {
          console.log(
            "[VerifyGuestPayment] getPayments via merchantOrderId failed",
            {
              error: paymentsError.message,
            }
          );
          // Continue to fallback
        }

        // If no verified payment found via direct lookup, check for SUCCESS in local DB
        const localPayment = await PaymentModel.findOne({
          orderId: order._id,
          status: "SUCCESS",
        }).lean();

        if (localPayment) {
          await OrderModel.updateOne(
            { _id: order._id },
            { $set: { status: "PAID" } }
          );

          await CashfreeOrderModel.updateOne(
            { _id: cashfreeOrder._id },
            {
              $set: {
                orderStatus: "PAID",
                isActive: false,
                lastUpdatedAt: new Date(),
              },
            }
          );

          const response: VerifyPaymentResponse = {
            success: true,
            message: "Payment verified successfully from local records",
            data: {
              orderId: order._id.toString(),
              orderNumber: order.orderNumber,
              cfOrderId: cashfreeOrder.cfOrderId,
              paymentId: localPayment._id.toString(),
              paymentStatus: "SUCCESS",
              paymentAmount: localPayment.amount,
              paymentCurrency: localPayment.currency,
              paymentTime: localPayment.paymentTime?.toISOString(),
              paymentCompletionTime:
                localPayment.paymentCompletionTime?.toISOString(),
              bankReference: localPayment.bankReference,
              paymentMessage: localPayment.paymentMessage,
            },
          };
          res.status(200).json(response);
          return;
        }

        const response: VerifyPaymentResponse = {
          success: true,
          message: "No payment found for this order",
          data: {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            cfOrderId: cashfreeOrder.cfOrderId,
            paymentId: "",
            paymentStatus: "PENDING",
            paymentAmount: 0,
            paymentCurrency: order.orderCurrency,
          },
        };
        res.status(200).json(response);
        return;
      }

      res.status(500).json({
        success: false,
        message: "Failed to verify payment with Cashfree",
        error: cfError?.message || "Unknown error",
      });
    }
  } catch (error: any) {
    console.error("Verify guest payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};
