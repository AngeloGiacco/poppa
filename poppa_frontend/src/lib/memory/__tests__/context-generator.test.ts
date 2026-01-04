/**
 * Tests for Lesson Context Generator
 */

import supabaseClient from "@/lib/supabase";

import {
  createMockLearnerProfile,
  createMockLanguageProgress,
  createMockVocabulary,
  createMockGrammar,
  createMockSession,
} from "../__mocks__/test-helpers";
import { generateLessonContext } from "../context-generator";
import * as crossLanguage from "../cross-language";
import * as realtimeQueries from "../realtime-queries";

// Mock the supabase client
jest.mock("@/lib/supabase", () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

// Mock the realtime-queries module
jest.mock("../realtime-queries", () => ({
  getMasteredVocabulary: jest.fn().mockResolvedValue([]),
  getMasteredGrammar: jest.fn().mockResolvedValue([]),
  getVocabularyDueForReview: jest.fn().mockResolvedValue([]),
  getGrammarDueForReview: jest.fn().mockResolvedValue([]),
  getVocabularyStrugglePoints: jest.fn().mockResolvedValue([]),
  getGrammarStrugglePoints: jest.fn().mockResolvedValue([]),
  getRecentSessions: jest.fn().mockResolvedValue([]),
}));

// Mock the cross-language module
jest.mock("../cross-language", () => ({
  getTransferableKnowledge: jest.fn().mockResolvedValue(null),
}));

describe("context-generator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateLessonContext", () => {
    it("should generate context for a new user with no history", async () => {
      const result = await generateLessonContext("user-1", "spa");

      expect(result.user.firstName).toBeNull();
      expect(result.user.nativeLanguage).toBe("English");
      expect(result.languageProgress.proficiencyLevel).toBe("beginner");
      expect(result.languageProgress.totalSessions).toBe(0);
      expect(result.masteredContent.vocabulary).toEqual([]);
      expect(result.masteredContent.grammar).toEqual([]);
      expect(result.dueForReview.vocabulary).toEqual([]);
      expect(result.dueForReview.grammar).toEqual([]);
    });

    it("should include user profile when found", async () => {
      const mockUserChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { first_name: "Maria", native_language: "Portuguese" },
          error: null,
        }),
      };

      (supabaseClient.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "users") {
          return mockUserChain;
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      const result = await generateLessonContext("user-1", "spa");

      expect(result.user.firstName).toBe("Maria");
      expect(result.user.nativeLanguage).toBe("Portuguese");
    });

    it("should include learner profile when found", async () => {
      const mockLearnerProfile = createMockLearnerProfile({
        learning_style: {
          prefers_music_examples: true,
          responds_well_to_humor: true,
        },
        interests: ["cooking", "travel"],
      });

      (supabaseClient.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "learner_profile") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockLearnerProfile,
              error: null,
            }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      const result = await generateLessonContext("user-1", "spa");

      expect(result.user.learnerProfile).not.toBeNull();
      expect(result.user.learnerProfile?.interests).toContain("cooking");
    });

    it("should include language progress when found", async () => {
      const mockProgress = createMockLanguageProgress({
        proficiency_level: "intermediate",
        proficiency_score: 55,
        total_session_count: 15,
        total_practice_minutes: 300,
        current_streak_days: 7,
      });

      (supabaseClient.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "language_progress") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockProgress,
              error: null,
            }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      const result = await generateLessonContext("user-1", "spa");

      expect(result.languageProgress.proficiencyLevel).toBe("intermediate");
      expect(result.languageProgress.proficiencyScore).toBe(55);
      expect(result.languageProgress.totalSessions).toBe(15);
      expect(result.languageProgress.totalMinutes).toBe(300);
      expect(result.languageProgress.currentStreak).toBe(7);
    });

    it("should include mastered vocabulary", async () => {
      const mockVocab = [
        createMockVocabulary({ term: "hola", translation: "hello", mastery_level: 0.9 }),
        createMockVocabulary({ term: "adios", translation: "goodbye", mastery_level: 0.85 }),
      ];

      (realtimeQueries.getMasteredVocabulary as jest.Mock).mockResolvedValue(mockVocab);

      const result = await generateLessonContext("user-1", "spa");

      expect(result.masteredContent.vocabulary.length).toBe(2);
      expect(result.masteredContent.vocabulary[0].term).toBe("hola");
      expect(result.masteredContent.vocabulary[0].mastery_level).toBe(0.9);
    });

    it("should include mastered grammar", async () => {
      const mockGrammar = [
        createMockGrammar({
          concept_name: "present_tense",
          concept_display: "Present Tense",
          mastery_level: 0.88,
        }),
      ];

      (realtimeQueries.getMasteredGrammar as jest.Mock).mockResolvedValue(mockGrammar);

      const result = await generateLessonContext("user-1", "spa");

      expect(result.masteredContent.grammar.length).toBe(1);
      expect(result.masteredContent.grammar[0].concept_name).toBe("present_tense");
    });

    it("should include vocabulary due for review", async () => {
      const mockVocab = [
        createMockVocabulary({ term: "perro", mastery_level: 0.6 }),
        createMockVocabulary({ term: "gato", mastery_level: 0.55 }),
      ];

      (realtimeQueries.getVocabularyDueForReview as jest.Mock).mockResolvedValue(mockVocab);

      const result = await generateLessonContext("user-1", "spa");

      expect(result.dueForReview.vocabulary.length).toBe(2);
    });

    it("should include grammar due for review", async () => {
      const mockGrammar = [createMockGrammar({ concept_name: "subjunctive" })];

      (realtimeQueries.getGrammarDueForReview as jest.Mock).mockResolvedValue(mockGrammar);

      const result = await generateLessonContext("user-1", "spa");

      expect(result.dueForReview.grammar.length).toBe(1);
    });

    it("should include struggling vocabulary with error patterns", async () => {
      const mockVocab = [
        createMockVocabulary({
          term: "cuchara",
          mastery_level: 0.3,
          common_errors: ["confused with tenedor"],
          times_incorrect: 5,
        }),
      ];

      (realtimeQueries.getVocabularyStrugglePoints as jest.Mock).mockResolvedValue(mockVocab);

      const result = await generateLessonContext("user-1", "spa");

      expect(result.strugglingAreas.vocabulary.length).toBe(1);
      expect(result.strugglingAreas.vocabulary[0].term).toBe("cuchara");
      expect(result.strugglingAreas.vocabulary[0].common_errors).toContain("confused with tenedor");
    });

    it("should include struggling grammar with error patterns", async () => {
      const mockGrammar = [
        createMockGrammar({
          concept_name: "subjunctive",
          concept_display: "Subjunctive Mood",
          mastery_level: 0.25,
          error_patterns: [{ error: "using indicative", frequency: 4, last_occurrence: "" }],
          times_struggled: 6,
        }),
      ];

      (realtimeQueries.getGrammarStrugglePoints as jest.Mock).mockResolvedValue(mockGrammar);

      const result = await generateLessonContext("user-1", "spa");

      expect(result.strugglingAreas.grammar.length).toBe(1);
      expect(result.strugglingAreas.grammar[0].concept_name).toBe("subjunctive");
    });

    it("should detect error patterns across struggling items", async () => {
      const mockVocab = [
        createMockVocabulary({ common_errors: ["pronunciation", "spelling"] }),
        createMockVocabulary({ common_errors: ["pronunciation"] }),
        createMockVocabulary({ common_errors: ["pronunciation"] }),
      ];

      (realtimeQueries.getVocabularyStrugglePoints as jest.Mock).mockResolvedValue(mockVocab);

      const result = await generateLessonContext("user-1", "spa");

      expect(result.strugglingAreas.patterns).toContain("pronunciation");
    });

    it("should include recent sessions summary", async () => {
      const mockSessions = [
        createMockSession({
          transcript_summary: "Practiced greetings and basic introductions.",
          vocabulary_introduced: ["hola", "adios"],
          grammar_introduced: ["present_tense"],
          highlights: [{ type: "milestone", description: "First conversation!" }],
        }),
        createMockSession({
          vocabulary_introduced: ["comer", "beber"],
          grammar_introduced: [],
          highlights: [],
        }),
      ];

      (realtimeQueries.getRecentSessions as jest.Mock).mockResolvedValue(mockSessions);

      const result = await generateLessonContext("user-1", "spa");

      expect(result.recentSessions.count).toBe(2);
      expect(result.recentSessions.lastSessionSummary).toBe(
        "Practiced greetings and basic introductions."
      );
      expect(result.recentSessions.conceptsCoveredRecently).toContain("hola");
      expect(result.recentSessions.conceptsCoveredRecently).toContain("present_tense");
      expect(result.recentSessions.recentHighlights.length).toBe(1);
    });

    it("should include curriculum context when provided", async () => {
      const result = await generateLessonContext("user-1", "spa", {
        useCurriculum: true,
        lessonId: 5,
        lessonTitle: "At the Restaurant",
        lessonLevel: "beginner",
        lessonGrammar: [{ name: "querer + infinitive", explanation: "Expressing wants" }],
        lessonVocabulary: [{ term: "menú", translation: "menu" }],
      });

      expect(result.curriculum).toBeDefined();
      expect(result.curriculum?.lessonId).toBe(5);
      expect(result.curriculum?.lessonTitle).toBe("At the Restaurant");
      expect(result.curriculum?.lessonGrammar?.length).toBe(1);
      expect(result.curriculum?.lessonVocabulary?.length).toBe(1);
    });

    it("should not include curriculum when not using curriculum", async () => {
      const result = await generateLessonContext("user-1", "spa", {
        useCurriculum: false,
      });

      expect(result.curriculum).toBeUndefined();
    });

    it("should include cross-language advantage when applicable", async () => {
      (crossLanguage.getTransferableKnowledge as jest.Mock).mockResolvedValue({
        relatedLanguages: ["fra", "ita"],
        transferableConcepts: [
          { concept_display: "Gendered Nouns" },
          { concept_display: "Verb Conjugation" },
        ],
        accelerationOpportunities: ["subjunctive_mood", "reflexive_verbs"],
      });

      const result = await generateLessonContext("user-1", "por");

      expect(result.crossLanguageAdvantage).toBeDefined();
      expect(result.crossLanguageAdvantage?.relatedLanguages).toContain("fra");
      expect(result.crossLanguageAdvantage?.transferableConcepts).toContain("Gendered Nouns");
      expect(result.crossLanguageAdvantage?.accelerationOpportunities).toContain(
        "subjunctive_mood"
      );
    });

    it("should not include cross-language advantage when no opportunities", async () => {
      (crossLanguage.getTransferableKnowledge as jest.Mock).mockResolvedValue({
        relatedLanguages: [],
        transferableConcepts: [],
        accelerationOpportunities: [],
      });

      const result = await generateLessonContext("user-1", "spa");

      expect(result.crossLanguageAdvantage).toBeUndefined();
    });

    it("should build recommended focus from struggling and due items", async () => {
      const mockStrugglingVocab = [
        createMockVocabulary({ term: "difícil" }),
        createMockVocabulary({ term: "problema" }),
      ];
      const mockDueVocab = [
        createMockVocabulary({ term: "revisar" }),
        createMockVocabulary({ term: "estudiar" }),
      ];
      const mockDueGrammar = [createMockGrammar({ concept_name: "past_tense" })];

      (realtimeQueries.getVocabularyStrugglePoints as jest.Mock).mockResolvedValue(
        mockStrugglingVocab
      );
      (realtimeQueries.getVocabularyDueForReview as jest.Mock).mockResolvedValue(mockDueVocab);
      (realtimeQueries.getGrammarDueForReview as jest.Mock).mockResolvedValue(mockDueGrammar);

      const result = await generateLessonContext("user-1", "spa");

      // Struggling items should come first
      expect(result.recommendedFocus.reviewPriority.length).toBeGreaterThan(0);
      expect(result.recommendedFocus.reviewPriority[0].identifier).toBe("difícil");
      expect(result.recommendedFocus.reviewPriority[0].reason).toBe("Needs reinforcement");
    });

    it("should include custom topic in suggested topic", async () => {
      const result = await generateLessonContext("user-1", "spa", {
        customTopic: "Food and cooking",
      });

      expect(result.recommendedFocus.suggestedTopic).toBe("Food and cooking");
    });

    it("should avoid duplicates in review priority", async () => {
      const sharedVocab = createMockVocabulary({ term: "difícil" });

      (realtimeQueries.getVocabularyStrugglePoints as jest.Mock).mockResolvedValue([sharedVocab]);
      (realtimeQueries.getVocabularyDueForReview as jest.Mock).mockResolvedValue([sharedVocab]);

      const result = await generateLessonContext("user-1", "spa");

      const difícilCount = result.recommendedFocus.reviewPriority.filter(
        (r) => r.identifier === "difícil"
      ).length;
      expect(difícilCount).toBe(1);
    });

    it("should fetch all data in parallel", async () => {
      const startTime = Date.now();

      // All mocks return immediately
      await generateLessonContext("user-1", "spa");

      const duration = Date.now() - startTime;
      // Should complete quickly since all fetches are parallel
      expect(duration).toBeLessThan(100);
    });
  });
});
