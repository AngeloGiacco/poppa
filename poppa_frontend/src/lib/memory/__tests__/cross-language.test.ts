/**
 * Tests for Cross-Language Intelligence
 */

import type { TransferableKnowledge, GrammarMemory } from "@/types/memory.types";

import {
  languageFamilies,
  getLanguageFamily,
  areLanguagesRelated,
  getSharedConcepts,
  generateCrossLanguagePrompt,
} from "../cross-language";

describe("cross-language", () => {
  describe("languageFamilies", () => {
    it("should include Romance language family", () => {
      const romance = languageFamilies.find((f) => f.name === "Romance");
      expect(romance).toBeDefined();
      expect(romance?.languages).toContain("spa");
      expect(romance?.languages).toContain("fra");
      expect(romance?.languages).toContain("ita");
      expect(romance?.languages).toContain("por");
    });

    it("should include Germanic language family", () => {
      const germanic = languageFamilies.find((f) => f.name === "Germanic");
      expect(germanic).toBeDefined();
      expect(germanic?.languages).toContain("deu");
      expect(germanic?.languages).toContain("nld");
      expect(germanic?.languages).toContain("swe");
    });

    it("should include Slavic language family", () => {
      const slavic = languageFamilies.find((f) => f.name === "Slavic");
      expect(slavic).toBeDefined();
      expect(slavic?.languages).toContain("rus");
      expect(slavic?.languages).toContain("pol");
    });

    it("should have shared concepts for each family", () => {
      languageFamilies.forEach((family) => {
        expect(family.sharedConcepts.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getLanguageFamily", () => {
    it("should return Romance family for Spanish", () => {
      const family = getLanguageFamily("spa");
      expect(family?.name).toBe("Romance");
    });

    it("should return Germanic family for German", () => {
      const family = getLanguageFamily("deu");
      expect(family?.name).toBe("Germanic");
    });

    it("should return Slavic family for Russian", () => {
      const family = getLanguageFamily("rus");
      expect(family?.name).toBe("Slavic");
    });

    it("should return null for unsupported language", () => {
      const family = getLanguageFamily("xxx");
      expect(family).toBeNull();
    });

    it("should return East Asian family for Japanese", () => {
      const family = getLanguageFamily("jpn");
      expect(family?.name).toBe("East_Asian");
    });

    it("should return Semitic family for Arabic", () => {
      const family = getLanguageFamily("ara");
      expect(family?.name).toBe("Semitic");
    });
  });

  describe("areLanguagesRelated", () => {
    it("should return related=true for Spanish and French", () => {
      const result = areLanguagesRelated("spa", "fra");
      expect(result.related).toBe(true);
      expect(result.family).toBe("Romance");
    });

    it("should return related=true for German and Dutch", () => {
      const result = areLanguagesRelated("deu", "nld");
      expect(result.related).toBe(true);
      expect(result.family).toBe("Germanic");
    });

    it("should return related=false for Spanish and German", () => {
      const result = areLanguagesRelated("spa", "deu");
      expect(result.related).toBe(false);
      expect(result.family).toBeUndefined();
    });

    it("should return related=true for Russian and Polish", () => {
      const result = areLanguagesRelated("rus", "pol");
      expect(result.related).toBe(true);
      expect(result.family).toBe("Slavic");
    });

    it("should be symmetric (order doesn't matter)", () => {
      const result1 = areLanguagesRelated("spa", "fra");
      const result2 = areLanguagesRelated("fra", "spa");
      expect(result1.related).toBe(result2.related);
      expect(result1.family).toBe(result2.family);
    });
  });

  describe("getSharedConcepts", () => {
    it("should return shared concepts for Romance languages", () => {
      const concepts = getSharedConcepts("spa", "fra");
      expect(concepts.length).toBeGreaterThan(0);
      expect(concepts).toContain("gendered_nouns");
      expect(concepts).toContain("subjunctive_mood");
    });

    it("should return shared concepts for Germanic languages", () => {
      const concepts = getSharedConcepts("deu", "nld");
      expect(concepts.length).toBeGreaterThan(0);
      expect(concepts).toContain("case_system");
    });

    it("should return empty array for unrelated languages", () => {
      const concepts = getSharedConcepts("spa", "deu");
      expect(concepts).toEqual([]);
    });

    it("should return empty array for unknown languages", () => {
      const concepts = getSharedConcepts("xxx", "yyy");
      expect(concepts).toEqual([]);
    });
  });

  describe("generateCrossLanguagePrompt", () => {
    const createMockGrammar = (conceptName: string): GrammarMemory => ({
      id: "test-id",
      user_id: "user-1",
      language_code: "spa",
      concept_name: conceptName,
      concept_display: conceptName.replace(/_/g, " "),
      category: "grammar",
      difficulty_tier: 1,
      prerequisites: [],
      unlocks: [],
      explanation: null,
      example_sentences: [],
      mastery_level: 0.9,
      easiness_factor: 2.5,
      interval_days: 7,
      repetitions: 5,
      next_review_at: null,
      last_reviewed_at: null,
      times_practiced: 10,
      times_correct: 9,
      times_struggled: 1,
      error_patterns: [],
      first_introduced_at: new Date().toISOString(),
      introduced_in_session: null,
      curriculum_lesson_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    it("should return empty string for no acceleration opportunities", () => {
      const knowledge: TransferableKnowledge = {
        relatedLanguages: ["spa"],
        transferableConcepts: [],
        accelerationOpportunities: [],
      };

      const result = generateCrossLanguagePrompt(knowledge);
      expect(result).toBe("");
    });

    it("should include related languages in prompt", () => {
      const knowledge: TransferableKnowledge = {
        relatedLanguages: ["spa", "ita"],
        transferableConcepts: [createMockGrammar("subjunctive_mood")],
        accelerationOpportunities: ["subjunctive_mood"],
      };

      const result = generateCrossLanguagePrompt(knowledge);
      expect(result).toContain("spa");
      expect(result).toContain("ita");
    });

    it("should list acceleration opportunities", () => {
      const knowledge: TransferableKnowledge = {
        relatedLanguages: ["spa"],
        transferableConcepts: [
          createMockGrammar("subjunctive_mood"),
          createMockGrammar("gendered_nouns"),
        ],
        accelerationOpportunities: ["subjunctive_mood", "gendered_nouns"],
      };

      const result = generateCrossLanguagePrompt(knowledge);
      expect(result).toContain("Subjunctive Mood");
      expect(result).toContain("Gendered Nouns");
    });

    it("should include guidance on leveraging knowledge", () => {
      const knowledge: TransferableKnowledge = {
        relatedLanguages: ["spa"],
        transferableConcepts: [createMockGrammar("verb_conjugation")],
        accelerationOpportunities: ["verb_conjugation"],
      };

      const result = generateCrossLanguagePrompt(knowledge);
      expect(result).toContain("Leverage");
      expect(result).toContain("existing knowledge");
    });

    it("should include example reference", () => {
      const knowledge: TransferableKnowledge = {
        relatedLanguages: ["spa"],
        transferableConcepts: [createMockGrammar("subjunctive_mood")],
        accelerationOpportunities: ["subjunctive_mood"],
      };

      const result = generateCrossLanguagePrompt(knowledge);
      expect(result).toContain("Spanish");
      expect(result).toContain("quiero que");
    });

    it("should limit to 5 concepts", () => {
      const concepts = [
        "concept_1",
        "concept_2",
        "concept_3",
        "concept_4",
        "concept_5",
        "concept_6",
        "concept_7",
      ];

      const knowledge: TransferableKnowledge = {
        relatedLanguages: ["spa"],
        transferableConcepts: concepts.map(createMockGrammar),
        accelerationOpportunities: concepts,
      };

      const result = generateCrossLanguagePrompt(knowledge);
      // Count bullet points (should be at most 5)
      const bulletPoints = (result.match(/^- /gm) || []).length;
      expect(bulletPoints).toBeLessThanOrEqual(5);
    });
  });
});
