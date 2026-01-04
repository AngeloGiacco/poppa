import posthogLib from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export const initPostHog = () => {
  if (typeof window === "undefined") {
    return;
  }
  if (!POSTHOG_KEY) {
    console.warn("PostHog key not configured");
    return;
  }

  posthogLib.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
  });
};

export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !POSTHOG_KEY) {
    return;
  }
  posthogLib.identify(userId, properties);
};

export const resetUser = () => {
  if (typeof window === "undefined" || !POSTHOG_KEY) {
    return;
  }
  posthogLib.reset();
};

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !POSTHOG_KEY) {
    return;
  }
  posthogLib.capture(eventName, properties);
};

export const Analytics = {
  userSignedUp: (properties?: { email?: string; nativeLanguage?: string }) => {
    trackEvent("user_signed_up", properties);
  },

  userLoggedIn: (userId: string) => {
    trackEvent("user_logged_in", { user_id: userId });
  },

  lessonStarted: (properties: { language: string; lessonType?: string }) => {
    trackEvent("lesson_started", properties);
  },

  lessonCompleted: (properties: {
    language: string;
    durationMinutes: number;
    lessonType?: string;
  }) => {
    trackEvent("lesson_completed", properties);
  },

  checkoutStarted: (properties: { planType: string; priceId?: string }) => {
    trackEvent("checkout_started", properties);
  },

  subscriptionCreated: (properties: { planType: string; priceId?: string }) => {
    trackEvent("subscription_created", properties);
  },

  creditsDepleted: (userId: string) => {
    trackEvent("credits_depleted", { user_id: userId });
  },

  languageAdded: (language: string) => {
    trackEvent("language_added", { language });
  },

  pageViewed: (pageName: string, properties?: Record<string, unknown>) => {
    trackEvent("page_viewed", { page: pageName, ...properties });
  },
};

export const posthog = posthogLib;
