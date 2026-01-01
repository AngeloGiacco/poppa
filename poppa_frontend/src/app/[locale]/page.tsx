"use client";

import { useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { learnable_languages } from "@/lib/supportedLanguages";

export default function Home() {
  const [showAnnouncement, _setShowAnnouncement] = useState(true);
  const t = useTranslations("HomePage");
  const tCommon = useTranslations("common");

  const _year = 2024;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Navigation - Mobile improvements */}
      <div className="absolute left-0 right-0 top-0 bg-[#FFF8E1]/50 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
          <motion.nav className="flex space-x-4 sm:space-x-6">
            <Button
              asChild
              variant="ghost"
              className="text-sm text-[#8B4513] transition-colors duration-300 hover:bg-transparent hover:text-[#6D3611] sm:text-base"
            >
              <Link href="/pricing">{t("navigation.pricing")}</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-sm text-[#8B4513] transition-colors duration-300 hover:bg-transparent hover:text-[#6D3611] sm:text-base"
            >
              <Link href="/how-it-works">{t("navigation.howItWorks")}</Link>
            </Button>
          </motion.nav>

          <motion.nav className="flex items-center space-x-2 sm:space-x-4">
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
          </motion.nav>
        </div>
      </div>

      {/* Main content - Mobile improvements */}
      <motion.div className="mx-auto max-w-7xl flex-grow px-4 pb-16 pt-40 sm:px-6 sm:pt-32">
        <motion.header className="mx-auto mb-12 max-w-3xl text-center sm:mb-20">
          {showAnnouncement && (
            <motion.div className="mb-8">
              <Link
                href="/founder-message"
                className="inline-flex items-center space-x-2 rounded-full bg-[#8B4513]/10 px-4 py-2 text-sm text-[#8B4513] transition-colors duration-300 hover:bg-[#8B4513]/15"
              >
                <span>{t("announcement.live")}</span>
                <span className="font-medium">{t("announcement.founderMessage")}</span>
              </Link>
            </motion.div>
          )}

          <div className="mb-6 flex items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image
                className="h-12 w-12 rounded-2xl shadow-lg sm:h-16 sm:w-16"
                src="/logo.svg"
                alt="Poppa logo"
                width={64}
                height={64}
                priority
              />
              <span className="text-2xl font-bold text-[#8B4513] sm:text-3xl">
                {t("hero.brandName")}
              </span>
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#8B4513] sm:mb-6 sm:text-5xl md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="px-4 text-lg leading-relaxed text-[#5D4037]/80 sm:px-0 sm:text-xl">
            {t("hero.subtitle")}
          </p>
        </motion.header>

        {/* Cards layout - Mobile improvements */}
        <div className="grid items-start gap-8 sm:gap-12 lg:grid-cols-2">
          <motion.div className="space-y-6">
            <Card className="overflow-hidden rounded-2xl border-0 bg-white/50 shadow-sm backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="mb-4 text-2xl font-semibold text-[#8B4513]">
                  {t("languagesSection.title")}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {learnable_languages.map((lang) => {
                    const FlagIcon = lang.icon;
                    return (
                      <div key={lang.name} className="group flex items-center space-x-3">
                        <FlagIcon className="h-4 w-6 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-[#5D4037]/80 transition-colors duration-300 group-hover:text-[#8B4513]">
                          {tCommon(`languages.${lang.iso639}`)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="lg:mt-12">
            <div className="relative">
              <div className="absolute inset-0 rotate-3 transform rounded-3xl bg-gradient-to-r from-[#8B4513]/5 to-[#8B4513]/10"></div>
              <Card className="relative rounded-2xl border-0 bg-white/80 shadow-lg backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="mb-6 text-2xl font-semibold text-[#8B4513]">
                    {t("whyPoppa.title")}
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#8B4513]/10">
                        <span className="text-[#8B4513]">🎓</span>
                      </div>
                      <div>
                        <h3 className="mb-1 font-medium text-[#8B4513] group-hover:underline">
                          {t("whyPoppa.features.tutoring.title")}
                        </h3>
                        <p className="text-[#5D4037]/80">
                          {t("whyPoppa.features.tutoring.description")}{" "}
                          <Link href="/how-it-works" className="text-[#8B4513] hover:underline">
                            {t("whyPoppa.features.tutoring.learnMore")}
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#8B4513]/10">
                        <span className="text-[#8B4513]">🎯</span>
                      </div>
                      <div>
                        <h3 className="mb-1 font-medium text-[#8B4513]">
                          {t("whyPoppa.features.personalized.title")}
                        </h3>
                        <p className="text-[#5D4037]/80">
                          {t("whyPoppa.features.personalized.description")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#8B4513]/10">
                        <span className="text-[#8B4513]">🎁</span>
                      </div>
                      <div>
                        <h3 className="mb-1 font-medium text-[#8B4513]">
                          {t("whyPoppa.features.freeStart.title")}
                        </h3>
                        <p className="text-[#5D4037]/80">
                          {t("whyPoppa.features.freeStart.description")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      asChild
                      className="w-full rounded-full bg-[#8B4513] px-8 py-6 text-lg text-white shadow-lg transition-all duration-300 hover:bg-[#6D3611] hover:shadow-xl"
                    >
                      <Link href="/signup">{t("whyPoppa.tryButton")}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
      <elevenlabs-convai agent-id="JkB4CzDJfbM0M5aLaoLL"></elevenlabs-convai>
      <script
        src="https://elevenlabs.io/convai-widget/index.js"
        async
        type="text/javascript"
      ></script>
    </div>
  );
}
