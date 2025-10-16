import mongoose, { Schema, Document } from "mongoose";

export interface PaymentDoc extends Document {
  // Our internal fields
  orderId: mongoose.Types.ObjectId;
  cashfreeOrderId: mongoose.Types.ObjectId; // Reference to CashfreeOrder
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "USER_DROPPED";
  paymentMessage?: string;
  bankReference?: string;
  paymentTime?: Date;
  paymentCompletionTime?: Date;

  // Cashfree payment fields (from webhooks and API responses)
  cfOrderId: string; // Cashfree Order ID
  cfPaymentId?: string; // Cashfree Payment ID
  paymentSessionId: string; // For hosted checkout
  entity?: string; // "payment"
  paymentGroup?: string; // upi, credit_card, etc.
  methodPayload?: {
    // UPI
    upi?: {
      channel?: string;
      upi_id?: string;
      upi_instrument?: string;
      upi_instrument_number?: string;
      upi_payer_ifsc?: string;
      upi_payer_account_number?: string;
    };
    // Card
    card?: {
      channel?: string;
      card_number?: string;
      card_network?: string;
      card_type?: string;
      card_sub_type?: string;
      card_country?: string;
      card_bank_name?: string;
      card_network_reference_id?: string;
      instrument_id?: string;
    };
    // Net Banking
    netbanking?: {
      channel?: string;
      netbanking_bank_code?: string;
      netbanking_bank_name?: string;
    };
    // Wallet
    wallet?: {
      channel?: string;
      provider?: string;
    };
    // Pay Later
    paylater?: {
      channel?: string;
      provider?: string;
    };
    // EMI
    cardless_emi?: {
      channel?: string;
      provider?: string;
    };
    debit_card_emi?: {
      channel?: string;
      provider?: string;
    };
    credit_card_emi?: {
      channel?: string;
      provider?: string;
    };
  };
  authorization?: {
    action?: string;
    status?: string;
    captured_amount?: number;
    start_time?: Date;
    end_time?: Date;
    approve_by?: Date;
    action_reference?: string;
    action_time?: Date;
  };
  isCaptured?: boolean;
  internationalPayment?: {
    international: boolean;
  };
  paymentSurcharge?: {
    payment_surcharge_service_charge?: number;
    payment_surcharge_service_tax?: number;
  };
  errorDetails?: {
    errorCode?: string;
    errorDescription?: string;
    errorReason?: string;
    errorSource?: string;
    errorSubcodeRaw?: string;
  };

  // Customer details from webhook
  customerDetails?: {
    customer_name?: string;
    customer_id?: string;
    customer_email?: string;
    customer_phone?: string;
  };

  // Payment gateway details from webhook
  paymentGatewayDetails?: {
    gateway_name?: string;
    gateway_order_id?: string;
    gateway_payment_id?: string;
    gateway_order_reference_id?: string;
    gateway_settlement?: string;
    gateway_status_code?: string;
  };

  // Payment offers from webhook
  paymentOffers?: Array<{
    offer_id?: string;
    offer_type?: string;
    offer_meta?: {
      offer_title?: string;
      offer_description?: string;
      offer_code?: string;
      offer_start_time?: Date;
      offer_end_time?: Date;
    };
    offer_redemption?: {
      redemption_status?: string;
      discount_amount?: number;
      cashback_amount?: number;
    };
  }>;

  // Terminal details from webhook
  terminalDetails?: {
    cf_terminal_id?: number;
    terminal_phone?: string;
  };

  // Auth ID from webhook
  authId?: string;

  // Metadata for tracking
  metadata: {
    sessionCreatedAt: Date;
    source:
      | "payment_session_creation"
      | "webhook_update"
      | "manual_verification";
    webhookReceivedAt?: Date;
    verificationAttempts?: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<PaymentDoc>(
  {
    // Our internal fields
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
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
      enum: ["PENDING", "SUCCESS", "FAILED", "USER_DROPPED"],
      default: "PENDING",
    },
    paymentMessage: String,
    bankReference: String,
    paymentTime: Date,
    paymentCompletionTime: Date,

    // Cashfree payment fields
    cfOrderId: {
      type: String,
      required: true,
    },
    cfPaymentId: {
      type: String,
    },
    paymentSessionId: {
      type: String,
      required: true,
    },
    entity: String,
    paymentGroup: String,
    methodPayload: Schema.Types.Mixed,
    authorization: {
      action: String,
      status: String,
      captured_amount: Number,
      start_time: Date,
      end_time: Date,
      approve_by: Date,
      action_reference: String,
      action_time: Date,
    },
    isCaptured: Boolean,
    internationalPayment: {
      international: Boolean,
    },
    paymentSurcharge: {
      payment_surcharge_service_charge: Number,
      payment_surcharge_service_tax: Number,
    },
    errorDetails: {
      errorCode: String,
      errorDescription: String,
      errorReason: String,
      errorSource: String,
      errorSubcodeRaw: String,
    },

    // Customer details
    customerDetails: {
      customer_name: String,
      customer_id: String,
      customer_email: String,
      customer_phone: String,
    },

    // Payment gateway details
    paymentGatewayDetails: {
      gateway_name: String,
      gateway_order_id: String,
      gateway_payment_id: String,
      gateway_order_reference_id: String,
      gateway_settlement: String,
      gateway_status_code: String,
    },

    // Payment offers
    paymentOffers: [
      {
        offer_id: String,
        offer_type: String,
        offer_meta: {
          offer_title: String,
          offer_description: String,
          offer_code: String,
          offer_start_time: Date,
          offer_end_time: Date,
        },
        offer_redemption: {
          redemption_status: String,
          discount_amount: Number,
          cashback_amount: Number,
        },
      },
    ],

    // Terminal details
    terminalDetails: {
      cf_terminal_id: Number,
      terminal_phone: String,
    },

    // Auth ID
    authId: String,

    // Metadata
    metadata: {
      sessionCreatedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      source: {
        type: String,
        enum: [
          "payment_session_creation",
          "webhook_update",
          "manual_verification",
        ],
        default: "payment_session_creation",
      },
      webhookReceivedAt: Date,
      verificationAttempts: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PaymentSchema.index({ orderId: 1, status: 1 });
PaymentSchema.index({ cashfreeOrderId: 1 });
PaymentSchema.index({ cfOrderId: 1 });
PaymentSchema.index({ cfPaymentId: 1 });
PaymentSchema.index({ paymentSessionId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ orderId: 1 });

export const PaymentModel = mongoose.model<PaymentDoc>(
  "Payment",
  PaymentSchema
);
