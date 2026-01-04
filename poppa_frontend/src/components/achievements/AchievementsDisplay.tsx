"use client";

import { useEffect, useState, useCallback } from "react";

import { Award } from "lucide-react";
import { useTranslations } from "next-intl";

import { AchievementBadge } from "@/components/achievements/AchievementBadge";
import { AchievementUnlock } from "@/components/achievements/AchievementUnlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import {
  ACHIEVEMENTS,
  checkAchievementProgress,
  getAchievementById,
  type Achievement,
} from "@/lib/achievements";
import { supabaseBrowserClient } from "@/lib/supabase-browser";

interface UnlockedAchievement {
  achievement_id: string;
  unlocked_at: string;
}

export function AchievementsDisplay() {
  const { user } = useAuth();
  const t = useTranslations("Achievements");
  const [unlockedAchievements, setUnlockedAchievements] = useState<
    UnlockedAchievement[]
  >([]);
  const [progress, setProgress] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const checkForNewAchievements = useCallback(async () => {
    if (!user) {
      return;
    }

    const { data: unnotified } = await supabaseBrowserClient.rpc(
      "get_unnotified_achievements",
      { p_user_id: user.id }
    );

    if (unnotified && unnotified.length > 0) {
      const firstUnnotified = unnotified[0];
      const achievement = getAchievementById(firstUnnotified.achievement_id);
      if (achievement) {
        setNewAchievement(achievement);
      }
    }
  }, [user]);

  const handleDismissNewAchievement = async () => {
    if (!user || !newAchievement) {
      return;
    }

    await supabaseBrowserClient.rpc("mark_achievement_notified", {
      p_user_id: user.id,
      p_achievement_id: newAchievement.id,
    });

    setNewAchievement(null);
    checkForNewAchievements();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        return;
      }

      try {
        // Fetch unlocked achievements
        const { data: achievements } = await supabaseBrowserClient
          .from("user_achievements")
          .select("achievement_id, unlocked_at")
          .eq("user_id", user.id);

        setUnlockedAchievements(achievements || []);

        // Fetch stats for progress calculation
        const { data: stats } = await supabaseBrowserClient
          .from("user_stats")
          .select("*")
          .eq("user_id", user.id)
          .single();

        // Get referral count
        const { count: referralCount } = await supabaseBrowserClient
          .from("referrals")
          .select("*", { count: "exact", head: true })
          .eq("referrer_id", user.id)
          .eq("status", "credited");

        // Get languages started
        const { data: transcripts } = await supabaseBrowserClient
          .from("conversation_transcripts")
          .select("target_language")
          .eq("user_id", user.id);

        const uniqueLanguages = new Set(
          transcripts?.map((t) => t.target_language).filter(Boolean)
        );

        if (stats) {
          const { progress: progressMap } = checkAchievementProgress({
            totalLessons: stats.total_lessons,
            totalMinutes: stats.total_minutes,
            currentStreak: stats.current_streak,
            longestStreak: stats.longest_streak,
            languagesStarted: uniqueLanguages.size,
            referralsCompleted: referralCount || 0,
          });
          setProgress(progressMap);
        }

        // Check for unnotified achievements
        await checkForNewAchievements();
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, checkForNewAchievements]);

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/80 shadow-md backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex animate-pulse items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#8B4513]/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-[#8B4513]/10" />
              <div className="h-3 w-24 rounded bg-[#8B4513]/10" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const unlockedIds = new Set(unlockedAchievements.map((a) => a.achievement_id));
  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <>
      {newAchievement && (
        <AchievementUnlock
          achievement={newAchievement}
          onDismiss={handleDismissNewAchievement}
        />
      )}

      <Card className="border-0 bg-white/80 shadow-md backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg text-[#8B4513]">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {t("title")}
            </div>
            <span className="text-sm font-normal text-[#5D4037]/70">
              {t("progress", { unlocked: unlockedCount, total: totalCount })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
            {ACHIEVEMENTS.map((achievement) => {
              const unlocked = unlockedIds.has(achievement.id);
              const unlockedData = unlockedAchievements.find(
                (a) => a.achievement_id === achievement.id
              );

              return (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={unlocked}
                  unlockedAt={unlockedData?.unlocked_at}
                  progress={progress.get(achievement.id)}
                  size="sm"
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
