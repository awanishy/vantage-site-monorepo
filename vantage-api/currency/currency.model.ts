import mongoose, { Schema } from "mongoose";
import { ICurrency, ICurrencyRate } from "@/types/currency.types";

const currencyRateSchema = new Schema({
  exchangeDate: {
    type: Date,
    required: true,
    index: true,
  },
  fromCurrency: {
    type: String,
    required: true,
    uppercase: true,
  },
  toCurrency: {
    type: String,
    required: true,
    uppercase: true,
  },
  exchangeRate: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient queries
currencyRateSchema.index({ fromCurrency: 1, toCurrency: 1, exchangeDate: -1 });

const currencySchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      default: "",
    },
    flag: {
      type: String, // flag paths
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one base currency
currencySchema.pre("save", async function (next) {
  if (this.isBase) {
    await Currency.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isBase: false } }
    );
  }
  next();
});

export const CurrencyRate = mongoose.model<ICurrencyRate>(
  "CurrencyRate",
  currencyRateSchema
);
export const Currency = mongoose.model<ICurrency>("Currency", currencySchema);
