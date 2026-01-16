"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Mic,
  MessageSquare,
  Sparkles,
  BookOpen,
  Target,
  Lightbulb,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Link } from "@/i18n/routing";

export default function HowItWorks() {
  const t = useTranslations("HowItWorksPage");

  const steps = [
    {
      number: "01",
      title: t("steps.listen.title"),
      description: t("steps.listen.description"),
      icon: Mic,
      color: "from-warm-200 to-warm-300",
      iconColor: "text-warm-700",
    },
    {
      number: "02",
      title: t("steps.think.title"),
      description: t("steps.think.description"),
      icon: Lightbulb,
      color: "from-terracotta-100 to-terracotta-200",
      iconColor: "text-terracotta-600",
    },
    {
      number: "03",
      title: t("steps.speak.title"),
      description: t("steps.speak.description"),
      icon: MessageSquare,
      color: "from-sage-100 to-sage-200",
      iconColor: "text-sage-600",
    },
    {
      number: "04",
      title: t("steps.grow.title"),
      description: t("steps.grow.description"),
      icon: Target,
      color: "from-cream-200 to-cream-300",
      iconColor: "text-cream-700",
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
                href="/pricing"
                className="rounded-lg px-3 py-2 text-sm text-olive-600 transition-colors hover:bg-warm-50 hover:text-olive-800"
              >
                {t("navigation.pricing")}
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
          className="px-6 pb-20 pt-12 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <a
              href="https://github.com/AngeloGiacco/poppa"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-warm-100 px-4 py-2 text-sm text-warm-700 transition-colors hover:bg-warm-200"
            >
              <span>👐</span>
              <span>{t("header.openSource.badge")}</span>
              <span className="font-medium">{t("header.openSource.link")}</span>
              <ArrowRight className="h-3 w-3" />
            </a>

            <h1 className="mb-6 text-4xl font-normal tracking-tight text-warm-700 sm:text-5xl lg:text-6xl">
              {t("header.title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-olive-600/80">{t("header.subtitle")}</p>
          </div>
        </motion.section>

        {/* Method Cards */}
        <motion.section
          className="border-t border-cream-200/60 bg-cream-50/50 px-6 py-20 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-2xl font-normal text-olive-800 sm:text-3xl">
                {t("sections.title")}
              </h2>
              <p className="mt-4 text-olive-600/70">{t("sections.subtitle")}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Socratic Method */}
              <div className="phosphor-card group">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-warm-200 to-warm-300 transition-transform duration-300 group-hover:scale-105">
                    <BookOpen className="h-6 w-6 text-warm-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-olive-800">
                      {t("sections.socraticMethod.title")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-olive-600/70">
                      {t("sections.socraticMethod.description1")}
                    </p>
                  </div>
                </div>
              </div>

              {/* The Tech */}
              <div className="phosphor-card group">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta-100 to-terracotta-200 transition-transform duration-300 group-hover:scale-105">
                    <Sparkles className="h-6 w-6 text-terracotta-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-olive-800">
                      {t("sections.tech.title")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-olive-600/70">
                      {t("sections.tech.description1")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personalized Learning */}
              <div className="phosphor-card group">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200 transition-transform duration-300 group-hover:scale-105">
                    <Target className="h-6 w-6 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-olive-800">
                      {t("sections.personalizedLearning.title")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-olive-600/70">
                      {t("sections.personalizedLearning.description1")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Steps Section */}
        <motion.section
          className="px-6 py-20 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <h2 className="text-2xl font-normal text-olive-800 sm:text-3xl">
                {t("process.title")}
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${step.color}`}
                      >
                        <IconComponent className={`h-5 w-5 ${step.iconColor}`} />
                      </div>
                      <span className="text-sm font-medium text-olive-400">{step.number}</span>
                    </div>
                    <h3 className="mb-2 font-medium text-olive-800">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-olive-600/70">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="border-t border-cream-200/60 bg-gradient-to-b from-cream-100 to-warm-50/30 px-6 py-20 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-normal text-olive-800 sm:text-3xl">
              {t("cta.title")}
            </h2>
            <p className="mb-8 text-olive-600/70">{t("cta.description")}</p>
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
}
