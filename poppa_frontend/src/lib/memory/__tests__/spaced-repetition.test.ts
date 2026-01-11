/**
 * Tests for Spaced Repetition Algorithm (SM-2)
 */

import {
  calculateNextReview,
  assessQualityFromEvent,
  getInitialReviewParams,
  isMastered,
  isStruggling,
  prioritizeReviewItems,
} from "../spaced-repetition";

describe("spaced-repetition", () => {
  describe("calculateNextReview", () => {
    const defaultParams = {
      easinessFactor: 2.5,
      intervalDays: 1,
      repetitions: 0,
    };

    it("should reset repetitions on quality < 3 (failure)", () => {
      const result = calculateNextReview(defaultParams, { quality: 2 });

      expect(result.repetitions).toBe(0);
      expect(result.interval_days).toBe(1);
    });

    it("should increase repetitions on quality >= 3 (success)", () => {
      const result = calculateNextReview(defaultParams, { quality: 4 });

      expect(result.repetitions).toBe(1);
    });

    it("should set interval to 1 day for first repetition", () => {
      const result = calculateNextReview(defaultParams, { quality: 4 });

      expect(result.interval_days).toBe(1);
    });

    it("should set interval to 3 days for second repetition", () => {
      const params = { ...defaultParams, repetitions: 1 };
      const result = calculateNextReview(params, { quality: 4 });

      expect(result.interval_days).toBe(3);
    });

    it("should multiply interval by EF for subsequent repetitions", () => {
      const params = { easinessFactor: 2.5, intervalDays: 3, repetitions: 2 };
      const result = calculateNextReview(params, { quality: 4 });

      expect(result.interval_days).toBe(Math.round(3 * 2.5));
    });

    it("should increase easiness factor for high quality responses", () => {
      const result = calculateNextReview(defaultParams, { quality: 5 });

      expect(result.easiness_factor).toBeGreaterThan(2.5);
    });

    it("should decrease easiness factor for low quality responses", () => {
      const result = calculateNextReview(defaultParams, { quality: 3 });

      expect(result.easiness_factor).toBeLessThan(2.5);
    });

    it("should not let easiness factor go below 1.3", () => {
      const params = { easinessFactor: 1.4, intervalDays: 1, repetitions: 0 };
      const result = calculateNextReview(params, { quality: 0 });

      expect(result.easiness_factor).toBe(1.3);
    });

    it("should calculate mastery level based on repetitions and EF", () => {
      const result = calculateNextReview(
        { easinessFactor: 2.5, intervalDays: 6, repetitions: 5 },
        { quality: 5 }
      );

      expect(result.mastery_level).toBeGreaterThan(0.5);
    });

    it("should set next_review_at to future date", () => {
      const result = calculateNextReview(defaultParams, { quality: 4 });
      const now = new Date();

      expect(result.next_review_at.getTime()).toBeGreaterThan(now.getTime());
    });

    it("should handle perfect responses (quality = 5)", () => {
      const result = calculateNextReview(defaultParams, { quality: 5 });

      expect(result.easiness_factor).toBeGreaterThan(2.5);
      expect(result.repetitions).toBe(1);
    });

    it("should handle complete failure (quality = 0)", () => {
      const result = calculateNextReview(
        { easinessFactor: 2.5, intervalDays: 10, repetitions: 5 },
        { quality: 0 }
      );

      expect(result.repetitions).toBe(0);
      expect(result.interval_days).toBe(1);
    });
  });

  describe("assessQualityFromEvent", () => {
    it("should return 5 for correct responses without hesitation", () => {
      expect(assessQualityFromEvent("correct")).toBe(5);
    });

    it("should return 4 for correct with self-correction", () => {
      expect(assessQualityFromEvent("correct", { self_corrected: true })).toBe(4);
    });

    it("should return 4 for slow but correct responses", () => {
      expect(assessQualityFromEvent("correct", { response_time_ms: 6000 })).toBe(4);
    });

    it("should return 3 for self_corrected events", () => {
      expect(assessQualityFromEvent("self_corrected")).toBe(3);
    });

    it("should return 2 for close attempts that were incorrect", () => {
      expect(assessQualityFromEvent("incorrect", { close_attempt: true })).toBe(2);
    });

    it("should return 1 for incorrect responses", () => {
      expect(assessQualityFromEvent("incorrect")).toBe(1);
    });

    it("should return 0 for struggled events", () => {
      expect(assessQualityFromEvent("struggled")).toBe(0);
    });

    it("should return 4 for reviewed events", () => {
      expect(assessQualityFromEvent("reviewed")).toBe(4);
    });

    it("should return 3 for introduced events", () => {
      expect(assessQualityFromEvent("introduced")).toBe(3);
    });

    it("should return 5 for mastered events", () => {
      expect(assessQualityFromEvent("mastered")).toBe(5);
    });

    it("should return 1 for forgot events", () => {
      expect(assessQualityFromEvent("forgot")).toBe(1);
    });

    it("should return 3 for unknown event types", () => {
      expect(assessQualityFromEvent("unknown" as any)).toBe(3);
    });
  });

  describe("getInitialReviewParams", () => {
    it("should return default easiness factor of 2.5", () => {
      const result = getInitialReviewParams();
      expect(result.easiness_factor).toBe(2.5);
    });

    it("should return initial interval of 1 day", () => {
      const result = getInitialReviewParams();
      expect(result.interval_days).toBe(1);
    });

    it("should return 0 repetitions", () => {
      const result = getInitialReviewParams();
      expect(result.repetitions).toBe(0);
    });

    it("should return 0 mastery level", () => {
      const result = getInitialReviewParams();
      expect(result.mastery_level).toBe(0);
    });

    it("should set next_review_at to tomorrow", () => {
      const result = getInitialReviewParams();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Check it's within the same day (accounting for test execution time)
      expect(result.next_review_at.getDate()).toBe(tomorrow.getDate());
    });
  });

  describe("isMastered", () => {
    it("should return true for mastery >= 0.8", () => {
      expect(isMastered(0.8)).toBe(true);
      expect(isMastered(0.9)).toBe(true);
      expect(isMastered(1.0)).toBe(true);
    });

    it("should return false for mastery < 0.8", () => {
      expect(isMastered(0.79)).toBe(false);
      expect(isMastered(0.5)).toBe(false);
      expect(isMastered(0)).toBe(false);
    });
  });

  describe("isStruggling", () => {
    it("should return true for low mastery and seen more than once", () => {
      expect(isStruggling(0.4, 2)).toBe(true);
      expect(isStruggling(0.3, 5)).toBe(true);
    });

    it("should return false for high mastery", () => {
      expect(isStruggling(0.6, 5)).toBe(false);
      expect(isStruggling(0.8, 10)).toBe(false);
    });

    it("should return false if only seen once", () => {
      expect(isStruggling(0.3, 1)).toBe(false);
      expect(isStruggling(0.1, 0)).toBe(false);
    });

    it("should return false for exactly 0.5 mastery", () => {
      expect(isStruggling(0.5, 5)).toBe(false);
    });
  });

  describe("prioritizeReviewItems", () => {
    const createItem = (
      next_review_at: string | null,
      mastery_level: number,
      times_seen = 5,
      times_incorrect = 0
    ) => ({
      next_review_at,
      mastery_level,
      times_seen,
      times_incorrect,
    });

    it("should filter out items not yet due for review", () => {
      const future = new Date();
      future.setDate(future.getDate() + 5);

      const items = [
        createItem(future.toISOString(), 0.5),
        createItem(new Date().toISOString(), 0.5),
      ];

      const result = prioritizeReviewItems(items);
      expect(result.length).toBe(1);
    });

    it("should include items with null next_review_at", () => {
      const items = [createItem(null, 0.5)];
      const result = prioritizeReviewItems(items);
      expect(result.length).toBe(1);
    });

    it("should prioritize struggling items first", () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);

      const items = [
        createItem(past.toISOString(), 0.7, 5), // Not struggling
        createItem(past.toISOString(), 0.3, 5), // Struggling
      ];

      const result = prioritizeReviewItems(items);
      expect(result[0].mastery_level).toBe(0.3);
    });

    it("should sort by overdue time for non-struggling items", () => {
      const veryOverdue = new Date();
      veryOverdue.setDate(veryOverdue.getDate() - 10);

      const slightlyOverdue = new Date();
      slightlyOverdue.setDate(slightlyOverdue.getDate() - 1);

      const items = [
        createItem(slightlyOverdue.toISOString(), 0.7, 5),
        createItem(veryOverdue.toISOString(), 0.7, 5),
      ];

      const result = prioritizeReviewItems(items);
      // More overdue should come first
      expect(result[0].next_review_at).toBe(veryOverdue.toISOString());
    });

    it("should respect maxItems limit", () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);

      const items = Array(20)
        .fill(null)
        .map(() => createItem(past.toISOString(), 0.5));

      const result = prioritizeReviewItems(items, 5);
      expect(result.length).toBe(5);
    });

    it("should handle empty array", () => {
      const result = prioritizeReviewItems([]);
      expect(result).toEqual([]);
    });
  });
});
