"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { Brain, Target, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default function HowItWorks() {
  const t = useTranslations("HowItWorksPage");

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
              <span className="text-xl font-bold text-[#8B4513]">Poppa</span>
            </Link>
            <nav className="hidden space-x-1 sm:flex">
              <Button
                asChild
                variant="ghost"
                className="text-sm text-[#5D4037] transition-colors duration-300 hover:bg-[#8B4513]/10 hover:text-[#8B4513]"
              >
                <Link href="/pricing">{t("navigation.pricing")}</Link>
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-7xl flex-grow px-6 pb-16 pt-32"
      >
        {/* Header */}
        <motion.header className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div className="mb-8">
            <Link
              href="https://github.com/AngeloGiacco/poppa"
              className="inline-flex items-center space-x-2 rounded-full bg-[#8B4513]/10 px-4 py-2 text-sm text-[#8B4513] transition-colors duration-300 hover:bg-[#8B4513]/15"
            >
              <span>{t("header.openSource.badge")}</span>
              <span className="font-medium">{t("header.openSource.link")}</span>
            </Link>
          </motion.div>

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-[#8B4513] sm:text-5xl">
            {t("header.title")}
          </h1>
          <p className="text-lg text-[#5D4037]/70">
            Learn how Poppa uses the Thinking Method to help you learn languages naturally.
          </p>
        </motion.header>

        {/* Cards */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          <Card className="overflow-hidden rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B4513]/10">
                <Brain className="h-6 w-6 text-[#8B4513]" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-[#8B4513]">
                {t("sections.socraticMethod.title")}
              </h2>
              <p className="text-sm leading-relaxed text-[#5D4037]/70">
                {t("sections.socraticMethod.description1")}
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B4513]/10">
                <Zap className="h-6 w-6 text-[#8B4513]" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-[#8B4513]">
                {t("sections.tech.title")}
              </h2>
              <p className="text-sm leading-relaxed text-[#5D4037]/70">
                {t("sections.tech.description1")}
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B4513]/10">
                <Target className="h-6 w-6 text-[#8B4513]" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-[#8B4513]">
                {t("sections.personalizedLearning.title")}
              </h2>
              <p className="text-sm leading-relaxed text-[#5D4037]/70">
                {t("sections.personalizedLearning.description1")}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
