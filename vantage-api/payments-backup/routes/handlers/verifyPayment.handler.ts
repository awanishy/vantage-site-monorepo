import { Request, Response } from "express";
import { OrderModel } from "@/payments-backup/models/order.model";
import { PaymentModel } from "@/payments-backup/models/payment.model";
import { CashfreeClient } from "@/payments-backup/clients/cashfree.client";

export const verifyPaymentHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    console.log("VerifyPaymentHandler called with orderId:", orderId);

    if (!orderId) {
      res.status(400).json({ success: false, message: "Order ID required" });
      return;
    }

    // Get our order from database
    const order = await OrderModel.findOne({
      $or: [{ _id: orderId }, { cfOrderId: orderId }],
    });

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    console.log("Found order:", {
      _id: order._id,
      orderNumber: order.orderNumber,
      merchantOrderId: order.merchantOrderId,
      cfOrderId: (order.metadata as any)?.cfOrderId,
      status: order.status,
    });

    // Verify payment session with Cashfree using merchantOrderId
    const cf = new CashfreeClient();
    console.log(
      "Attempting to fetch payment session from Cashfree with merchantOrderId:",
      order.merchantOrderId
    );

    const cfOrder = await cf.fetchPaymentSession(order.merchantOrderId!);
    console.log(
      "Successfully fetched payment session with merchantOrderId:",
      order.merchantOrderId
    );

    // Update order status based on Cashfree payment session response
    const cfStatus = cfOrder.order_status;
    let newStatus = order.status;

    // Map Cashfree statuses to our internal statuses
    if (cfStatus === "PAID") {
      newStatus = "PAID";
    } else if (cfStatus === "EXPIRED") {
      newStatus = "EXPIRED";
    } else if (cfStatus === "TERMINATED") {
      newStatus = "TERMINATED";
    } else if (cfStatus === "ACTIVE") {
      // Keep as ACTIVE if still processing
      newStatus = "ACTIVE";
    }

    console.log(
      `Order ${orderId}: CF Status=${cfStatus}, Current=${order.status}, New=${newStatus}`
    );

    // Update database if status changed
    if (newStatus !== order.status) {
      await OrderModel.updateOne({ _id: order._id }, { status: newStatus });
    }

    // Fetch and update payments from Cashfree payment session
    try {
      console.log(
        "Fetching payments from Cashfree payment session for merchantOrderId:",
        order.merchantOrderId
      );
      const cfPayments = await cf.fetchPayments(order.merchantOrderId!);
      console.log("Fetched payments from Cashfree:", cfPayments);

      if (cfPayments && Array.isArray(cfPayments)) {
        for (const payment of cfPayments) {
          if (payment.cf_payment_id) {
            // Create or update payment with actual data from Cashfree
            const paymentData = {
              // Don't update cfPaymentId - keep it consistent
              paymentGroup: payment.payment_group,
              methodPayload: payment.payment_method,
              amount: payment.payment_amount,
              currency: payment.payment_currency,
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
              orderId: order._id,
              "metadata.cf_order_id": order.merchantOrderId, // Find by Cashfree order ID in metadata
            });

            if (existingPayment) {
              // Update existing payment record with actual payment data
              await PaymentModel.updateOne(
                { _id: existingPayment._id },
                { $set: paymentData }
              );
              console.log(
                "Updated existing payment record with cfPaymentId:",
                payment.cf_payment_id
              );
            } else {
              // Create new payment record if none exists (fallback)
              await PaymentModel.create(paymentData);
              console.log(
                "Created new payment record with cfPaymentId:",
                payment.cf_payment_id
              );
            }
          }
        }
      } else {
        // If no payments found from Cashfree, create a payment record based on payment session status
        console.log(
          "No payments found from Cashfree payment session, creating payment based on session status"
        );

        let paymentStatus = "PENDING";
        let paymentMessage = "Payment initiated - awaiting user action";

        if (cfStatus === "PAID") {
          paymentStatus = "SUCCESS";
          paymentMessage = "Payment completed successfully";
        } else if (cfStatus === "EXPIRED") {
          paymentStatus = "FAILED";
          paymentMessage = "Payment expired";
        } else if (cfStatus === "TERMINATED") {
          paymentStatus = "FAILED";
          paymentMessage = "Payment terminated";
        }

        // Create payment record with order data
        const paymentData = {
          orderId: order._id,
          cfPaymentId: null,
          paymentGroup: null,
          methodPayload: null,
          amount: order.orderAmount,
          currency: order.orderCurrency,
          status: paymentStatus,
          paymentMessage: paymentMessage,
          bankReference: null,
          authorization: null,
          paymentTime: new Date(),
          paymentCompletionTime: undefined,
          errorDetails:
            cfStatus === "EXPIRED" || cfStatus === "TERMINATED"
              ? {
                  error_code: cfStatus,
                  error_description: paymentMessage,
                  error_reason:
                    "Payment session status indicates payment failure",
                  error_source: "CASHFREE_PAYMENT_SESSION_STATUS",
                }
              : null,
        };

        const createdPayment = await PaymentModel.create(paymentData);
        console.log(
          "Created payment based on payment session status:",
          paymentStatus
        );

        // Add payment reference to order
        if (createdPayment) {
          await OrderModel.updateOne(
            { _id: order._id },
            { $addToSet: { payments: createdPayment._id } }
          );
        }
      }
    } catch (paymentError) {
      console.error("Error fetching payments from Cashfree:", paymentError);

      // Fallback: Create payment record based on payment session status even if payment fetch fails
      console.log(
        "Payment fetch failed, creating payment based on payment session status"
      );

      let paymentStatus = "PENDING";
      let paymentMessage = "Payment initiated - awaiting user action";

      if (cfStatus === "PAID") {
        paymentStatus = "SUCCESS";
        paymentMessage = "Payment completed successfully";
      } else if (cfStatus === "EXPIRED") {
        paymentStatus = "FAILED";
        paymentMessage = "Payment expired";
      } else if (cfStatus === "TERMINATED") {
        paymentStatus = "FAILED";
        paymentMessage = "Payment terminated";
      }

      // Create payment record with order data
      const paymentData = {
        orderId: order._id,
        cfPaymentId: null,
        paymentGroup: null,
        methodPayload: null,
        amount: order.orderAmount,
        currency: order.orderCurrency,
        status: paymentStatus,
        paymentMessage: paymentMessage,
        bankReference: null,
        authorization: null,
        paymentTime: new Date(),
        paymentCompletionTime: undefined,
        errorDetails:
          cfStatus === "EXPIRED" || cfStatus === "TERMINATED"
            ? {
                error_code: cfStatus,
                error_description: paymentMessage,
                error_reason:
                  "Payment session status indicates payment failure",
                error_source: "CASHFREE_PAYMENT_SESSION_STATUS",
              }
            : null,
      };

      const createdPayment = await PaymentModel.create(paymentData);
      console.log(
        "Created payment based on payment session status (fallback):",
        paymentStatus
      );

      // Add payment reference to order
      if (createdPayment) {
        await OrderModel.updateOne(
          { _id: order._id },
          { $addToSet: { payments: createdPayment._id } }
        );
      }
    }

    // Get payments for this order
    const payments = await PaymentModel.find({
      orderId: order._id,
    }).lean();

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        cfOrderId: (order.metadata as any)?.cfOrderId,
        status: newStatus,
        cfStatus,
        orderAmount: order.orderAmount,
        orderCurrency: order.orderCurrency,
        payments: payments,
      },
    });
  } catch (error: unknown) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Payment verification failed",
    });
  }
};
