"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { useAuth } from "@/context/AuthContext";

const plans = [
  {
    id: "hobby",
    nameKey: "hobbyPlan.name",
    priceKey: "hobbyPlan.price",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY,
  },
  {
    id: "pro",
    nameKey: "proPlan.name",
    priceKey: "proPlan.price",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
  },
];

const PricingPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations("pricing");

  const handleSubscribe = async (priceId?: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!priceId) {
      console.error("Stripe Price ID is not defined for this plan.");
      alert(t("error.missingPriceId"));
      return;
    }

    try {
      const response = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price_id: priceId, user_id: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("error.checkoutFailed"));
      }

      const { url } = await response.json();
      if (url) {
        router.push(url);
      } else {
        throw new Error(t("error.checkoutUrlMissing"));
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert((error as Error).message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-12 text-center text-3xl font-bold">{t("title")}</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.id} className="flex flex-col rounded-lg border p-6 shadow-lg">
            <h2 className="mb-3 text-2xl font-semibold">{t(plan.nameKey)}</h2>
            <p className="mb-4 text-xl text-gray-600">{t(plan.priceKey)}</p>
            <button
              onClick={() => handleSubscribe(plan.stripePriceId)}
              disabled={!plan.stripePriceId}
              className="mt-auto w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              {t("subscribeButton")}
            </button>
            {!plan.stripePriceId && (
              <p className="mt-2 text-center text-xs text-red-500">{t("misconfiguredPlan")}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
