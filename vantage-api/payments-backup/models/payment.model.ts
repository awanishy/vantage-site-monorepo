import mongoose, { Schema, Document, Types } from "mongoose";
import {
  PaymentDoc,
  PaymentStatus,
} from "@/types/payments-backup/payments.types";

const PaymentSchema = new Schema<PaymentDoc>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    cfPaymentId: { type: String, index: true },
    paymentGroup: { type: String },
    methodPayload: { type: Schema.Types.Mixed },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "USER_DROPPED"],
      default: "PENDING",
      index: true,
    },
    paymentMessage: { type: String },
    bankReference: { type: String },
    errorDetails: { type: Schema.Types.Mixed, default: null },
    authorization: { type: Schema.Types.Mixed, default: null },
    paymentTime: { type: Date },
    paymentCompletionTime: { type: Date },
  },
  { timestamps: true }
);

PaymentSchema.index({ createdAt: -1 });

export const PaymentModel =
  (mongoose.models.Payment as mongoose.Model<PaymentDoc>) ||
  mongoose.model<PaymentDoc>("Payment", PaymentSchema);
