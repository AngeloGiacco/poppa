/**
 * Tests for ElevenLabs Client Tools
 */

import supabaseClient from "@/lib/supabase";

import { createMockVocabulary, createMockGrammar } from "../__mocks__/test-helpers";
import { createMemoryClientTools, getMemoryToolDefinitions } from "../client-tools";
import * as nlQuery from "../natural-language-query";
import * as realtimeQueries from "../realtime-queries";

// Mock the supabase client
jest.mock("@/lib/supabase", () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

// Mock the realtime-queries module
jest.mock("../realtime-queries", () => ({
  checkVocabularyHistory: jest.fn(),
  checkGrammarHistory: jest.fn(),
  getVocabularyDueForReview: jest.fn(),
  getGrammarDueForReview: jest.fn(),
  getLastSessionSummary: jest.fn(),
  getVocabularyStrugglePoints: jest.fn(),
  getGrammarStrugglePoints: jest.fn(),
  getRelatedVocabulary: jest.fn(),
}));

// Mock the natural-language-query module
jest.mock("../natural-language-query", () => ({
  queryMemoryNaturalLanguage: jest.fn(),
}));

describe("client-tools", () => {
  const userId = "user-1";
  const languageCode = "spa";
  const sessionId = "session-1";

  let tools: ReturnType<typeof createMemoryClientTools>;

  beforeEach(() => {
    jest.clearAllMocks();
    tools = createMemoryClientTools(userId, languageCode, sessionId);
  });

  describe("createMemoryClientTools", () => {
    describe("checkVocabulary", () => {
      it("should report when vocabulary is new", async () => {
        (realtimeQueries.checkVocabularyHistory as jest.Mock).mockResolvedValue({
          seen: false,
          mastery: 0,
          lastSeen: null,
          errorPatterns: [],
        });

        const result = await tools.checkVocabulary({ term: "nuevo" });

        expect(result).toContain("has not seen");
        expect(result).toContain("nuevo");
        expect(result).toContain("new vocabulary");
      });

      it("should report vocabulary mastery when seen", async () => {
        (realtimeQueries.checkVocabularyHistory as jest.Mock).mockResolvedValue({
          seen: true,
          mastery: 0.75,
          lastSeen: new Date().toISOString(),
          errorPatterns: [],
        });

        const result = await tools.checkVocabulary({ term: "hola" });

        expect(result).toContain("knows");
        expect(result).toContain("hola");
        expect(result).toContain("75%");
        expect(result).toContain("today");
      });

      it("should include error patterns when present", async () => {
        (realtimeQueries.checkVocabularyHistory as jest.Mock).mockResolvedValue({
          seen: true,
          mastery: 0.5,
          lastSeen: new Date().toISOString(),
          errorPatterns: ["pronunciation", "spelling"],
        });

        const result = await tools.checkVocabulary({ term: "difícil" });

        expect(result).toContain("Common errors");
        expect(result).toContain("pronunciation");
        expect(result).toContain("spelling");
      });

      it("should report no errors when none recorded", async () => {
        (realtimeQueries.checkVocabularyHistory as jest.Mock).mockResolvedValue({
          seen: true,
          mastery: 0.9,
          lastSeen: new Date().toISOString(),
          errorPatterns: [],
        });

        const result = await tools.checkVocabulary({ term: "fácil" });

        expect(result).toContain("No common errors");
      });
    });

    describe("checkGrammar", () => {
      it("should report when grammar is not introduced", async () => {
        (realtimeQueries.checkGrammarHistory as jest.Mock).mockResolvedValue({
          introduced: false,
          mastery: 0,
          lastPracticed: null,
          errorPatterns: [],
        });

        const result = await tools.checkGrammar({ concept: "subjunctive" });

        expect(result).toContain("not been introduced");
        expect(result).toContain("subjunctive");
      });

      it("should report grammar mastery when introduced", async () => {
        (realtimeQueries.checkGrammarHistory as jest.Mock).mockResolvedValue({
          introduced: true,
          mastery: 0.65,
          lastPracticed: new Date().toISOString(),
          errorPatterns: [{ error: "wrong ending", frequency: 3, last_occurrence: "" }],
        });

        const result = await tools.checkGrammar({ concept: "present_tense" });

        expect(result).toContain("studied");
        expect(result).toContain("present_tense");
        expect(result).toContain("65%");
        expect(result).toContain("wrong ending");
      });
    });

    describe("getReviewItems", () => {
      it("should report no items when nothing due", async () => {
        (realtimeQueries.getVocabularyDueForReview as jest.Mock).mockResolvedValue([]);
        (realtimeQueries.getGrammarDueForReview as jest.Mock).mockResolvedValue([]);

        const result = await tools.getReviewItems();

        expect(result).toContain("No items are currently due");
      });

      it("should list vocabulary due for review", async () => {
        (realtimeQueries.getVocabularyDueForReview as jest.Mock).mockResolvedValue([
          createMockVocabulary({ term: "revisar" }),
          createMockVocabulary({ term: "estudiar" }),
        ]);
        (realtimeQueries.getGrammarDueForReview as jest.Mock).mockResolvedValue([]);

        const result = await tools.getReviewItems();

        expect(result).toContain("Vocabulary");
        expect(result).toContain("revisar");
        expect(result).toContain("estudiar");
      });

      it("should list grammar due for review", async () => {
        (realtimeQueries.getVocabularyDueForReview as jest.Mock).mockResolvedValue([]);
        (realtimeQueries.getGrammarDueForReview as jest.Mock).mockResolvedValue([
          createMockGrammar({ concept_display: "Past Tense" }),
        ]);

        const result = await tools.getReviewItems();

        expect(result).toContain("Grammar");
        expect(result).toContain("Past Tense");
      });

      it("should list both vocabulary and grammar when due", async () => {
        (realtimeQueries.getVocabularyDueForReview as jest.Mock).mockResolvedValue([
          createMockVocabulary({ term: "palabra" }),
        ]);
        (realtimeQueries.getGrammarDueForReview as jest.Mock).mockResolvedValue([
          createMockGrammar({ concept_display: "Subjunctive" }),
        ]);

        const result = await tools.getReviewItems();

        expect(result).toContain("Vocabulary");
        expect(result).toContain("palabra");
        expect(result).toContain("Grammar");
        expect(result).toContain("Subjunctive");
      });
    });

    describe("getLastSession", () => {
      it("should report first session for new users", async () => {
        (realtimeQueries.getLastSessionSummary as jest.Mock).mockResolvedValue(null);

        const result = await tools.getLastSession();

        expect(result).toContain("first session");
      });

      it("should return session summary when available", async () => {
        (realtimeQueries.getLastSessionSummary as jest.Mock).mockResolvedValue({
          date: new Date().toISOString(),
          summary: "Practiced greetings and introductions.",
          vocabularyCovered: ["hola", "adios"],
          grammarCovered: ["present_tense"],
        });

        const result = await tools.getLastSession();

        expect(result).toContain("Summary");
        expect(result).toContain("Practiced greetings");
        expect(result).toContain("hola");
        expect(result).toContain("present_tense");
      });
    });

    describe("getStrugglingAreas", () => {
      it("should report no struggle points for new users", async () => {
        (realtimeQueries.getVocabularyStrugglePoints as jest.Mock).mockResolvedValue([]);
        (realtimeQueries.getGrammarStrugglePoints as jest.Mock).mockResolvedValue([]);

        const result = await tools.getStrugglingAreas();

        expect(result).toContain("No significant struggle points");
      });

      it("should list vocabulary struggle points with error counts", async () => {
        (realtimeQueries.getVocabularyStrugglePoints as jest.Mock).mockResolvedValue([
          createMockVocabulary({ term: "difícil", times_incorrect: 5 }),
          createMockVocabulary({ term: "problema", times_incorrect: 3 }),
        ]);
        (realtimeQueries.getGrammarStrugglePoints as jest.Mock).mockResolvedValue([]);

        const result = await tools.getStrugglingAreas();

        expect(result).toContain("Vocabulary");
        expect(result).toContain("difícil");
        expect(result).toContain("5 errors");
      });

      it("should list grammar struggle points", async () => {
        (realtimeQueries.getVocabularyStrugglePoints as jest.Mock).mockResolvedValue([]);
        (realtimeQueries.getGrammarStrugglePoints as jest.Mock).mockResolvedValue([
          createMockGrammar({ concept_display: "Subjunctive Mood" }),
        ]);

        const result = await tools.getStrugglingAreas();

        expect(result).toContain("Grammar");
        expect(result).toContain("Subjunctive Mood");
      });
    });

    describe("getRelatedWords", () => {
      it("should report when no words in category", async () => {
        (realtimeQueries.getRelatedVocabulary as jest.Mock).mockResolvedValue([]);

        const result = await tools.getRelatedWords({ category: "animals" });

        expect(result).toContain("No vocabulary found");
        expect(result).toContain("animals");
      });

      it("should list related vocabulary with translations", async () => {
        (realtimeQueries.getRelatedVocabulary as jest.Mock).mockResolvedValue([
          createMockVocabulary({ term: "perro", translation: "dog", category: "animals" }),
          createMockVocabulary({ term: "gato", translation: "cat", category: "animals" }),
        ]);

        const result = await tools.getRelatedWords({ category: "animals" });

        expect(result).toContain("animals vocabulary");
        expect(result).toContain("perro (dog)");
        expect(result).toContain("gato (cat)");
      });
    });

    describe("recordVocabularyUsage", () => {
      it("should record correct vocabulary usage", async () => {
        const mockFromChain = {
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
        (supabaseClient.from as jest.Mock).mockReturnValue(mockFromChain);

        const result = await tools.recordVocabularyUsage({
          term: "hola",
          correct: true,
        });

        expect(supabaseClient.from).toHaveBeenCalledWith("concept_events");
        expect(mockFromChain.insert).toHaveBeenCalledWith(
          expect.objectContaining({
            user_id: userId,
            session_id: sessionId,
            language_code: languageCode,
            event_type: "correct",
            concept_type: "vocabulary",
            concept_identifier: "hola",
          })
        );
        expect(supabaseClient.rpc).toHaveBeenCalledWith(
          "update_vocabulary_after_review",
          expect.objectContaining({
            p_quality: 4,
          })
        );
        expect(result).toContain("successful");
      });

      it("should record incorrect vocabulary usage", async () => {
        const mockFromChain = {
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
        (supabaseClient.from as jest.Mock).mockReturnValue(mockFromChain);

        const result = await tools.recordVocabularyUsage({
          term: "difícil",
          correct: false,
          context: "confused with fácil",
        });

        expect(mockFromChain.insert).toHaveBeenCalledWith(
          expect.objectContaining({
            event_type: "incorrect",
            context: { user_response: "confused with fácil" },
          })
        );
        expect(supabaseClient.rpc).toHaveBeenCalledWith(
          "update_vocabulary_after_review",
          expect.objectContaining({
            p_quality: 1,
          })
        );
        expect(result).toContain("difficulty");
        expect(result).toContain("reinforce");
      });
    });

    describe("recordGrammarUsage", () => {
      it("should record correct grammar usage", async () => {
        const mockFromChain = {
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
        (supabaseClient.from as jest.Mock).mockReturnValue(mockFromChain);

        const result = await tools.recordGrammarUsage({
          concept: "present_tense",
          correct: true,
        });

        expect(mockFromChain.insert).toHaveBeenCalledWith(
          expect.objectContaining({
            event_type: "correct",
            concept_type: "grammar",
            concept_identifier: "present_tense",
          })
        );
        expect(supabaseClient.rpc).toHaveBeenCalledWith(
          "update_grammar_after_practice",
          expect.objectContaining({
            p_quality: 4,
          })
        );
        expect(result).toContain("successful");
      });

      it("should record struggled grammar usage", async () => {
        const mockFromChain = {
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
        (supabaseClient.from as jest.Mock).mockReturnValue(mockFromChain);

        const result = await tools.recordGrammarUsage({
          concept: "subjunctive",
          correct: false,
        });

        expect(mockFromChain.insert).toHaveBeenCalledWith(
          expect.objectContaining({
            event_type: "struggled",
          })
        );
        expect(supabaseClient.rpc).toHaveBeenCalledWith(
          "update_grammar_after_practice",
          expect.objectContaining({
            p_quality: 1,
          })
        );
        expect(result).toContain("struggle");
      });
    });

    describe("askAboutStudent", () => {
      it("should query memory and return answer", async () => {
        (nlQuery.queryMemoryNaturalLanguage as jest.Mock).mockResolvedValue({
          answer: "The student struggles with verb conjugation.",
          confidence: 0.9,
        });

        const result = await tools.askAboutStudent({
          question: "What does the student struggle with?",
        });

        expect(nlQuery.queryMemoryNaturalLanguage).toHaveBeenCalledWith(
          userId,
          languageCode,
          "What does the student struggle with?"
        );
        expect(result).toBe("The student struggles with verb conjugation.");
      });
    });

    describe("logNewVocabulary", () => {
      it("should upsert vocabulary and log event", async () => {
        const mockFromChain = {
          upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
        (supabaseClient.from as jest.Mock).mockReturnValue(mockFromChain);

        const result = await tools.logNewVocabulary({
          term: "nuevo",
          translation: "new",
          category: "adjectives",
        });

        expect(supabaseClient.from).toHaveBeenCalledWith("vocabulary_memory");
        expect(mockFromChain.upsert).toHaveBeenCalledWith(
          expect.objectContaining({
            user_id: userId,
            language_code: languageCode,
            term: "nuevo",
            translation: "new",
            category: "adjectives",
            introduced_in_session: sessionId,
          }),
          { onConflict: "user_id,language_code,term" }
        );
        expect(supabaseClient.from).toHaveBeenCalledWith("concept_events");
        expect(result).toContain("Logged new vocabulary");
        expect(result).toContain("nuevo");
      });
    });

    describe("logNewGrammar", () => {
      it("should upsert grammar and log event", async () => {
        const mockFromChain = {
          upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
        (supabaseClient.from as jest.Mock).mockReturnValue(mockFromChain);

        const result = await tools.logNewGrammar({
          conceptName: "past_tense_regular",
          conceptDisplay: "Past Tense: Regular Verbs",
          category: "tense",
        });

        expect(supabaseClient.from).toHaveBeenCalledWith("grammar_memory");
        expect(mockFromChain.upsert).toHaveBeenCalledWith(
          expect.objectContaining({
            user_id: userId,
            language_code: languageCode,
            concept_name: "past_tense_regular",
            concept_display: "Past Tense: Regular Verbs",
            category: "tense",
            introduced_in_session: sessionId,
          }),
          { onConflict: "user_id,language_code,concept_name" }
        );
        expect(result).toContain("Logged new grammar concept");
        expect(result).toContain("Past Tense: Regular Verbs");
      });
    });
  });

  describe("getMemoryToolDefinitions", () => {
    it("should return all 11 tool definitions", () => {
      const definitions = getMemoryToolDefinitions();

      expect(definitions.length).toBe(11);
    });

    it("should have checkVocabulary tool", () => {
      const definitions = getMemoryToolDefinitions();
      const tool = definitions.find((t) => t.name === "checkVocabulary");

      expect(tool).toBeDefined();
      expect(tool?.description).toContain("vocabulary");
      expect(tool?.parameters.properties.term).toBeDefined();
      expect(tool?.parameters.required).toContain("term");
    });

    it("should have checkGrammar tool", () => {
      const definitions = getMemoryToolDefinitions();
      const tool = definitions.find((t) => t.name === "checkGrammar");

      expect(tool).toBeDefined();
      expect(tool?.parameters.properties.concept).toBeDefined();
      expect(tool?.parameters.required).toContain("concept");
    });

    it("should have getReviewItems tool with no required params", () => {
      const definitions = getMemoryToolDefinitions();
      const tool = definitions.find((t) => t.name === "getReviewItems");

      expect(tool).toBeDefined();
      expect(tool?.parameters.properties).toEqual({});
    });

    it("should have recordVocabularyUsage tool", () => {
      const definitions = getMemoryToolDefinitions();
      const tool = definitions.find((t) => t.name === "recordVocabularyUsage");

      expect(tool).toBeDefined();
      expect(tool?.parameters.properties.term).toBeDefined();
      expect(tool?.parameters.properties.correct).toBeDefined();
      expect(tool?.parameters.properties.context).toBeDefined();
      expect(tool?.parameters.required).toContain("term");
      expect(tool?.parameters.required).toContain("correct");
    });

    it("should have recordGrammarUsage tool", () => {
      const definitions = getMemoryToolDefinitions();
      const tool = definitions.find((t) => t.name === "recordGrammarUsage");

      expect(tool).toBeDefined();
      expect(tool?.parameters.properties.concept).toBeDefined();
      expect(tool?.parameters.properties.correct).toBeDefined();
    });

    it("should have askAboutStudent tool", () => {
      const definitions = getMemoryToolDefinitions();
      const tool = definitions.find((t) => t.name === "askAboutStudent");

      expect(tool).toBeDefined();
      expect(tool?.description).toContain("natural language");
      expect(tool?.parameters.required).toContain("question");
    });

    it("should have logNewVocabulary tool", () => {
      const definitions = getMemoryToolDefinitions();
      const tool = definitions.find((t) => t.name === "logNewVocabulary");

      expect(tool).toBeDefined();
      expect(tool?.parameters.properties.term).toBeDefined();
      expect(tool?.parameters.properties.translation).toBeDefined();
      expect(tool?.parameters.properties.category).toBeDefined();
      expect(tool?.parameters.required).toContain("term");
      expect(tool?.parameters.required).toContain("translation");
    });

    it("should have logNewGrammar tool", () => {
      const definitions = getMemoryToolDefinitions();
      const tool = definitions.find((t) => t.name === "logNewGrammar");

      expect(tool).toBeDefined();
      expect(tool?.parameters.properties.conceptName).toBeDefined();
      expect(tool?.parameters.properties.conceptDisplay).toBeDefined();
      expect(tool?.parameters.required).toContain("conceptName");
      expect(tool?.parameters.required).toContain("conceptDisplay");
    });

    it("should have all tools with valid structure", () => {
      const definitions = getMemoryToolDefinitions();

      for (const tool of definitions) {
        expect(tool.name).toBeDefined();
        expect(typeof tool.name).toBe("string");
        expect(tool.description).toBeDefined();
        expect(typeof tool.description).toBe("string");
        expect(tool.parameters).toBeDefined();
        expect(tool.parameters.type).toBe("object");
        expect(tool.parameters.properties).toBeDefined();
      }
    });
  });
});
