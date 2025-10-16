import { PricingService } from "@/payments-backup/services/pricing.service";

jest.mock("@/courses/courses.model", () => ({
  ProgramModel: {
    findById: jest.fn().mockReturnValue({
      lean: () => ({ pricing: { currency: "INR", total: 1000 } }),
    }),
  },
}));

jest.mock("@/currency/currency.service", () => ({
  CurrencyService: {
    getInstance: () => ({
      convertCurrency: async () => ({
        fromCurrency: "INR",
        toCurrency: "USD",
        rate: 0.012,
        conversionDate: new Date(),
        convertedAmount: 12,
      }),
    }),
  },
}));

describe("PricingService.compute", () => {
  it("computes with conversion and snapshot", async () => {
    const res = await PricingService.compute({
      programId: "id",
      selectedCurrency: "USD",
    });
    expect(res.orderCurrency).toBe("USD");
    expect(res.programCurrency).toBe("INR");
    expect(res.fx?.rate).toBeGreaterThan(0);
    expect(res.pricingSnapshot?.currency).toBe("INR");
  });
});
