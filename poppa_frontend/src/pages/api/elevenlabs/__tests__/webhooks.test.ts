import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import elevenlabsWebhookHandler from '../webhooks'; // Adjust path
import { supabase } from '../../../../lib/supabase'; // Mocked
import crypto from 'crypto';
import { buffer } from 'micro';

// Mock the 'micro' buffer function
jest.mock('micro', () => ({
  buffer: jest.fn(),
}));

describe('/api/elevenlabs/webhooks API Endpoint', () => {
  let mockReq: Pick<NextApiRequest, any>;
  let mockRes: Pick<NextApiResponse<any>>;

  const mockElevenLabsWebhookSecret = process.env.ELEVENLABS_WEBHOOK_SECRET!;

  beforeEach(() => {
    jest.clearAllMocks();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      headers: {
        'elevenlabs-signature': '', // Will be set in tests
      },
    });
    mockReq = req;
    mockRes = res;

    // Default mock for Supabase RPC call
    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: [{ user_id: 'user_test_123', usage_count: 1, usage_limit: 100 }], // Mocked successful RPC response
      error: null,
    });
  });

  const mockElevenLabsEvent = (eventData: any, signatureHeader?: string, secret?: string) => {
    const body = JSON.stringify(eventData);
    (buffer as jest.Mock).mockResolvedValue(Buffer.from(body));

    if (signatureHeader && secret) {
      mockReq.headers['elevenlabs-signature'] = signatureHeader;
    } else if (secret) { // Auto-generate signature if secret is provided but no explicit header
        const generatedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');
        mockReq.headers['elevenlabs-signature'] = generatedSig;
    }
    // If no signatureHeader and no secret, signature remains as set in beforeEach or previous tests (or empty)
  };

  describe('Webhook Signature Verification', () => {
    it('should return 400 if signature is missing', async () => {
      const eventPayload = { type: 'call_ended', data: {} };
      // No signature set in headers for this test
      mockReq.headers['elevenlabs-signature'] = undefined;
      mockElevenLabsEvent(eventPayload); 
      
      await elevenlabsWebhookHandler(mockReq, mockRes);
      
      expect(mockRes._getStatusCode()).toBe(400);
      expect(mockRes._getData()).toContain('Missing signature.');
    });
    
    it('should return 400 if signature verification fails', async () => {
      const eventPayload = { type: 'call_ended', data: {} };
      // Provide a body and a secret, but the header will be wrong
      mockElevenLabsEvent(eventPayload, 'invalid_signature_header', mockElevenLabsWebhookSecret);
      
      await elevenlabsWebhookHandler(mockReq, mockRes);
      
      expect(mockRes._getStatusCode()).toBe(400);
      expect(mockRes._getData()).toContain('Invalid signature.');
    });

    it('should return 500 if webhook secret is not configured', async () => {
        const originalSecret = process.env.ELEVENLABS_WEBHOOK_SECRET;
        delete process.env.ELEVENLABS_WEBHOOK_SECRET; // Temporarily remove secret

        const eventPayload = { type: 'call_ended', data: {} };
        mockElevenLabsEvent(eventPayload, 'any_signature'); // Signature value doesn't matter here

        await elevenlabsWebhookHandler(mockReq, mockRes);

        expect(mockRes._getStatusCode()).toBe(500);
        expect(mockRes._getData()).toContain('Webhook secret not configured.');
        process.env.ELEVENLABS_WEBHOOK_SECRET = originalSecret; // Restore secret
    });
  });
  
  it('should return 405 if method is not POST', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({ method: 'GET' });
    await elevenlabsWebhookHandler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders().allow).toBe('POST');
  });


  describe('Successful Webhook Processing (call_ended)', () => {
    const callEndedEventPayload = {
      call_id: 'call_123',
      type: 'call_ended', // Assuming this is the type that signifies usage
      data: {
        conversation_initiation_client_data: {
          dynamic_variables: {
            user_id: 'user_test_abcdef',
          },
        },
        // other call data...
      },
    };

    it('should call increment_user_usage RPC with correct user_id and increment_by value', async () => {
      mockElevenLabsEvent(callEndedEventPayload, undefined, mockElevenLabsWebhookSecret); // Auto-generate valid signature

      await elevenlabsWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(supabase.rpc).toHaveBeenCalledWith('increment_user_usage', {
        p_user_id: 'user_test_abcdef',
        p_increment_by: 1,
      });
      expect(mockRes._getJSONData()).toEqual(expect.objectContaining({
        message: 'Webhook processed successfully',
        userId: 'user_test_abcdef',
      }));
    });

    it('should log a warning if usage limit is exceeded', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      (supabase.rpc as jest.Mock).mockResolvedValueOnce({ // Mock RPC to return exceeded usage
        data: [{ user_id: 'user_test_abcdef', usage_count: 101, usage_limit: 100 }],
        error: null,
      });
      mockElevenLabsEvent(callEndedEventPayload, undefined, mockElevenLabsWebhookSecret);

      await elevenlabsWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('⚠️ Usage limit exceeded for user_id: user_test_abcdef')
      );
      consoleWarnSpy.mockRestore();
    });
    
    it('should log info if usage limit is reached exactly', async () => {
      const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
      (supabase.rpc as jest.Mock).mockResolvedValueOnce({ // Mock RPC to return usage at limit
        data: [{ user_id: 'user_test_abcdef', usage_count: 100, usage_limit: 100 }],
        error: null,
      });
      mockElevenLabsEvent(callEndedEventPayload, undefined, mockElevenLabsWebhookSecret);

      await elevenlabsWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('ℹ️ Usage limit reached for user_id: user_test_abcdef')
      );
      consoleInfoSpy.mockRestore();
    });


    it('should return 400 if user_id is missing in payload dynamic_variables', async () => {
      const eventWithoutUserId = {
        ...callEndedEventPayload,
        data: {
          ...callEndedEventPayload.data,
          conversation_initiation_client_data: { dynamic_variables: {} }, // Missing user_id
        },
      };
      mockElevenLabsEvent(eventWithoutUserId, undefined, mockElevenLabsWebhookSecret);

      await elevenlabsWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(400);
      expect(mockRes._getData()).toContain('Missing user_id in payload.');
    });
    
    it('should return 404 if RPC call indicates user usage record not found/updated', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValueOnce({ data: null, error: null }); // Simulate RPC not returning data
      mockElevenLabsEvent(callEndedEventPayload, undefined, mockElevenLabsWebhookSecret);

      await elevenlabsWebhookHandler(mockReq, mockRes);
      
      expect(mockRes._getStatusCode()).toBe(404);
      expect(mockRes._getData()).toContain('Usage record not found for user.');
    });
  });

  describe('Other Event Types', () => {
    it('should skip processing and return 200 for non-call_ended/call_processed event types', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const otherEventPayload = {
        type: 'call_started', // Example of an event type to skip
        data: { conversation_initiation_client_data: { dynamic_variables: { user_id: 'user_test_skip' } } },
      };
      mockElevenLabsEvent(otherEventPayload, undefined, mockElevenLabsWebhookSecret);

      await elevenlabsWebhookHandler(mockReq, mockRes);

      expect(mockRes._getStatusCode()).toBe(200);
      expect(mockRes._getJSONData()).toEqual({ message: 'Event type skipped', type: 'call_started' });
      expect(supabase.rpc).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('ℹ️ Skipping ElevenLabs event type: call_started'));
      consoleLogSpy.mockRestore();
    });
  });
  
  describe('Error Handling', () => {
    it('should return 500 if Supabase RPC call fails', async () => {
        const rpcError = { message: 'Mock Supabase RPC Error', code: 'DB500' };
        (supabase.rpc as jest.Mock).mockResolvedValueOnce({ data: null, error: rpcError });
        const eventPayload = { ...callEndedEventPayload }; // Use a valid payload structure
         mockElevenLabsEvent(eventPayload, undefined, mockElevenLabsWebhookSecret);


        await elevenlabsWebhookHandler(mockReq, mockRes);

        expect(mockRes._getStatusCode()).toBe(500);
        expect(mockRes._getData()).toContain(`Error incrementing usage: ${rpcError.message}`);
    });

    it('should return 400 for invalid JSON payload', async () => {
        (buffer as jest.Mock).mockResolvedValue(Buffer.from("this is not json"));
        const sig = crypto.createHmac('sha256', mockElevenLabsWebhookSecret).update("this is not json").digest('hex');
        mockReq.headers['elevenlabs-signature'] = sig;


        await elevenlabsWebhookHandler(mockReq, mockRes);

        expect(mockRes._getStatusCode()).toBe(400);
        expect(mockRes._getData()).toContain('Webhook Error: Invalid JSON payload.');
    });
  });

});

// Minimal payload for call_ended, adjust if your actual payload structure is different
const callEndedEventPayload = {
  call_id: 'call_123',
  type: 'call_ended',
  data: {
    conversation_initiation_client_data: {
      dynamic_variables: {
        user_id: 'user_test_abcdef',
      },
    },
  },
};
