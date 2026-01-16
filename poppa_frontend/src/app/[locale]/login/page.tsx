"use client";

import { useEffect } from "react";

import dynamic from "next/dynamic";
import Image from "next/image";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Footer } from "@/components/Footer";
import { LoadingSpinner } from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { Link, useRouter } from "@/i18n/routing";

const LoginForm = dynamic(() => import("@/components/LoginForm"), { ssr: false });

export default function Login() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations("LoginPage");

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-cream-100">
      <div className="absolute left-0 right-0 top-0 bg-cream-100/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-olive-600 transition-colors duration-300 hover:text-olive-800"
          >
            <span>←</span> {t("navigation.backToHome")}
          </Link>
          <Link
            href="/signup"
            className="font-medium text-olive-600 transition-colors duration-300 hover:text-olive-800"
          >
            {t("navigation.signup")}
          </Link>
        </div>
      </div>

      <div className="mx-auto flex flex-1 flex-col justify-center px-4 pb-16 pt-24">
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
            <span className="text-3xl font-bold text-warm-700">poppa</span>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-olive-800">{t("title")}</h1>
          <p className="text-lg text-olive-600/80">{t("subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="rounded-2xl border border-cream-200/60 bg-cream-50/80 p-8 shadow-lg backdrop-blur-sm">
            <LoginForm />
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
