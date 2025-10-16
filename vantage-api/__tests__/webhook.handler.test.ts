import { paymentsWebhookHandler } from "@/payments-backup/routes/handlers/webhook.handler";

jest.mock("@/payments/models/paymentAttempt.model", () => ({
  PaymentAttemptModel: { findOneAndUpdate: jest.fn().mockResolvedValue({}) },
}));

const updateMock = jest.fn().mockResolvedValue({
  _id: "o1",
  userId: "u1",
  programId: "p1",
  orderAmount: 10,
  orderCurrency: "INR",
});
const findOneMock = jest.fn().mockResolvedValue({
  _id: "o1",
  userId: "u1",
  programId: "p1",
  orderAmount: 10,
  orderCurrency: "INR",
});

jest.mock("@/payments/models/order.model", () => ({
  OrderModel: {
    findOneAndUpdate: (...args: any[]) => updateMock(...args),
    findOne: (...args: any[]) => findOneMock(...args),
  },
}));

const refundUpsertMock = jest.fn().mockResolvedValue({ _id: "r1" });
const refundUpdateOneMock = jest.fn().mockResolvedValue({});

jest.mock("@/payments/models/refund.model", () => ({
  RefundModel: {
    findOneAndUpdate: (...args: any[]) => refundUpsertMock(...args),
    updateOne: (...args: any[]) => refundUpdateOneMock(...args),
  },
}));

jest.mock("@/config/email/templates/emailTemplates.config", () => ({
  EmailTemplateService: {
    sendTemplatedEmail: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("@/users/user.model", () => ({
  User: {
    findById: jest.fn().mockReturnValue({
      lean: () => ({ _id: "u1", email: "a@b.com", name: "User" }),
    }),
  },
}));

describe("paymentsWebhookHandler", () => {
  const makeRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(undefined);
    res.setHeader = jest.fn();
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CF_VERIFY_WEBHOOK = "false";
  });

  it("marks order PAID on PAYMENT_SUCCESS_WEBHOOK", async () => {
    const req: any = {
      headers: {},
      body: {
        type: "PAYMENT_SUCCESS_WEBHOOK",
        data: { order: { order_id: "m1" }, payment: {} },
      },
    };
    const res = makeRes();
    await paymentsWebhookHandler(req as any, res as any);
    expect(updateMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("marks order ACTIVE on PAYMENT_FAILED_WEBHOOK", async () => {
    const req: any = {
      headers: {},
      body: {
        type: "PAYMENT_FAILED_WEBHOOK",
        data: { order: { order_id: "m1" }, payment: {} },
      },
    };
    const res = makeRes();
    await paymentsWebhookHandler(req as any, res as any);
    expect(updateMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("upserts refund on REFUND_SUCCESS_WEBHOOK", async () => {
    const req: any = {
      headers: {},
      body: {
        type: "REFUND_SUCCESS_WEBHOOK",
        data: {
          order: { order_id: "m1" },
          refund: {
            refund_id: "r1",
            refund_status: "SUCCESS",
            refund_amount: 1,
            refund_currency: "INR",
          },
        },
      },
    };
    const res = makeRes();
    await paymentsWebhookHandler(req as any, res as any);
    expect(refundUpsertMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("verifies signature when enabled", async () => {
    process.env.CF_VERIFY_WEBHOOK = "true";
    const verifyMock = jest.fn();
    jest.resetModules();
    jest.doMock(
      "cashfree-pg",
      () => ({ Cashfree: { PGVerifyWebhookSignature: verifyMock } }),
      { virtual: true }
    );

    const req: any = {
      headers: { "x-webhook-signature": "sig", "x-webhook-timestamp": "ts" },
      rawBody: JSON.stringify({ type: "PAYMENT_SUCCESS_WEBHOOK", data: {} }),
      body: Buffer.from(
        JSON.stringify({ type: "PAYMENT_SUCCESS_WEBHOOK", data: {} }),
        "utf8"
      ),
    };
    const res = makeRes();
    await paymentsWebhookHandler(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
