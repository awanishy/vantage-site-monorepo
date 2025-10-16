import { Request, Response } from "express";
import { OrderModel } from "@/payments/models/order.model";
import { CashfreeOrderModel } from "@/payments/models/cashfreeOrder.model";
import { PaymentModel } from "@/payments/models/payment.model";
import { cashfreeClient } from "@/payments/clients/cashfree.client";
import { VerifyPaymentResponse } from "@/types/payments/payments.types";

export const verifyPaymentHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const authUserId = req.user.userId;

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
      return;
    }

    // Get our order
    const order = await OrderModel.findById(orderId).lean();
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    // Verify order belongs to user
    if (String(order.userId) !== String(authUserId)) {
      res.status(403).json({
        success: false,
        message: "Order does not belong to user",
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

    // Check if order has expired
    if (
      cashfreeOrder.orderExpiryTime &&
      new Date() > cashfreeOrder.orderExpiryTime
    ) {
      console.log("Order has expired:", {
        orderId: order._id.toString(),
        expiryTime: cashfreeOrder.orderExpiryTime,
        currentTime: new Date(),
      });
    }

    // Check if order is already PAID
    if (order.status === "PAID") {
      console.log("Order is already marked as PAID");

      // Get the successful payment record
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
      console.log("Verifying payment for order:", {
        orderId: order._id.toString(),
        cfOrderId: cashfreeOrder.cfOrderId,
        merchantOrderId: cashfreeOrder.merchantOrderId,
        orderStatus: cashfreeOrder.orderStatus,
        isActive: cashfreeOrder.isActive,
      });

      // Fetch order details from Cashfree (try merchantOrderId first, then cfOrderId)
      let cfOrder;
      try {
        cfOrder = await cashfreeClient.getOrder(cashfreeOrder.merchantOrderId);
        console.log("[VerifyPayment] getOrder success via merchantOrderId", {
          merchantOrderId: cashfreeOrder.merchantOrderId,
        });
      } catch (e) {
        console.log(
          "[VerifyPayment] getOrder via merchantOrderId failed, trying cfOrderId",
          {
            merchantOrderId: cashfreeOrder.merchantOrderId,
            cfOrderId: cashfreeOrder.cfOrderId,
            error: (e as any)?.message,
          }
        );
        cfOrder = await cashfreeClient.getOrder(cashfreeOrder.cfOrderId);
        console.log("[VerifyPayment] getOrder success via cfOrderId", {
          cfOrderId: cashfreeOrder.cfOrderId,
        });
      }

      // Fetch payments strictly via merchantOrderId
      const cfPayments = await cashfreeClient.getPayments(
        cashfreeOrder.merchantOrderId
      );
      console.log("[VerifyPayment] getPayments success via merchantOrderId", {
        merchantOrderId: cashfreeOrder.merchantOrderId,
        count: cfPayments.length,
      });

      // Find successful payment
      const successfulPayment = cfPayments.find(
        (payment) => payment.payment_status === "SUCCESS"
      );
      console.log("[VerifyPayment] successfulPayment lookup", {
        found: !!successfulPayment,
      });

      if (successfulPayment) {
        // Update our payment record
        const existingPayment = await PaymentModel.findOne({
          orderId: order._id,
          cfOrderId: cashfreeOrder.cfOrderId,
        });

        if (existingPayment) {
          console.log("[VerifyPayment] Updating existing payment", {
            paymentId: (existingPayment._id as any).toString(),
          });
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
                  source: "manual_verification",
                  verificationAttempts:
                    (existingPayment.metadata.verificationAttempts || 0) + 1,
                },
              },
            }
          );

          // Update order status to PAID
          await OrderModel.updateOne(
            { _id: order._id },
            { $set: { status: "PAID" } }
          );
          console.log("[VerifyPayment] Order marked PAID", {
            orderId: order._id.toString(),
          });

          // Update Cashfree order status
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
          console.log("[VerifyPayment] Cashfree order marked PAID/inactive", {
            cashfreeOrderId: cashfreeOrder._id.toString(),
            cfOrderId: cashfreeOrder.cfOrderId,
          });

          const response: VerifyPaymentResponse = {
            success: true,
            message: "Payment verified successfully",
            data: {
              orderId: order._id.toString(),
              orderNumber: order.orderNumber,
              cfOrderId: cashfreeOrder.cfOrderId,
              paymentId: (existingPayment._id as any).toString(),
              paymentStatus: "SUCCESS",
              paymentAmount: successfulPayment.payment_amount,
              paymentCurrency: successfulPayment.payment_currency,
              paymentTime: successfulPayment.payment_time,
              paymentCompletionTime: successfulPayment.payment_completion_time,
              bankReference: successfulPayment.bank_reference,
              paymentMessage: successfulPayment.payment_message,
            },
          };

          res.status(200).json(response);
        } else {
          res.status(404).json({
            success: false,
            message: "Payment record not found",
          });
        }
      } else {
        // No successful payment found
        console.log(
          "[VerifyPayment] No SUCCESS payment found in primary flow",
          {
            paymentsFetched: cfPayments.length,
          }
        );
        const response: VerifyPaymentResponse = {
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

        res.status(200).json(response);
      }
    } catch (cfError: any) {
      console.error("Cashfree verification error:", cfError);

      // If order not found in Cashfree, try alternative verification methods
      if (cfError.code === "order_not_found") {
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
          payments: allPayments.map((p) => ({
            id: p._id.toString(),
            status: p.status,
            cfPaymentId: p.cfPaymentId,
            amount: p.amount,
          })),
        });

        // Try to get payments directly from Cashfree using merchantOrderId only
        try {
          console.log(
            "[VerifyPayment] Attempt getPayments via merchantOrderId",
            {
              merchantOrderId: cashfreeOrder.merchantOrderId,
            }
          );

          const cfPayments = await cashfreeClient.getPayments(
            cashfreeOrder.merchantOrderId
          );

          console.log("[VerifyPayment] getPayments fetched", {
            count: cfPayments.length,
          });

          // Find successful payment
          const successfulPayment = cfPayments.find(
            (p: any) => p.payment_status === "SUCCESS"
          );

          if (successfulPayment) {
            console.log("Found SUCCESS payment from Cashfree:", {
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
            "[VerifyPayment] getPayments via merchantOrderId failed",
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
          console.log("Found successful local payment record:", localPayment);

          // Update order status to PAID
          await OrderModel.updateOne(
            { _id: order._id },
            { $set: { status: "PAID" } }
          );

          // Update Cashfree order status
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
        } else {
          // No local payment record found, order truly doesn't exist
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
      }

      res.status(500).json({
        success: false,
        message: "Failed to verify payment with Cashfree",
        error: cfError.message,
      });
    }
  } catch (error: any) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};
