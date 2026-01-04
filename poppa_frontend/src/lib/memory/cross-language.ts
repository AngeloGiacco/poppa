/**
 * Cross-Language Intelligence
 * Leverages knowledge from related languages
 */

import supabaseClient from "@/lib/supabase";
import type {
  LanguageFamily,
  TransferableKnowledge,
  GrammarMemory,
} from "@/types/memory.types";

/**
 * Language family definitions with shared concepts
 */
export const languageFamilies: LanguageFamily[] = [
  {
    name: "Romance",
    languages: ["spa", "fra", "ita", "por", "ron", "cat"],
    sharedConcepts: [
      "gendered_nouns",
      "adjective_agreement",
      "verb_conjugation",
      "subjunctive_mood",
      "reflexive_verbs",
      "direct_object_pronouns",
      "indirect_object_pronouns",
      "preterite_vs_imperfect",
      "conditional_mood",
      "ser_estar_distinction",
    ],
  },
  {
    name: "Germanic",
    languages: ["deu", "nld", "swe", "nor", "dan", "isl"],
    sharedConcepts: [
      "case_system",
      "verb_second_order",
      "compound_words",
      "modal_verbs",
      "separable_prefixes",
      "strong_weak_verbs",
      "definite_article_declension",
    ],
  },
  {
    name: "Slavic",
    languages: ["rus", "pol", "ces", "ukr", "bul", "hrv", "srp"],
    sharedConcepts: [
      "case_system_extensive",
      "aspect_perfective_imperfective",
      "verb_prefixes",
      "motion_verbs",
      "genitive_of_negation",
    ],
  },
  {
    name: "East_Asian",
    languages: ["zho", "jpn", "kor"],
    sharedConcepts: [
      "topic_prominent",
      "measure_words",
      "honorifics",
      "sentence_final_particles",
    ],
  },
  {
    name: "Semitic",
    languages: ["ara", "heb"],
    sharedConcepts: [
      "root_pattern_morphology",
      "dual_number",
      "construct_state",
      "definiteness_marking",
    ],
  },
];

/**
 * Get transferable knowledge for a target language
 */
export async function getTransferableKnowledge(
  userId: string,
  targetLanguage: string
): Promise<TransferableKnowledge | null> {
  // Find the language family for the target language
  const targetFamily = languageFamilies.find((f) =>
    f.languages.includes(targetLanguage)
  );

  if (!targetFamily) {
    return null;
  }

  // Get user's progress in related languages
  const { data: relatedProgress } = await supabaseClient
    .from("language_progress")
    .select("*")
    .eq("user_id", userId)
    .in("language_code", targetFamily.languages)
    .neq("language_code", targetLanguage)
    .gt("proficiency_score", 30);

  if (!relatedProgress?.length) {
    return null;
  }

  const relatedLangs = relatedProgress.map((p) => p.language_code);

  // Get mastered grammar from related languages that matches shared concepts
  const { data: masteredGrammar } = await supabaseClient
    .from("grammar_memory")
    .select("*")
    .eq("user_id", userId)
    .in("language_code", relatedLangs)
    .gt("mastery_level", 0.7)
    .in("concept_name", targetFamily.sharedConcepts);

  const transferableConcepts = (masteredGrammar as GrammarMemory[]) || [];

  // Find acceleration opportunities
  const accelerationOpportunities = targetFamily.sharedConcepts.filter((c) =>
    transferableConcepts.some((g) => g.concept_name === c)
  );

  return {
    relatedLanguages: relatedLangs,
    transferableConcepts,
    accelerationOpportunities,
  };
}

/**
 * Get the language family for a given language code
 */
export function getLanguageFamily(languageCode: string): LanguageFamily | null {
  return (
    languageFamilies.find((f) => f.languages.includes(languageCode)) || null
  );
}

/**
 * Check if two languages share a family
 */
export function areLanguagesRelated(
  lang1: string,
  lang2: string
): { related: boolean; family?: string } {
  const family = languageFamilies.find(
    (f) => f.languages.includes(lang1) && f.languages.includes(lang2)
  );

  return {
    related: !!family,
    family: family?.name,
  };
}

/**
 * Get shared concepts between two languages
 */
export function getSharedConcepts(lang1: string, lang2: string): string[] {
  const family = languageFamilies.find(
    (f) => f.languages.includes(lang1) && f.languages.includes(lang2)
  );

  return family?.sharedConcepts || [];
}

/**
 * Generate cross-language context for tutor prompt
 */
export function generateCrossLanguagePrompt(
  knowledge: TransferableKnowledge
): string {
  if (knowledge.accelerationOpportunities.length === 0) {
    return "";
  }

  const lines = [
    "## Cross-Language Advantage",
    `The student has experience with: ${knowledge.relatedLanguages.join(", ")}`,
    "",
    "They have mastered these transferable concepts:",
  ];

  for (const concept of knowledge.accelerationOpportunities.slice(0, 5)) {
    const displayName = formatConceptName(concept);
    lines.push(`- ${displayName}`);
  }

  lines.push("");
  lines.push(
    "Leverage their existing knowledge when introducing similar concepts."
  );
  lines.push(
    'For example: "Remember how in Spanish you use subjunctive after \'quiero que\'? This language works similarly..."'
  );

  return lines.join("\n");
}

/**
 * Format a concept name for display
 */
function formatConceptName(conceptName: string): string {
  return conceptName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get recommendations for concepts to learn based on cross-language knowledge
 */
export async function getCrossLanguageRecommendations(
  userId: string,
  targetLanguage: string
): Promise<{
  readyToLearn: string[];
  canAccelerate: string[];
}> {
  const knowledge = await getTransferableKnowledge(userId, targetLanguage);

  if (!knowledge) {
    return { readyToLearn: [], canAccelerate: [] };
  }

  // Get concepts not yet learned in target language
  const { data: targetGrammar } = await supabaseClient
    .from("grammar_memory")
    .select("concept_name")
    .eq("user_id", userId)
    .eq("language_code", targetLanguage);

  const learnedInTarget = new Set(
    (targetGrammar || []).map((g) => g.concept_name)
  );

  // Find concepts that can be accelerated
  const canAccelerate = knowledge.accelerationOpportunities.filter(
    (c) => !learnedInTarget.has(c)
  );

  // These are ready to learn because student has foundation
  const readyToLearn = canAccelerate.slice(0, 3);

  return {
    readyToLearn,
    canAccelerate,
  };
}
