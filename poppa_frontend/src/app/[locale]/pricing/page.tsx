'use client';

import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext'; // Adjust path as needed
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import { useTranslation } from 'react-i18next'; // Assuming i18next is used

// Define plan structures - these could also be fetched from an API or a config file
const प्लांस = [ // "plans" in Hindi, as an example for i18n
  {
    id: 'hobby',
    nameKey: 'pricing.hobbyPlan.name', // Key for translation
    priceKey: 'pricing.hobbyPlan.price', // Key for translation
    featuresKey: 'pricing.hobbyPlan.features', // Key for translation (array of strings)
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY,
  },
  {
    id: 'pro',
    nameKey: 'pricing.proPlan.name',
    priceKey: 'pricing.proPlan.price',
    featuresKey: 'pricing.proPlan.features',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
  },
  // Add more plans as needed
];

const PricingPage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { t } = useTranslation(); // For localization

  const handleSubscribe = async (priceId?: string) => {
    if (!user) {
      // Redirect to login or show a message
      router.push('/login'); // Adjust login path as needed
      return;
    }
    if (!priceId) {
      console.error('Stripe Price ID is not defined for this plan.');
      // Show an error message to the user
      alert(t('pricing.error.missingPriceId'));
      return;
    }

    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price_id: priceId, user_id: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('pricing.error.checkoutFailed'));
      }

      const { sessionId, url } = await response.json();
      if (url) {
        router.push(url); // Redirect to Stripe Checkout
      } else {
        throw new Error(t('pricing.error.checkoutUrlMissing'));
      }
    } catch (error) {
      console.error('Subscription error:', error);
      // Display error message to the user, perhaps using a toast notification
      alert((error as Error).message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12">{t('pricing.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {प्लांस.map((plan) => (
          <div key={plan.id} className="border rounded-lg p-6 shadow-lg flex flex-col">
            <h2 className="text-2xl font-semibold mb-3">{t(plan.nameKey)}</h2>
            <p className="text-xl text-gray-600 mb-4">{t(plan.priceKey)}</p>
            <ul className="list-disc list-inside mb-6 text-gray-700 flex-grow">
              {(t(plan.featuresKey, { returnObjects: true }) as Array<string>)?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.stripePriceId)}
              disabled={!plan.stripePriceId}
              className="mt-auto w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            >
              {t('pricing.subscribeButton')}
            </button>
            {!plan.stripePriceId && (
                <p className="text-xs text-red-500 mt-2 text-center">
                    {t('pricing.misconfiguredPlan')}
                </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
