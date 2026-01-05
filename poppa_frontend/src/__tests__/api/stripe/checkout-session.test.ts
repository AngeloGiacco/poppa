import { createMocks } from "node-mocks-http";
import Stripe from "stripe";

import supabaseClient from "@/lib/supabase";

import checkoutSessionHandler from "@/pages/api/stripe/checkout-session";

import type { NextApiRequest, NextApiResponse } from "next";
import type { MockRequest, MockResponse } from "node-mocks-http";

const mockStripe = new Stripe("sk_test_mock", { apiVersion: "2025-08-27.basil" });

describe("/api/stripe/checkout-session API Endpoint", () => {
  let mockReq: MockRequest<NextApiRequest>;
  let mockRes: MockResponse<NextApiResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {}, // Will be set in tests
    });
    mockReq = req;
    mockRes = res;

    // Default mock for Stripe checkout session creation
    (mockStripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
      id: "cs_mock_session_id",
      url: "https://checkout.stripe.com/mock_session_url",
    });

    // Default mock for Supabase query to fetch existing customer
    const mockMaybeSingle = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const mockEq = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    (supabaseClient.from as jest.Mock).mockReturnValue({ select: mockSelect });
  });

  it("should return 405 if method is not POST", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({ method: "GET" });
    await checkoutSessionHandler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders().allow).toBe("POST");
  });

  it("should return 400 if price_id is missing", async () => {
    mockReq.body = { user_id: "user_test_123" };
    await checkoutSessionHandler(mockReq, mockRes);
    expect(mockRes._getStatusCode()).toBe(400);
    expect(mockRes._getJSONData()).toEqual({
      error: "Missing price_id or user_id in request body.",
    });
  });

  it("should return 400 if user_id is missing", async () => {
    mockReq.body = { price_id: "price_mock_123" };
    await checkoutSessionHandler(mockReq, mockRes);
    expect(mockRes._getStatusCode()).toBe(400);
    expect(mockRes._getJSONData()).toEqual({
      error: "Missing price_id or user_id in request body.",
    });
  });

  it("should create a Stripe Checkout session and return session ID and URL", async () => {
    mockReq.body = { price_id: "price_mock_pro", user_id: "user_new_customer" };

    await checkoutSessionHandler(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(200);
    expect(mockRes._getJSONData()).toEqual({
      sessionId: "cs_mock_session_id",
      url: "https://checkout.stripe.com/mock_session_url",
    });

    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
      payment_method_types: ["card"],
      line_items: [{ price: "price_mock_pro", quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing`,
      metadata: {
        user_id: "user_new_customer",
        price_id: "price_mock_pro",
      },
      // customer: undefined, // Since no existing customer in default mock
    });
  });

  it("should include customer ID if user is an existing Stripe customer", async () => {
    mockReq.body = { price_id: "price_mock_hobby", user_id: "user_existing_customer" };
    // Mock Supabase to return an existing Stripe customer ID
    const mockMaybeSingle = jest.fn().mockResolvedValue({
      data: { stripe_customer_id: "cus_existing_stripe_id" },
      error: null,
    });
    const mockEq = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    (supabaseClient.from as jest.Mock).mockReturnValue({ select: mockSelect });

    await checkoutSessionHandler(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(200);
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_existing_stripe_id", // Key check
        metadata: {
          user_id: "user_existing_customer",
          price_id: "price_mock_hobby",
        },
      })
    );
  });

  it("should handle errors from Stripe API gracefully", async () => {
    mockReq.body = { price_id: "price_mock_error", user_id: "user_stripe_error" };
    const stripeError = new Error("Mock Stripe API Error");
    (mockStripe.checkout.sessions.create as jest.Mock).mockRejectedValueOnce(stripeError);

    await checkoutSessionHandler(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(500);
    expect(mockRes._getJSONData()).toEqual({
      error: `Error creating checkout session: ${stripeError.message}`,
    });
  });

  it("should handle errors from Supabase when fetching customer ID", async () => {
    mockReq.body = { price_id: "price_mock_db_error", user_id: "user_db_error" };
    const dbError = { message: "Mock Supabase Read Error", code: "500" };
    const mockMaybeSingle = jest.fn().mockResolvedValue({
      data: null,
      error: dbError,
    });
    const mockEq = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    (supabaseClient.from as jest.Mock).mockReturnValue({ select: mockSelect });
    // Spy on console.error to check if the error is logged
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await checkoutSessionHandler(mockReq, mockRes);

    // The code currently proceeds even if subFetchError occurs, so it should still call Stripe
    // and potentially succeed if Stripe doesn't require the customer_id (or creates one).
    // This test verifies that the error is logged and the process continues.
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching existing subscription for customer ID:",
      dbError
    );
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalled(); // Stripe is still called
    expect(mockRes._getStatusCode()).toBe(200); // Assuming Stripe call succeeds

    consoleErrorSpy.mockRestore();
  });
});
