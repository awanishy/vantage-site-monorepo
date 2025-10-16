import { Request, Response } from "express";
import { OrderModel } from "@/payments/models/order.model";
import { CashfreeOrderModel } from "@/payments/models/cashfreeOrder.model";
import { PaymentModel } from "@/payments/models/payment.model";
import { RefundModel } from "@/payments/models/refund.model";
import {
  PaymentWebhookData,
  RefundWebhookData,
} from "@/types/payments/cashfree.types";
import { WebhookResponse } from "@/types/payments/payments.types";

export const webhookHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Parse the raw buffer data to JSON
    let webhookData;
    if (Buffer.isBuffer(req.body)) {
      try {
        webhookData = JSON.parse(req.body.toString());
      } catch (parseError) {
        console.error("Failed to parse webhook body:", parseError);
        res.status(400).json({
          success: false,
          message: "Invalid webhook data format",
        });
        return;
      }
    } else {
      webhookData = req.body;
    }

    const webhookType = webhookData.type;

    console.log(
      `[Webhook] Received ${webhookType} webhook:`,
      JSON.stringify(webhookData, null, 2)
    );

    // Handle different webhook types
    switch (webhookType) {
      case "PAYMENT_SUCCESS_WEBHOOK":
        await handlePaymentSuccessWebhook(webhookData as PaymentWebhookData);
        break;
      case "PAYMENT_FAILED_WEBHOOK":
        await handlePaymentFailedWebhook(webhookData as PaymentWebhookData);
        break;
      case "PAYMENT_USER_DROPPED_WEBHOOK":
        await handlePaymentUserDroppedWebhook(
          webhookData as PaymentWebhookData
        );
        break;
      case "REFUND_SUCCESS_WEBHOOK":
        await handleRefundSuccessWebhook(webhookData as RefundWebhookData);
        break;
      case "REFUND_FAILED_WEBHOOK":
        await handleRefundFailedWebhook(webhookData as RefundWebhookData);
        break;
      case "PAYMENT_CHARGES_WEBHOOK":
        // Payment charges webhook - treat as payment success
        console.log("[Webhook] Processing payment charges webhook");
        await handlePaymentSuccessWebhook(webhookData as PaymentWebhookData);
        break;
      default:
        console.log(`[Webhook] Unknown webhook type: ${webhookType}`);
        console.log(
          "[Webhook] Webhook data structure:",
          JSON.stringify(webhookData, null, 2)
        );
        break;
    }

    const response: WebhookResponse = {
      success: true,
      message: "Webhook processed successfully",
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Webhook processing error:", error);

    const response: WebhookResponse = {
      success: false,
      message: "Webhook processing failed",
    };

    res.status(500).json(response);
  }
};

// ============================================================================
// PAYMENT WEBHOOK HANDLERS
// ============================================================================

async function handlePaymentSuccessWebhook(
  webhookData: PaymentWebhookData
): Promise<void> {
  const { data } = webhookData;
  const { order, payment } = data;

  console.log(
    `[Webhook] Processing payment success for order: ${order.order_id}`
  );

  // Find order by merchantOrderId in CashfreeOrderModel (this is the reliable way)
  const cashfreeOrder = await CashfreeOrderModel.findOne({
    merchantOrderId: order.order_id,
  }).lean();

  if (!cashfreeOrder) {
    console.error(
      `[Webhook] Cashfree order not found for merchantOrderId: ${order.order_id}`
    );
    return;
  }

  // Get the internal order
  const orderDoc = await OrderModel.findById(cashfreeOrder.orderId).lean();
  if (!orderDoc) {
    console.error(
      `[Webhook] Internal order not found for ID: ${cashfreeOrder.orderId}`
    );
    return;
  }

  // First check if payment with this cfPaymentId already exists
  let existingPayment = await PaymentModel.findOne({
    cfPaymentId: payment.cf_payment_id.toString(),
  });

  if (existingPayment) {
    console.log(
      `[Webhook] Payment with cfPaymentId ${payment.cf_payment_id} already exists, skipping duplicate`
    );
    return;
  }

  // Find existing PENDING payment record
  existingPayment = await PaymentModel.findOne({
    orderId: orderDoc._id,
    status: "PENDING",
  }).sort({ createdAt: -1 });

  if (existingPayment) {
    console.log(
      `[Webhook] Found PENDING payment to update: ${existingPayment._id}`
    );

    // Update existing PENDING payment record
    await PaymentModel.updateOne(
      { _id: existingPayment._id },
      {
        $set: {
          cfPaymentId: payment.cf_payment_id.toString(),
          status: "SUCCESS",
          paymentMessage: payment.payment_message,
          bankReference: payment.bank_reference,
          paymentTime: new Date(payment.payment_time),
          paymentCompletionTime: new Date(
            payment.payment_completion_time || payment.payment_time
          ),
          paymentGroup: payment.payment_group,
          methodPayload: payment.payment_method,
          authorization: payment.authorization,
          isCaptured: payment.is_captured,
          internationalPayment: payment.international_payment,
          paymentSurcharge: payment.payment_surcharge,
          customerDetails: data.customer_details,
          paymentGatewayDetails: data.payment_gateway_details,
          paymentOffers: data.payment_offers,
          terminalDetails: data.terminal_details,
          authId: payment.auth_id,
          metadata: {
            ...existingPayment.metadata,
            source: "webhook_update",
            webhookReceivedAt: new Date(),
          },
        },
      }
    );

    // Ensure payment is in the order's payments array
    await OrderModel.updateOne(
      { _id: orderDoc._id },
      { $addToSet: { payments: existingPayment._id } }
    );
  } else {
    console.log(
      `[Webhook] No PENDING payment found, creating new payment record for retry: ${orderDoc.orderNumber}`
    );

    // Create new payment record for retry scenario
    const newPayment = await PaymentModel.create({
      orderId: orderDoc._id,
      cashfreeOrderId: cashfreeOrder._id,
      cfOrderId: cashfreeOrder.cfOrderId, // Use the order ID, not payment ID
      cfPaymentId: payment.cf_payment_id.toString(), // This is the payment ID
      paymentSessionId: cashfreeOrder.paymentSessionId,
      amount: orderDoc.orderAmount,
      currency: orderDoc.orderCurrency,
      status: "SUCCESS",
      paymentMessage: payment.payment_message,
      bankReference: payment.bank_reference,
      paymentTime: new Date(payment.payment_time),
      paymentCompletionTime: new Date(
        payment.payment_completion_time || payment.payment_time
      ),
      paymentGroup: payment.payment_group,
      methodPayload: payment.payment_method,
      authorization: payment.authorization,
      isCaptured: payment.is_captured,
      internationalPayment: payment.international_payment,
      paymentSurcharge: payment.payment_surcharge,
      customerDetails: data.customer_details,
      paymentGatewayDetails: data.payment_gateway_details,
      paymentOffers: data.payment_offers,
      terminalDetails: data.terminal_details,
      authId: payment.auth_id,
      metadata: {
        source: "webhook_update",
        webhookReceivedAt: new Date(),
        retryPayment: true,
      },
    });

    // Add payment reference to order
    await OrderModel.updateOne(
      { _id: orderDoc._id },
      { $addToSet: { payments: newPayment._id } }
    );
  }

  // Update order status to PAID
  await OrderModel.updateOne(
    { _id: orderDoc._id },
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

  console.log(
    `[Webhook] Payment success processed for order: ${orderDoc.orderNumber} (Payment ID: ${payment.cf_payment_id})`
  );
}

async function handlePaymentFailedWebhook(
  webhookData: PaymentWebhookData
): Promise<void> {
  const { data } = webhookData;
  const { order, payment } = data;

  console.log(
    `[Webhook] Processing payment failed for order: ${order.order_id}`
  );

  // Find order by merchantOrderId in CashfreeOrderModel
  const cashfreeOrder = await CashfreeOrderModel.findOne({
    merchantOrderId: order.order_id,
  }).lean();

  if (!cashfreeOrder) {
    console.error(
      `[Webhook] Cashfree order not found for merchantOrderId: ${order.order_id}`
    );
    return;
  }

  // Get the internal order
  const orderDoc = await OrderModel.findById(cashfreeOrder.orderId).lean();
  if (!orderDoc) {
    console.error(
      `[Webhook] Internal order not found for ID: ${cashfreeOrder.orderId}`
    );
    return;
  }

  // First check if payment with this cfPaymentId already exists
  let existingPayment = await PaymentModel.findOne({
    cfPaymentId: payment.cf_payment_id.toString(),
  });

  if (existingPayment) {
    console.log(
      `[Webhook] Payment with cfPaymentId ${payment.cf_payment_id} already exists, skipping duplicate`
    );
    return;
  }

  // Find existing PENDING payment record
  existingPayment = await PaymentModel.findOne({
    orderId: orderDoc._id,
    status: "PENDING",
  }).sort({ createdAt: -1 });

  if (existingPayment) {
    console.log(
      `[Webhook] Found PENDING payment to update: ${existingPayment._id}`
    );
    // Update payment status to FAILED
    await PaymentModel.updateOne(
      { _id: existingPayment._id },
      {
        $set: {
          cfPaymentId: payment.cf_payment_id.toString(),
          status: "FAILED",
          paymentMessage: payment.payment_message,
          errorDetails: payment.error_details,
          metadata: {
            ...existingPayment.metadata,
            source: "webhook_update",
            webhookReceivedAt: new Date(),
          },
        },
      }
    );

    // Update Cashfree order status to reflect payment failure
    await CashfreeOrderModel.updateOne(
      { _id: cashfreeOrder._id },
      {
        $set: {
          orderStatus: "ACTIVE", // Keep as ACTIVE for failed payments (user can retry)
          lastUpdatedAt: new Date(),
        },
      }
    );

    // Ensure payment is in the order's payments array
    await OrderModel.updateOne(
      { _id: orderDoc._id },
      { $addToSet: { payments: existingPayment._id } }
    );

    console.log(
      `[Webhook] Payment failed processed for order: ${orderDoc.orderNumber}`
    );
  }
}

async function handlePaymentUserDroppedWebhook(
  webhookData: PaymentWebhookData
): Promise<void> {
  const { data } = webhookData;
  const { order, payment } = data;

  console.log(
    `[Webhook] Processing payment user dropped for order: ${order.order_id}`
  );

  // Find order by merchantOrderId in CashfreeOrderModel
  const cashfreeOrder = await CashfreeOrderModel.findOne({
    merchantOrderId: order.order_id,
  }).lean();

  if (!cashfreeOrder) {
    console.error(
      `[Webhook] Cashfree order not found for merchantOrderId: ${order.order_id}`
    );
    return;
  }

  // Get the internal order
  const orderDoc = await OrderModel.findById(cashfreeOrder.orderId).lean();
  if (!orderDoc) {
    console.error(
      `[Webhook] Internal order not found for ID: ${cashfreeOrder.orderId}`
    );
    return;
  }

  // First check if payment with this cfPaymentId already exists
  let existingPayment = await PaymentModel.findOne({
    cfPaymentId: payment.cf_payment_id.toString(),
  });

  if (existingPayment) {
    console.log(
      `[Webhook] Payment with cfPaymentId ${payment.cf_payment_id} already exists, skipping duplicate`
    );
    return;
  }

  // Find existing PENDING payment record
  existingPayment = await PaymentModel.findOne({
    orderId: orderDoc._id,
    status: "PENDING",
  }).sort({ createdAt: -1 });

  if (existingPayment) {
    console.log(
      `[Webhook] Found PENDING payment to update: ${existingPayment._id}`
    );
    // Update payment status to USER_DROPPED
    await PaymentModel.updateOne(
      { _id: existingPayment._id },
      {
        $set: {
          cfPaymentId: payment.cf_payment_id.toString(),
          status: "USER_DROPPED",
          paymentMessage: "User dropped payment",
          metadata: {
            ...existingPayment.metadata,
            source: "webhook_update",
            webhookReceivedAt: new Date(),
          },
        },
      }
    );

    // Update Cashfree order status to reflect user dropped payment
    await CashfreeOrderModel.updateOne(
      { _id: cashfreeOrder._id },
      {
        $set: {
          orderStatus: "ACTIVE", // Keep as ACTIVE for user dropped payments (user can retry)
          lastUpdatedAt: new Date(),
        },
      }
    );

    // Ensure payment is in the order's payments array
    await OrderModel.updateOne(
      { _id: orderDoc._id },
      { $addToSet: { payments: existingPayment._id } }
    );

    console.log(
      `[Webhook] Payment user dropped processed for order: ${orderDoc.orderNumber}`
    );
  }
}

// ============================================================================
// REFUND WEBHOOK HANDLERS
// ============================================================================

async function handleRefundSuccessWebhook(
  webhookData: RefundWebhookData
): Promise<void> {
  const { data } = webhookData;
  const { refund } = data;

  console.log(
    `[Webhook] Processing refund success for refund: ${refund.refund_id}`
  );

  // Find refund record
  const refundDoc = await RefundModel.findOne({
    cfRefundId: refund.cf_refund_id,
  });

  if (refundDoc) {
    // Update refund status
    await RefundModel.updateOne(
      { _id: refundDoc._id },
      {
        $set: {
          status: "SUCCESS",
          arn: refund.refund_arn,
          charge: refund.refund_charge,
          statusDescription: refund.refund_status_description,
          mode: refund.refund_mode,
          speed: refund.refund_speed,
          processedAtCF: refund.refund_processed_at
            ? new Date(refund.refund_processed_at)
            : undefined,
          webhookReceivedAt: new Date(),
        },
      }
    );

    console.log(
      `[Webhook] Refund success processed for refund: ${refund.refund_id}`
    );
  }
}

async function handleRefundFailedWebhook(
  webhookData: RefundWebhookData
): Promise<void> {
  const { data } = webhookData;
  const { refund } = data;

  console.log(
    `[Webhook] Processing refund failed for refund: ${refund.refund_id}`
  );

  // Find refund record
  const refundDoc = await RefundModel.findOne({
    cfRefundId: refund.cf_refund_id,
  });

  if (refundDoc) {
    // Update refund status
    await RefundModel.updateOne(
      { _id: refundDoc._id },
      {
        $set: {
          status: "FAILED",
          statusDescription: refund.refund_status_description,
          webhookReceivedAt: new Date(),
        },
      }
    );

    console.log(
      `[Webhook] Refund failed processed for refund: ${refund.refund_id}`
    );
  }
}
