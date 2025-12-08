'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabaseBrowserClient } from '@/lib/supabase-browser';
import { languages, Language } from '@/lib/languageData';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('dashboard');

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        if (!authLoading) {
          router.push('/login');
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data: subData, error: subError } = await supabaseBrowserClient
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subError) {
          console.error('Error fetching subscription:', subError);
          throw new Error(t('error.fetchSubscription'));
        }
        setSubscription(subData as Subscription);

        const { data: usageData, error: usageError } = await supabaseBrowserClient
          .from('usage')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (usageError) {
          console.error('Error fetching usage:', usageError);
          console.warn('Usage data not found for user. This might be okay if subscription is new.');
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
    if (!user) return;

    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('error.manageSubscriptionFailed'));
      }

      const { url } = await response.json();
      if (url) {
        router.push(url);
      } else {
        throw new Error(t('error.portalUrlMissing'));
      }
    } catch (error) {
      console.error('Error managing subscription:', error);
      alert((error as Error).message);
    }
  };

  if (authLoading || isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">{t('loading')}</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  if (!subscription) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>{t('noSubscription')}</p>
        <button
          onClick={() => router.push('/pricing')}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          {t('viewPlansButton')}
        </button>
      </div>
    );
  }

  let planName = t('unknownPlan');
  if (subscription.plan_id === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY) {
    planName = 'Hobby';
  } else if (subscription.plan_id === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO) {
    planName = 'Pro';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('subscriptionDetails.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>{t('subscriptionDetails.plan')}:</strong> {planName}</p>
          <p><strong>{t('subscriptionDetails.status')}:</strong> <span className={`font-semibold ${subscription.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{subscription.status}</span></p>
          <p><strong>{t('subscriptionDetails.renews')}:</strong> {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : t('notApplicable')}</p>
          {subscription.stripe_subscription_id && (
            <p><strong>{t('subscriptionDetails.subscriptionId')}:</strong> {subscription.stripe_subscription_id}</p>
          )}
        </div>
        <button
          onClick={handleManageSubscription}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {t('manageSubscriptionButton')}
        </button>
      </div>

      {usage && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{t('usageDetails.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>{t('usageDetails.count')}:</strong> {usage.usage_count}</p>
            <p><strong>{t('usageDetails.limit')}:</strong> {usage.usage_limit}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${Math.min((usage.usage_count / usage.usage_limit) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {t('usageDetails.remaining', { remaining: Math.max(0, usage.usage_limit - usage.usage_count) })}
          </p>
        </div>
      )}
      {!usage && subscription && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 text-center">
          <p>{t('usageDetails.loadingOrNotAvailable')}</p>
        </div>
      )}

      {user && subscription && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center md:text-left text-gray-800 dark:text-gray-200">{t('learnNewLanguageTitle')}</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">{t('languagesTitle')}</h3>
              <ul className="space-y-2">
                {languages.map((lang) => (
                  <li key={lang.name}>
                    <button
                      onClick={() => setSelectedLanguage(lang)}
                      className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${
                          selectedLanguage.name === lang.name
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
                        }`}
                    >
                      {lang.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full md:w-3/4">
              <h3 className="text-xl font-semibold mb-5 text-slate-800 dark:text-slate-200">
                {selectedLanguage.name} {t('lessonsTitleSuffix')}
              </h3>
              {selectedLanguage && selectedLanguage.lessons && selectedLanguage.lessons.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedLanguage.lessons.map((lesson, index) => (
                    <div key={index} className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-150 ease-in-out">
                      <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400">{lesson.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5">{lesson.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 py-4">{t('noLessonsAvailable')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
