import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { supabase } from '../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Tell Next.js to disable body parsing for this route,
// as Stripe requires the raw body to verify the signature.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'] as string;
  const rawBody = await buffer(req);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error verifying webhook signature: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('✅ Stripe Webhook Received:', event.type, event.id);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', session.id);
      // Metadata should contain user_id and price_id
      const userId = session.metadata?.user_id;
      const priceId = session.metadata?.price_id; // This might be on line_items instead
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;

      if (!userId || !priceId) {
        console.error('❌ Missing user_id or price_id in checkout session metadata', session.id);
        return res.status(400).send('Missing user_id or price_id in metadata.');
      }
      
      try {
        // 1. Create or retrieve Stripe Customer ID is usually handled by Stripe, 
        //    but ensure it's stored if needed for direct API calls later.
        //    Here we get it from the session.

        // 2. Create a new subscription in the `subscriptions` table
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            plan_id: priceId, // Assuming priceId from metadata is the plan_id
            status: 'active', // Or session.payment_status, but 'active' upon completion is common
            // current_period_end will be set by invoice.paid
          })
          .select()
          .single();

        if (subError) {
          console.error('❌ Error creating subscription:', subError);
          return res.status(500).send('Error creating subscription.');
        }
        console.log('✅ Subscription created:', subscription.id);

        // 3. Set an appropriate usage_limit in the `usage` table
        //    This requires a mapping from price_id to usage_limit
        let usageLimit = 0;
        if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY) { // Example price ID
          usageLimit = 1000; 
        } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO) { // Example price ID
          usageLimit = 10000;
        } else {
            console.warn(`⚠️ Unknown price_id: ${priceId}, setting default usage limit.`);
            usageLimit = 100; // Default or error
        }

        const { error: usageError } = await supabase
          .from('usage')
          .upsert({
            user_id: userId,
            usage_limit: usageLimit,
            // usage_count will be reset by invoice.paid if it's a recurring subscription
          }, { onConflict: 'user_id' });

        if (usageError) {
          console.error('❌ Error setting usage limit:', usageError);
          // Potentially roll back subscription creation or mark for reconciliation
          return res.status(500).send('Error setting usage limit.');
        }
        console.log('✅ Usage limit set for user:', userId);

      } catch (err: any) {
        console.error('❌ Error handling checkout.session.completed:', err);
        return res.status(500).send('Internal server error.');
      }
      break;

    case 'invoice.paid':
      const invoicePaid = event.data.object as Stripe.Invoice;
      console.log('Invoice paid:', invoicePaid.id);
      const subscriptionIdPaid = invoicePaid.subscription as string;
      const customerIdPaid = invoicePaid.customer as string;

      if (!subscriptionIdPaid || !customerIdPaid) {
          console.error('❌ Missing subscription_id or customer_id in invoice.paid event');
          return res.status(400).send('Missing subscription_id or customer_id.');
      }
      
      try {
        const { data: updatedSubscription, error: updateSubError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active', // Or invoicePaid.status if more granular (e.g., 'paid')
            current_period_end: new Date((invoicePaid.lines.data[0].period.end) * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionIdPaid)
          .select('user_id')
          .single();

        if (updateSubError || !updatedSubscription) {
          console.error('❌ Error updating subscription for invoice.paid:', updateSubError);
          return res.status(500).send('Error updating subscription.');
        }
        console.log('✅ Subscription updated for invoice.paid:', subscriptionIdPaid);
        
        const userIdForUsageReset = updatedSubscription.user_id;

        // Reset usage_count to 0
        const { error: usageResetError } = await supabase
          .from('usage')
          .update({
            usage_count: 0,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userIdForUsageReset);

        if (usageResetError) {
          console.error('❌ Error resetting usage count for invoice.paid:', usageResetError);
          return res.status(500).send('Error resetting usage count.');
        }
        console.log('✅ Usage count reset for user:', userIdForUsageReset);

      } catch (err: any) {
        console.error('❌ Error handling invoice.paid:', err);
        return res.status(500).send('Internal server error.');
      }
      break;

    case 'invoice.payment_failed':
      const invoiceFailed = event.data.object as Stripe.Invoice;
      console.log('Invoice payment failed:', invoiceFailed.id);
      const subscriptionIdFailed = invoiceFailed.subscription as string;
      const customerIdFailed = invoiceFailed.customer as string; // For fetching user_id if needed

       if (!subscriptionIdFailed) {
          console.error('❌ Missing subscription_id in invoice.payment_failed event');
          return res.status(400).send('Missing subscription_id.');
      }

      try {
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'past_due', // Or 'canceled' depending on Stripe settings and retry logic
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionIdFailed);

        if (updateError) {
          console.error('❌ Error updating subscription status for invoice.payment_failed:', updateError);
          return res.status(500).send('Error updating subscription status.');
        }
        console.log('✅ Subscription status updated to past_due for:', subscriptionIdFailed);
        // Optionally, send a notification to the user (out of scope).

      } catch (err: any) {
        console.error('❌ Error handling invoice.payment_failed:', err);
        return res.status(500).send('Internal server error.');
      }
      break;

    // ... handle other event types
    default:
      console.log(`🤷‍♀️ Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}
