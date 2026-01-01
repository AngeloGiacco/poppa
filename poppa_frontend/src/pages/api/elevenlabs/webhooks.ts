import crypto from "crypto";

import { buffer } from "micro"; // For reading the raw body
import { type NextApiRequest, type NextApiResponse } from "next";

import supabaseClient from "@/lib/supabase";

// Disable Next.js body parsing for this route to access the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

const elevenLabsWebhookSecret = process.env.ELEVENLABS_WEBHOOK_SECRET;

interface ElevenLabsWebhookPayload {
  call_id: string;
  type: string; // e.g., "call_ended"
  data: {
    conversation_initiation_client_data?: {
      dynamic_variables?: {
        user_id?: string; // Expecting our UUID here
      };
    };
    // Other call data fields...
  };
  // Other top-level fields...
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  if (!elevenLabsWebhookSecret) {
    console.error("❌ ElevenLabs webhook secret is not configured.");
    return res.status(500).send("Webhook secret not configured.");
  }

  const signature = req.headers["elevenlabs-signature"] as string;
  if (!signature) {
    console.warn("⚠️ Missing ElevenLabs-Signature header.");
    return res.status(400).send("Missing signature.");
  }

  const rawBody = await buffer(req);
  const requestBody = rawBody.toString("utf8");

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", elevenLabsWebhookSecret)
    .update(requestBody)
    .digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    console.error("❌ Invalid ElevenLabs webhook signature.");
    return res.status(400).send("Invalid signature.");
  }

  console.log("✅ ElevenLabs Webhook Signature Verified");

  try {
    const payload = JSON.parse(requestBody) as ElevenLabsWebhookPayload;
    console.log("Received ElevenLabs webhook payload:", JSON.stringify(payload, null, 2));

    // We are interested in events that signify usage, e.g., 'call_ended' or similar.
    // Adjust this based on the actual webhook events from ElevenLabs that indicate usage.
    // For this example, let's assume 'call_ended' is the event type.
    if (payload.type !== "call_ended" && payload.type !== "call_processed") {
      // Or whatever event type indicates usage
      console.log(`ℹ️ Skipping ElevenLabs event type: ${payload.type}`);
      return res.status(200).json({ message: "Event type skipped", type: payload.type });
    }

    const userId = payload.data?.conversation_initiation_client_data?.dynamic_variables?.user_id;

    if (!userId) {
      console.error("❌ Missing user_id in ElevenLabs webhook payload dynamic_variables.");
      // Depending on strictness, you might want to return 400 or just log and return 200 to acknowledge receipt.
      return res.status(400).send("Missing user_id in payload.");
    }

    console.log(`Processing usage for user_id: ${userId}`);

    // Increment usage_count in Supabase
    // Using an RPC function for atomic increment is generally safer and more efficient.
    // Let's assume we have an RPC function `increment_user_usage(p_user_id uuid, p_increment_by integer)`
    // If not, we can do a read-then-write (less safe under concurrency without transactions).

    // Option 1: Using RPC (Preferred) - Create this function in Supabase SQL Editor
    /*
      CREATE OR REPLACE FUNCTION increment_user_usage(p_user_id UUID, p_increment_by INTEGER DEFAULT 1)
      RETURNS TABLE (
          id BIGINT,
          user_id UUID,
          usage_count INTEGER,
          usage_limit INTEGER,
          updated_at TIMESTAMP WITH TIME ZONE
      )
      AS $$
      BEGIN
          RETURN QUERY
          UPDATE usage
          SET usage_count = usage.usage_count + p_increment_by, updated_at = timezone('utc'::text, now())
          WHERE usage.user_id = p_user_id
          RETURNING usage.id, usage.user_id, usage.usage_count, usage.usage_limit, usage.updated_at;

          -- Optional: Handle case where user_id might not exist in usage table yet
          -- IF NOT FOUND THEN
          --    RAISE WARNING 'User % not found in usage table for increment.', p_user_id;
          --    -- Or insert a new row if that's desired behavior
          -- END IF;
      END;
      $$ LANGUAGE plpgsql;
    */
    const { data: usageData, error: rpcError } = await supabaseClient.rpc("increment_user_usage", {
      p_user_id: userId,
      p_increment_by: 1, // Assuming one call is one unit of usage
    });

    if (rpcError) {
      console.error("❌ Error incrementing usage via RPC:", rpcError);
      return res.status(500).send(`Error incrementing usage: ${rpcError.message}`);
    }

    // The RPC function in this example returns the updated row(s).
    // If it returns an array, we might need to pick the first element.
    const updatedUsage = Array.isArray(usageData) ? usageData[0] : usageData;

    if (!updatedUsage) {
      console.error(
        `❌ Usage record not found or not updated for user_id: ${userId} after RPC call.`
      );
      // This could happen if the user_id doesn't exist in the usage table
      // and the RPC function doesn't create it.
      return res.status(404).send("Usage record not found for user.");
    }

    console.log(
      `✅ Usage incremented for user_id: ${userId}. New count: ${updatedUsage.usage_count}`
    );

    // Check if usage_count now exceeds usage_limit
    if (updatedUsage.usage_count > updatedUsage.usage_limit) {
      console.warn(
        `⚠️ Usage limit exceeded for user_id: ${userId}. Count: ${updatedUsage.usage_count}, Limit: ${updatedUsage.usage_limit}`
      );
      // TODO: Implement notification logic if required (e.g., email user, admin notification)
    } else if (updatedUsage.usage_count === updatedUsage.usage_limit) {
      console.info(
        `ℹ️ Usage limit reached for user_id: ${userId}. Count: ${updatedUsage.usage_count}, Limit: ${updatedUsage.usage_limit}`
      );
    }

    res.status(200).json({
      message: "Webhook processed successfully",
      userId: userId,
      newUsageCount: updatedUsage.usage_count,
    });
  } catch (error: any) {
    console.error("❌ Error processing ElevenLabs webhook:", error);
    if (error instanceof SyntaxError) {
      return res.status(400).send(`Webhook Error: Invalid JSON payload. ${error.message}`);
    }
    return res.status(500).send(`Webhook Error: ${error.message}`);
  }
}
