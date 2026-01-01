"use client";

import { Coins } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Tables } from "@/types/database.types";

interface CreditsBannerProps {
  userData: Tables<"users"> | null;
}

export default function CreditsBanner({ userData }: CreditsBannerProps) {
  const t = useTranslations("DashboardPage");

  if (!userData) {
    return (
      <div className="rounded-full bg-white/70 px-4 py-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-[#8B4513]" />
          <span className="text-sm font-medium text-[#8B4513]">-</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-full bg-white/70 px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-2">
        <Coins className="h-5 w-5 text-[#8B4513]" />
        <span className="text-sm font-medium text-[#8B4513]">
          {new Intl.NumberFormat(undefined, {
            style: "decimal",
            maximumFractionDigits: 0,
          }).format(userData.credits)}{" "}
          {t("credits.credits")}
        </span>
      </div>
    </div>
  );
}
