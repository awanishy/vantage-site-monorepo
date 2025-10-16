import { Request, Response } from "express";
import { ProgramModel } from "@courses/courses.model";
import { ProgramBase } from "@/types/courses/courses.types";
import {
  GetPricingRequest,
  GetPricingResponse,
} from "@/types/payments/payments.types";
import { CurrencyService } from "@/currency/currency.service";

export const getPricingHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { programId, selectedCurrency }: GetPricingRequest = req.body;

    if (!programId || !selectedCurrency) {
      res.status(400).json({
        success: false,
        message: "Program ID and selected currency are required",
      });
      return;
    }

    // Find program by programId (simple single query)
    const programDoc = (await ProgramModel.findOne({
      programId: programId,
    }).lean()) as ProgramBase | null;

    if (!programDoc) {
      res.status(404).json({
        success: false,
        message: "Program not found",
      });
      return;
    }

    // Calculate pricing
    const programCurrency = programDoc.pricing?.currency || "USD";
    const tuition = programDoc.pricing?.tuition || 0;
    const taxesIncluded = programDoc.pricing?.taxesIncluded || true;

    let totalAmount = tuition;
    let fx: any = undefined;

    // Handle currency conversion if needed
    if (selectedCurrency !== programCurrency) {
      try {
        const currencyService = CurrencyService.getInstance();
        const conversion = await currencyService.convertCurrency(
          programCurrency,
          selectedCurrency,
          tuition
        );

        totalAmount = Math.round(conversion.convertedAmount);
        fx = {
          fromCurrency: programCurrency,
          toCurrency: selectedCurrency,
          rate: conversion.rate,
          conversionDate: conversion.conversionDate.toISOString(),
        };
      } catch (error) {
        console.error("Currency conversion error:", error);
        // Fallback to mock rate if conversion fails
        const mockRate = selectedCurrency === "INR" ? 88.86 : 1;
        totalAmount = Math.round(tuition * mockRate);
        fx = {
          fromCurrency: programCurrency,
          toCurrency: selectedCurrency,
          rate: mockRate,
          conversionDate: new Date().toISOString(),
        };
      }
    }

    const response: GetPricingResponse = {
      programId: programDoc.programId,
      programSlug: programDoc.slug,
      programName: programDoc.title,
      programCurrency,
      selectedCurrency,
      pricing: {
        currency: selectedCurrency,
        tuition: totalAmount,
        taxesIncluded,
        totalAmount,
      },
      fx,
      pricingVersion: "v1",
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Get pricing error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get pricing",
      error: error.message,
    });
  }
};
