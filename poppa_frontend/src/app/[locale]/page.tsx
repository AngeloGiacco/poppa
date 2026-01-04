"use client";

import { useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";
import { ArrowRight, Gift, Mic, Play, Sparkles, Target } from "lucide-react";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { learnable_languages } from "@/lib/supportedLanguages";

export default function Home() {
  const [showAnnouncement] = useState(true);
  const t = useTranslations("HomePage");
  const tCommon = useTranslations("common");

  const featuredLanguages = learnable_languages.slice(0, 12);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Navigation */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-[#8B4513]/5 bg-[#FFF8E1]/80 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                className="h-8 w-8 rounded-xl sm:h-10 sm:w-10"
                src="/logo.svg"
                alt="Poppa logo"
                width={40}
                height={40}
                priority
              />
              <span className="text-xl font-bold text-[#8B4513]">{t("hero.brandName")}</span>
            </Link>
            <nav className="hidden space-x-1 sm:flex">
              <Button
                asChild
                variant="ghost"
                className="text-sm text-[#5D4037] transition-colors duration-300 hover:bg-[#8B4513]/10 hover:text-[#8B4513]"
              >
                <Link href="/pricing">{t("navigation.pricing")}</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-sm text-[#5D4037] transition-colors duration-300 hover:bg-[#8B4513]/10 hover:text-[#8B4513]"
              >
                <Link href="/how-it-works">{t("navigation.howItWorks")}</Link>
              </Button>
            </nav>
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSelector />
            <Button
              asChild
              variant="ghost"
              className="text-sm text-[#5D4037] hover:bg-[#8B4513]/10 hover:text-[#8B4513]"
            >
              <Link href="/login">{t("navigation.login")}</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-[#8B4513] px-5 text-sm text-white shadow-md transition-all duration-300 hover:bg-[#6D3611] hover:shadow-lg"
            >
              <Link href="/signup">{t("navigation.getStarted")}</Link>
            </Button>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        className="mx-auto max-w-7xl flex-grow px-4 pb-16 pt-32 sm:px-6 sm:pt-36"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className="mx-auto mb-16 max-w-4xl text-center sm:mb-20">
          {showAnnouncement && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/founder-message"
                className="group inline-flex items-center gap-2 rounded-full bg-[#8B4513]/10 px-4 py-2 text-sm text-[#8B4513] transition-colors duration-300 hover:bg-[#8B4513]/15"
              >
                <span className="text-base">✨</span>
                <span>{t("announcement.live")}</span>
                <span className="font-medium group-hover:underline">
                  {t("announcement.founderMessage")}
                </span>
              </Link>
            </motion.div>
          )}

          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight text-[#8B4513] sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#5D4037]/80 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button
              asChild
              className="group rounded-full bg-[#8B4513] px-8 py-6 text-lg text-white shadow-lg transition-all duration-300 hover:bg-[#6D3611] hover:shadow-xl"
            >
              <Link href="/signup">
                <Mic className="mr-2 h-5 w-5" />
                {t("whyPoppa.tryButton")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#8B4513]/30 px-8 py-6 text-lg text-[#8B4513] transition-all duration-300 hover:bg-[#8B4513]/10"
            >
              <Link href="/how-it-works">
                <Play className="mr-2 h-5 w-5" />
                See how it works
              </Link>
            </Button>
          </motion.div>
        </header>

        {/* Features Grid */}
        <motion.div
          className="mb-16 grid gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="overflow-hidden rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B4513]/10">
                <Sparkles className="h-6 w-6 text-[#8B4513]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#8B4513]">
                {t("whyPoppa.features.tutoring.title")}
              </h3>
              <p className="text-sm leading-relaxed text-[#5D4037]/70">
                {t("whyPoppa.features.tutoring.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B4513]/10">
                <Target className="h-6 w-6 text-[#8B4513]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#8B4513]">
                {t("whyPoppa.features.personalized.title")}
              </h3>
              <p className="text-sm leading-relaxed text-[#5D4037]/70">
                {t("whyPoppa.features.personalized.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B4513]/10">
                <Gift className="h-6 w-6 text-[#8B4513]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#8B4513]">
                {t("whyPoppa.features.freeStart.title")}
              </h3>
              <p className="text-sm leading-relaxed text-[#5D4037]/70">
                {t("whyPoppa.features.freeStart.description")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Languages Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="overflow-hidden rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="mb-8 text-center">
                <h2 className="mb-2 text-2xl font-bold text-[#8B4513] sm:text-3xl">
                  {t("languagesSection.title")}
                </h2>
                <p className="text-[#5D4037]/70">50+ languages to explore</p>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {featuredLanguages.map((lang) => {
                  const FlagIcon = lang.icon;
                  return (
                    <div
                      key={lang.name}
                      className="group flex cursor-pointer flex-col items-center rounded-xl p-3 transition-colors duration-300 hover:bg-[#8B4513]/5"
                    >
                      <FlagIcon className="mb-2 h-6 w-8 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-center text-sm text-[#5D4037]/80 transition-colors duration-300 group-hover:text-[#8B4513]">
                        {tCommon(`languages.${lang.iso639}`)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-[#8B4513]/30 px-6 text-[#8B4513] hover:bg-[#8B4513]/10"
                >
                  <Link href="/signup">
                    View all 50+ languages
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
        >
          <Testimonials />
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="mt-16 py-12 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="mb-4 text-2xl font-bold text-[#8B4513] sm:text-3xl">
            Ready to start learning?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-[#5D4037]/70">
            Join thousands of learners discovering the joy of conversational language learning.
          </p>
          <Button
            asChild
            className="rounded-full bg-[#8B4513] px-10 py-6 text-lg text-white shadow-lg transition-all duration-300 hover:bg-[#6D3611] hover:shadow-xl"
          >
            <Link href="/signup">Get started for free</Link>
          </Button>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}
