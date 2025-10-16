import mongoose, { Schema, Document } from "mongoose";

export interface RefundDoc extends Document {
  // Our internal fields
  orderId: mongoose.Types.ObjectId;
  paymentId: mongoose.Types.ObjectId;
  cashfreeOrderId: mongoose.Types.ObjectId; // Reference to CashfreeOrder
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  reason?: string;

  // Cashfree refund fields (from Create Refund response and webhooks)
  cfRefundId: string; // Cashfree refund ID (unique)
  refundId: string; // Cashfree refund reference
  cfPaymentId: string; // Original payment ID
  cfOrderId: string; // Original order ID

  // Refund details
  arn?: string; // Acquirer Reference Number
  charge?: number; // Refund charge
  statusDescription?: string;
  mode?: string; // Refund mode
  speed?: string; // Refund speed

  // Timestamps from Cashfree
  createdAtCF?: Date; // Created at Cashfree
  processedAtCF?: Date; // Processed at Cashfree

  // Refund splits
  splits?: Array<{
    vendor_id: string;
    amount?: number;
    percentage?: number;
    tags?: Record<string, any>;
  }>;

  // Additional metadata
  metadata?: Record<string, any>;

  // Webhook tracking
  webhookReceivedAt?: Date;
  webhookAttempts?: number;

  createdAt: Date;
  updatedAt: Date;
}

const RefundSchema = new Schema<RefundDoc>(
  {
    // Our internal fields
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    cashfreeOrderId: {
      type: Schema.Types.ObjectId,
      ref: "CashfreeOrder",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    reason: String,

    // Cashfree refund fields
    cfRefundId: {
      type: String,
      required: true,
      unique: true,
    },
    refundId: {
      type: String,
      required: true,
    },
    cfPaymentId: {
      type: String,
      required: true,
    },
    cfOrderId: {
      type: String,
      required: true,
    },

    // Refund details
    arn: String,
    charge: Number,
    statusDescription: String,
    mode: String,
    speed: String,

    // Timestamps from Cashfree
    createdAtCF: Date,
    processedAtCF: Date,

    // Refund splits
    splits: [
      {
        vendor_id: String,
        amount: Number,
        percentage: Number,
        tags: Schema.Types.Mixed,
      },
    ],

    // Additional metadata
    metadata: Schema.Types.Mixed,

    // Webhook tracking
    webhookReceivedAt: Date,
    webhookAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RefundSchema.index({ orderId: 1, status: 1 });
RefundSchema.index({ paymentId: 1, status: 1 });
RefundSchema.index({ cashfreeOrderId: 1 });
// Note: cfRefundId index is automatically created by unique: true
RefundSchema.index({ refundId: 1 });
RefundSchema.index({ cfPaymentId: 1 });
RefundSchema.index({ cfOrderId: 1 });
RefundSchema.index({ orderId: 1 });
RefundSchema.index({ paymentId: 1 });
RefundSchema.index({ status: 1 });

export const RefundModel = mongoose.model<RefundDoc>("Refund", RefundSchema);
