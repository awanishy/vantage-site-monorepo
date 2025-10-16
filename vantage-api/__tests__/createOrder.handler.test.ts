import request from "supertest";
import express from "express";
import { createOrderHandler } from "@/payments-backup/routes/handlers/createOrder.handler";
jest.mock("uuid", () => ({ v4: () => "test-uuid" }));

jest.mock("@/users/user.model", () => ({
  User: {
    findById: jest.fn().mockReturnValue({
      lean: () => ({ _id: "u1", email: "a@b.com", name: "Test" }),
    }),
  },
}));

jest.mock("@/payments/services/pricing.service", () => ({
  PricingService: {
    compute: jest.fn().mockResolvedValue({
      orderAmount: 10,
      orderCurrency: "INR",
      programCurrency: "INR",
      selectedCurrency: "INR",
      pricingSnapshot: {},
      fx: null,
    }),
  },
}));

jest.mock("@/payments/clients/cashfree.client", () => ({
  CashfreeClient: class {
    async createOrder() {
      return {
        cf_order_id: "cf1",
        payment_session_id: "sess",
        order_expiry_time: new Date().toISOString(),
        order_meta: {},
        order_tags: {},
        order_splits: [],
        products: {},
      };
    }
  },
}));

jest.mock("@/payments/models/order.model", () => ({
  OrderModel: {
    create: jest.fn().mockResolvedValue({
      _id: "o1",
      cfOrderId: "cf1",
      paymentSessionId: "sess",
      orderAmount: 10,
      orderCurrency: "INR",
    }),
  },
}));

describe("createOrderHandler", () => {
  it("creates order and returns session", async () => {
    const app = express();
    app.use(express.json());
    app.post("/", (req, res) => createOrderHandler(req as any, res as any));
    const res = await request(app)
      .post("/")
      .send({ programId: "p1", userId: "u1" });
    expect(res.status).toBe(201);
    expect(res.body?.data?.paymentSessionId).toBe("sess");
  });
});
