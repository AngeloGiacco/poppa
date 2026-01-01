"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { useAuth } from "@/context/AuthContext";
import { languages, type Language } from "@/lib/languageData";
import { supabaseBrowserClient } from "@/lib/supabase-browser";

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_end: string;
  stripe_subscription_id: string;
}

interface Usage {
  usage_count: number;
  usage_limit: number;
}

const DashboardPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations("dashboard");

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        if (!authLoading) {
          router.push("/login");
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data: subData, error: subError } = await supabaseBrowserClient
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subError) {
          console.error("Error fetching subscription:", subError);
          throw new Error(t("error.fetchSubscription"));
        }
        setSubscription(subData as Subscription);

        const { data: usageData, error: usageError } = await supabaseBrowserClient
          .from("usage")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (usageError) {
          console.error("Error fetching usage:", usageError);
          console.warn("Usage data not found for user. This might be okay if subscription is new.");
          setUsage(null);
        } else {
          setUsage(usageData as Usage);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading, router, t]);

  const handleManageSubscription = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch("/api/stripe/customer-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("error.manageSubscriptionFailed"));
      }

      const { url } = await response.json();
      if (url) {
        router.push(url);
      } else {
        throw new Error(t("error.portalUrlMissing"));
      }
    } catch (error) {
      console.error("Error managing subscription:", error);
      alert((error as Error).message);
    }
  };

  if (authLoading || isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">{t("loading")}</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  if (!subscription) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>{t("noSubscription")}</p>
        <button
          onClick={() => router.push("/pricing")}
          className="mt-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
        >
          {t("viewPlansButton")}
        </button>
      </div>
    );
  }

  let planName = t("unknownPlan");
  if (subscription.plan_id === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY) {
    planName = "Hobby";
  } else if (subscription.plan_id === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO) {
    planName = "Pro";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">{t("subscriptionDetails.title")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <p>
            <strong>{t("subscriptionDetails.plan")}:</strong> {planName}
          </p>
          <p>
            <strong>{t("subscriptionDetails.status")}:</strong>{" "}
            <span
              className={`font-semibold ${subscription.status === "active" ? "text-green-600" : "text-red-600"}`}
            >
              {subscription.status}
            </span>
          </p>
          <p>
            <strong>{t("subscriptionDetails.renews")}:</strong>{" "}
            {subscription.current_period_end
              ? new Date(subscription.current_period_end).toLocaleDateString()
              : t("notApplicable")}
          </p>
          {subscription.stripe_subscription_id && (
            <p>
              <strong>{t("subscriptionDetails.subscriptionId")}:</strong>{" "}
              {subscription.stripe_subscription_id}
            </p>
          )}
        </div>
        <button
          onClick={handleManageSubscription}
          className="mt-6 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        >
          {t("manageSubscriptionButton")}
        </button>
      </div>

      {usage && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">{t("usageDetails.title")}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <p>
              <strong>{t("usageDetails.count")}:</strong> {usage.usage_count}
            </p>
            <p>
              <strong>{t("usageDetails.limit")}:</strong> {usage.usage_limit}
            </p>
          </div>
          <div className="mt-2 h-4 w-full rounded-full bg-gray-200">
            <div
              className="h-4 rounded-full bg-blue-500"
              style={{ width: `${Math.min((usage.usage_count / usage.usage_limit) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {t("usageDetails.remaining", {
              remaining: Math.max(0, usage.usage_limit - usage.usage_count),
            })}
          </p>
        </div>
      )}
      {!usage && subscription && (
        <div className="mt-6 rounded-lg bg-white p-6 text-center shadow-md">
          <p>{t("usageDetails.loadingOrNotAvailable")}</p>
        </div>
      )}

      {user && subscription && (
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200 md:text-left">
            {t("learnNewLanguageTitle")}
          </h2>
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="w-full rounded-lg bg-slate-50 p-4 shadow-md dark:bg-slate-800 md:w-1/4">
              <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
                {t("languagesTitle")}
              </h3>
              <ul className="space-y-2">
                {languages.map((lang) => (
                  <li key={lang.name}>
                    <button
                      onClick={() => setSelectedLanguage(lang)}
                      className={`w-full rounded-md px-4 py-2.5 text-left text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        selectedLanguage.name === lang.name
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {lang.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full md:w-3/4">
              <h3 className="mb-5 text-xl font-semibold text-slate-800 dark:text-slate-200">
                {selectedLanguage.name} {t("lessonsTitleSuffix")}
              </h3>
              {selectedLanguage &&
              selectedLanguage.lessons &&
              selectedLanguage.lessons.length > 0 ? (
                <div className="custom-scrollbar max-h-[600px] space-y-4 overflow-y-auto pr-2">
                  {selectedLanguage.lessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-white p-4 shadow transition-shadow duration-150 ease-in-out hover:shadow-lg dark:bg-slate-700"
                    >
                      <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400">
                        {lesson.title}
                      </h4>
                      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                        {lesson.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-slate-500 dark:text-slate-400">{t("noLessonsAvailable")}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
