"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  Globe,
  Mic,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import type { learnable_languages } from "@/lib/supportedLanguages";

type Language = (typeof learnable_languages)[number];

interface LanguageLandingPageProps {
  language: Language;
}

export function LanguageLandingPage({ language }: LanguageLandingPageProps) {
  const t = useTranslations("LanguageLanding");
  const tCommon = useTranslations("common");

  const languageName = tCommon(`languages.${language.iso639}`);
  const FlagIcon = language.icon;

  const benefits = [
    { icon: Mic, key: "voiceFirst" },
    { icon: Brain, key: "thinkingMethod" },
    { icon: Target, key: "personalized" },
    { icon: Zap, key: "immediate" },
    { icon: BookOpen, key: "noMemorization" },
    { icon: Globe, key: "nativeContext" },
  ];

  const steps = ["connect", "converse", "discover", "progress"];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Navigation */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-[#8B4513]/5 bg-[#FFF8E1]/80 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#8B4513]">Poppa</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-sm text-[#5D4037] hover:bg-[#8B4513]/10"
            >
              <Link href="/login">{t("nav.login")}</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-[#8B4513] px-5 text-sm text-white shadow-md hover:bg-[#6D3611]"
            >
              <Link href="/signup">{t("nav.getStarted")}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        className="mx-auto max-w-7xl flex-grow px-4 pb-16 pt-28 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className="mx-auto mb-16 max-w-4xl text-center">
          <motion.div
            className="mb-6 flex items-center justify-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FlagIcon className="h-12 w-16" />
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight text-[#8B4513] sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t("hero.title", { language: languageName })}
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#5D4037]/80 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {t("hero.subtitle", { language: languageName })}
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button
              asChild
              className="group rounded-full bg-[#8B4513] px-8 py-6 text-lg text-white shadow-lg hover:bg-[#6D3611] hover:shadow-xl"
            >
              <Link href="/signup">
                <Mic className="mr-2 h-5 w-5" />
                {t("hero.cta", { language: languageName })}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <motion.p
            className="mt-4 text-sm text-[#5D4037]/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {t("hero.freeMinutes")}
          </motion.p>
        </header>

        {/* Benefits Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="mb-8 text-center text-2xl font-bold text-[#8B4513] sm:text-3xl">
            {t("benefits.title", { language: languageName })}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, key }) => (
              <Card
                key={key}
                className="overflow-hidden rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B4513]/10">
                    <Icon className="h-6 w-6 text-[#8B4513]" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#8B4513]">
                    {t(`benefits.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5D4037]/70">
                    {t(`benefits.${key}.description`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="overflow-hidden rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="mb-8 text-center text-2xl font-bold text-[#8B4513] sm:text-3xl">
                {t("howItWorks.title")}
              </h2>

              <div className="grid gap-8 md:grid-cols-4">
                {steps.map((step, index) => (
                  <div key={step} className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#8B4513] text-xl font-bold text-white">
                      {index + 1}
                    </div>
                    <h3 className="mb-2 font-semibold text-[#8B4513]">
                      {t(`howItWorks.steps.${step}.title`)}
                    </h3>
                    <p className="text-sm text-[#5D4037]/70">
                      {t(`howItWorks.steps.${step}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why Poppa Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
        >
          <Card className="overflow-hidden rounded-2xl border-0 bg-[#8B4513] shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Sparkles className="mt-1 h-8 w-8 flex-shrink-0 text-white/80" />
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
                    {t("whyPoppa.title")}
                  </h2>
                  <p className="mb-6 text-lg leading-relaxed text-white/90">
                    {t("whyPoppa.description", { language: languageName })}
                  </p>
                  <div className="space-y-3">
                    {["noApps", "noFlashcards", "noGrammar"].map((key) => (
                      <div key={key} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-white/80" />
                        <span className="text-white/90">{t(`whyPoppa.points.${key}`)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Testimonials />
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="mt-16 py-12 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-[#8B4513] sm:text-3xl">
            {t("cta.title", { language: languageName })}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-[#5D4037]/70">{t("cta.subtitle")}</p>
          <Button
            asChild
            className="rounded-full bg-[#8B4513] px-10 py-6 text-lg text-white shadow-lg hover:bg-[#6D3611] hover:shadow-xl"
          >
            <Link href="/signup">{t("cta.button")}</Link>
          </Button>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}
