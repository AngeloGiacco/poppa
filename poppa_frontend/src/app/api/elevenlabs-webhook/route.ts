import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import supabaseClient from "@/lib/supabase"; // Import the Supabase client

// Define the expected structure of the webhook payload (based on the issue description)
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
      // Add other transcript fields if needed
    }>;
    metadata: {
      start_time_unix_secs: number;
      call_duration_secs: number;
      // Add other metadata fields if needed
    };
    analysis: {
      transcript_summary?: string;
      // Add other analysis fields if needed
    };
    conversation_initiation_client_data?: {
      dynamic_variables?: {
        user_id?: string;
        target_language?: string;
        // Add other dynamic variables if needed
      };
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as ElevenLabsWebhookPayload;

    // Log the received payload for debugging (optional, remove in production if too verbose)
    // console.log('Webhook payload received:', JSON.stringify(payload, null, 2));

    // Validate payload structure (basic validation)
    if (payload.type !== "post_call_transcription" || !payload.data) {
      console.error("Invalid payload type or missing data:", payload);
      return NextResponse.json({ error: "Invalid payload structure" }, { status: 400 });
    }

    const {
      conversation_id,
      transcript,
      conversation_initiation_client_data,
      // metadata, // if needed for credits, e.g., call_duration_secs
    } = payload.data;

    const userId = conversation_initiation_client_data?.dynamic_variables?.user_id;
    const targetLanguage = conversation_initiation_client_data?.dynamic_variables?.target_language;

    if (!userId) {
      console.error("Missing user_id in dynamic_variables");
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    if (!targetLanguage) {
      console.error("Missing target_language in dynamic_variables");
      // Depending on requirements, this might be optional or also return an error
      // For now, let's log and proceed, or decide if it's critical
    }

    if (!conversation_id) {
      console.error("Missing conversation_id in payload data");
      return NextResponse.json({ error: "Missing conversation_id" }, { status: 400 });
    }

    // 1. Decrement user credits (by incrementing usage)
    // We'll increment usage by 1 for each call as per the plan.
    const { error: usageError, data: usageData } = await supabaseClient.rpc(
      "increment_user_usage",
      {
        p_user_id: userId,
        p_increment_by: 1,
      }
    );

    if (usageError) {
      console.error("Error incrementing user usage:", usageError);
      // Decide if this is a fatal error. For now, let's assume it is.
      return NextResponse.json({ error: "Failed to update user usage" }, { status: 500 });
    }
    if (!usageData || usageData.length === 0) {
      console.error("User usage not updated (user may not exist or RPC returned no data):", userId);
      // This case might happen if increment_user_usage returns an empty set
      return NextResponse.json(
        { error: "Failed to update user usage, user not found or RPC error" },
        { status: 404 }
      );
    }

    // console.log('User usage updated:', usageData);

    // 2. Store conversation transcript
    // The 'conversation_transcripts' table will be created in the next step.
    // For now, this code assumes it exists.
    const { error: transcriptError } = await supabaseClient
      .from("conversation_transcripts")
      .insert({
        user_id: userId,
        target_language: targetLanguage, // This could be null if not provided
        transcript: transcript, // Storing the full transcript array as JSONB
        conversation_id: conversation_id, // Store the conversation_id
        // created_at is handled by default value in the table schema
      });

    if (transcriptError) {
      console.error("Error storing conversation transcript:", transcriptError);
      // Decide if this is a fatal error.
      return NextResponse.json({ error: "Failed to store transcript" }, { status: 500 });
    }

    // console.log('Conversation transcript stored successfully for user:', userId);

    return NextResponse.json(
      { message: "Webhook received and processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
    // General error
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
