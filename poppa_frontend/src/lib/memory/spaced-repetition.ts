/**
 * Spaced Repetition Algorithm (SM-2)
 * Modified for voice-based language learning
 */

import type {
  ReviewResult,
  SpacedRepetitionUpdate,
  ConceptEventType,
  ConceptEventContext,
} from "@/types/memory.types";

/**
 * Calculate the next review parameters using SM-2 algorithm
 */
export function calculateNextReview(
  current: {
    easinessFactor: number;
    intervalDays: number;
    repetitions: number;
  },
  result: ReviewResult
): SpacedRepetitionUpdate {
  let { easinessFactor, intervalDays, repetitions } = current;
  const { quality } = result;

  // Update easiness factor (minimum 1.3)
  easinessFactor = Math.max(
    1.3,
    easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  if (quality < 3) {
    // Failed - reset repetitions
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Passed - increase interval
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 3;
    } else {
      intervalDays = Math.round(intervalDays * easinessFactor);
    }
  }

  // Calculate mastery level (0-1)
  const masteryLevel = Math.min(1, repetitions * 0.15 + ((easinessFactor - 1.3) / 1.2) * 0.25);

  // Calculate next review date
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  return {
    easiness_factor: easinessFactor,
    interval_days: intervalDays,
    repetitions,
    next_review_at: nextReviewAt,
    mastery_level: masteryLevel,
  };
}

/**
 * Assess quality score (0-5) from a concept event
 */
export function assessQualityFromEvent(
  eventType: ConceptEventType,
  context?: ConceptEventContext
): number {
  switch (eventType) {
    case "correct":
      if (context?.self_corrected) {
        return 4;
      }
      if (context?.response_time_ms && context.response_time_ms > 5000) {
        return 4;
      }
      return 5;

    case "self_corrected":
      return 3;

    case "incorrect":
      if (context?.close_attempt) {
        return 2;
      }
      return 1;

    case "struggled":
      return 0;

    case "reviewed":
      return 4;

    case "introduced":
      return 3;

    case "mastered":
      return 5;

    case "forgot":
      return 1;

    default:
      return 3;
  }
}

/**
 * Calculate initial review parameters for new vocabulary
 */
export function getInitialReviewParams(): {
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: Date;
  mastery_level: number;
} {
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + 1);

  return {
    easiness_factor: 2.5,
    interval_days: 1,
    repetitions: 0,
    next_review_at: nextReview,
    mastery_level: 0,
  };
}

/**
 * Determine if a concept should be considered "mastered"
 */
export function isMastered(masteryLevel: number): boolean {
  return masteryLevel >= 0.8;
}

/**
 * Determine if a concept is "struggling"
 */
export function isStruggling(masteryLevel: number, timesSeen: number): boolean {
  return masteryLevel < 0.5 && timesSeen > 1;
}

/**
 * Calculate optimal review schedule for a set of items
 * Returns items sorted by review priority
 */
export function prioritizeReviewItems<
  T extends {
    next_review_at: string | null;
    mastery_level: number;
    times_seen?: number;
    times_incorrect?: number;
  },
>(items: T[], maxItems = 10): T[] {
  const now = new Date();

  return items
    .filter((item) => {
      if (!item.next_review_at) {
        return true;
      }
      return new Date(item.next_review_at) <= now;
    })
    .sort((a, b) => {
      // Prioritize struggling items
      const aStruggling = isStruggling(a.mastery_level, a.times_seen || 0);
      const bStruggling = isStruggling(b.mastery_level, b.times_seen || 0);

      if (aStruggling && !bStruggling) {
        return -1;
      }
      if (!aStruggling && bStruggling) {
        return 1;
      }

      // Then by overdue time
      const aOverdue = a.next_review_at
        ? now.getTime() - new Date(a.next_review_at).getTime()
        : Number.POSITIVE_INFINITY;
      const bOverdue = b.next_review_at
        ? now.getTime() - new Date(b.next_review_at).getTime()
        : Number.POSITIVE_INFINITY;

      return bOverdue - aOverdue;
    })
    .slice(0, maxItems);
}
