import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import stripeWebhookHandler from '../webhooks'; // Adjust path as needed
import { supabase } from '../../../../lib/supabase'; // Mocked in jest.setup.js
import Stripe from 'stripe'; // Mocked in jest.setup.js
import { buffer } from 'micro';

// Mock the 'micro' buffer function
jest.mock('micro', () => ({
  buffer: jest.fn(),
}));

const mockStripe = new Stripe('sk_test_mock', { apiVersion: '2024-06-20' });

describe('/api/stripe/webhooks API Endpoint', () => {
  let mockReq: Pick<NextApiRequest, any>;
  let mockRes: Pick<NextApiResponse, any>;

  const mockWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      headers: {
        'stripe-signature': '', // Will be set in tests
      },
    });
    mockReq = req;
    mockRes = res;

    // Default mock for supabase calls that might return a single object
    (supabase.from('subscriptions').insert as jest.Mock).mockResolvedValue({ data: [{ id: 'sub_mock_id' }], error: null });
    (supabase.from('subscriptions').update as jest.Mock).mockResolvedValue({ data: [{ user_id: 'user_mock_id' }], error: null, count: 1 });
    (supabase.from('usage').upsert as jest.Mock).mockResolvedValue({ data: [{ id: 'usage_mock_id' }], error: null });
    (supabase.from('usage').update as jest.Mock).mockResolvedValue({ data: [{ id: 'usage_mock_id' }], error: null });
     // Ensure .single() returns a mock data object
    (supabase.from('subscriptions').select().single as jest.Mock).mockResolvedValue({ data: { user_id: 'user_mock_id' }, error: null });
  });

  const mockStripeEvent = (eventData: any, signature: string) => {
    (buffer as jest.Mock).mockResolvedValue(Buffer.from(JSON.stringify(eventData)));
    mockReq.headers['stripe-signature'] = signature;
    // Mock the constructEvent to return the eventData directly for valid signatures
    // or throw an error for invalid ones.
    (mockStripe.webhooks.constructEvent as jest.Mock).mockImplementation((body, sig, secret) => {
      if (sig === 'valid_signature') {
        return eventData;
      }
      throw new Error('Mocked Stripe signature verification failed');
    });
  };
  
  describe('Webhook Signature Verification', () => {
    it('should return 400 if signature verification fails', async () => {
      const eventPayload = { id: 'evt_test', type: 'checkout.session.completed' };
      mockStripeEvent(eventPayload, 'invalid_signature');
      
      await stripeWebhookHandler(mockReq, mockRes);
      
      expect(mockRes._getStatusCode()).toBe(400);
      expect(mockRes._getData()).toContain('Webhook Error: Mocked Stripe signature verification failed');
    });

    it('should return 405 if method is not POST', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({ method: 'GET' });
        await stripeWebhookHandler(req, res);
        expect(res._getStatusCode()).toBe(405);
        expect(res._getHeaders().allow).toBe('POST');
    });
  });

  describe('checkout.session.completed', () => {
    const checkoutSessionCompletedEvent = {
      id: 'evt_checkout_session_completed',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          customer: 'cus_mock_customer_id',
          subscription: 'sub_mock_subscription_id',
          metadata: {
            user_id: 'user_test_123',
            price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY,
          },
          // payment_status: 'paid', // Useful if checking this
        },
      },
    };

    it('should create a new subscription and set usage limit', async () => {
      mockStripeEvent(checkoutSessionCompletedEvent, 'valid_signature');
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY = 'price_hobby_mock'; // Ensure this is set for the test logic

      await stripeWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(supabase.from('subscriptions').insert).toHaveBeenCalledWith({
        user_id: 'user_test_123',
        stripe_customer_id: 'cus_mock_customer_id',
        stripe_subscription_id: 'sub_mock_subscription_id',
        plan_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY,
        status: 'active',
      });
      expect(supabase.from('usage').upsert).toHaveBeenCalledWith(
        {
          user_id: 'user_test_123',
          usage_limit: 1000, // Assuming Hobby plan maps to 1000
        },
        { onConflict: 'user_id' }
      );
    });

    it('should return 400 if user_id or price_id is missing in metadata', async () => {
      const eventWithoutMetadata = {
        ...checkoutSessionCompletedEvent,
        data: {
          object: {
            ...checkoutSessionCompletedEvent.data.object,
            metadata: {}, // Missing user_id and price_id
          },
        },
      };
      mockStripeEvent(eventWithoutMetadata, 'valid_signature');

      await stripeWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(400);
      expect(mockRes._getData()).toContain('Missing user_id or price_id in metadata.');
    });
  });

  describe('invoice.paid', () => {
    const invoicePaidEvent = {
      id: 'evt_invoice_paid',
      type: 'invoice.paid',
      data: {
        object: {
          id: 'in_test_123',
          subscription: 'sub_mock_active_id',
          customer: 'cus_mock_customer_id_for_invoice',
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
    
    // Mock that the subscription update returns the user_id needed for usage reset
    beforeEach(() => {
        const mockSuccessfulUpdate = {
            data: [{ user_id: 'user_for_invoice_paid' }], // Ensure this has user_id
            error: null,
            count: 1,
        };
        (supabase.from('subscriptions').update as jest.Mock).mockResolvedValue(mockSuccessfulUpdate);
        // Also, ensure the .select().single() chain is fully mocked if your code relies on its specific structure
         (supabase.from('subscriptions').update().eq().select().single as jest.Mock) = jest.fn().mockResolvedValue({
            data: { user_id: 'user_for_invoice_paid' }, // This is critical
            error: null,
        });
    });


    it('should update subscription status, current_period_end, and reset usage_count', async () => {
      mockStripeEvent(invoicePaidEvent, 'valid_signature');
      
      // Mock the select().single() to return a user_id for the usage reset step
      // This is a common pattern: an update, then a select for some fields of the updated row.
      // Here, we ensure the update mock itself returns what's needed, or mock the chain.
      (supabase.from('subscriptions').update as jest.Mock).mockImplementation(() => ({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { user_id: 'user_associated_with_sub_mock_active_id' }, error: null }),
      }));


      await stripeWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(supabase.from('subscriptions').update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'active',
          current_period_end: new Date(1678886400 * 1000).toISOString(),
        })
      );
      expect(supabase.from('subscriptions').update().eq).toHaveBeenCalledWith('stripe_subscription_id', 'sub_mock_active_id');
      
      expect(supabase.from('usage').update).toHaveBeenCalledWith(
        expect.objectContaining({
          usage_count: 0,
        })
      );
      // This expect needs to check the user_id from the mocked subscription update
      expect(supabase.from('usage').update().eq).toHaveBeenCalledWith('user_id', 'user_associated_with_sub_mock_active_id');
    });
  });

  describe('invoice.payment_failed', () => {
    const invoicePaymentFailedEvent = {
      id: 'evt_invoice_payment_failed',
      type: 'invoice.payment_failed',
      data: {
        object: {
          id: 'in_fail_123',
          subscription: 'sub_mock_failed_id',
          customer: 'cus_mock_customer_id_for_failure',
        },
      },
    };

    it('should update subscription status to past_due', async () => {
      mockStripeEvent(invoicePaymentFailedEvent, 'valid_signature');

      await stripeWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(supabase.from('subscriptions').update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'past_due',
        })
      );
      expect(supabase.from('subscriptions').update().eq).toHaveBeenCalledWith('stripe_subscription_id', 'sub_mock_failed_id');
    });
  });
  
  describe('Unhandled event types', () => {
    it('should log and return 200 for unhandled event types', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const unknownEvent = {
        id: 'evt_unknown',
        type: 'some.unknown.event',
        data: { object: {} },
      };
      mockStripeEvent(unknownEvent, 'valid_signature');

      await stripeWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(mockRes._getJSONData()).toEqual({ received: true });
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🤷‍♀️ Unhandled event type some.unknown.event'));
      consoleSpy.mockRestore();
    });
  });

});
