import { sendEmail } from "./client";
import {
  welcomeEmail,
  firstLessonReminderEmail,
  streakReminderEmail,
  weeklyProgressEmail,
  achievementUnlockedEmail,
} from "./templates";

export function sendWelcomeEmail(
  email: string,
  firstName?: string
): Promise<{ success: boolean; error?: string }> {
  const { subject, html, text } = welcomeEmail(firstName);
  return sendEmail({ to: email, subject, html, text });
}

export function sendFirstLessonReminder(
  email: string,
  firstName?: string
): Promise<{ success: boolean; error?: string }> {
  const { subject, html, text } = firstLessonReminderEmail(firstName);
  return sendEmail({ to: email, subject, html, text });
}

export function sendStreakReminder(
  email: string,
  firstName: string | undefined,
  currentStreak: number
): Promise<{ success: boolean; error?: string }> {
  const { subject, html, text } = streakReminderEmail(firstName, currentStreak);
  return sendEmail({ to: email, subject, html, text });
}

export function sendWeeklyProgress(
  email: string,
  firstName: string | undefined,
  stats: {
    lessonsThisWeek: number;
    minutesThisWeek: number;
    currentStreak: number;
    languagesStudied: string[];
  }
): Promise<{ success: boolean; error?: string }> {
  const { subject, html, text } = weeklyProgressEmail(firstName, stats);
  return sendEmail({ to: email, subject, html, text });
}

export function sendAchievementUnlocked(
  email: string,
  firstName: string | undefined,
  achievementTitle: string,
  achievementDescription: string,
  achievementIcon: string
): Promise<{ success: boolean; error?: string }> {
  const { subject, html, text } = achievementUnlockedEmail(
    firstName,
    achievementTitle,
    achievementDescription,
    achievementIcon
  );
  return sendEmail({ to: email, subject, html, text });
}

export * from "./client";
export * from "./templates";
