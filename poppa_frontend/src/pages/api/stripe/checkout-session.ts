import Stripe from "stripe";

import supabaseClient from "@/lib/supabase";

import type { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const { price_id, user_id } = req.body;

  if (!price_id || !user_id) {
    return res.status(400).json({ error: "Missing price_id or user_id in request body." });
  }

  // For authenticated users, you might already have the user_id from their session
  // For this example, we're taking it from the request body.
  // Ensure this user_id corresponds to an authenticated user in your system.

  // Optionally, retrieve the user's email from your database to prefill in Stripe Checkout
  // const { data: user, error: userError } = await supabaseClient
  //   .from('users') // Or your user table, or auth.users
  //   .select('email')
  //   .eq('id', user_id)
  //   .single();

  // if (userError || !user) {
  //   console.error('User not found:', user_id, userError);
  //   return res.status(404).json({ error: 'User not found.' });
  // }
  // const customerEmail = user.email;

  // Determine success and cancel URLs
  const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing`;

  try {
    // Check if the user is an existing Stripe customer
    const { data: existingSubscription, error: subFetchError } = await supabaseClient
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user_id)
      .maybeSingle();

    if (subFetchError) {
      console.error("Error fetching existing subscription for customer ID:", subFetchError);
      // Decide if this is a critical error or if you can proceed without a customer ID
    }

    const stripeCustomerId = existingSubscription?.stripe_customer_id;

    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: "subscription", // or 'payment' for one-time purchases
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id,
        price_id, // Storing price_id as well for easier access in webhook
      },
    };

    if (stripeCustomerId) {
      params.customer = stripeCustomerId;
    }
    // else {
    //     params.customer_email = customerEmail; // If you want Stripe to create/match customer by email
    // }

    const session = await stripe.checkout.sessions.create(params);

    console.log("✅ Stripe Checkout Session Created:", session.id, "for user:", user_id);
    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error("❌ Error creating Stripe Checkout session:", err.message);
    res.status(500).json({ error: `Error creating checkout session: ${err.message}` });
  }
}
