/**
 * Tests for Real-time Memory Queries
 */

import supabaseClient from "@/lib/supabase";

import {
  createMockVocabulary,
  createMockGrammar,
  createMockSession,
} from "../__mocks__/test-helpers";
import {
  checkVocabularyHistory,
  getVocabularyDueForReview,
  getGrammarDueForReview,
  getReviewItems,
  getGrammarStrugglePoints,
  getVocabularyStrugglePoints,
  getLastSessionSummary,
  getRecentSessions,
  getRelatedVocabulary,
  getMasteredVocabulary,
  getMasteredGrammar,
  checkGrammarHistory,
  getVocabularyByMastery,
} from "../realtime-queries";

// Mock the supabase client
jest.mock("@/lib/supabase", () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

describe("realtime-queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkVocabularyHistory", () => {
    it("should return seen=false when vocabulary not found", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await checkVocabularyHistory("user-1", "spa", "unknown");

      expect(result.seen).toBe(false);
      expect(result.mastery).toBe(0);
      expect(result.lastSeen).toBeNull();
      expect(result.errorPatterns).toEqual([]);
    });

    it("should return vocabulary data when found", async () => {
      const mockVocab = createMockVocabulary({
        mastery_level: 0.75,
        last_reviewed_at: "2024-01-15T00:00:00Z",
        common_errors: ["pronunciation"],
      });

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockVocab, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await checkVocabularyHistory("user-1", "spa", "hola");

      expect(result.seen).toBe(true);
      expect(result.mastery).toBe(0.75);
      expect(result.lastSeen).toBe("2024-01-15T00:00:00Z");
      expect(result.errorPatterns).toEqual(["pronunciation"]);
    });
  });

  describe("getVocabularyDueForReview", () => {
    it("should query vocabulary with next_review_at <= now", async () => {
      const mockVocab = [
        createMockVocabulary({ term: "hola" }),
        createMockVocabulary({ term: "adios" }),
      ];

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockVocab, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getVocabularyDueForReview("user-1", "spa");

      expect(result.length).toBe(2);
      expect(supabaseClient.from).toHaveBeenCalledWith("vocabulary_memory");
    });

    it("should return empty array on error", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: null, error: new Error("DB error") }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getVocabularyDueForReview("user-1", "spa");

      expect(result).toEqual([]);
    });

    it("should respect limit parameter", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await getVocabularyDueForReview("user-1", "spa", 5);

      expect(mockChain.limit).toHaveBeenCalledWith(5);
    });
  });

  describe("getGrammarDueForReview", () => {
    it("should query grammar with next_review_at <= now", async () => {
      const mockGrammar = [createMockGrammar()];

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockGrammar, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getGrammarDueForReview("user-1", "spa");

      expect(result.length).toBe(1);
      expect(supabaseClient.from).toHaveBeenCalledWith("grammar_memory");
    });
  });

  describe("getReviewItems", () => {
    it("should return both vocabulary and grammar due for review", async () => {
      const mockVocab = [createMockVocabulary()];
      const mockGrammar = [createMockGrammar()];

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockImplementation(() => {
          // Return different data based on which table was queried
          const table = (supabaseClient.from as jest.Mock).mock.calls.slice(-1)[0][0];
          if (table === "vocabulary_memory") {
            return Promise.resolve({ data: mockVocab, error: null });
          }
          return Promise.resolve({ data: mockGrammar, error: null });
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getReviewItems("user-1", "spa");

      expect(result.vocabulary).toBeDefined();
      expect(result.grammar).toBeDefined();
    });
  });

  describe("getGrammarStrugglePoints", () => {
    it("should query grammar with low mastery and multiple practices", async () => {
      const mockGrammar = [
        createMockGrammar({
          mastery_level: 0.3,
          times_practiced: 5,
          times_struggled: 3,
        }),
      ];

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lt: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockGrammar, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getGrammarStrugglePoints("user-1", "spa");

      expect(result.length).toBe(1);
      expect(mockChain.lt).toHaveBeenCalled();
      expect(mockChain.gt).toHaveBeenCalled();
    });
  });

  describe("getVocabularyStrugglePoints", () => {
    it("should query vocabulary with low mastery and seen more than once", async () => {
      const mockVocab = [
        createMockVocabulary({
          mastery_level: 0.25,
          times_seen: 5,
          times_incorrect: 4,
        }),
      ];

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lt: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockVocab, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getVocabularyStrugglePoints("user-1", "spa");

      expect(result.length).toBe(1);
    });
  });

  describe("getLastSessionSummary", () => {
    it("should return null when no sessions found", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getLastSessionSummary("user-1", "spa");

      expect(result).toBeNull();
    });

    it("should return session summary when found", async () => {
      const mockSession = createMockSession({
        transcript_summary: "Practiced greetings.",
        vocabulary_introduced: ["hola"],
        vocabulary_reviewed: ["adios"],
        grammar_introduced: [],
        grammar_reviewed: ["present_tense"],
        highlights: [{ type: "breakthrough", description: "Got verb conjugation right!" }],
      });

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockSession, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getLastSessionSummary("user-1", "spa");

      expect(result).not.toBeNull();
      expect(result?.summary).toBe("Practiced greetings.");
      expect(result?.vocabularyCovered).toContain("hola");
      expect(result?.vocabularyCovered).toContain("adios");
      expect(result?.grammarCovered).toContain("present_tense");
    });
  });

  describe("getRecentSessions", () => {
    it("should return recent sessions ordered by date", async () => {
      const mockSessions = [
        createMockSession({ started_at: "2024-01-15T00:00:00Z" }),
        createMockSession({ started_at: "2024-01-14T00:00:00Z" }),
      ];

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockSessions, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getRecentSessions("user-1", "spa");

      expect(result.length).toBe(2);
    });
  });

  describe("getRelatedVocabulary", () => {
    it("should query vocabulary by category", async () => {
      const mockVocab = [
        createMockVocabulary({ category: "food", term: "manzana" }),
        createMockVocabulary({ category: "food", term: "naranja" }),
      ];

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockVocab, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getRelatedVocabulary("user-1", "spa", "food");

      expect(result.length).toBe(2);
    });
  });

  describe("getMasteredVocabulary", () => {
    it("should query vocabulary with high mastery", async () => {
      const mockVocab = [createMockVocabulary({ mastery_level: 0.9 })];

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockVocab, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getMasteredVocabulary("user-1", "spa");

      expect(result.length).toBe(1);
      expect(mockChain.gte).toHaveBeenCalled();
    });
  });

  describe("getMasteredGrammar", () => {
    it("should query grammar with high mastery", async () => {
      const mockGrammar = [createMockGrammar({ mastery_level: 0.85 })];

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockGrammar, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getMasteredGrammar("user-1", "spa");

      expect(result.length).toBe(1);
    });
  });

  describe("checkGrammarHistory", () => {
    it("should return introduced=false when grammar not found", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await checkGrammarHistory("user-1", "spa", "unknown");

      expect(result.introduced).toBe(false);
      expect(result.mastery).toBe(0);
      expect(result.errorPatterns).toEqual([]);
    });

    it("should return grammar data when found", async () => {
      const mockGrammar = createMockGrammar({
        mastery_level: 0.65,
        last_reviewed_at: "2024-01-15T00:00:00Z",
        error_patterns: [{ error: "wrong ending", frequency: 3, last_occurrence: "" }],
      });

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockGrammar, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await checkGrammarHistory("user-1", "spa", "present_tense");

      expect(result.introduced).toBe(true);
      expect(result.mastery).toBe(0.65);
      expect(result.errorPatterns.length).toBe(1);
    });
  });

  describe("getVocabularyByMastery", () => {
    it("should query vocabulary within mastery range", async () => {
      const mockVocab = [
        createMockVocabulary({ mastery_level: 0.5 }),
        createMockVocabulary({ mastery_level: 0.6 }),
      ];

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockVocab, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await getVocabularyByMastery("user-1", "spa", 0.4, 0.7);

      expect(result.length).toBe(2);
      expect(mockChain.gte).toHaveBeenCalled();
      expect(mockChain.lte).toHaveBeenCalled();
    });
  });
});
