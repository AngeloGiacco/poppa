"use client";

import { useTranslations } from "next-intl";

import {
  type Achievement,
  type AchievementTier,
  getTierColor,
  getTierGradient,
} from "@/lib/achievements";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
}

export function AchievementBadge({
  achievement,
  unlocked,
  unlockedAt,
  progress = 0,
  size = "md",
  showProgress = true,
}: AchievementBadgeProps) {
  const t = useTranslations("Achievements");

  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-2xl",
    lg: "w-20 h-20 text-3xl",
  };

  const containerClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-lg transition-all",
        containerClasses[size],
        unlocked ? "opacity-100" : "opacity-60"
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full border-2",
          sizeClasses[size],
          unlocked
            ? getTierColor(achievement.tier)
            : "bg-gray-100 border-gray-300 text-gray-400"
        )}
      >
        {unlocked && (
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br opacity-30",
              getTierGradient(achievement.tier)
            )}
          />
        )}
        <span className={unlocked ? "" : "grayscale"}>{achievement.icon}</span>
      </div>

      <div className="text-center">
        <p
          className={cn(
            "text-sm font-medium",
            unlocked ? "text-[#8B4513]" : "text-gray-500"
          )}
        >
          {t(achievement.titleKey)}
        </p>
        {size !== "sm" && (
          <p className="text-xs text-[#5D4037]/60">
            {t(achievement.descriptionKey)}
          </p>
        )}
      </div>

      {!unlocked && showProgress && progress > 0 && (
        <div className="w-full">
          <div className="h-1.5 w-full rounded-full bg-gray-200">
            <div
              className={cn(
                "h-1.5 rounded-full transition-all",
                `bg-gradient-to-r ${getTierGradient(achievement.tier)}`
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-center text-xs text-gray-500">
            {Math.round(progress)}%
          </p>
        </div>
      )}

      {unlocked && unlockedAt && (
        <p className="text-xs text-[#5D4037]/50">
          {t("unlockedOn", {
            date: new Date(unlockedAt).toLocaleDateString(),
          })}
        </p>
      )}

      {unlocked && (
        <TierBadge tier={achievement.tier} />
      )}
    </div>
  );
}

function TierBadge({ tier }: { tier: AchievementTier }) {
  const t = useTranslations("Achievements.tiers");

  const tierLabels = {
    bronze: t("bronze"),
    silver: t("silver"),
    gold: t("gold"),
    platinum: t("platinum"),
  };

  return (
    <span
      className={cn(
        "absolute -top-1 -right-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase",
        getTierColor(tier)
      )}
    >
      {tierLabels[tier]}
    </span>
  );
}
