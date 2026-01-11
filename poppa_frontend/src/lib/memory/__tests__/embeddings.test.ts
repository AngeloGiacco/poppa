/**
 * Tests for Vector Embeddings
 */

import supabaseClient from "@/lib/supabase";

import {
  createMockVocabulary,
  createMockGrammar,
  createMockSession,
} from "../__mocks__/test-helpers";
import {
  generateEmbedding,
  embedVocabulary,
  embedGrammar,
  embedSession,
  searchVocabularySemantic,
  searchGrammarSemantic,
  searchSessionsSemantic,
  findSimilarVocabulary,
  batchEmbedVocabulary,
} from "../embeddings";

// Mock fetch for OpenAI API
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock the supabase client
jest.mock("@/lib/supabase", () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

describe("embeddings", () => {
  const mockEmbedding = Array(1536).fill(0.1);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENAI_API_KEY = "test-key";

    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [{ embedding: mockEmbedding }],
        }),
    });
  });

  describe("generateEmbedding", () => {
    it("should call OpenAI API with correct parameters", async () => {
      await generateEmbedding("test text");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.openai.com/v1/embeddings",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-key",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: "test text",
          }),
        })
      );
    });

    it("should return embedding array", async () => {
      const result = await generateEmbedding("test text");

      expect(result).toEqual(mockEmbedding);
      expect(result.length).toBe(1536);
    });

    it("should throw error on API failure", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Rate limited",
      });

      await expect(generateEmbedding("test")).rejects.toThrow("Embedding API error");
    });
  });

  describe("embedVocabulary", () => {
    it("should do nothing when vocabulary not found", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await embedVocabulary("user-1", "spa", "unknown");

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should generate and store embedding for vocabulary", async () => {
      const mockVocab = createMockVocabulary({
        id: "vocab-123",
        term: "hola",
        translation: "hello",
        category: "greetings",
        example_sentences: [{ sentence: "Hola, ¿cómo estás?", translation: "Hello, how are you?" }],
      });

      // Create a self-referencing mock chain that supports multiple .eq() calls
      const mockChain: Record<string, jest.Mock> = {};
      mockChain.select = jest.fn(() => mockChain);
      mockChain.update = jest.fn(() => mockChain);
      mockChain.eq = jest.fn(() => mockChain);
      mockChain.single = jest.fn().mockResolvedValue({ data: mockVocab, error: null });

      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await embedVocabulary("user-1", "spa", "hola");

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("embedGrammar", () => {
    it("should do nothing when grammar not found", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await embedGrammar("user-1", "spa", "unknown");

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should generate and store embedding for grammar", async () => {
      const mockGrammar = createMockGrammar({
        id: "grammar-123",
        concept_display: "Present Tense",
        explanation: "Used for current actions",
        category: "tense",
        example_sentences: [{ target: "Yo hablo español", native: "I speak Spanish" }],
      });

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockGrammar, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await embedGrammar("user-1", "spa", "present_tense");

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("embedSession", () => {
    it("should do nothing when session not found", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await embedSession("unknown-session");

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should do nothing when session has no summary", async () => {
      const mockSession = createMockSession({
        transcript_summary: null,
      });

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockSession, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await embedSession("session-1");

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should generate and store embedding for session", async () => {
      const mockSession = createMockSession({
        lesson_title: "Greetings",
        transcript_summary: "Practiced basic greetings and introductions.",
        vocabulary_introduced: ["hola", "adios"],
        grammar_introduced: ["present_tense"],
      });

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockSession, error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      await embedSession("session-1");

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("searchVocabularySemantic", () => {
    it("should call match_vocabulary RPC with embedding", async () => {
      (supabaseClient.rpc as jest.Mock).mockResolvedValue({
        data: [
          { ...createMockVocabulary({ term: "hola" }), similarity: 0.95 },
          { ...createMockVocabulary({ term: "buenos días" }), similarity: 0.85 },
        ],
        error: null,
      });

      const result = await searchVocabularySemantic("user-1", "spa", "greeting");

      expect(mockFetch).toHaveBeenCalled();
      expect(supabaseClient.rpc).toHaveBeenCalledWith("match_vocabulary", {
        query_embedding: mockEmbedding,
        match_user_id: "user-1",
        match_language: "spa",
        match_threshold: 0.7,
        match_count: 10,
      });
      expect(result.length).toBe(2);
      expect(result[0].similarity).toBe(0.95);
    });

    it("should use custom limit and threshold", async () => {
      (supabaseClient.rpc as jest.Mock).mockResolvedValue({
        data: [],
        error: null,
      });

      await searchVocabularySemantic("user-1", "spa", "query", 5, 0.8);

      expect(supabaseClient.rpc).toHaveBeenCalledWith(
        "match_vocabulary",
        expect.objectContaining({
          match_threshold: 0.8,
          match_count: 5,
        })
      );
    });

    it("should return empty array on error", async () => {
      (supabaseClient.rpc as jest.Mock).mockResolvedValue({
        data: null,
        error: new Error("RPC failed"),
      });

      const result = await searchVocabularySemantic("user-1", "spa", "query");

      expect(result).toEqual([]);
    });
  });

  describe("searchGrammarSemantic", () => {
    it("should call match_grammar RPC with embedding", async () => {
      (supabaseClient.rpc as jest.Mock).mockResolvedValue({
        data: [{ ...createMockGrammar(), similarity: 0.9 }],
        error: null,
      });

      const result = await searchGrammarSemantic("user-1", "spa", "verb tenses");

      expect(supabaseClient.rpc).toHaveBeenCalledWith("match_grammar", {
        query_embedding: mockEmbedding,
        match_user_id: "user-1",
        match_language: "spa",
        match_threshold: 0.7,
        match_count: 10,
      });
      expect(result.length).toBe(1);
    });

    it("should return empty array on error", async () => {
      (supabaseClient.rpc as jest.Mock).mockResolvedValue({
        data: null,
        error: new Error("RPC failed"),
      });

      const result = await searchGrammarSemantic("user-1", "spa", "query");

      expect(result).toEqual([]);
    });
  });

  describe("searchSessionsSemantic", () => {
    it("should call match_sessions RPC with embedding", async () => {
      (supabaseClient.rpc as jest.Mock).mockResolvedValue({
        data: [{ ...createMockSession(), similarity: 0.85 }],
        error: null,
      });

      const result = await searchSessionsSemantic("user-1", "spa", "food vocabulary");

      expect(supabaseClient.rpc).toHaveBeenCalledWith("match_sessions", {
        query_embedding: mockEmbedding,
        match_user_id: "user-1",
        match_language: "spa",
        match_threshold: 0.7,
        match_count: 5,
      });
      expect(result.length).toBe(1);
    });

    it("should return empty array on error", async () => {
      (supabaseClient.rpc as jest.Mock).mockResolvedValue({
        data: null,
        error: new Error("RPC failed"),
      });

      const result = await searchSessionsSemantic("user-1", "spa", "query");

      expect(result).toEqual([]);
    });
  });

  describe("findSimilarVocabulary", () => {
    it("should return empty when source has no embedding", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { context_embedding: null },
          error: null,
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const result = await findSimilarVocabulary("user-1", "spa", "hola");

      expect(result).toEqual([]);
      expect(supabaseClient.rpc).not.toHaveBeenCalled();
    });

    it("should find similar vocabulary excluding source", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { context_embedding: mockEmbedding },
          error: null,
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      (supabaseClient.rpc as jest.Mock).mockResolvedValue({
        data: [
          createMockVocabulary({ term: "hola" }),
          createMockVocabulary({ term: "buenos días" }),
          createMockVocabulary({ term: "buenas tardes" }),
        ],
        error: null,
      });

      const result = await findSimilarVocabulary("user-1", "spa", "hola", 5);

      expect(supabaseClient.rpc).toHaveBeenCalledWith("match_vocabulary", {
        query_embedding: mockEmbedding,
        match_user_id: "user-1",
        match_language: "spa",
        match_threshold: 0.6,
        match_count: 6, // limit + 1 to account for source
      });

      // Should filter out the source term
      expect(result.length).toBe(2);
      expect(result.some((v) => v.term === "hola")).toBe(false);
    });

    it("should return empty on RPC error", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { context_embedding: mockEmbedding },
          error: null,
        }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      (supabaseClient.rpc as jest.Mock).mockResolvedValue({
        data: null,
        error: new Error("RPC failed"),
      });

      const result = await findSimilarVocabulary("user-1", "spa", "hola");

      expect(result).toEqual([]);
    });
  });

  describe("batchEmbedVocabulary", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return zeros when no vocabulary to embed", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({ data: [], error: null }),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const promise = batchEmbedVocabulary("user-1", "spa");
      jest.runAllTimers();
      const result = await promise;

      expect(result.processed).toBe(0);
      expect(result.errors).toBe(0);
    });

    it("should process vocabulary in batches", async () => {
      const mockVocab = [
        createMockVocabulary({ id: "v1", term: "hola" }),
        createMockVocabulary({ id: "v2", term: "adios" }),
      ];

      // Create a self-referencing mock chain that supports multiple .eq() calls
      const mockChain: Record<string, jest.Mock> = {};
      mockChain.select = jest.fn(() => mockChain);
      mockChain.update = jest.fn(() => mockChain);
      mockChain.eq = jest.fn(() => mockChain);
      mockChain.is = jest.fn(() => mockChain);
      mockChain.range = jest
        .fn()
        .mockResolvedValueOnce({ data: mockVocab, error: null })
        .mockResolvedValue({ data: [], error: null });

      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const promise = batchEmbedVocabulary("user-1", "spa", 50);

      // Advance through all timers for rate limiting delays
      await jest.runAllTimersAsync();
      const result = await promise;

      expect(result.processed).toBe(2);
      expect(result.errors).toBe(0);
    });

    it("should count errors and continue processing", async () => {
      const mockVocab = [
        createMockVocabulary({ id: "v1", term: "hola" }),
        createMockVocabulary({ id: "v2", term: "error" }),
        createMockVocabulary({ id: "v3", term: "adios" }),
      ];

      // Create a self-referencing mock chain that supports multiple .eq() calls
      const mockChain: Record<string, jest.Mock> = {};
      mockChain.select = jest.fn(() => mockChain);
      mockChain.update = jest.fn(() => mockChain);
      mockChain.eq = jest.fn(() => mockChain);
      mockChain.is = jest.fn(() => mockChain);
      mockChain.range = jest
        .fn()
        .mockResolvedValueOnce({ data: mockVocab, error: null })
        .mockResolvedValue({ data: [], error: null });

      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      // Make the second embedding call fail
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: [{ embedding: mockEmbedding }] }),
        })
        .mockResolvedValueOnce({
          ok: false,
          statusText: "Rate limited",
        })
        .mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ data: [{ embedding: mockEmbedding }] }),
        });

      const promise = batchEmbedVocabulary("user-1", "spa");
      await jest.runAllTimersAsync();
      const result = await promise;

      expect(result.processed).toBe(2);
      expect(result.errors).toBe(1);
    });

    it("should respect batch size parameter", async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({ data: [], error: null }),
        update: jest.fn().mockReturnThis(),
      };
      (supabaseClient.from as jest.Mock).mockReturnValue(mockChain);

      const promise = batchEmbedVocabulary("user-1", "spa", 25);
      await jest.runAllTimersAsync();
      await promise;

      expect(mockChain.range).toHaveBeenCalledWith(0, 24);
    });
  });
});
