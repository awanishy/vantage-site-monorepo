import { Document } from 'mongoose';

export interface ICurrency extends Document {
  _id: string;
  code: string;
  name: string;
  symbol?: string;
  flag?: string; // Base64 encoded flag image
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICurrencyRate extends Document {
  _id: string;
  exchangeDate: Date;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  lastUpdated: Date;
}

export interface ICurrencyConversion {
  fromCurrency: string;
  toCurrency: string;
  originalAmount: number;
  convertedAmount: number;
  conversionDate: Date;
  rate: number;
}

export interface ICurrencyResponse {
  success: boolean;
  message?: string;
  data?: ICurrency | ICurrency[] | ICurrencyConversion | any;
  error?: string;
}

export interface ICurrencyInput {
  code: string;
  name: string;
  symbol?: string;
  flag?: string; // Base64 encoded flag image
  isActive?: boolean;
}
