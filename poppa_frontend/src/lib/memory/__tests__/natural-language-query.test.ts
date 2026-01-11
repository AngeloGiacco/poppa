/**
 * Tests for Natural Language Query Layer
 */

import supabaseClient from "@/lib/supabase";

import { quickQuery } from "../natural-language-query";

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
      in: jest.fn().mockReturnThis(),
      contains: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

// Mock Anthropic
jest.mock("@anthropic-ai/sdk", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [
          {
            type: "text",
            text: JSON.stringify({
              queries: [
                {
                  table: "vocabulary_memory",
                  filters: { mastery_level: { lt: 0.5 } },
                  orderBy: "times_incorrect",
                  limit: 10,
                },
              ],
              intent: "find_struggling_vocabulary",
              confidence: 0.9,
            }),
          },
        ],
      }),
    },
  })),
}));

describe("natural-language-query", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("quickQuery", () => {
    it("should execute struggling_vocab query", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: [{ term: "difícil", mastery_level: 0.3 }],
          error: null,
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await quickQuery("user-1", "spa", "struggling_vocab");

      expect(supabaseClient.from).toHaveBeenCalledWith("vocabulary_memory");
      expect(result.length).toBe(1);
    });

    it("should execute struggling_grammar query", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: [{ concept_name: "subjunctive", mastery_level: 0.25 }],
          error: null,
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await quickQuery("user-1", "spa", "struggling_grammar");

      expect(supabaseClient.from).toHaveBeenCalledWith("grammar_memory");
      expect(result.length).toBe(1);
    });

    it("should execute due_for_review query", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: [{ term: "revisar" }],
          error: null,
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await quickQuery("user-1", "spa", "due_for_review");

      expect(supabaseClient.from).toHaveBeenCalledWith("vocabulary_memory");
      expect(mockChain.lte).toHaveBeenCalled();
    });

    it("should execute last_session query", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: [{ id: "session-1", transcript_summary: "Good session" }],
          error: null,
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await quickQuery("user-1", "spa", "last_session");

      expect(supabaseClient.from).toHaveBeenCalledWith("lesson_sessions");
    });

    it("should execute mastered_items query", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: [{ term: "hola", mastery_level: 0.95 }],
          error: null,
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await quickQuery("user-1", "spa", "mastered_items");

      expect(mockChain.gte).toHaveBeenCalled();
    });

    it("should return empty array on query error", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: null, error: new Error("DB error") }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await quickQuery("user-1", "spa", "struggling_vocab");

      expect(result).toEqual([]);
    });
  });

  // Note: queryMemoryNaturalLanguage tests would require more complex mocking
  // of the Anthropic SDK, which is handled separately in integration tests
});
