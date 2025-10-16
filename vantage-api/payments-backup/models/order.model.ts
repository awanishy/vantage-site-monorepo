import mongoose, { Schema, Document, Types } from "mongoose";
import { OrderStatus, OrderDoc } from "@/types/payments-backup/orders.types";

const OrderSchema = new Schema<OrderDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderType: {
      type: String,
      enum: ["PROGRAM_PURCHASE", "COURSE_ENROLLMENT", "SUBSCRIPTION"],
      default: "PROGRAM_PURCHASE",
      index: true,
    },
    orderAmount: { type: Number, required: true },
    merchantOrderId: { type: String, index: true },
    orderCurrency: { type: String, required: true, default: "INR" },
    programCurrency: { type: String },
    selectedCurrency: { type: String },
    fx: {
      type: {
        fromCurrency: { type: String, required: true },
        toCurrency: { type: String, required: true },
        rate: { type: Number, required: true },
        conversionDate: { type: Date },
      },
      default: null,
    },
    pricingSnapshot: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: [
        "ACTIVE",
        "PAID",
        "EXPIRED",
        "TERMINATED",
        "TERMINATION_REQUESTED",
      ],
      default: "ACTIVE",
      index: true,
    },
    orderNote: { type: String },
    expiresAt: {
      type: Date,
      default: function () {
        // Order expires in 24 hours by default
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      },
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ programId: 1, status: 1 });

export const OrderModel =
  (mongoose.models.Order as mongoose.Model<OrderDoc>) ||
  mongoose.model<OrderDoc>("Order", OrderSchema);
