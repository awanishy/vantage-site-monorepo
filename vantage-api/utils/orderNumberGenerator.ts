import { OrderModel } from "@/payments/models/order.model";

/**
 * Order number generation utility
 * Generates unique, human-readable order numbers in format: ORD-YYYY-MM-XXX
 */
export class OrderNumberGenerator {
  /**
   * Generate a unique order number
   * @returns Promise<string> - Unique order number
   */
  static async generate(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");

    // Find the highest counter for this month
    const prefix = `ORD-${year}-${month}-`;
    const existingOrders = await OrderModel.find({
      orderNumber: { $regex: `^${prefix}` },
    })
      .sort({ orderNumber: -1 })
      .limit(1);

    let counter = 1;
    if (existingOrders.length > 0) {
      const lastOrderNumber = existingOrders[0].orderNumber;
      const lastCounter = parseInt(lastOrderNumber.split("-").pop() || "0");
      counter = lastCounter + 1;
    }

    const paddedCounter = String(counter).padStart(3, "0");
    return `${prefix}${paddedCounter}`;
  }

  /**
   * Reset the counter (for testing purposes)
   * Note: This is not needed in production since we check the database
   */
  static reset(): void {
    // No longer needed since we check the database
    console.log(
      "OrderNumberGenerator.reset() is deprecated - counter is now database-driven"
    );
  }
}
