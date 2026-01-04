"use client";

import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import { initPostHog, identifyUser, resetUser } from "@/lib/analytics/posthog";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user, userProfile } = useAuth();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (user && userProfile) {
      identifyUser(user.id, {
        email: user.email,
        first_name: userProfile.first_name,
        native_language: userProfile.native_language,
        created_at: userProfile.created_at,
      });
    } else if (!user) {
      resetUser();
    }
  }, [user, userProfile]);

  return children;
}
