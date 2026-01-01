"use client";

import { useRouter } from "next/navigation";

import { BookOpen, Check, Clock, MessageCircle, Mic, Sparkles, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/routing";

const PricingPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations("PricingPage");

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

  const features = [
    { icon: Mic, label: t("features.aiTutor") },
    { icon: Clock, label: t("features.availability") },
    { icon: Sparkles, label: t("features.adaptiveLearning") },
    { icon: TrendingUp, label: t("features.progressTracking") },
    { icon: MessageCircle, label: t("features.conversation") },
    { icon: BookOpen, label: t("features.exercises") },
  ];

  const plans = [
    {
      id: "hobby",
      name: "Hobby",
      price: "$9",
      period: "/month",
      credits: "60",
      description: "Perfect for casual learners",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY,
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "/month",
      credits: "240",
      description: "For dedicated language enthusiasts",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
      popular: true,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Navigation */}
      <div className="absolute left-0 right-0 top-0 z-10 bg-[#FFF8E1]/50 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
          <nav className="flex space-x-4 sm:space-x-6">
            <Button
              asChild
              variant="ghost"
              className="text-sm text-[#8B4513] transition-colors duration-300 hover:bg-transparent hover:text-[#6D3611] sm:text-base"
            >
              <Link href="/">{t("navigation.home")}</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-sm text-[#8B4513] transition-colors duration-300 hover:bg-transparent hover:text-[#6D3611] sm:text-base"
            >
              <Link href="/how-it-works">{t("navigation.howItWorks")}</Link>
            </Button>
          </nav>

          <nav className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSelector />
            <Button
              asChild
              variant="ghost"
              className="text-sm text-[#8B4513] hover:bg-transparent hover:text-[#6D3611] sm:text-base"
            >
              <Link href="/login">{t("navigation.login")}</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-[#8B4513] px-4 text-sm text-white hover:bg-[#6D3611] sm:px-6 sm:text-base"
            >
              <Link href="/signup">{t("navigation.getStarted")}</Link>
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl flex-grow px-4 pb-16 pt-32 sm:px-6 sm:pt-28">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#8B4513] sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#5D4037]/80 sm:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mb-16 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl bg-white/50 p-3 backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#8B4513]/10">
                  <IconComponent className="h-5 w-5 text-[#8B4513]" />
                </div>
                <span className="text-sm font-medium text-[#5D4037]">{feature.label}</span>
              </div>
            );
          })}
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mb-16 grid max-w-4xl gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden rounded-2xl border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                plan.popular ? "ring-2 ring-[#8B4513]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute right-4 top-4">
                  <span className="rounded-full bg-[#8B4513] px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-[#8B4513]">{plan.name}</CardTitle>
                <p className="text-sm text-[#5D4037]/70">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-[#8B4513]">{plan.price}</span>
                  <span className="text-[#5D4037]/70">{plan.period}</span>
                </div>

                <div className="rounded-xl bg-[#8B4513]/5 p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#8B4513]" />
                    <span className="font-medium text-[#5D4037]">
                      {plan.credits} minutes of tutoring
                    </span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-[#5D4037]">
                      <Check className="h-5 w-5 flex-shrink-0 text-[#8B4513]" />
                      <span className="text-sm">{feature.label}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.stripePriceId)}
                  disabled={!plan.stripePriceId}
                  className={`w-full rounded-full py-6 text-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-[#8B4513] text-white shadow-lg hover:bg-[#6D3611] hover:shadow-xl"
                      : "bg-[#8B4513]/10 text-[#8B4513] hover:bg-[#8B4513]/20"
                  }`}
                >
                  Get Started
                </Button>

                {!plan.stripePriceId && (
                  <p className="text-center text-xs text-red-500">Plan not available</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Free Trial CTA */}
        <div className="mx-auto max-w-2xl rounded-2xl bg-white/50 p-8 text-center backdrop-blur-sm">
          <h3 className="mb-2 text-2xl font-bold text-[#8B4513]">{t("cta.startFree")}</h3>
          <p className="mb-6 text-[#5D4037]/70">{t("cta.noCard")}</p>
          <Button
            asChild
            className="rounded-full bg-[#8B4513] px-8 py-6 text-lg text-white shadow-lg transition-all duration-300 hover:bg-[#6D3611] hover:shadow-xl"
          >
            <Link href="/signup">Start Learning Now</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
