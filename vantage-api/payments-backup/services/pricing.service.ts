import { ProgramModel } from "@/courses/courses.model";
import { Types } from "mongoose";
import { CurrencyService } from "@/currency/currency.service";
import {
  PricingInput,
  PricingResult,
} from "@/types/payments-backup/orders.types";

export class PricingService {
  static async compute(input: PricingInput): Promise<PricingResult> {
    const idOrSlug = String(input.programId);

    // Find by ObjectId, or by programId, or by slug
    let program =
      (Types.ObjectId.isValid(idOrSlug)
        ? await ProgramModel.findById(idOrSlug).lean()
        : null) ||
      (await ProgramModel.findOne({ programId: idOrSlug }).lean()) ||
      (await ProgramModel.findOne({ slug: idOrSlug }).lean());

    if (!program) {
      throw new Error("Program not found");
    }

    // Expect pricing object on program; try root first then sections fallback
    const pricing =
      (program as any).pricing ||
      (program as any).sections?.admissionScholarshipFees?.pricing ||
      {};
    const programCurrency: string = pricing.currency || "INR";
    const baseAmount: number = Number(
      pricing.tuition || pricing.total || pricing.amount || 0
    );
    if (!baseAmount || baseAmount <= 0) {
      throw new Error("Program pricing is missing or invalid");
    }

    const selectedCurrency = (
      input.selectedCurrency || programCurrency
    ).toUpperCase();
    let orderAmount = baseAmount;
    let fx: PricingResult["fx"] = null;

    if (selectedCurrency !== programCurrency) {
      const converted = await CurrencyService.getInstance().convertCurrency(
        programCurrency,
        selectedCurrency,
        baseAmount
      );
      orderAmount = converted.convertedAmount;
      fx = {
        fromCurrency: converted.fromCurrency,
        toCurrency: converted.toCurrency,
        rate: converted.rate,
        conversionDate: converted.conversionDate,
      };
    }

    return {
      orderAmount: Number(orderAmount.toFixed(2)),
      orderCurrency: selectedCurrency,
      pricingSnapshot: pricing,
      programCurrency,
      selectedCurrency,
      fx,
    };
  }
}
