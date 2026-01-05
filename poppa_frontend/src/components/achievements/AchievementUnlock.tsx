"use client";

import { useEffect, useState } from "react";

import { X, PartyPopper } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { type Achievement, getTierColor, getTierGradient } from "@/lib/achievements";
import { Analytics } from "@/lib/analytics/posthog";
import { cn } from "@/lib/utils";

interface AchievementUnlockProps {
  achievement: Achievement;
  onDismiss: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export function AchievementUnlock({
  achievement,
  onDismiss,
  autoHide = true,
  autoHideDelay = 5000,
}: AchievementUnlockProps) {
  const t = useTranslations("Achievements");
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  useEffect(() => {
    // Track achievement unlock
    Analytics.track("achievement_unlocked", {
      achievement_id: achievement.id,
      achievement_tier: achievement.tier,
    });

    // Animate in
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto-hide
    let hideTimer: NodeJS.Timeout;
    if (autoHide) {
      hideTimer = setTimeout(() => {
        handleDismiss();
      }, autoHideDelay);
    }

    return () => {
      clearTimeout(showTimer);
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievement, autoHide, autoHideDelay]);

  return (
    <dialog
      open
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center border-none bg-transparent p-0 transition-all duration-300 backdrop:bg-black/30 backdrop:backdrop-blur-sm",
        isVisible && !isLeaving ? "opacity-100" : "opacity-0"
      )}
      onClick={handleDismiss}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          handleDismiss();
        }
      }}
    >
      <div
        className={cn(
          "relative mx-4 max-w-sm transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300",
          isVisible && !isLeaving ? "scale-100" : "scale-95"
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-[#8B4513]">
            <PartyPopper className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">{t("unlocked")}</span>
            <PartyPopper className="h-5 w-5" />
          </div>

          <div
            className={cn(
              "relative flex h-24 w-24 items-center justify-center rounded-full border-4",
              getTierColor(achievement.tier)
            )}
          >
            <div
              className={cn(
                "absolute inset-0 animate-pulse rounded-full bg-gradient-to-br opacity-30",
                getTierGradient(achievement.tier)
              )}
            />
            <span className="text-5xl">{achievement.icon}</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#8B4513]">{t(achievement.titleKey)}</h3>
            <p className="mt-1 text-sm text-[#5D4037]/70">{t(achievement.descriptionKey)}</p>
          </div>

          <div
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold uppercase",
              getTierColor(achievement.tier)
            )}
          >
            {t(`tiers.${achievement.tier}`)}
          </div>

          <Button
            onClick={handleDismiss}
            className="mt-2 bg-[#8B4513] text-white hover:bg-[#6D3611]"
          >
            {t("awesome")}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
