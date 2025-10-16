import { Request, Response } from "express";
import { PricingService } from "@/payments-backup/services/pricing.service";

export const getPricingHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { programId, selectedCurrency } = req.body || {};

    if (!programId) {
      res
        .status(400)
        .json({ success: false, message: "programId is required" });
      return;
    }

    // Compute pricing with currency conversion and snapshot
    const pricing = await PricingService.compute({
      programId,
      selectedCurrency,
    });

    res.status(200).json({
      success: true,
      data: {
        orderAmount: pricing.orderAmount,
        orderCurrency: pricing.orderCurrency,
        programCurrency: pricing.programCurrency,
        selectedCurrency: pricing.selectedCurrency,
        fx: pricing.fx,
        pricingSnapshot: pricing.pricingSnapshot,
      },
    });
  } catch (error: any) {
    console.error("Get pricing error:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to compute pricing",
    });
  }
};
