export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

export interface Achievement {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  tier: AchievementTier;
}

export interface UserStats {
  totalLessons: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  languagesStarted: number;
  referralsCompleted: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Lesson milestones
  {
    id: "first_lesson",
    titleKey: "firstLesson.title",
    descriptionKey: "firstLesson.description",
    icon: "🎯",
    tier: "bronze",
  },
  {
    id: "ten_lessons",
    titleKey: "tenLessons.title",
    descriptionKey: "tenLessons.description",
    icon: "📚",
    tier: "silver",
  },
  {
    id: "fifty_lessons",
    titleKey: "fiftyLessons.title",
    descriptionKey: "fiftyLessons.description",
    icon: "🎓",
    tier: "gold",
  },
  {
    id: "hundred_lessons",
    titleKey: "hundredLessons.title",
    descriptionKey: "hundredLessons.description",
    icon: "👑",
    tier: "platinum",
  },

  // Time-based
  {
    id: "one_hour",
    titleKey: "oneHour.title",
    descriptionKey: "oneHour.description",
    icon: "⏱️",
    tier: "bronze",
  },
  {
    id: "ten_hours",
    titleKey: "tenHours.title",
    descriptionKey: "tenHours.description",
    icon: "⏰",
    tier: "gold",
  },

  // Streak-based
  {
    id: "three_day_streak",
    titleKey: "threeDayStreak.title",
    descriptionKey: "threeDayStreak.description",
    icon: "🔥",
    tier: "bronze",
  },
  {
    id: "seven_day_streak",
    titleKey: "sevenDayStreak.title",
    descriptionKey: "sevenDayStreak.description",
    icon: "💪",
    tier: "silver",
  },
  {
    id: "thirty_day_streak",
    titleKey: "thirtyDayStreak.title",
    descriptionKey: "thirtyDayStreak.description",
    icon: "🏆",
    tier: "platinum",
  },

  // Language diversity
  {
    id: "polyglot_starter",
    titleKey: "polyglotStarter.title",
    descriptionKey: "polyglotStarter.description",
    icon: "🌍",
    tier: "silver",
  },
  {
    id: "polyglot_master",
    titleKey: "polyglotMaster.title",
    descriptionKey: "polyglotMaster.description",
    icon: "🌐",
    tier: "platinum",
  },

  // Social
  {
    id: "first_referral",
    titleKey: "firstReferral.title",
    descriptionKey: "firstReferral.description",
    icon: "🤝",
    tier: "silver",
  },
  {
    id: "five_referrals",
    titleKey: "fiveReferrals.title",
    descriptionKey: "fiveReferrals.description",
    icon: "🌟",
    tier: "gold",
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function getTierColor(tier: AchievementTier): string {
  switch (tier) {
    case "bronze":
      return "bg-amber-100 border-amber-400 text-amber-700";
    case "silver":
      return "bg-gray-100 border-gray-400 text-gray-700";
    case "gold":
      return "bg-yellow-100 border-yellow-400 text-yellow-700";
    case "platinum":
      return "bg-purple-100 border-purple-400 text-purple-700";
    default:
      return "bg-gray-100 border-gray-400 text-gray-700";
  }
}

export function getTierGradient(tier: AchievementTier): string {
  switch (tier) {
    case "bronze":
      return "from-amber-200 to-amber-400";
    case "silver":
      return "from-gray-200 to-gray-400";
    case "gold":
      return "from-yellow-200 to-yellow-400";
    case "platinum":
      return "from-purple-200 to-purple-400";
    default:
      return "from-gray-200 to-gray-400";
  }
}

export function checkAchievementProgress(stats: UserStats): {
  achieved: string[];
  progress: Map<string, number>;
} {
  const achieved: string[] = [];
  const progress = new Map<string, number>();

  // Lesson milestones
  if (stats.totalLessons >= 1) {
    achieved.push("first_lesson");
  }
  progress.set("first_lesson", Math.min(stats.totalLessons / 1, 1) * 100);

  if (stats.totalLessons >= 10) {
    achieved.push("ten_lessons");
  }
  progress.set("ten_lessons", Math.min(stats.totalLessons / 10, 1) * 100);

  if (stats.totalLessons >= 50) {
    achieved.push("fifty_lessons");
  }
  progress.set("fifty_lessons", Math.min(stats.totalLessons / 50, 1) * 100);

  if (stats.totalLessons >= 100) {
    achieved.push("hundred_lessons");
  }
  progress.set("hundred_lessons", Math.min(stats.totalLessons / 100, 1) * 100);

  // Time milestones
  if (stats.totalMinutes >= 60) {
    achieved.push("one_hour");
  }
  progress.set("one_hour", Math.min(stats.totalMinutes / 60, 1) * 100);

  if (stats.totalMinutes >= 600) {
    achieved.push("ten_hours");
  }
  progress.set("ten_hours", Math.min(stats.totalMinutes / 600, 1) * 100);

  // Streak milestones
  if (stats.currentStreak >= 3) {
    achieved.push("three_day_streak");
  }
  progress.set("three_day_streak", Math.min(stats.currentStreak / 3, 1) * 100);

  if (stats.currentStreak >= 7) {
    achieved.push("seven_day_streak");
  }
  progress.set("seven_day_streak", Math.min(stats.currentStreak / 7, 1) * 100);

  if (stats.currentStreak >= 30) {
    achieved.push("thirty_day_streak");
  }
  progress.set("thirty_day_streak", Math.min(stats.currentStreak / 30, 1) * 100);

  // Language diversity
  if (stats.languagesStarted >= 3) {
    achieved.push("polyglot_starter");
  }
  progress.set("polyglot_starter", Math.min(stats.languagesStarted / 3, 1) * 100);

  // Referral milestones
  if (stats.referralsCompleted >= 1) {
    achieved.push("first_referral");
  }
  progress.set("first_referral", Math.min(stats.referralsCompleted / 1, 1) * 100);

  if (stats.referralsCompleted >= 5) {
    achieved.push("five_referrals");
  }
  progress.set("five_referrals", Math.min(stats.referralsCompleted / 5, 1) * 100);

  return { achieved, progress };
}
