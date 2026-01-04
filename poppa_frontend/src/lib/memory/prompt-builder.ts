/**
 * Prompt Builder
 * Transforms lesson context into AI tutor prompts
 */

import type {
  LessonContext,
  VocabSummary,
  GrammarSummary,
  VocabWithErrors,
  GrammarWithErrors,
  VocabularyMemory,
  GrammarMemory,
  SessionHighlight,
  ConceptReference,
  LearnerProfile,
} from "@/types/memory.types";

/**
 * Build a complete tutor prompt from lesson context
 */
export function buildTutorPrompt(context: LessonContext): string {
  const sections: string[] = [];

  // Student Profile Section
  sections.push(buildStudentProfileSection(context));

  // Progress Section
  sections.push(buildProgressSection(context));

  // Mastered Content Section
  if (
    context.masteredContent.vocabulary.length > 0 ||
    context.masteredContent.grammar.length > 0
  ) {
    sections.push(buildMasteredContentSection(context));
  }

  // Items Due for Review
  if (
    context.dueForReview.vocabulary.length > 0 ||
    context.dueForReview.grammar.length > 0
  ) {
    sections.push(buildReviewSection(context));
  }

  // Struggling Areas
  if (
    context.strugglingAreas.vocabulary.length > 0 ||
    context.strugglingAreas.grammar.length > 0
  ) {
    sections.push(buildStrugglingSection(context));
  }

  // Recent Session Context
  if (context.recentSessions.count > 0) {
    sections.push(buildRecentSessionSection(context));
  }

  // Cross-Language Advantage
  if (context.crossLanguageAdvantage) {
    sections.push(buildCrossLanguageSection(context));
  }

  // Recommended Focus
  sections.push(buildRecommendedFocusSection(context));

  // Curriculum Context
  if (context.curriculum) {
    sections.push(buildCurriculumSection(context));
  }

  return sections.join("\n\n");
}

function buildStudentProfileSection(context: LessonContext): string {
  const { user } = context;
  const lines = ["## Student Profile"];

  lines.push(`- Name: ${user.firstName || "Student"}`);
  lines.push(`- Native Language: ${user.nativeLanguage}`);

  if (user.learnerProfile) {
    lines.push(`- Learning Style: ${formatLearningStyle(user.learnerProfile)}`);

    if (user.learnerProfile.interests.length > 0) {
      lines.push(`- Interests: ${user.learnerProfile.interests.join(", ")}`);
    }

    if (user.learnerProfile.session_preferences.preferred_pace) {
      lines.push(
        `- Preferred Pace: ${user.learnerProfile.session_preferences.preferred_pace}`
      );
    }

    if (user.learnerProfile.session_preferences.correction_style) {
      lines.push(
        `- Correction Style: ${user.learnerProfile.session_preferences.correction_style}`
      );
    }
  }

  return lines.join("\n");
}

function buildProgressSection(context: LessonContext): string {
  const { languageProgress } = context;
  const lines = ["## Current Progress"];

  lines.push(
    `- Level: ${formatProficiencyLevel(languageProgress.proficiencyLevel)} (${languageProgress.proficiencyScore}/100)`
  );
  lines.push(`- Sessions Completed: ${languageProgress.totalSessions}`);
  lines.push(`- Total Practice Time: ${languageProgress.totalMinutes} minutes`);

  if (languageProgress.currentStreak > 0) {
    lines.push(`- Current Streak: ${languageProgress.currentStreak} days`);
  }

  if (languageProgress.lastPracticeAt) {
    lines.push(
      `- Last Practice: ${formatRelativeTime(languageProgress.lastPracticeAt)}`
    );
  }

  return lines.join("\n");
}

function buildMasteredContentSection(context: LessonContext): string {
  const { masteredContent } = context;
  const lines = ["## What the Student Already Knows"];

  if (masteredContent.vocabulary.length > 0) {
    lines.push(
      `\n### Mastered Vocabulary (${masteredContent.vocabulary.length} items)`
    );
    lines.push(formatVocabList(masteredContent.vocabulary.slice(0, 20)));

    if (masteredContent.vocabulary.length > 20) {
      lines.push(`... and ${masteredContent.vocabulary.length - 20} more`);
    }
  }

  if (masteredContent.grammar.length > 0) {
    lines.push(
      `\n### Mastered Grammar (${masteredContent.grammar.length} concepts)`
    );
    lines.push(formatGrammarList(masteredContent.grammar));
  }

  return lines.join("\n");
}

function buildReviewSection(context: LessonContext): string {
  const { dueForReview } = context;
  const lines = ["## Items Due for Review (Spaced Repetition)"];
  lines.push(
    "Try to naturally incorporate these into the conversation to reinforce learning."
  );

  if (dueForReview.vocabulary.length > 0) {
    lines.push("\n### Vocabulary to Review");
    lines.push(formatVocabForReview(dueForReview.vocabulary));
  }

  if (dueForReview.grammar.length > 0) {
    lines.push("\n### Grammar to Review");
    lines.push(formatGrammarForReview(dueForReview.grammar));
  }

  return lines.join("\n");
}

function buildStrugglingSection(context: LessonContext): string {
  const { strugglingAreas } = context;
  const lines = ["## Areas Needing Reinforcement"];
  lines.push(
    "These concepts need extra practice. Provide gentle corrections and additional examples."
  );

  if (strugglingAreas.vocabulary.length > 0) {
    lines.push("\n### Vocabulary Challenges");
    for (const v of strugglingAreas.vocabulary) {
      let line = `- **${v.term}** (${v.translation})`;
      if (v.common_errors.length > 0) {
        line += ` - Common errors: ${v.common_errors.join(", ")}`;
      }
      lines.push(line);
    }
  }

  if (strugglingAreas.grammar.length > 0) {
    lines.push("\n### Grammar Challenges");
    for (const g of strugglingAreas.grammar) {
      let line = `- **${g.concept_display}**`;
      if (g.error_patterns.length > 0) {
        line += ` - ${g.error_patterns[0].error}`;
      }
      lines.push(line);
    }
  }

  if (strugglingAreas.patterns.length > 0) {
    lines.push("\n### Detected Error Patterns");
    lines.push(
      `The student consistently struggles with: ${strugglingAreas.patterns.join(", ")}`
    );
  }

  return lines.join("\n");
}

function buildRecentSessionSection(context: LessonContext): string {
  const { recentSessions } = context;
  const lines = ["## Recent Session Context"];

  if (recentSessions.lastSessionSummary) {
    lines.push(`\nLast session summary: ${recentSessions.lastSessionSummary}`);
  }

  if (recentSessions.conceptsCoveredRecently.length > 0) {
    lines.push(
      `\nRecently covered: ${recentSessions.conceptsCoveredRecently.slice(0, 10).join(", ")}`
    );
  }

  if (recentSessions.recentHighlights.length > 0) {
    lines.push("\n### Notable Moments");
    for (const h of recentSessions.recentHighlights) {
      lines.push(`- ${h.type}: ${h.description}`);
    }
  }

  return lines.join("\n");
}

function buildCrossLanguageSection(context: LessonContext): string {
  const { crossLanguageAdvantage } = context;
  if (!crossLanguageAdvantage) return "";

  const lines = ["## Cross-Language Advantage"];
  lines.push(
    `Student has experience with: ${crossLanguageAdvantage.relatedLanguages.join(", ")}`
  );

  if (crossLanguageAdvantage.accelerationOpportunities.length > 0) {
    lines.push("\nYou can leverage their existing knowledge of:");
    for (const concept of crossLanguageAdvantage.accelerationOpportunities) {
      lines.push(`- ${concept}`);
    }
    lines.push(
      '\nRefer to their previous language knowledge when introducing similar concepts. For example: "Remember how in Spanish you use subjunctive after \'quiero que\'? French works the same way..."'
    );
  }

  return lines.join("\n");
}

function buildRecommendedFocusSection(context: LessonContext): string {
  const { recommendedFocus } = context;
  const lines = ["## Recommended Focus for This Session"];

  if (recommendedFocus.suggestedTopic) {
    lines.push(`\nStudent requested topic: **${recommendedFocus.suggestedTopic}**`);
  }

  if (recommendedFocus.reviewPriority.length > 0) {
    lines.push("\n### Priority Review Items");
    for (const item of recommendedFocus.reviewPriority.slice(0, 8)) {
      lines.push(`- ${item.type}: ${item.identifier} (${item.reason})`);
    }
  }

  if (recommendedFocus.newConceptsReady.length > 0) {
    lines.push("\n### Ready to Learn");
    for (const item of recommendedFocus.newConceptsReady) {
      lines.push(`- ${item.type}: ${item.identifier}`);
    }
  }

  return lines.join("\n");
}

function buildCurriculumSection(context: LessonContext): string {
  const { curriculum } = context;
  if (!curriculum) return "";

  const lines = [
    `## Today's Lesson: ${curriculum.lessonTitle}`,
    `Level: ${curriculum.lessonLevel}`,
  ];

  if (curriculum.lessonGrammar.length > 0) {
    lines.push("\n### Grammar Points to Introduce");
    for (const g of curriculum.lessonGrammar) {
      lines.push(`- **${g.name}**: ${g.explanation}`);
    }
  }

  if (curriculum.lessonVocabulary.length > 0) {
    lines.push("\n### Vocabulary to Introduce");
    for (const v of curriculum.lessonVocabulary) {
      lines.push(`- **${v.term}**: ${v.translation}`);
    }
  }

  return lines.join("\n");
}

// Formatting helpers

function formatLearningStyle(profile: LearnerProfile): string {
  const traits: string[] = [];

  if (profile.learning_style.prefers_music_examples) {
    traits.push("responds well to music examples");
  }
  if (profile.learning_style.needs_extra_repetition) {
    traits.push("benefits from extra repetition");
  }
  if (profile.learning_style.responds_well_to_humor) {
    traits.push("appreciates humor");
  }

  return traits.length > 0 ? traits.join(", ") : "standard approach";
}

function formatProficiencyLevel(level: string): string {
  const mapping: Record<string, string> = {
    beginner: "Beginner",
    elementary: "Elementary",
    intermediate: "Intermediate",
    upper_intermediate: "Upper Intermediate",
    advanced: "Advanced",
    mastery: "Mastery",
  };
  return mapping[level] || level;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function formatVocabList(vocab: VocabSummary[]): string {
  return vocab.map((v) => `- ${v.term} (${v.translation})`).join("\n");
}

function formatGrammarList(grammar: GrammarSummary[]): string {
  return grammar.map((g) => `- ${g.concept_display}`).join("\n");
}

function formatVocabForReview(vocab: VocabularyMemory[]): string {
  return vocab
    .map((v) => {
      const mastery = Math.round(v.mastery_level * 100);
      return `- ${v.term} (${v.translation}) - ${mastery}% mastery`;
    })
    .join("\n");
}

function formatGrammarForReview(grammar: GrammarMemory[]): string {
  return grammar
    .map((g) => {
      const mastery = Math.round(g.mastery_level * 100);
      return `- ${g.concept_display} - ${mastery}% mastery`;
    })
    .join("\n");
}

/**
 * Generate a compact context summary for token-limited scenarios
 */
export function buildCompactPrompt(context: LessonContext): string {
  const lines: string[] = [];

  // Basic info
  lines.push(`Student: ${context.user.firstName || "Learner"}`);
  lines.push(`Native: ${context.user.nativeLanguage}`);
  lines.push(
    `Level: ${context.languageProgress.proficiencyLevel} (${context.languageProgress.proficiencyScore}/100)`
  );

  // Key stats
  lines.push(
    `Sessions: ${context.languageProgress.totalSessions}, Streak: ${context.languageProgress.currentStreak} days`
  );

  // Struggling areas (most important)
  if (context.strugglingAreas.vocabulary.length > 0) {
    const terms = context.strugglingAreas.vocabulary
      .slice(0, 5)
      .map((v) => v.term);
    lines.push(`Struggling vocab: ${terms.join(", ")}`);
  }

  if (context.strugglingAreas.grammar.length > 0) {
    const concepts = context.strugglingAreas.grammar
      .slice(0, 3)
      .map((g) => g.concept_display);
    lines.push(`Struggling grammar: ${concepts.join(", ")}`);
  }

  // Review items
  if (context.dueForReview.vocabulary.length > 0) {
    const terms = context.dueForReview.vocabulary.slice(0, 5).map((v) => v.term);
    lines.push(`Review vocab: ${terms.join(", ")}`);
  }

  return lines.join("\n");
}
