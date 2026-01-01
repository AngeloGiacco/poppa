"use client";
import React, { useEffect, useState, type ReactNode } from "react";

import { useRouter, usePathname } from "next/navigation";

import { useTranslations } from "next-intl";

import { useAuth } from "@/context/AuthContext";
import { supabaseBrowserClient } from "@/lib/supabase-browser";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

interface Subscription {
  status: string;
  // add other relevant fields if needed for more complex logic
}

interface Usage {
  usage_count: number;
  usage_limit: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles: _allowedRoles,
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("ProtectedRoute");

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      // Store the intended path before redirecting to login
      if (pathname !== "/login" && pathname !== "/register") {
        localStorage.setItem("intendedPath", pathname || "/");
      }
      router.push("/login");
      return;
    }

    // Fetch subscription and usage data only if user is logged in
    const fetchSubscriptionData = async () => {
      setIsSubscriptionLoading(true);
      setSubscriptionError(null);
      try {
        const { data: subData, error: subError } = await supabaseBrowserClient
          .from("subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subError) {
          throw subError;
        }
        setSubscription(subData);

        const { data: usageData, error: usageError } = await supabaseBrowserClient
          .from("usage")
          .select("usage_count, usage_limit")
          .eq("user_id", user.id)
          .single();

        // If usage data is not found, it might mean it's not created yet.
        // For simplicity, we'll allow access if subscription exists and is active,
        // and usage is missing (implying it might be a new user or a plan without strict usage tracking initially)
        // A more robust solution would ensure usage record is created upon subscription.
        if (usageError && usageError.code !== "PGRST116") {
          // PGRST116: "single row not found"
          throw usageError;
        }
        setUsage(usageData);
      } catch (error: unknown) {
        console.error("Error fetching subscription/usage data:", error);
        setSubscriptionError(t("error.fetchSubscription"));
      } finally {
        setIsSubscriptionLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user, isLoading, router, pathname, t]);

  if (isLoading || (user && isSubscriptionLoading)) {
    return <div className="flex h-screen items-center justify-center">{t("loading")}</div>;
  }

  if (!user) {
    // This case should ideally be handled by the useEffect redirect,
    // but as a fallback:
    return null;
  }

  // Allow access to pricing and dashboard regardless of subscription status for management purposes
  // Also allow access to settings pages for general account management
  const openPaths = ["/pricing", "/dashboard", "/settings"];
  if (openPaths.some((p) => pathname?.includes(p))) {
    return <>{children}</>;
  }

  // Check subscription status and usage limits
  // This check applies to routes NOT in openPaths
  if (!isSubscriptionLoading && !subscriptionError) {
    const isActive = subscription?.status === "active" || subscription?.status === "trialing"; // Adjust as per your Stripe statuses
    const usageExceeded = usage ? usage.usage_count >= usage.usage_limit : false;

    if (!isActive) {
      alert(t("alert.inactiveSubscription"));
      router.push("/pricing");
      return null;
    }

    if (usageExceeded) {
      alert(t("alert.usageExceeded"));
      router.push("/pricing"); // Or a specific "upgrade plan" page
      return null;
    }
  } else if (subscriptionError) {
    // If there was an error fetching subscription, block access and show error
    // This prevents users from accessing paid features if subscription check fails
    alert(subscriptionError);
    router.push("/dashboard"); // Redirect to dashboard where they might see more info or retry
    return null;
  }

  // Role-based access control (disabled - userRole not available in AuthContext)
  // TODO: Re-enable when userRole is added to AuthContext
  // if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
  //   alert(t('alert.roleForbidden'));
  //   router.push('/');
  //   return null;
  // }

  // If all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;
