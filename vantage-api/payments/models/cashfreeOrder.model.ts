import mongoose, { Schema, Document } from "mongoose";

export interface CashfreeOrderDoc extends Document {
  // Reference to our internal order
  orderId: mongoose.Types.ObjectId;

  // Cashfree order fields (from Create Order response)
  cfOrderId: string; // Cashfree's unique order ID
  merchantOrderId: string; // Our order ID (sent to Cashfree)
  entity: string; // "order"
  orderCurrency: string;
  orderAmount: number;
  orderStatus:
    | "ACTIVE"
    | "PAID"
    | "EXPIRED"
    | "TERMINATED"
    | "TERMINATION_REQUESTED";
  paymentSessionId: string;
  orderExpiryTime?: Date;
  orderNote?: string;
  createdAtCF?: Date; // Created at Cashfree

  // Order configuration
  orderSplits?: Array<{
    vendor_id: string;
    amount?: number;
    percentage?: number;
    tags?: Record<string, any>;
  }>;
  orderTags?: Record<string, any>;
  orderMeta?: {
    return_url?: string;
    notify_url?: string;
    payment_methods?: string;
    payment_methods_filters?: any;
  };

  // Customer details
  customerDetails?: {
    customer_id: string;
    customer_email: string;
    customer_phone: string;
    customer_name: string;
    customer_bank_account_number?: string;
    customer_bank_ifsc?: string;
    customer_bank_code?: number;
    customer_uid?: string;
  };

  // Product configuration
  products?: {
    one_click_checkout?: {
      enabled: boolean;
      conditions: any[];
    };
    verify_pay?: {
      enabled: boolean;
      conditions: any[];
    };
  };

  // Cart details
  cartDetails?: {
    cart_id?: string;
    cart_name?: string;
    customer_note?: string;
    shipping_charge?: number;
    customer_shipping_address?: any;
    customer_billing_address?: any;
    cart_items?: any[];
  };

  // Terminal data
  terminalData?: {
    agent_mobile_number?: string;
    cf_terminal_id?: number;
    merchant_terminal_id?: string;
    terminal_type?: string;
  };

  // Status tracking
  isActive: boolean; // Whether this Cashfree order is still active
  lastUpdatedAt: Date; // Last time this was updated from Cashfree

  createdAt: Date;
  updatedAt: Date;
}

const CashfreeOrderSchema = new Schema<CashfreeOrderDoc>(
  {
    // Reference to our internal order
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Cashfree order fields
    cfOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    merchantOrderId: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      default: "order",
    },
    orderCurrency: {
      type: String,
      required: true,
      default: "INR",
    },
    orderAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderStatus: {
      type: String,
      enum: [
        "ACTIVE",
        "PAID",
        "EXPIRED",
        "TERMINATED",
        "TERMINATION_REQUESTED",
      ],
      default: "ACTIVE",
    },
    paymentSessionId: {
      type: String,
      required: true,
    },
    orderExpiryTime: Date,
    orderNote: String,
    createdAtCF: Date,

    // Order configuration
    orderSplits: [
      {
        vendor_id: String,
        amount: Number,
        percentage: Number,
        tags: Schema.Types.Mixed,
      },
    ],
    orderTags: Schema.Types.Mixed,
    orderMeta: {
      return_url: String,
      notify_url: String,
      payment_methods: String,
      payment_methods_filters: Schema.Types.Mixed,
    },

    // Customer details
    customerDetails: {
      customer_id: String,
      customer_email: String,
      customer_phone: String,
      customer_name: String,
      customer_bank_account_number: String,
      customer_bank_ifsc: String,
      customer_bank_code: Number,
      customer_uid: String,
    },

    // Product configuration
    products: {
      one_click_checkout: {
        enabled: Boolean,
        conditions: [Schema.Types.Mixed],
      },
      verify_pay: {
        enabled: Boolean,
        conditions: [Schema.Types.Mixed],
      },
    },

    // Cart details
    cartDetails: {
      cart_id: String,
      cart_name: String,
      customer_note: String,
      shipping_charge: Number,
      customer_shipping_address: Schema.Types.Mixed,
      customer_billing_address: Schema.Types.Mixed,
      cart_items: [Schema.Types.Mixed],
    },

    // Terminal data
    terminalData: {
      agent_mobile_number: String,
      cf_terminal_id: Number,
      merchant_terminal_id: String,
      terminal_type: String,
    },

    // Status tracking
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CashfreeOrderSchema.index({ orderId: 1, isActive: 1 });
// Note: cfOrderId index is automatically created by unique: true
CashfreeOrderSchema.index({ paymentSessionId: 1 });
CashfreeOrderSchema.index({ orderStatus: 1 });
CashfreeOrderSchema.index({ orderExpiryTime: 1 });
CashfreeOrderSchema.index({ orderId: 1 });
CashfreeOrderSchema.index({ merchantOrderId: 1 });
CashfreeOrderSchema.index({ isActive: 1 });

export const CashfreeOrderModel = mongoose.model<CashfreeOrderDoc>(
  "CashfreeOrder",
  CashfreeOrderSchema
);
