"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default function HowItWorks() {
  const t = useTranslations("HowItWorksPage");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Navigation */}
      <div className="absolute left-0 right-0 top-0 z-50 bg-[#FFF8E1]/50 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <Button
            variant="ghost"
            asChild
            className="text-[#8B4513] transition-colors duration-300 hover:bg-transparent hover:text-[#6D3611]"
          >
            <Link href="/">{t("navigation.backToHome")}</Link>
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-7xl flex-grow px-6 pb-16 pt-32"
      >
        {/* Header */}
        <motion.header className="mx-auto mb-20 max-w-3xl text-center">
          <motion.div className="mb-8">
            <Link
              href="https://github.com/AngeloGiacco/poppa"
              className="inline-flex items-center space-x-2 rounded-full bg-[#8B4513]/10 px-4 py-2 text-sm text-[#8B4513] transition-colors duration-300 hover:bg-[#8B4513]/15"
            >
              <span>{t("header.openSource.badge")}</span>
              <span className="font-medium">{t("header.openSource.link")}</span>
            </Link>
          </motion.div>

          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                className="h-16 w-16 rounded-2xl shadow-lg"
                src="/logo.svg"
                alt="Poppa logo"
                width={64}
                height={64}
                priority
              />
              <span className="text-3xl font-bold text-[#8B4513]">poppa</span>
            </div>
          </div>
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-[#8B4513] sm:text-6xl">
            {t("header.title")}
          </h1>
        </motion.header>

        {/* Cards */}
        <div className="space-y-12">
          <Card className="rounded-2xl border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl">
            <CardContent className="p-8">
              <div className="mb-6 flex items-start space-x-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#8B4513]/10">
                  <span className="text-2xl">🧠</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#8B4513]">
                  {t("sections.socraticMethod.title")}
                </h2>
              </div>
              <p className="mb-4 text-[#5D4037]">{t("sections.socraticMethod.description1")}</p>
              <p className="text-[#5D4037]">{t("sections.socraticMethod.description2")}</p>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 rotate-2 transform rounded-3xl bg-gradient-to-r from-[#8B4513]/5 to-[#8B4513]/10" />
            <Card className="relative rounded-2xl border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6 flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#8B4513]/10">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#8B4513]">
                    {t("sections.tech.title")}
                  </h2>
                </div>
                <p className="mb-4 text-[#5D4037]">{t("sections.tech.description1")}</p>
                <p className="text-[#5D4037]">{t("sections.tech.description2")}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl">
            <CardContent className="p-8">
              <div className="mb-6 flex items-start space-x-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#8B4513]/10">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#8B4513]">
                  {t("sections.personalizedLearning.title")}
                </h2>
              </div>
              <p className="mb-4 text-[#5D4037]">
                {t("sections.personalizedLearning.description1")}
              </p>
              <ul className="mb-4 list-inside list-disc text-[#5D4037]">
                <li>{t("sections.personalizedLearning.benefits.0")}</li>
                <li>{t("sections.personalizedLearning.benefits.1")}</li>
                <li>{t("sections.personalizedLearning.benefits.2")}</li>
              </ul>
              <p className="text-[#5D4037]">{t("sections.personalizedLearning.description2")}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
