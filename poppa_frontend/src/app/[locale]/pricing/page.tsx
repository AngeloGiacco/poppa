"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { BookOpen, Check, Clock, MessageCircle, Mic, Sparkles, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { LanguageSelector } from "@/components/LanguageSelector";
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
      description: t("plans.hobby.description"),
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_HOBBY,
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "/month",
      credits: "240",
      description: t("plans.pro.description"),
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
      popular: true,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 bg-cream-100/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                className="h-8 w-8 rounded-lg"
                src="/logo.svg"
                alt="Poppa logo"
                width={32}
                height={32}
                priority
              />
              <span className="text-xl font-semibold text-warm-700">Poppa</span>
            </Link>
            <div className="hidden sm:flex sm:gap-1">
              <Link
                href="/how-it-works"
                className="rounded-lg px-3 py-2 text-sm text-olive-600 transition-colors hover:bg-warm-50 hover:text-olive-800"
              >
                {t("navigation.howItWorks")}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSelector />
            <Link
              href="/login"
              className="hidden text-sm text-olive-600 transition-colors duration-200 hover:text-olive-800 sm:block"
            >
              {t("navigation.login")}
            </Link>
            <Link href="/signup" className="phosphor-btn-primary">
              {t("navigation.getStarted")}
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <motion.section
          className="px-6 pb-12 pt-12 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-4xl font-normal tracking-tight text-warm-700 sm:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-olive-600/80">{t("hero.subtitle")}</p>
          </div>
        </motion.section>

        {/* Features Row */}
        <motion.section
          className="px-6 pb-16 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-olive-600/70">
                  <IconComponent className="h-4 w-4 text-warm-500" />
                  <span className="text-sm">{feature.label}</span>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Pricing Cards */}
        <motion.section
          className="border-t border-cream-200/60 bg-cream-50/50 px-6 py-20 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`relative rounded-2xl border bg-cream-50/80 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? "border-warm-400 shadow-md"
                    : "border-cream-200 hover:border-cream-300"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-6">
                    <span className="rounded-full bg-warm-600 px-4 py-1 text-xs font-medium text-cream-50">
                      {t("plans.popular")}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-medium text-olive-800">{plan.name}</h3>
                  <p className="mt-1 text-sm text-olive-600/70">{plan.description}</p>
                </div>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-5xl font-semibold text-warm-700">{plan.price}</span>
                  <span className="text-olive-500">{plan.period}</span>
                </div>

                <div className="mb-8 rounded-xl bg-warm-50 p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-warm-600" />
                    <span className="font-medium text-olive-700">
                      {plan.credits} {t("plans.minutes")}
                    </span>
                  </div>
                </div>

                <ul className="mb-8 space-y-4">
                  {features.slice(0, 4).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0 text-warm-500" />
                      <span className="text-sm text-olive-600">{feature.label}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.stripePriceId)}
                  className={`w-full rounded-full py-3 text-sm font-medium transition-all duration-200 ${
                    plan.popular
                      ? "bg-warm-600 text-cream-50 hover:bg-warm-700"
                      : "border border-olive-300 bg-transparent text-olive-700 hover:border-warm-400 hover:bg-warm-50"
                  }`}
                >
                  {t("plans.getStarted")}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Free Trial CTA */}
        <motion.section
          className="px-6 py-20 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto max-w-2xl rounded-2xl border border-cream-200/60 bg-gradient-to-b from-cream-50 to-warm-50/30 p-10 text-center">
            <h3 className="mb-3 text-2xl font-normal text-olive-800">{t("cta.startFree")}</h3>
            <p className="mb-8 text-olive-600/70">{t("cta.noCard")}</p>
            <Link href="/signup" className="phosphor-btn-primary">
              <Mic className="h-4 w-4" />
              <span>{t("cta.button")}</span>
            </Link>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
