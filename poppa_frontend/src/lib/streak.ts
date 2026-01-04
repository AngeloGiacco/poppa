import type { Tables } from "@/types/database.types";

export type UserStats = Tables<"user_stats">;

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalLessons: number;
  totalMinutes: number;
  lastLessonDate: string | null;
  isActiveToday: boolean;
  streakAtRisk: boolean;
}

export function calculateStreakInfo(stats: UserStats | null): StreakInfo {
  if (!stats) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalLessons: 0,
      totalMinutes: 0,
      lastLessonDate: null,
      isActiveToday: false,
      streakAtRisk: false,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastLesson = stats.last_lesson_date ? new Date(stats.last_lesson_date) : null;
  if (lastLesson) {
    lastLesson.setHours(0, 0, 0, 0);
  }

  const isActiveToday = lastLesson?.getTime() === today.getTime();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const streakAtRisk = !isActiveToday && lastLesson?.getTime() === yesterday.getTime();

  return {
    currentStreak: stats.current_streak,
    longestStreak: stats.longest_streak,
    totalLessons: stats.total_lessons,
    totalMinutes: stats.total_minutes,
    lastLessonDate: stats.last_lesson_date,
    isActiveToday,
    streakAtRisk,
  };
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) {
    return "🏆";
  }
  if (streak >= 14) {
    return "⭐";
  }
  if (streak >= 7) {
    return "🔥";
  }
  if (streak >= 3) {
    return "✨";
  }
  return "💪";
}

export function getStreakMessage(streakInfo: StreakInfo): string {
  if (streakInfo.currentStreak === 0) {
    return "Start your streak today!";
  }

  if (streakInfo.isActiveToday) {
    if (streakInfo.currentStreak === 1) {
      return "Great start! Come back tomorrow to build your streak.";
    }
    return `${streakInfo.currentStreak} day streak! Keep it going!`;
  }

  if (streakInfo.streakAtRisk) {
    return `${streakInfo.currentStreak} day streak at risk! Practice today to keep it.`;
  }

  return "Your streak has ended. Start a new one today!";
}
