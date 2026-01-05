import { buffer } from "micro";
import { createMocks } from "node-mocks-http";
import Stripe from "stripe";

import supabaseClient from "@/lib/supabase";
import stripeWebhookHandler from "@/pages/api/stripe/webhooks";

import type { NextApiRequest, NextApiResponse } from "next";
import type { MockRequest, MockResponse } from "node-mocks-http";

// Mock the 'micro' buffer function
jest.mock("micro", () => ({
  buffer: jest.fn(),
}));

const mockStripe = new Stripe("sk_test_mock", { apiVersion: "2025-08-27.basil" });

describe("/api/stripe/webhooks API Endpoint", () => {
  let mockReq: MockRequest<NextApiRequest>;
  let mockRes: MockResponse<NextApiResponse>;

  const _mockWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const setupSupabaseMock = () => {
    const mockSingle = jest.fn().mockResolvedValue({
      data: { id: "sub_mock_id", user_id: "user_mock_id" },
      error: null,
    });
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
    const mockEq = jest.fn().mockReturnValue({ select: mockSelect, single: mockSingle });
    // insert returns .select().single() chain
    const mockInsert = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: { id: "sub_mock_id" },
          error: null,
        }),
      }),
    });
    const mockUpdate = jest.fn().mockReturnValue({
      eq: mockEq,
      select: mockSelect,
    });
    const mockUpsert = jest.fn().mockResolvedValue({
      data: [{ id: "usage_mock_id" }],
      error: null,
    });

    (supabaseClient.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "subscriptions") {
        return {
          insert: mockInsert,
          update: mockUpdate,
          select: mockSelect,
        };
      }
      if (table === "usage") {
        return {
          upsert: mockUpsert,
          update: mockUpdate,
        };
      }
      return {};
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      headers: {
        "stripe-signature": "",
      },
    });
    mockReq = req;
    mockRes = res;
    setupSupabaseMock();
  });

  const mockStripeEvent = (eventData: Record<string, unknown>, signature: string) => {
    (buffer as jest.Mock).mockResolvedValue(Buffer.from(JSON.stringify(eventData)));
    mockReq.headers["stripe-signature"] = signature;
    // Mock the constructEvent to return the eventData directly for valid signatures
    // or throw an error for invalid ones.
    (mockStripe.webhooks.constructEvent as jest.Mock).mockImplementation(
      (_body: Buffer, sig: string, _secret: string) => {
        if (sig === "valid_signature") {
          return eventData;
        }
        throw new Error("Mocked Stripe signature verification failed");
      }
    );
  };

  describe("Webhook Signature Verification", () => {
    it("should return 400 if signature verification fails", async () => {
      const eventPayload = { id: "evt_test", type: "checkout.session.completed" };
      mockStripeEvent(eventPayload, "invalid_signature");

      await stripeWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(400);
      expect(mockRes._getData()).toContain(
        "Webhook Error: Mocked Stripe signature verification failed"
      );
    });

    it("should return 405 if method is not POST", async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({ method: "GET" });
      await stripeWebhookHandler(req, res);
      expect(res._getStatusCode()).toBe(405);
      expect(res._getHeaders().allow).toBe("POST");
    });
  });

  describe("checkout.session.completed", () => {
    const checkoutSessionCompletedEvent = {
      id: "evt_checkout_session_completed",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          customer: "cus_mock_customer_id",
          subscription: "sub_mock_subscription_id",
          metadata: {
            user_id: "user_test_123",
            price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY,
          },
          // payment_status: 'paid', // Useful if checking this
        },
      },
    };

    it("should create a new subscription and set usage limit", async () => {
      mockStripeEvent(checkoutSessionCompletedEvent, "valid_signature");
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY = "price_hobby_mock";
      setupSupabaseMock();

      await stripeWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(supabaseClient.from).toHaveBeenCalledWith("subscriptions");
      expect(supabaseClient.from).toHaveBeenCalledWith("usage");
    });

    it("should return 400 if user_id or price_id is missing in metadata", async () => {
      const eventWithoutMetadata = {
        ...checkoutSessionCompletedEvent,
        data: {
          object: {
            ...checkoutSessionCompletedEvent.data.object,
            metadata: {}, // Missing user_id and price_id
          },
        },
      };
      mockStripeEvent(eventWithoutMetadata, "valid_signature");

      await stripeWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(400);
      expect(mockRes._getData()).toContain("Missing user_id or price_id in metadata.");
    });
  });

  describe("invoice.paid", () => {
    const invoicePaidEvent = {
      id: "evt_invoice_paid",
      type: "invoice.paid",
      data: {
        object: {
          id: "in_test_123",
          subscription: "sub_mock_active_id",
          customer: "cus_mock_customer_id_for_invoice",
          lines: {
            data: [
              {
                period: {
                  end: 1678886400, // Example timestamp (March 15, 2023)
                },
              },
            ],
          },
          // status: 'paid', // if you use this
        },
      },
    };

    it("should update subscription status, current_period_end, and reset usage_count", async () => {
      mockStripeEvent(invoicePaidEvent, "valid_signature");
      setupSupabaseMock();

      await stripeWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(supabaseClient.from).toHaveBeenCalledWith("subscriptions");
      expect(supabaseClient.from).toHaveBeenCalledWith("usage");
    });
  });

  describe("invoice.payment_failed", () => {
    const invoicePaymentFailedEvent = {
      id: "evt_invoice_payment_failed",
      type: "invoice.payment_failed",
      data: {
        object: {
          id: "in_fail_123",
          subscription: "sub_mock_failed_id",
          customer: "cus_mock_customer_id_for_failure",
        },
      },
    };

    it("should update subscription status to past_due", async () => {
      mockStripeEvent(invoicePaymentFailedEvent, "valid_signature");
      setupSupabaseMock();

      await stripeWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(supabaseClient.from).toHaveBeenCalledWith("subscriptions");
    });
  });

  describe("Unhandled event types", () => {
    it("should log and return 200 for unhandled event types", async () => {
      const consoleSpy = jest.spyOn(console, "log");
      const unknownEvent = {
        id: "evt_unknown",
        type: "some.unknown.event",
        data: { object: {} },
      };
      mockStripeEvent(unknownEvent, "valid_signature");

      await stripeWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(mockRes._getJSONData()).toEqual({ received: true });
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("🤷‍♀️ Unhandled event type some.unknown.event")
      );
      consoleSpy.mockRestore();
    });
  });
});
