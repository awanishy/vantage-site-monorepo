import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
  // Our internal fields only
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  programId: string;
  orderAmount: number;
  orderCurrency: string;
  programCurrency: string;
  selectedCurrency: string;
  fx?: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    conversionDate: Date;
  };
  pricingSnapshot: {
    currency: string;
    tuition: number;
    taxesIncluded: boolean;
  };
  status: "ACTIVE" | "PAID" | "EXPIRED" | "CANCELLED";
  orderNote?: string;
  expiresAt: Date;
  metadata: {
    source: "authenticated_user" | "guest_user";
    programSlug: string;
    pricingVersion: string;
  };
  payments: mongoose.Types.ObjectId[]; // References to PaymentModel

  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<OrderDoc>(
  {
    // Our internal fields only
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    programId: {
      type: String,
      required: true,
    },
    orderAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderCurrency: {
      type: String,
      required: true,
      default: "INR",
    },
    programCurrency: {
      type: String,
      required: true,
      default: "USD",
    },
    selectedCurrency: {
      type: String,
      required: true,
      default: "INR",
    },
    fx: {
      fromCurrency: String,
      toCurrency: String,
      rate: Number,
      conversionDate: Date,
    },
    pricingSnapshot: {
      currency: String,
      tuition: Number,
      taxesIncluded: Boolean,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "PAID", "EXPIRED", "CANCELLED"],
      default: "ACTIVE",
    },
    orderNote: {
      type: String,
      maxlength: 200,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    metadata: {
      source: {
        type: String,
        enum: ["authenticated_user", "guest_user"],
        required: true,
      },
      programSlug: String,
      pricingVersion: String,
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
OrderSchema.index({ userId: 1, status: 1 });
// Note: orderNumber index is automatically created by unique: true
OrderSchema.index({ expiresAt: 1 });
OrderSchema.index({ programId: 1 });
OrderSchema.index({ status: 1 });

export const OrderModel = mongoose.model<OrderDoc>("Order", OrderSchema);
