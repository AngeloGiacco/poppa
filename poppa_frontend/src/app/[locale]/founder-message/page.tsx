"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default function FounderMessage() {
  const t = useTranslations("FounderMessagePage");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Navigation */}
      <div className="absolute left-0 right-0 top-0 bg-[#FFF8E1]/50 px-6 py-4 backdrop-blur-sm">
        <Button
          variant="ghost"
          asChild
          className="text-[#8B4513] transition-colors duration-300 hover:bg-transparent hover:text-[#6D3611]"
        >
          <Link href="/">{t("navigation.backToHome")}</Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-4xl flex-grow px-6 pb-16 pt-32"
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <Image
              className="h-16 w-16 rounded-2xl shadow-lg"
              src="/logo.svg"
              alt="Poppa logo"
              width={64}
              height={64}
              priority
            />
            <h1 className="text-3xl font-bold text-[#8B4513] sm:text-5xl">poppa</h1>
          </div>
          <p className="text-xl text-[#5D4037]/80">{t("header.subtitle")}</p>
        </motion.header>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 rotate-1 transform rounded-3xl bg-gradient-to-r from-[#8B4513]/5 to-[#8B4513]/10"></div>
          <Card className="relative rounded-2xl border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardContent className="space-y-6 p-8 text-lg text-[#5D4037]">
              <h2 className="text-2xl font-semibold text-[#8B4513]">{t("content.greeting")}</h2>
              <p>{t("content.welcome")}</p>
              <p>{t("content.background")}</p>
              <p>{t("content.philosophy")}</p>
              <p>{t("content.approach")}</p>
              <p>{t("content.story")}</p>
              <p className="font-semibold">{t("content.closing")}</p>
              <p className="font-semibold">{t("content.signature")}</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Footer className="mt-8" />
    </div>
  );
}
