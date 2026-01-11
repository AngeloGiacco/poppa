/**
 * Tests for Prompt Builder
 */

import type { LessonContext, LearnerProfile } from "@/types/memory.types";

import { buildTutorPrompt, buildCompactPrompt } from "../prompt-builder";

describe("prompt-builder", () => {
  const createMinimalContext = (): LessonContext => ({
    user: {
      firstName: null,
      nativeLanguage: "English",
      learnerProfile: null,
    },
    languageProgress: {
      proficiencyLevel: "beginner",
      proficiencyScore: 0,
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      lastPracticeAt: null,
    },
    recentSessions: {
      count: 0,
      lastSessionSummary: null,
      conceptsCoveredRecently: [],
      recentHighlights: [],
    },
    masteredContent: {
      vocabulary: [],
      grammar: [],
    },
    dueForReview: {
      vocabulary: [],
      grammar: [],
    },
    strugglingAreas: {
      vocabulary: [],
      grammar: [],
      patterns: [],
    },
    recommendedFocus: {
      reviewPriority: [],
      newConceptsReady: [],
      suggestedTopic: null,
    },
  });

  const createMockLearnerProfile = (): LearnerProfile => ({
    id: "profile-1",
    user_id: "user-1",
    learning_style: {
      prefers_music_examples: true,
      responds_well_to_humor: true,
    },
    interests: ["cooking", "travel"],
    session_preferences: {
      preferred_pace: "moderate",
      correction_style: "gentle",
    },
    cross_language_notes: null,
    learner_summary: null,
    summary_updated_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  describe("buildTutorPrompt", () => {
    it("should include student profile section", () => {
      const context = createMinimalContext();
      const result = buildTutorPrompt(context);

      expect(result).toContain("## Student Profile");
      expect(result).toContain("English");
    });

    it("should use firstName when available", () => {
      const context = createMinimalContext();
      context.user.firstName = "Maria";

      const result = buildTutorPrompt(context);
      expect(result).toContain("Maria");
    });

    it("should default to 'Student' when no firstName", () => {
      const context = createMinimalContext();
      const result = buildTutorPrompt(context);
      expect(result).toContain("Name: Student");
    });

    it("should include current progress section", () => {
      const context = createMinimalContext();
      context.languageProgress = {
        proficiencyLevel: "intermediate",
        proficiencyScore: 55,
        totalSessions: 10,
        totalMinutes: 120,
        currentStreak: 5,
        lastPracticeAt: new Date().toISOString(),
      };

      const result = buildTutorPrompt(context);

      expect(result).toContain("## Current Progress");
      expect(result).toContain("Intermediate");
      expect(result).toContain("55/100");
      expect(result).toContain("10");
      expect(result).toContain("120 minutes");
      expect(result).toContain("5 days");
    });

    it("should include mastered content when available", () => {
      const context = createMinimalContext();
      context.masteredContent = {
        vocabulary: [
          { term: "hola", translation: "hello", mastery_level: 0.9 },
          { term: "adios", translation: "goodbye", mastery_level: 0.85 },
        ],
        grammar: [
          {
            concept_name: "present_tense",
            concept_display: "Present Tense",
            mastery_level: 0.9,
          },
        ],
      };

      const result = buildTutorPrompt(context);

      expect(result).toContain("What the Student Already Knows");
      expect(result).toContain("hola");
      expect(result).toContain("hello");
      expect(result).toContain("Present Tense");
    });

    it("should include review items when due", () => {
      const context = createMinimalContext();
      context.dueForReview = {
        vocabulary: [
          {
            id: "v1",
            user_id: "u1",
            language_code: "spa",
            term: "perro",
            translation: "dog",
            phonetic: null,
            part_of_speech: null,
            category: "animals",
            example_sentences: [],
            mastery_level: 0.6,
            easiness_factor: 2.5,
            interval_days: 3,
            repetitions: 2,
            next_review_at: null,
            last_reviewed_at: null,
            times_seen: 5,
            times_correct: 3,
            times_incorrect: 2,
            common_errors: [],
            first_introduced_at: new Date().toISOString(),
            introduced_in_session: null,
            curriculum_lesson_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        grammar: [],
      };

      const result = buildTutorPrompt(context);

      expect(result).toContain("Due for Review");
      expect(result).toContain("perro");
      expect(result).toContain("60%");
    });

    it("should include struggling areas", () => {
      const context = createMinimalContext();
      context.strugglingAreas = {
        vocabulary: [
          {
            term: "cuchara",
            translation: "spoon",
            mastery_level: 0.3,
            common_errors: ["confused with tenedor"],
            times_incorrect: 5,
          },
        ],
        grammar: [
          {
            concept_name: "subjunctive",
            concept_display: "Subjunctive Mood",
            mastery_level: 0.25,
            error_patterns: [
              { error: "using indicative instead", frequency: 3, last_occurrence: "" },
            ],
            times_struggled: 4,
          },
        ],
        patterns: ["verb conjugation"],
      };

      const result = buildTutorPrompt(context);

      expect(result).toContain("Needing Reinforcement");
      expect(result).toContain("cuchara");
      expect(result).toContain("confused with tenedor");
      expect(result).toContain("Subjunctive Mood");
      expect(result).toContain("verb conjugation");
    });

    it("should include recent session context", () => {
      const context = createMinimalContext();
      context.recentSessions = {
        count: 3,
        lastSessionSummary: "Practiced food vocabulary and present tense.",
        conceptsCoveredRecently: ["present_tense", "food_vocabulary"],
        recentHighlights: [
          {
            type: "breakthrough",
            description: "Finally understood ser vs estar",
          },
        ],
      };

      const result = buildTutorPrompt(context);

      expect(result).toContain("Recent Session Context");
      expect(result).toContain("Practiced food vocabulary");
      expect(result).toContain("ser vs estar");
    });

    it("should include cross-language advantage when available", () => {
      const context = createMinimalContext();
      context.crossLanguageAdvantage = {
        relatedLanguages: ["spa", "ita"],
        transferableConcepts: ["subjunctive_mood"],
        accelerationOpportunities: ["gendered_nouns", "verb_conjugation"],
      };

      const result = buildTutorPrompt(context);

      expect(result).toContain("Cross-Language Advantage");
      expect(result).toContain("spa");
    });

    it("should include recommended focus", () => {
      const context = createMinimalContext();
      context.recommendedFocus = {
        reviewPriority: [{ type: "vocabulary", identifier: "comer", reason: "Due for review" }],
        newConceptsReady: [{ type: "grammar", identifier: "past_tense", reason: "Ready" }],
        suggestedTopic: "Food and restaurants",
      };

      const result = buildTutorPrompt(context);

      expect(result).toContain("Recommended Focus");
      expect(result).toContain("Food and restaurants");
      expect(result).toContain("comer");
    });

    it("should include curriculum section when provided", () => {
      const context = createMinimalContext();
      context.curriculum = {
        lessonId: 5,
        lessonTitle: "At the Restaurant",
        lessonLevel: "beginner",
        lessonGrammar: [{ name: "querer + infinitive", explanation: "Expressing wants" }],
        lessonVocabulary: [{ term: "menú", translation: "menu" }],
      };

      const result = buildTutorPrompt(context);

      expect(result).toContain("At the Restaurant");
      expect(result).toContain("querer + infinitive");
      expect(result).toContain("menú");
    });

    it("should include learning style from profile", () => {
      const context = createMinimalContext();
      context.user.learnerProfile = createMockLearnerProfile();

      const result = buildTutorPrompt(context);

      expect(result).toContain("music examples");
      expect(result).toContain("humor");
    });

    it("should include interests from profile", () => {
      const context = createMinimalContext();
      context.user.learnerProfile = createMockLearnerProfile();

      const result = buildTutorPrompt(context);

      expect(result).toContain("cooking");
      expect(result).toContain("travel");
    });
  });

  describe("buildCompactPrompt", () => {
    it("should be shorter than full prompt", () => {
      const context = createMinimalContext();
      context.masteredContent = {
        vocabulary: Array(20)
          .fill(null)
          .map((_, i) => ({
            term: `word${i}`,
            translation: `translation${i}`,
            mastery_level: 0.9,
          })),
        grammar: [],
      };

      const fullPrompt = buildTutorPrompt(context);
      const compactPrompt = buildCompactPrompt(context);

      expect(compactPrompt.length).toBeLessThan(fullPrompt.length);
    });

    it("should include basic user info", () => {
      const context = createMinimalContext();
      context.user.firstName = "Maria";

      const result = buildCompactPrompt(context);

      expect(result).toContain("Maria");
      expect(result).toContain("English");
    });

    it("should include proficiency level", () => {
      const context = createMinimalContext();
      context.languageProgress.proficiencyLevel = "intermediate";
      context.languageProgress.proficiencyScore = 55;

      const result = buildCompactPrompt(context);

      expect(result).toContain("intermediate");
      expect(result).toContain("55/100");
    });

    it("should include struggling vocab", () => {
      const context = createMinimalContext();
      context.strugglingAreas.vocabulary = [
        {
          term: "difícil",
          translation: "difficult",
          mastery_level: 0.3,
          common_errors: [],
          times_incorrect: 3,
        },
      ];

      const result = buildCompactPrompt(context);

      expect(result).toContain("difícil");
    });

    it("should include struggling grammar", () => {
      const context = createMinimalContext();
      context.strugglingAreas.grammar = [
        {
          concept_name: "subjunctive",
          concept_display: "Subjunctive",
          mastery_level: 0.2,
          error_patterns: [],
          times_struggled: 5,
        },
      ];

      const result = buildCompactPrompt(context);

      expect(result).toContain("Subjunctive");
    });

    it("should include review vocab", () => {
      const context = createMinimalContext();
      context.dueForReview.vocabulary = [
        {
          id: "v1",
          user_id: "u1",
          language_code: "spa",
          term: "revisar",
          translation: "review",
          phonetic: null,
          part_of_speech: null,
          category: null,
          example_sentences: [],
          mastery_level: 0.6,
          easiness_factor: 2.5,
          interval_days: 3,
          repetitions: 2,
          next_review_at: null,
          last_reviewed_at: null,
          times_seen: 5,
          times_correct: 3,
          times_incorrect: 2,
          common_errors: [],
          first_introduced_at: new Date().toISOString(),
          introduced_in_session: null,
          curriculum_lesson_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const result = buildCompactPrompt(context);

      expect(result).toContain("revisar");
    });
  });
});
