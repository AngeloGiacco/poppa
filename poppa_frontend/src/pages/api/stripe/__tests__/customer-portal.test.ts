import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import customerPortalHandler from '../customer-portal'; // Adjust path
import { supabase } from '../../../../lib/supabase'; // Mocked
import Stripe from 'stripe'; // Mocked

const mockStripe = new Stripe('sk_test_mock', { apiVersion: '2024-06-20' });

describe('/api/stripe/customer-portal API Endpoint', () => {
  let mockReq: Pick<NextApiRequest, any>;
  let mockRes: Pick<NextApiResponse<any>>;

  beforeEach(() => {
    jest.clearAllMocks();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {}, // Will be set in tests
    });
    mockReq = req;
    mockRes = res;

    // Default mock for Stripe billing portal session creation
    (mockStripe.billingPortal.sessions.create as jest.Mock).mockResolvedValue({
      id: 'pts_mock_portal_session_id',
      url: 'https://billing.stripe.com/mock_portal_session_url',
    });

    // Default mock for Supabase query to fetch stripe_customer_id
    (supabase.from('subscriptions').select().eq().order().limit().single as jest.Mock).mockResolvedValue({
      data: { stripe_customer_id: 'cus_default_stripe_id' },
      error: null,
    });
  });

  it('should return 405 if method is not POST', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({ method: 'GET' });
    await customerPortalHandler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders().allow).toBe('POST');
  });

  it('should return 400 if user_id is missing', async () => {
    mockReq.body = {}; // Missing user_id
    await customerPortalHandler(mockReq, mockRes);
    expect(mockRes._getStatusCode()).toBe(400);
    expect(mockRes._getJSONData()).toEqual({ error: 'Missing user_id in request body.' });
  });

  it('should return 404 if Stripe customer ID is not found for the user', async () => {
    mockReq.body = { user_id: 'user_no_customer_id' };
    // Mock Supabase to return no data (customer ID not found)
    (supabase.from('subscriptions').select().eq().order().limit().single as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: null, // No DB error, just no data
    });

    await customerPortalHandler(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(404);
    expect(mockRes._getJSONData()).toEqual({ error: 'Stripe customer ID not found for this user.' });
    expect(supabase.from('subscriptions').select).toHaveBeenCalledWith('stripe_customer_id');
    expect(supabase.from('subscriptions').select().eq).toHaveBeenCalledWith('user_id', 'user_no_customer_id');
  });
  
  it('should return 404 if Supabase returns an error when fetching customer ID', async () => {
    mockReq.body = { user_id: 'user_db_error_case' };
    const dbError = { message: 'Mock Supabase DB Error on fetch', code: 'DB500' };
    (supabase.from('subscriptions').select().eq().order().limit().single as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: dbError,
    });
     const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});


    await customerPortalHandler(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(404); // As per current code, dbError results in 404
    expect(mockRes._getJSONData()).toEqual({ error: 'Stripe customer ID not found for this user.' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error fetching Stripe customer ID or customer ID not found for user:', 'user_db_error_case', dbError);
    consoleErrorSpy.mockRestore();
  });


  it('should create a Stripe Customer Portal session and return its URL', async () => {
    mockReq.body = { user_id: 'user_valid_customer' };
    const expectedStripeCustomerId = 'cus_fetched_stripe_id';
    (supabase.from('subscriptions').select().eq().order().limit().single as jest.Mock).mockResolvedValueOnce({
      data: { stripe_customer_id: expectedStripeCustomerId },
      error: null,
    });

    await customerPortalHandler(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(200);
    expect(mockRes._getJSONData()).toEqual({
      url: 'https://billing.stripe.com/mock_portal_session_url',
    });
    expect(supabase.from('subscriptions').select).toHaveBeenCalledWith('stripe_customer_id');
    expect(supabase.from('subscriptions').select().eq).toHaveBeenCalledWith('user_id', 'user_valid_customer');
    expect(mockStripe.billingPortal.sessions.create).toHaveBeenCalledWith({
      customer: expectedStripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing`,
    });
  });

  it('should handle errors from Stripe API gracefully', async () => {
    mockReq.body = { user_id: 'user_stripe_api_error' };
    const stripeApiError = new Error('Mock Stripe Portal API Error');
    (mockStripe.billingPortal.sessions.create as jest.Mock).mockRejectedValueOnce(stripeApiError);
     // Ensure Supabase call is successful for this test case
    (supabase.from('subscriptions').select().eq().order().limit().single as jest.Mock).mockResolvedValueOnce({
      data: { stripe_customer_id: 'cus_for_stripe_error' },
      error: null,
    });

    await customerPortalHandler(mockReq, mockRes);

    expect(mockRes._getStatusCode()).toBe(500);
    expect(mockRes._getJSONData()).toEqual({
      error: `Error creating customer portal session: ${stripeApiError.message}`,
    });
  });
});
