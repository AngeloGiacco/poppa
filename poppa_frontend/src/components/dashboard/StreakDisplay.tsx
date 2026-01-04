"use client";

import { useEffect, useState } from "react";

import { Flame, Trophy, Clock, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { calculateStreakInfo, getStreakMessage, type StreakInfo } from "@/lib/streak";
import { supabaseBrowserClient } from "@/lib/supabase-browser";
import type { Tables } from "@/types/database.types";

export function StreakDisplay() {
  const { user } = useAuth();
  const t = useTranslations("Dashboard.streak");
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        return;
      }

      try {
        const { data } = await supabaseBrowserClient
          .from("user_stats")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setStreakInfo(calculateStreakInfo(data as Tables<"user_stats"> | null));
      } catch {
        setStreakInfo(calculateStreakInfo(null));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/80 shadow-md backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex animate-pulse items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#8B4513]/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-[#8B4513]/10" />
              <div className="h-3 w-32 rounded bg-[#8B4513]/10" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!streakInfo) {
    return null;
  }

  return (
    <Card className="border-0 bg-white/80 shadow-md backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-[#8B4513]">
          <Flame className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${
                streakInfo.streakAtRisk
                  ? "bg-orange-100"
                  : streakInfo.isActiveToday
                    ? "bg-green-100"
                    : "bg-[#8B4513]/10"
              }`}
            >
              <Flame
                className={`h-7 w-7 ${
                  streakInfo.streakAtRisk
                    ? "text-orange-500"
                    : streakInfo.isActiveToday
                      ? "text-green-600"
                      : "text-[#8B4513]"
                }`}
              />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#8B4513]">{streakInfo.currentStreak}</p>
              <p className="text-sm text-[#5D4037]/70">{t("dayStreak")}</p>
            </div>
          </div>
          {streakInfo.longestStreak > 0 && (
            <div className="flex items-center gap-2 text-sm text-[#5D4037]/70">
              <Trophy className="h-4 w-4" />
              <span>
                {t("best")}: {streakInfo.longestStreak}
              </span>
            </div>
          )}
        </div>

        <p
          className={`text-sm ${
            streakInfo.streakAtRisk ? "font-medium text-orange-600" : "text-[#5D4037]/70"
          }`}
        >
          {getStreakMessage(streakInfo)}
        </p>

        <div className="grid grid-cols-2 gap-4 border-t border-[#8B4513]/10 pt-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#8B4513]/60" />
            <div>
              <p className="font-semibold text-[#8B4513]">{streakInfo.totalLessons}</p>
              <p className="text-xs text-[#5D4037]/60">{t("totalLessons")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#8B4513]/60" />
            <div>
              <p className="font-semibold text-[#8B4513]">{streakInfo.totalMinutes}</p>
              <p className="text-xs text-[#5D4037]/60">{t("totalMinutes")}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
