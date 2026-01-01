import Stripe from "stripe";

import supabaseClient from "@/lib/supabase";

import type { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id in request body." });
  }

  // Retrieve the user's Stripe Customer ID from your database
  try {
    const { data: subscription, error: dbError } = await supabaseClient
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false }) // Get the latest subscription if multiple
      .limit(1)
      .single();

    if (dbError || !subscription || !subscription.stripe_customer_id) {
      console.error(
        "❌ Error fetching Stripe customer ID or customer ID not found for user:",
        user_id,
        dbError
      );
      return res.status(404).json({ error: "Stripe customer ID not found for this user." });
    }

    const stripeCustomerId = subscription.stripe_customer_id;
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing`; // URL to return to after portal session

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    console.log("✅ Stripe Customer Portal Session Created for user:", user_id, portalSession.id);
    res.status(200).json({ url: portalSession.url });
  } catch (err: any) {
    console.error("❌ Error creating Stripe Customer Portal session:", err.message);
    res.status(500).json({ error: `Error creating customer portal session: ${err.message}` });
  }
}
