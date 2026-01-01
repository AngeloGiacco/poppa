"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import SignupForm from "@/components/SignupForm";
import { Link } from "@/i18n/routing";

export default function SignUp() {
  const t = useTranslations("SignupPage");

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0]">
      {/* Refined navigation */}
      <div className="absolute left-0 right-0 top-0 bg-[#FFF8E1]/50 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#8B4513] transition-colors duration-300 hover:text-[#6D3611]"
          >
            <span>←</span> {t("navigation.backToHome")}
          </Link>
          <Link
            href="/login"
            className="font-medium text-[#8B4513] transition-colors duration-300 hover:text-[#6D3611]"
          >
            {t("login.link")}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 pb-16 pt-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-3">
            <Image
              className="h-16 w-16 rounded-2xl shadow-lg"
              src="/logo.svg"
              alt={t("logo.alt")}
              width={64}
              height={64}
              priority
            />
            <span className="text-3xl font-bold text-[#8B4513]">{t("hero.brandName")}</span>
          </div>
          <p className="text-lg text-[#5D4037]/80">{t("hero.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm">
            <SignupForm />
          </div>
        </motion.div>
      </div>

      <Footer className="absolute bottom-0 w-full" />
    </div>
  );
}
