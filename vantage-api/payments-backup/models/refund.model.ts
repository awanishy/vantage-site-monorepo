import mongoose, { Schema, Document, Types } from "mongoose";
import { RefundDoc } from "@/types/payments-backup/refund.types";

const RefundSchema = new Schema<RefundDoc>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    cfPaymentId: { type: String, index: true },
    cfRefundId: { type: String, index: true },
    refundId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    status: {
      type: String,
      enum: ["SUCCESS", "PENDING", "CANCELLED", "ONHOLD", "FAILED"],
      default: "PENDING",
      index: true,
    },
    arn: { type: String, default: null },
    charge: { type: Number, default: null },
    statusDescription: { type: String, default: null },
    mode: { type: String, default: null },
    createdAtCF: { type: Date, default: null },
    processedAtCF: { type: Date, default: null },
    speed: { type: Schema.Types.Mixed, default: null },
    splits: {
      type: [
        {
          vendor_id: { type: String, required: true },
          amount: { type: Number },
          percentage: { type: Number },
        },
      ],
      default: null,
    },
    metadata: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

RefundSchema.index({ createdAt: -1 });

export const RefundModel =
  (mongoose.models.Refund as mongoose.Model<RefundDoc>) ||
  mongoose.model<RefundDoc>("Refund", RefundSchema);
