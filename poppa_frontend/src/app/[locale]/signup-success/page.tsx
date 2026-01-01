"use client";

import { motion } from "framer-motion";
import { Check as LucideCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default function SignupSuccess() {
  const t = useTranslations("SignupSuccess");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFF8E1] to-[#FFF3E0] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-0 bg-white/50 shadow-lg backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <LucideCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>

            <h1 className="mb-4 text-2xl font-bold text-[#8B4513]">{t("title")}</h1>

            <p className="mb-8 text-[#5D4037]/80">{t("description")}</p>

            <Button asChild className="w-full bg-[#8B4513] text-white hover:bg-[#6D3611]">
              <Link href="/login">{t("backToLogin")}</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
