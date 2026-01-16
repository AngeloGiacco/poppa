"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { ArrowRight, CirclePlay, Mic } from "lucide-react";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { FloatingElements } from "@/components/landing/FloatingElements";
import { QuickLinks } from "@/components/landing/QuickLinks";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Link } from "@/i18n/routing";
import { learnable_languages } from "@/lib/supportedLanguages";

export default function Home() {
  const t = useTranslations("HomePage");
  const tCommon = useTranslations("common");

  const featuredLanguages = learnable_languages.slice(0, 8);

  return (
    <div className="relative flex min-h-screen flex-col bg-cream-100">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 bg-cream-100/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              className="h-8 w-8 rounded-lg"
              src="/logo.svg"
              alt="Poppa logo"
              width={32}
              height={32}
              priority
            />
          </Link>

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

      {/* Hero Section */}
      <main className="relative flex-grow">
        <FloatingElements />

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pt-40">
          <div className="grid gap-20 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Content */}
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-balance text-4xl font-normal leading-[1.1] tracking-tight text-olive-800 sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl">
                {t("hero.title")}
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-olive-600/80 sm:text-xl">
                {t("hero.subtitle")}
              </p>

              {/* CTA Buttons */}
              <div className="mt-12 flex flex-wrap items-center gap-4">
                <Link href="/signup" className="phosphor-btn-primary group">
                  <CirclePlay className="h-4 w-4" />
                  <span>{t("whyPoppa.tryButton")}</span>
                </Link>
                <Link href="/how-it-works" className="phosphor-btn group">
                  <Mic className="h-4 w-4" />
                  <span>{t("navigation.howItWorks")}</span>
                </Link>
              </div>

              {/* Quick Links Grid */}
              <QuickLinks />
            </motion.div>

            {/* Right Column - Feature Cards */}
            <motion.div
              className="flex flex-col justify-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Feature Card 1 */}
              <div className="phosphor-card group">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-warm-200 to-warm-300 transition-transform duration-300 group-hover:scale-105">
                    <svg
                      className="h-6 w-6 text-warm-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-olive-800">
                      {t("whyPoppa.features.tutoring.title")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-olive-600/70">
                      {t("whyPoppa.features.tutoring.description")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="phosphor-card group">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta-100 to-terracotta-200 transition-transform duration-300 group-hover:scale-105">
                    <svg
                      className="h-6 w-6 text-terracotta-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2V5M12 19V22M2 12H5M19 12H22" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-olive-800">
                      {t("whyPoppa.features.personalized.title")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-olive-600/70">
                      {t("whyPoppa.features.personalized.description")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="phosphor-card group">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200 transition-transform duration-300 group-hover:scale-105">
                    <svg
                      className="h-6 w-6 text-sage-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12H22M12 2C15 5 16 8.5 16 12S15 19 12 22C9 19 8 15.5 8 12S9 5 12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-olive-800">
                      {t("whyPoppa.features.freeStart.title")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-olive-600/70">
                      {t("whyPoppa.features.freeStart.description")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Languages Section */}
        <motion.section
          className="border-t border-cream-200/60 bg-cream-50/50 py-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-2xl font-normal text-olive-800 sm:text-3xl">
                {t("languagesSection.title")}
              </h2>
              <p className="mt-4 text-olive-600/70">
                50+ {tCommon("languages.languagesAvailable")}
              </p>
            </div>

            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
              {featuredLanguages.map((lang) => {
                const FlagIcon = lang.icon;
                return (
                  <Link
                    key={lang.name}
                    href="/signup"
                    className="group flex items-center gap-3 rounded-2xl border border-cream-200/80 bg-cream-50 px-5 py-4 transition-all duration-200 hover:border-warm-300 hover:bg-cream-100 hover:shadow-md"
                  >
                    <FlagIcon className="h-5 w-7 shrink-0" />
                    <span className="truncate text-sm font-medium text-olive-700 transition-colors group-hover:text-olive-800">
                      {tCommon(`languages.${lang.iso639}`)}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Link href="/signup" className="phosphor-btn group">
                <span>{t("languagesSection.viewAll")}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          className="py-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Testimonials />
        </motion.section>

        {/* Final CTA Section */}
        <motion.section
          className="border-t border-cream-200/60 bg-gradient-to-b from-cream-100 to-warm-50/30 py-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
            <h2 className="text-2xl font-normal text-olive-800 sm:text-3xl">
              {t("finalCta.title")}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-olive-600/70">{t("finalCta.description")}</p>
            <div className="mt-10">
              <Link href="/signup" className="phosphor-btn-primary">
                <Mic className="h-4 w-4" />
                <span>{t("finalCta.button")}</span>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
