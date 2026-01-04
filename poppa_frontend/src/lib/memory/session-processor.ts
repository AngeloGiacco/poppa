/**
 * Session Processor
 * Post-session analysis and memory updates
 */

import Anthropic from "@anthropic-ai/sdk";
import supabaseClient from "@/lib/supabase";
import type {
  TranscriptMessage,
  TranscriptAnalysis,
  VocabularyEvent,
  GrammarEvent,
  PerformanceMetrics,
  SessionHighlight,
  NextSessionRecommendations,
  LearningStyle,
  ConceptEventType,
} from "@/types/memory.types";
import { assessQualityFromEvent } from "./spaced-repetition";

const anthropic = new Anthropic();

/**
 * Process a completed session transcript
 */
export async function processSessionTranscript(
  userId: string,
  languageCode: string,
  conversationId: string,
  transcript: TranscriptMessage[],
  sessionId: string
): Promise<TranscriptAnalysis> {
  // 1. Analyze transcript with Claude
  const analysis = await analyzeTranscriptWithClaude(transcript, languageCode);

  // 2. Record concept events
  await recordConceptEvents(userId, languageCode, sessionId, analysis);

  // 3. Update vocabulary memory
  await updateVocabularyFromEvents(userId, languageCode, sessionId, analysis.vocabularyEvents);

  // 4. Update grammar memory
  await updateGrammarFromEvents(userId, languageCode, sessionId, analysis.grammarEvents);

  // 5. Update session record
  await updateSessionRecord(sessionId, conversationId, analysis);

  // 6. Update language progress
  await updateLanguageProgressFromSession(userId, languageCode, analysis);

  // 7. Update learner profile if new insights
  if (analysis.learnerInsights) {
    await updateLearnerProfile(userId, analysis.learnerInsights);
  }

  return analysis;
}

/**
 * Analyze transcript using Claude
 */
async function analyzeTranscriptWithClaude(
  transcript: TranscriptMessage[],
  languageCode: string
): Promise<TranscriptAnalysis> {
  const formattedTranscript = formatTranscriptForAnalysis(transcript);

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    system: `You are analyzing a language learning conversation transcript for ${languageCode}.
The conversation is between a student and an AI tutor using the Socratic/Thinking Method.

Extract the following and return as JSON:

1. vocabularyEvents: Array of vocabulary items used by the student
   - term: the target language word
   - translation: the native language translation
   - category: (optional) category like "food", "travel", etc.
   - event_type: "introduced" | "reviewed" | "correct" | "incorrect" | "struggled" | "self_corrected"
   - context: { expected?, actual?, error_type? }

2. grammarEvents: Array of grammar concepts demonstrated
   - concept_name: machine-readable name like "present_tense_regular_ar"
   - concept_display: human-readable name like "Present Tense: Regular -AR Verbs"
   - event_type: "introduced" | "reviewed" | "correct" | "incorrect" | "struggled" | "self_corrected"
   - context: { expected?, actual?, error_type? }

3. performanceMetrics:
   - overall_score: 0-1 estimate of session quality
   - fluency_score: 0-1 estimate of speaking fluency
   - accuracy_score: 0-1 estimate of correctness
   - self_corrections: count of self-corrections
   - tutor_corrections: count of tutor corrections

4. highlights: Notable moments
   - type: "breakthrough" | "struggle" | "milestone" | "error_pattern"
   - description: brief description
   - concept: (optional) related concept

5. summary: 1-2 sentence summary of the session

6. recommendations:
   - review_concepts: concepts to review next session
   - introduce_next: concepts ready to introduce
   - suggested_focus: overall focus suggestion
   - difficulty_adjustment: "easier" | "same" | "harder"

7. learnerInsights: (optional) New insights about learning style
   - needs_extra_repetition: boolean
   - responds_well_to_humor: boolean
   - preferred_pace: "slow" | "moderate" | "fast"

Return ONLY valid JSON.`,
    messages: [
      {
        role: "user",
        content: formattedTranscript,
      },
    ],
  });

  try {
    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as TranscriptAnalysis;
    }
  } catch (error) {
    console.error("Failed to parse transcript analysis:", error);
  }

  // Return default analysis if parsing fails
  return {
    vocabularyEvents: [],
    grammarEvents: [],
    performanceMetrics: { overall_score: 0.5 },
    highlights: [],
    summary: "Session completed.",
    recommendations: {},
  };
}

/**
 * Format transcript for Claude analysis
 */
function formatTranscriptForAnalysis(transcript: TranscriptMessage[]): string {
  return transcript
    .map((msg) => {
      const role = msg.role === "agent" ? "Tutor" : "Student";
      const time = msg.time_in_call_secs
        ? ` [${Math.floor(msg.time_in_call_secs / 60)}:${String(msg.time_in_call_secs % 60).padStart(2, "0")}]`
        : "";
      return `${role}${time}: ${msg.message}`;
    })
    .join("\n");
}

/**
 * Record concept events in the database
 */
async function recordConceptEvents(
  userId: string,
  languageCode: string,
  sessionId: string,
  analysis: TranscriptAnalysis
): Promise<void> {
  const events: {
    user_id: string;
    session_id: string;
    language_code: string;
    event_type: ConceptEventType;
    concept_type: "vocabulary" | "grammar";
    concept_identifier: string;
    context: Record<string, unknown>;
    session_timestamp_seconds?: number;
  }[] = [];

  for (const ve of analysis.vocabularyEvents) {
    events.push({
      user_id: userId,
      session_id: sessionId,
      language_code: languageCode,
      event_type: ve.event_type,
      concept_type: "vocabulary",
      concept_identifier: ve.term,
      context: ve.context || {},
      session_timestamp_seconds: ve.timestamp_seconds,
    });
  }

  for (const ge of analysis.grammarEvents) {
    events.push({
      user_id: userId,
      session_id: sessionId,
      language_code: languageCode,
      event_type: ge.event_type,
      concept_type: "grammar",
      concept_identifier: ge.concept_name,
      context: ge.context || {},
      session_timestamp_seconds: ge.timestamp_seconds,
    });
  }

  if (events.length > 0) {
    await supabaseClient.from("concept_events").insert(events);
  }
}

/**
 * Update vocabulary memory from events
 */
async function updateVocabularyFromEvents(
  userId: string,
  languageCode: string,
  sessionId: string,
  events: VocabularyEvent[]
): Promise<void> {
  for (const event of events) {
    // Upsert vocabulary item
    const { data: existing } = await supabaseClient
      .from("vocabulary_memory")
      .select("*")
      .eq("user_id", userId)
      .eq("language_code", languageCode)
      .eq("term", event.term)
      .single();

    if (!existing) {
      // Insert new vocabulary
      await supabaseClient.from("vocabulary_memory").insert({
        user_id: userId,
        language_code: languageCode,
        term: event.term,
        translation: event.translation,
        category: event.category,
        introduced_in_session: sessionId,
        times_seen: 1,
        times_correct: event.event_type === "correct" ? 1 : 0,
        times_incorrect: event.event_type === "incorrect" ? 1 : 0,
        mastery_level: event.event_type === "correct" ? 0.15 : 0,
        next_review_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    } else {
      // Update existing vocabulary with SM-2
      const quality = assessQualityFromEvent(event.event_type, event.context);
      await supabaseClient.rpc("update_vocabulary_after_review", {
        p_user_id: userId,
        p_language_code: languageCode,
        p_term: event.term,
        p_quality: quality,
      });
    }
  }
}

/**
 * Update grammar memory from events
 */
async function updateGrammarFromEvents(
  userId: string,
  languageCode: string,
  sessionId: string,
  events: GrammarEvent[]
): Promise<void> {
  for (const event of events) {
    const { data: existing } = await supabaseClient
      .from("grammar_memory")
      .select("*")
      .eq("user_id", userId)
      .eq("language_code", languageCode)
      .eq("concept_name", event.concept_name)
      .single();

    if (!existing) {
      // Insert new grammar concept
      await supabaseClient.from("grammar_memory").insert({
        user_id: userId,
        language_code: languageCode,
        concept_name: event.concept_name,
        concept_display: event.concept_display,
        introduced_in_session: sessionId,
        times_practiced: 1,
        times_correct: event.event_type === "correct" ? 1 : 0,
        times_struggled: event.event_type === "struggled" ? 1 : 0,
        mastery_level: event.event_type === "correct" ? 0.15 : 0,
        next_review_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    } else {
      // Update existing grammar with SM-2
      const quality = assessQualityFromEvent(event.event_type, event.context);
      await supabaseClient.rpc("update_grammar_after_practice", {
        p_user_id: userId,
        p_language_code: languageCode,
        p_concept_name: event.concept_name,
        p_quality: quality,
      });
    }
  }
}

/**
 * Update session record with analysis
 */
async function updateSessionRecord(
  sessionId: string,
  conversationId: string,
  analysis: TranscriptAnalysis
): Promise<void> {
  await supabaseClient
    .from("lesson_sessions")
    .update({
      conversation_id: conversationId,
      vocabulary_introduced: analysis.vocabularyEvents
        .filter((e) => e.event_type === "introduced")
        .map((e) => e.term),
      vocabulary_reviewed: analysis.vocabularyEvents
        .filter((e) => e.event_type === "reviewed" || e.event_type === "correct")
        .map((e) => e.term),
      grammar_introduced: analysis.grammarEvents
        .filter((e) => e.event_type === "introduced")
        .map((e) => e.concept_name),
      grammar_reviewed: analysis.grammarEvents
        .filter((e) => e.event_type === "reviewed" || e.event_type === "correct")
        .map((e) => e.concept_name),
      performance_metrics: analysis.performanceMetrics,
      highlights: analysis.highlights,
      transcript_summary: analysis.summary,
      next_session_recommendations: analysis.recommendations,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);
}

/**
 * Update language progress after session
 */
async function updateLanguageProgressFromSession(
  userId: string,
  languageCode: string,
  analysis: TranscriptAnalysis
): Promise<void> {
  const vocabIntroduced = analysis.vocabularyEvents.filter(
    (e) => e.event_type === "introduced"
  ).length;
  const grammarIntroduced = analysis.grammarEvents.filter(
    (e) => e.event_type === "introduced"
  ).length;

  // Get session duration (approximate based on transcript)
  const durationSeconds = 300; // Default 5 minutes if not available

  await supabaseClient.rpc("update_language_progress_after_session", {
    p_user_id: userId,
    p_language_code: languageCode,
    p_session_duration_seconds: durationSeconds,
    p_vocab_introduced: vocabIntroduced,
    p_grammar_introduced: grammarIntroduced,
  });
}

/**
 * Update learner profile with new insights
 */
async function updateLearnerProfile(
  userId: string,
  insights: Partial<LearningStyle>
): Promise<void> {
  // Get existing profile
  const { data: existing } = await supabaseClient
    .from("learner_profile")
    .select("learning_style")
    .eq("user_id", userId)
    .single();

  const currentStyle = (existing?.learning_style as LearningStyle) || {};
  const updatedStyle = { ...currentStyle, ...insights };

  await supabaseClient
    .from("learner_profile")
    .upsert({
      user_id: userId,
      learning_style: updatedStyle,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

/**
 * Create a new lesson session
 */
export async function createLessonSession(params: {
  userId: string;
  languageCode: string;
  sessionType?: "lesson" | "review" | "practice" | "assessment";
  curriculumLessonId?: number;
  lessonTitle?: string;
  lessonLevel?: string;
  customTopic?: string;
}): Promise<{ id: string }> {
  const { data, error } = await supabaseClient
    .from("lesson_sessions")
    .insert({
      user_id: params.userId,
      language_code: params.languageCode,
      session_type: params.sessionType || "lesson",
      curriculum_lesson_id: params.curriculumLessonId,
      lesson_title: params.lessonTitle,
      lesson_level: params.lessonLevel,
      custom_topic: params.customTopic,
    })
    .select("id")
    .single();

  if (error) throw error;
  return { id: data.id };
}

/**
 * End a lesson session
 */
export async function endLessonSession(
  sessionId: string,
  durationSeconds: number
): Promise<void> {
  await supabaseClient
    .from("lesson_sessions")
    .update({
      ended_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);
}
