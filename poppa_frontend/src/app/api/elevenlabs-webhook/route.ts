import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';
import supabaseClient from '@/lib/supabase';

const elevenLabsWebhookSecret = process.env.ELEVENLABS_WEBHOOK_SECRET;

interface ElevenLabsWebhookPayload {
  type: string;
  event_timestamp: number;
  data: {
    agent_id: string;
    conversation_id: string;
    status: string;
    transcript: Array<{
      role: string;
      message: string;
      time_in_call_secs?: number;
    }>;
    metadata: {
      start_time_unix_secs: number;
      call_duration_secs: number;
    };
    analysis?: {
      transcript_summary?: string;
    };
    conversation_initiation_client_data?: {
      dynamic_variables?: {
        user_id?: string;
        target_language?: string;
      };
    };
  };
}

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (!elevenLabsWebhookSecret) {
      console.error('ELEVENLABS_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const signature = req.headers.get('elevenlabs-signature');
    if (!signature) {
      console.error('Missing elevenlabs-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    if (!verifySignature(rawBody, signature, elevenLabsWebhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as ElevenLabsWebhookPayload;

    if (payload.type !== 'post_call_transcription' || !payload.data) {
      console.error('Invalid payload type or missing data:', payload);
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    const { conversation_id, transcript, conversation_initiation_client_data } = payload.data;

    const userId = conversation_initiation_client_data?.dynamic_variables?.user_id;
    const targetLanguage = conversation_initiation_client_data?.dynamic_variables?.target_language;

    if (!userId) {
      console.error('Missing user_id in dynamic_variables');
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    if (!targetLanguage) {
      console.warn('Missing target_language in dynamic_variables - proceeding without it');
    }

    if (!conversation_id) {
        console.error('Missing conversation_id in payload data');
        return NextResponse.json({ error: 'Missing conversation_id' }, { status: 400 });
    }

    const { error: usageError, data: usageData } = await supabaseClient.rpc('increment_user_usage', {
      p_user_id: userId,
      p_increment_by: 1,
    });

    if (usageError) {
      console.error('Error incrementing user usage:', usageError);
      return NextResponse.json({ error: 'Failed to update user usage' }, { status: 500 });
    }

    if (!usageData || usageData.length === 0) {
      console.error('User not found in usage table:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { error: transcriptError } = await supabaseClient
      .from('conversation_transcripts')
      .insert({
        user_id: userId,
        target_language: targetLanguage,
        transcript: transcript,
        conversation_id: conversation_id,
      });

    if (transcriptError) {
      console.error('Error storing conversation transcript:', transcriptError);
      return NextResponse.json({ error: 'Failed to store transcript' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Transcript saved successfully',
      conversation_id,
      user_id: userId,
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // General error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
