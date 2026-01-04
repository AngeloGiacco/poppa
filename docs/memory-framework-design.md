# Poppa Memory Framework Design

> **Purpose**: A comprehensive memory system that tracks user progress, enables personalized teaching, and creates the "stickiness" that differentiates Poppa from generic language learning apps.

---

## Executive Summary

This document proposes a memory framework built on three pillars:

1. **Concept Memory** - Granular tracking of vocabulary and grammar mastery with spaced repetition
2. **Episodic Memory** - Rich lesson history with performance metrics and error patterns
3. **Learner Profile** - Cross-language patterns, learning style insights, and adaptive difficulty

The framework provides two access patterns:
- **Lesson Context Generation** - Summarized progress for lesson start
- **Real-time Retrieval** - Mid-lesson lookup via ElevenLabs client tools

---

## Design Philosophy

### Why Memory Matters for Language Learning

The Thinking Method's power comes from building on what students already know. Without memory:
- The tutor can't reference "remember when we learned ser?"
- Spaced repetition is impossible - concepts never resurface
- Errors repeat because patterns aren't tracked
- Cross-language insights are lost

### The Unfair Advantage

A human tutor remembers their students. They know:
- "Maria always confuses ser/estar"
- "She mastered subjunctive faster than most"
- "She learns best through music examples"

Poppa's memory creates this same relationship at scale.

---

## Schema Design

### Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MEMORY FRAMEWORK SCHEMA                          │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────┐
                        │       users         │
                        │  (existing table)   │
                        └──────────┬──────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│   learner_profile   │ │  language_progress  │ │   lesson_sessions   │
│                     │ │   (per language)    │ │   (rich history)    │
│ • learning_style    │ │                     │ │                     │
│ • preferred_topics  │ │ • proficiency_level │ │ • session_metrics   │
│ • session_prefs     │ │ • total_time        │ │ • concepts_covered  │
│ • cross_lang_notes  │ │ • streak_data       │ │ • error_events      │
└─────────────────────┘ └──────────┬──────────┘ └──────────┬──────────┘
                                   │                       │
                    ┌──────────────┴──────────────┐        │
                    │                             │        │
                    ▼                             ▼        │
         ┌─────────────────────┐       ┌─────────────────────┐
         │  vocabulary_memory  │       │   grammar_memory    │
         │                     │       │                     │
         │ • term/translation  │       │ • concept_name      │
         │ • mastery_level     │       │ • mastery_level     │
         │ • next_review       │       │ • next_review       │
         │ • review_history    │       │ • example_sentences │
         │ • error_patterns    │       │ • common_errors     │
         └─────────────────────┘       └─────────────────────┘
                    │                             │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │   concept_events    │
                        │  (append-only log)  │
                        │                     │
                        │ • event_type        │
                        │ • concept_ref       │
                        │ • session_ref       │
                        │ • context           │
                        └─────────────────────┘
```

### Table Definitions

#### 1. `learner_profile` - Cross-Language User Memory

Stores user-level learning patterns that transcend individual languages.

```sql
CREATE TABLE learner_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Learning Style Insights (updated by AI analysis)
  learning_style JSONB DEFAULT '{}'::jsonb,
  -- Example: {
  --   "visual_learner": false,
  --   "prefers_music_examples": true,
  --   "needs_extra_repetition": false,
  --   "responds_well_to_humor": true,
  --   "optimal_session_length_mins": 12
  -- }

  -- Preferred Topics (for contextual examples)
  interests TEXT[] DEFAULT '{}',
  -- Example: ['cooking', 'travel', 'technology', 'sports']

  -- Session Preferences
  session_preferences JSONB DEFAULT '{}'::jsonb,
  -- Example: {
  --   "preferred_pace": "moderate",
  --   "correction_style": "gentle",
  --   "preferred_session_length": 15
  -- }

  -- Cross-Language Observations
  cross_language_notes TEXT,
  -- Example: "Strong grasp of Romance language patterns.
  --           Spanish subjunctive knowledge accelerates French learning."

  -- AI-Generated Summary (refreshed periodically)
  learner_summary TEXT,
  summary_updated_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Index for fast lookup
CREATE INDEX idx_learner_profile_user ON learner_profile(user_id);
```

#### 2. `language_progress` - Per-Language Progress Tracking

Tracks overall progress and metadata for each language a user learns.

```sql
CREATE TABLE language_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL, -- ISO 639-3 (e.g., 'spa', 'fra', 'deu')

  -- Proficiency Tracking
  proficiency_level TEXT DEFAULT 'beginner'
    CHECK (proficiency_level IN (
      'beginner', 'elementary', 'intermediate',
      'upper_intermediate', 'advanced', 'mastery'
    )),
  proficiency_score NUMERIC(5,2) DEFAULT 0, -- 0-100 fine-grained score

  -- Curriculum Progress (for structured languages)
  current_lesson_id INTEGER,
  completed_lesson_ids INTEGER[] DEFAULT '{}',

  -- Time Investment
  total_session_count INTEGER DEFAULT 0,
  total_practice_minutes INTEGER DEFAULT 0,

  -- Streak & Consistency
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_practice_at TIMESTAMPTZ,

  -- Mastery Counts (denormalized for fast access)
  vocabulary_learned_count INTEGER DEFAULT 0,
  vocabulary_mastered_count INTEGER DEFAULT 0,
  grammar_learned_count INTEGER DEFAULT 0,
  grammar_mastered_count INTEGER DEFAULT 0,

  -- AI-Generated Language Summary
  progress_summary TEXT,
  summary_updated_at TIMESTAMPTZ,

  -- Recommended Focus Areas (AI-generated)
  recommended_focus JSONB DEFAULT '[]'::jsonb,
  -- Example: [
  --   { "type": "grammar", "concept": "subjunctive_mood", "reason": "struggled_recently" },
  --   { "type": "vocabulary", "category": "food", "reason": "due_for_review" }
  -- ]

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_language UNIQUE (user_id, language_code)
);

-- Indexes
CREATE INDEX idx_language_progress_user ON language_progress(user_id);
CREATE INDEX idx_language_progress_lang ON language_progress(language_code);
CREATE INDEX idx_language_progress_last_practice ON language_progress(last_practice_at);
```

#### 3. `vocabulary_memory` - Vocabulary Item Mastery

Tracks individual vocabulary items with spaced repetition data.

```sql
CREATE TABLE vocabulary_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,

  -- The Vocabulary Item
  term TEXT NOT NULL,              -- Target language word/phrase
  translation TEXT NOT NULL,       -- Native language translation
  phonetic TEXT,                   -- IPA or simplified pronunciation
  part_of_speech TEXT,             -- noun, verb, adjective, etc.
  category TEXT,                   -- food, travel, business, etc.

  -- Example Contexts (from actual conversations)
  example_sentences JSONB DEFAULT '[]'::jsonb,
  -- Example: [
  --   { "sentence": "Quiero una manzana", "translation": "I want an apple", "session_id": "..." }
  -- ]

  -- Mastery & Spaced Repetition
  mastery_level NUMERIC(3,2) DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 1),
  -- 0.0 = never seen, 0.5 = learning, 1.0 = fully mastered

  -- SM-2 Algorithm Fields
  easiness_factor NUMERIC(3,2) DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,

  -- Performance Tracking
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  times_incorrect INTEGER DEFAULT 0,

  -- Error Patterns
  common_errors TEXT[],
  -- Example: ['confused_with:pera', 'pronunciation_issue']

  -- Source Tracking
  first_introduced_at TIMESTAMPTZ DEFAULT NOW(),
  introduced_in_session UUID, -- FK to lesson_sessions
  curriculum_lesson_id INTEGER, -- If from structured curriculum

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_vocab UNIQUE (user_id, language_code, term)
);

-- Indexes for common queries
CREATE INDEX idx_vocab_user_lang ON vocabulary_memory(user_id, language_code);
CREATE INDEX idx_vocab_next_review ON vocabulary_memory(user_id, next_review_at);
CREATE INDEX idx_vocab_mastery ON vocabulary_memory(user_id, language_code, mastery_level);
CREATE INDEX idx_vocab_category ON vocabulary_memory(user_id, language_code, category);
```

#### 4. `grammar_memory` - Grammar Concept Mastery

Tracks grammar rules and patterns with mastery levels.

```sql
CREATE TABLE grammar_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,

  -- The Grammar Concept
  concept_name TEXT NOT NULL,      -- e.g., "present_tense_regular_ar"
  concept_display TEXT NOT NULL,   -- e.g., "Present Tense: Regular -AR Verbs"
  category TEXT,                   -- tense, mood, syntax, etc.
  difficulty_tier INTEGER DEFAULT 1, -- 1-5 complexity rating

  -- Related Concepts (for prerequisite/follow-up)
  prerequisites TEXT[],            -- concepts that should be learned first
  unlocks TEXT[],                  -- concepts this enables

  -- Explanation & Examples
  explanation TEXT,                -- AI-generated or curriculum explanation
  example_sentences JSONB DEFAULT '[]'::jsonb,
  -- Example: [
  --   { "target": "Yo hablo español", "native": "I speak Spanish", "pattern": "yo + -o" }
  -- ]

  -- Mastery & Spaced Repetition
  mastery_level NUMERIC(3,2) DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 1),

  -- SM-2 Algorithm Fields
  easiness_factor NUMERIC(3,2) DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,

  -- Performance Tracking
  times_practiced INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  times_struggled INTEGER DEFAULT 0,

  -- Common Errors (for targeted remediation)
  error_patterns JSONB DEFAULT '[]'::jsonb,
  -- Example: [
  --   { "error": "using -as ending for yo form", "frequency": 3, "last_occurrence": "..." }
  -- ]

  -- Source Tracking
  first_introduced_at TIMESTAMPTZ DEFAULT NOW(),
  introduced_in_session UUID,
  curriculum_lesson_id INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_grammar UNIQUE (user_id, language_code, concept_name)
);

-- Indexes
CREATE INDEX idx_grammar_user_lang ON grammar_memory(user_id, language_code);
CREATE INDEX idx_grammar_next_review ON grammar_memory(user_id, next_review_at);
CREATE INDEX idx_grammar_mastery ON grammar_memory(user_id, language_code, mastery_level);
CREATE INDEX idx_grammar_category ON grammar_memory(user_id, language_code, category);
```

#### 5. `lesson_sessions` - Rich Lesson History

Enhanced lesson tracking with performance metrics and concept coverage.

```sql
CREATE TABLE lesson_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,

  -- Session Metadata
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,

  -- Curriculum Reference (if structured lesson)
  curriculum_lesson_id INTEGER,
  lesson_title TEXT,
  lesson_level TEXT,

  -- Session Type
  session_type TEXT DEFAULT 'lesson'
    CHECK (session_type IN ('lesson', 'review', 'practice', 'assessment')),

  -- What Was Covered
  vocabulary_introduced TEXT[] DEFAULT '{}',
  vocabulary_reviewed TEXT[] DEFAULT '{}',
  grammar_introduced TEXT[] DEFAULT '{}',
  grammar_reviewed TEXT[] DEFAULT '{}',

  -- Custom Topic (if user-requested)
  custom_topic TEXT,

  -- Performance Metrics (AI-analyzed post-session)
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  -- Example: {
  --   "overall_score": 0.82,
  --   "fluency_score": 0.75,
  --   "accuracy_score": 0.88,
  --   "response_time_avg_ms": 2400,
  --   "self_corrections": 3,
  --   "tutor_corrections": 5
  -- }

  -- Transcript Reference
  conversation_id TEXT,           -- ElevenLabs conversation ID
  transcript_summary TEXT,        -- AI-generated summary

  -- Key Moments (notable events from the session)
  highlights JSONB DEFAULT '[]'::jsonb,
  -- Example: [
  --   { "type": "breakthrough", "description": "Finally understood ser vs estar", "timestamp": 180 },
  --   { "type": "struggle", "description": "Difficulty with subjunctive triggers", "timestamp": 420 }
  -- ]

  -- AI Recommendations (for next session)
  next_session_recommendations JSONB DEFAULT '{}'::jsonb,
  -- Example: {
  --   "review_concepts": ["subjunctive_triggers"],
  --   "introduce_next": ["imperfect_tense"],
  --   "suggested_focus": "Practice subjunctive in context"
  -- }

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_user ON lesson_sessions(user_id);
CREATE INDEX idx_sessions_user_lang ON lesson_sessions(user_id, language_code);
CREATE INDEX idx_sessions_started ON lesson_sessions(started_at DESC);
CREATE INDEX idx_sessions_conversation ON lesson_sessions(conversation_id);
```

#### 6. `concept_events` - Append-Only Event Log

Immutable log of all concept-related events for analytics and debugging.

```sql
CREATE TABLE concept_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES lesson_sessions(id) ON DELETE SET NULL,
  language_code TEXT NOT NULL,

  -- Event Details
  event_type TEXT NOT NULL
    CHECK (event_type IN (
      'introduced',    -- First time seeing concept
      'reviewed',      -- Practicing known concept
      'correct',       -- Got it right
      'incorrect',     -- Made an error
      'struggled',     -- Needed help/hints
      'mastered',      -- Reached mastery threshold
      'forgot',        -- Mastery declined significantly
      'self_corrected' -- Caught own mistake
    )),

  -- Concept Reference
  concept_type TEXT NOT NULL CHECK (concept_type IN ('vocabulary', 'grammar')),
  concept_id UUID,              -- FK to vocabulary_memory or grammar_memory
  concept_identifier TEXT,      -- The term or concept_name for quick reference

  -- Event Context
  context JSONB DEFAULT '{}'::jsonb,
  -- Example for incorrect event: {
  --   "expected": "hablo",
  --   "actual": "hablas",
  --   "error_type": "conjugation",
  --   "tutor_response": "Remember, for 'yo' we use -o, not -as"
  -- }

  -- Timing
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  session_timestamp_seconds INTEGER -- Seconds into the session
);

-- Indexes for analytics
CREATE INDEX idx_events_user ON concept_events(user_id);
CREATE INDEX idx_events_user_lang ON concept_events(user_id, language_code);
CREATE INDEX idx_events_session ON concept_events(session_id);
CREATE INDEX idx_events_type ON concept_events(event_type);
CREATE INDEX idx_events_occurred ON concept_events(occurred_at DESC);
CREATE INDEX idx_events_concept ON concept_events(concept_type, concept_identifier);
```

---

## Retrieval Interface Design

### Access Pattern 1: Lesson Context Generation

Called at lesson start to generate a comprehensive context summary for the AI tutor.

```typescript
// src/lib/memory/context-generator.ts

interface LessonContext {
  // User identity
  user: {
    firstName: string;
    nativeLanguage: string;
    learnerProfile: LearnerProfile;
  };

  // Language-specific progress
  languageProgress: {
    proficiencyLevel: ProficiencyLevel;
    proficiencyScore: number;
    totalSessions: number;
    totalMinutes: number;
    currentStreak: number;
    lastPracticeAt: Date | null;
  };

  // Recent session summary
  recentSessions: {
    count: number;
    lastSessionSummary: string;
    conceptsCoveredRecently: string[];
    recentHighlights: Highlight[];
  };

  // Mastered content (what student already knows)
  masteredContent: {
    vocabulary: VocabSummary[];
    grammar: GrammarSummary[];
  };

  // Items due for review (spaced repetition)
  dueForReview: {
    vocabulary: VocabItem[];
    grammar: GrammarConcept[];
  };

  // Struggling areas (need reinforcement)
  strugglingAreas: {
    vocabulary: VocabWithErrors[];
    grammar: GrammarWithErrors[];
    patterns: string[]; // AI-detected patterns like "verb conjugation"
  };

  // Recommended focus for this session
  recommendedFocus: {
    reviewPriority: ConceptReference[];
    newConceptsReady: ConceptReference[];
    suggestedTopic: string;
  };

  // Curriculum context (if structured)
  curriculum?: {
    lessonId: number;
    lessonTitle: string;
    lessonLevel: string;
    lessonGrammar: GrammarPoint[];
    lessonVocabulary: VocabItem[];
  };
}

async function generateLessonContext(
  userId: string,
  languageCode: string,
  options?: {
    useCurriculum?: boolean;
    customTopic?: string;
    sessionType?: 'lesson' | 'review' | 'practice';
  }
): Promise<LessonContext> {
  // 1. Fetch user profile and language progress
  // 2. Get recent sessions (last 5)
  // 3. Query mastered vocabulary (mastery_level > 0.8)
  // 4. Query mastered grammar (mastery_level > 0.8)
  // 5. Query items due for review (next_review_at < now)
  // 6. Query struggling items (mastery_level < 0.4 AND times_seen > 2)
  // 7. Get curriculum lesson if applicable
  // 8. Generate recommended focus based on all data

  return context;
}
```

#### Context-to-Prompt Transformation

```typescript
// src/lib/memory/prompt-builder.ts

function buildTutorPrompt(context: LessonContext): string {
  const sections: string[] = [];

  // Student Profile Section
  sections.push(`
## Student Profile
- Name: ${context.user.firstName || 'Student'}
- Native Language: ${context.user.nativeLanguage}
- Learning Style: ${formatLearningStyle(context.user.learnerProfile)}
`);

  // Progress Section
  sections.push(`
## Current Progress in ${context.languageProgress.languageCode}
- Level: ${context.languageProgress.proficiencyLevel} (${context.languageProgress.proficiencyScore}/100)
- Sessions Completed: ${context.languageProgress.totalSessions}
- Practice Time: ${context.languageProgress.totalMinutes} minutes
- Current Streak: ${context.languageProgress.currentStreak} days
`);

  // What They Already Know
  if (context.masteredContent.vocabulary.length > 0) {
    sections.push(`
## Mastered Vocabulary (${context.masteredContent.vocabulary.length} items)
${formatVocabList(context.masteredContent.vocabulary)}
`);
  }

  if (context.masteredContent.grammar.length > 0) {
    sections.push(`
## Mastered Grammar Concepts
${formatGrammarList(context.masteredContent.grammar)}
`);
  }

  // Items to Review
  if (context.dueForReview.vocabulary.length > 0) {
    sections.push(`
## Vocabulary Due for Review (spaced repetition)
${formatVocabForReview(context.dueForReview.vocabulary)}
Try to naturally incorporate these into the conversation.
`);
  }

  // Struggling Areas - Critical for personalization
  if (context.strugglingAreas.vocabulary.length > 0 ||
      context.strugglingAreas.grammar.length > 0) {
    sections.push(`
## Areas Needing Reinforcement
${formatStrugglingAreas(context.strugglingAreas)}
These need extra practice and gentle correction.
`);
  }

  // Session Recommendations
  sections.push(`
## Recommended Focus for This Session
${formatRecommendations(context.recommendedFocus)}
`);

  // Curriculum Context if applicable
  if (context.curriculum) {
    sections.push(`
## Today's Lesson: ${context.curriculum.lessonTitle}
Level: ${context.curriculum.lessonLevel}

Grammar Points to Introduce:
${formatGrammarPoints(context.curriculum.lessonGrammar)}

Vocabulary to Introduce:
${formatVocabPoints(context.curriculum.lessonVocabulary)}
`);
  }

  return sections.join('\n');
}
```

### Access Pattern 2: Real-Time Mid-Lesson Queries

Using ElevenLabs client tools for in-conversation memory lookups.

```typescript
// src/lib/memory/realtime-queries.ts

interface MemoryQueryResult {
  found: boolean;
  data: any;
  suggestion?: string;
}

// Query: "Has student seen this vocabulary before?"
async function checkVocabularyHistory(
  userId: string,
  languageCode: string,
  term: string
): Promise<{
  seen: boolean;
  mastery: number;
  lastSeen: Date | null;
  errorPatterns: string[];
}> {
  const vocab = await supabase
    .from('vocabulary_memory')
    .select('*')
    .eq('user_id', userId)
    .eq('language_code', languageCode)
    .eq('term', term)
    .single();

  if (!vocab.data) {
    return { seen: false, mastery: 0, lastSeen: null, errorPatterns: [] };
  }

  return {
    seen: true,
    mastery: vocab.data.mastery_level,
    lastSeen: vocab.data.last_reviewed_at,
    errorPatterns: vocab.data.common_errors || []
  };
}

// Query: "What grammar does student struggle with?"
async function getGrammarStrugglePoints(
  userId: string,
  languageCode: string,
  limit: number = 5
): Promise<GrammarMemory[]> {
  const { data } = await supabase
    .from('grammar_memory')
    .select('*')
    .eq('user_id', userId)
    .eq('language_code', languageCode)
    .lt('mastery_level', 0.5)
    .gt('times_practiced', 1)
    .order('times_struggled', { ascending: false })
    .limit(limit);

  return data || [];
}

// Query: "What did we cover in the last session?"
async function getLastSessionSummary(
  userId: string,
  languageCode: string
): Promise<{
  date: Date;
  summary: string;
  vocabularyCovered: string[];
  grammarCovered: string[];
  highlights: Highlight[];
}> {
  const { data } = await supabase
    .from('lesson_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('language_code', languageCode)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  return data ? {
    date: new Date(data.started_at),
    summary: data.transcript_summary || '',
    vocabularyCovered: data.vocabulary_introduced.concat(data.vocabulary_reviewed),
    grammarCovered: data.grammar_introduced.concat(data.grammar_reviewed),
    highlights: data.highlights || []
  } : null;
}

// Query: "What vocabulary is due for review?"
async function getVocabularyDueForReview(
  userId: string,
  languageCode: string,
  limit: number = 10
): Promise<VocabularyMemory[]> {
  const { data } = await supabase
    .from('vocabulary_memory')
    .select('*')
    .eq('user_id', userId)
    .eq('language_code', languageCode)
    .lt('next_review_at', new Date().toISOString())
    .order('next_review_at', { ascending: true })
    .limit(limit);

  return data || [];
}

// Query: "Related vocabulary in this category"
async function getRelatedVocabulary(
  userId: string,
  languageCode: string,
  category: string,
  limit: number = 5
): Promise<VocabularyMemory[]> {
  const { data } = await supabase
    .from('vocabulary_memory')
    .select('*')
    .eq('user_id', userId)
    .eq('language_code', languageCode)
    .eq('category', category)
    .order('mastery_level', { ascending: false })
    .limit(limit);

  return data || [];
}
```

### ElevenLabs Client Tool Integration

```typescript
// src/components/Chat.tsx - Enhanced with memory client tools

const conversation = useConversation({
  clientTools: {
    // Check if student knows a word
    checkVocabulary: async ({ term }: { term: string }) => {
      const result = await checkVocabularyHistory(
        user.id,
        targetLanguage,
        term
      );

      if (!result.seen) {
        return `Student has not seen "${term}" before. This is new vocabulary.`;
      }

      return `Student knows "${term}" (mastery: ${Math.round(result.mastery * 100)}%). ` +
        `Last practiced: ${formatRelativeTime(result.lastSeen)}. ` +
        (result.errorPatterns.length > 0
          ? `Common errors: ${result.errorPatterns.join(', ')}`
          : 'No common errors.');
    },

    // Get vocabulary due for review
    getReviewItems: async () => {
      const vocab = await getVocabularyDueForReview(user.id, targetLanguage, 5);
      const grammar = await getGrammarDueForReview(user.id, targetLanguage, 3);

      if (vocab.length === 0 && grammar.length === 0) {
        return "No items currently due for review.";
      }

      return `Due for review:\n` +
        `Vocabulary: ${vocab.map(v => v.term).join(', ')}\n` +
        `Grammar: ${grammar.map(g => g.concept_display).join(', ')}`;
    },

    // Log when student demonstrates vocabulary
    recordVocabularyUsage: async ({
      term,
      correct,
      context
    }: {
      term: string;
      correct: boolean;
      context?: string
    }) => {
      await recordConceptEvent({
        userId: user.id,
        sessionId: currentSessionId,
        languageCode: targetLanguage,
        eventType: correct ? 'correct' : 'incorrect',
        conceptType: 'vocabulary',
        conceptIdentifier: term,
        context: { userResponse: context }
      });

      return correct
        ? `Recorded successful use of "${term}"`
        : `Recorded struggle with "${term}" - will reinforce`;
    },

    // Log grammar demonstration
    recordGrammarUsage: async ({
      concept,
      correct,
      context
    }: {
      concept: string;
      correct: boolean;
      context?: string
    }) => {
      await recordConceptEvent({
        userId: user.id,
        sessionId: currentSessionId,
        languageCode: targetLanguage,
        eventType: correct ? 'correct' : 'incorrect',
        conceptType: 'grammar',
        conceptIdentifier: concept,
        context: { userResponse: context }
      });

      return correct
        ? `Recorded successful use of ${concept}`
        : `Recorded struggle with ${concept}`;
    },

    // Get what was covered last session
    getLastSession: async () => {
      const session = await getLastSessionSummary(user.id, targetLanguage);

      if (!session) {
        return "This is the student's first session in this language.";
      }

      return `Last session (${formatRelativeTime(session.date)}):\n` +
        `Summary: ${session.summary}\n` +
        `Vocabulary covered: ${session.vocabularyCovered.join(', ')}\n` +
        `Grammar covered: ${session.grammarCovered.join(', ')}`;
    },

    // Get struggling areas
    getStrugglingAreas: async () => {
      const grammar = await getGrammarStrugglePoints(user.id, targetLanguage, 5);

      if (grammar.length === 0) {
        return "No significant struggle points identified yet.";
      }

      return `Grammar areas needing work:\n` +
        grammar.map(g =>
          `- ${g.concept_display}: ${g.error_patterns?.[0]?.error || 'general difficulty'}`
        ).join('\n');
    }
  }
});
```

---

## Spaced Repetition Algorithm

Using a modified SM-2 algorithm optimized for voice-based learning.

```typescript
// src/lib/memory/spaced-repetition.ts

interface ReviewResult {
  quality: number; // 0-5 scale (0=complete failure, 5=perfect)
}

function calculateNextReview(
  current: {
    easinessFactor: number;
    intervalDays: number;
    repetitions: number;
  },
  result: ReviewResult
): {
  easinessFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: Date;
  masteryLevel: number;
} {
  let { easinessFactor, intervalDays, repetitions } = current;
  const { quality } = result;

  // Update easiness factor (minimum 1.3)
  easinessFactor = Math.max(
    1.3,
    easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  if (quality < 3) {
    // Failed - reset repetitions
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Passed - increase interval
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 3;
    } else {
      intervalDays = Math.round(intervalDays * easinessFactor);
    }
  }

  // Calculate mastery level (0-1)
  // Based on repetitions and easiness factor
  const masteryLevel = Math.min(
    1,
    (repetitions * 0.15) + ((easinessFactor - 1.3) / 1.2 * 0.25)
  );

  // Calculate next review date
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  return {
    easinessFactor,
    intervalDays,
    repetitions,
    nextReviewAt,
    masteryLevel
  };
}

// Quality scoring from conversation analysis
function assessQuality(event: ConceptEvent): number {
  switch (event.eventType) {
    case 'correct':
      // Check if there was hesitation or self-correction
      if (event.context?.selfCorrected) return 4;
      if (event.context?.responseTimeMs > 5000) return 4; // Slow but correct
      return 5; // Fast and correct

    case 'self_corrected':
      return 3; // Got there eventually

    case 'incorrect':
      if (event.context?.closeAttempt) return 2; // Almost right
      return 1; // Wrong

    case 'struggled':
      return 0; // Needed significant help

    default:
      return 3;
  }
}
```

---

## Post-Session Processing

After each conversation ends, process the transcript to update memory.

```typescript
// src/lib/memory/session-processor.ts

interface ProcessedSession {
  sessionId: string;
  vocabularyEvents: ConceptEvent[];
  grammarEvents: ConceptEvent[];
  performanceMetrics: PerformanceMetrics;
  highlights: Highlight[];
  summary: string;
  recommendations: SessionRecommendations;
}

async function processSessionTranscript(
  userId: string,
  languageCode: string,
  conversationId: string,
  transcript: TranscriptMessage[]
): Promise<ProcessedSession> {
  // 1. Analyze transcript with Claude to extract:
  //    - Vocabulary used (and whether correctly)
  //    - Grammar patterns demonstrated
  //    - Errors made
  //    - Breakthrough moments
  //    - Struggle points

  const analysis = await analyzeTranscriptWithClaude(transcript, languageCode);

  // 2. Create session record
  const session = await createLessonSession({
    userId,
    languageCode,
    conversationId,
    ...analysis.sessionMetadata
  });

  // 3. Log concept events
  for (const event of analysis.conceptEvents) {
    await recordConceptEvent({
      ...event,
      userId,
      sessionId: session.id,
      languageCode
    });
  }

  // 4. Update vocabulary memory with spaced repetition
  for (const vocabEvent of analysis.vocabularyEvents) {
    await updateVocabularyMemory(userId, languageCode, vocabEvent);
  }

  // 5. Update grammar memory with spaced repetition
  for (const grammarEvent of analysis.grammarEvents) {
    await updateGrammarMemory(userId, languageCode, grammarEvent);
  }

  // 6. Update language progress
  await updateLanguageProgress(userId, languageCode, analysis);

  // 7. Update learner profile if new insights
  if (analysis.learnerInsights) {
    await updateLearnerProfile(userId, analysis.learnerInsights);
  }

  return {
    sessionId: session.id,
    ...analysis
  };
}

async function analyzeTranscriptWithClaude(
  transcript: TranscriptMessage[],
  languageCode: string
): Promise<TranscriptAnalysis> {
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: `You are analyzing a language learning conversation transcript for ${languageCode}.
Extract the following:
1. All vocabulary items used by the student (with correctness assessment)
2. Grammar patterns demonstrated
3. Errors made and their types
4. Moments of breakthrough or struggle
5. Overall performance metrics
6. Recommendations for next session

Return structured JSON.`,
    messages: [{
      role: 'user',
      content: formatTranscriptForAnalysis(transcript)
    }]
  });

  return parseAnalysisResponse(response);
}
```

---

## API Endpoints

### Memory Context API

```typescript
// src/app/api/memory/context/route.ts

export async function POST(req: Request) {
  const { userId, languageCode, options } = await req.json();

  // Validate user has access
  const authUser = await validateAuth(req);
  if (authUser.id !== userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const context = await generateLessonContext(userId, languageCode, options);
  const prompt = buildTutorPrompt(context);

  return Response.json({
    context,
    tutorPrompt: prompt
  });
}
```

### Real-Time Query API

```typescript
// src/app/api/memory/query/route.ts

type QueryType =
  | 'check_vocabulary'
  | 'get_review_items'
  | 'get_last_session'
  | 'get_struggling_areas'
  | 'get_related_vocabulary';

export async function POST(req: Request) {
  const {
    userId,
    languageCode,
    queryType,
    params
  }: {
    userId: string;
    languageCode: string;
    queryType: QueryType;
    params: Record<string, any>;
  } = await req.json();

  // Route to appropriate query function
  switch (queryType) {
    case 'check_vocabulary':
      return Response.json(
        await checkVocabularyHistory(userId, languageCode, params.term)
      );
    case 'get_review_items':
      return Response.json({
        vocabulary: await getVocabularyDueForReview(userId, languageCode),
        grammar: await getGrammarDueForReview(userId, languageCode)
      });
    case 'get_last_session':
      return Response.json(
        await getLastSessionSummary(userId, languageCode)
      );
    case 'get_struggling_areas':
      return Response.json(
        await getGrammarStrugglePoints(userId, languageCode)
      );
    case 'get_related_vocabulary':
      return Response.json(
        await getRelatedVocabulary(userId, languageCode, params.category)
      );
    default:
      return Response.json({ error: 'Unknown query type' }, { status: 400 });
  }
}
```

### Session Processing Webhook Enhancement

```typescript
// src/app/api/elevenlabs-webhook/route.ts - Enhanced

export async function POST(req: Request) {
  // ... existing signature verification ...

  const { data } = await req.json();
  const {
    conversation_id,
    transcript,
    conversation_initiation_client_data
  } = data;

  const userId = conversation_initiation_client_data.dynamic_variables.user_id;
  const targetLanguage = conversation_initiation_client_data.dynamic_variables.target_language;

  // Existing: Save to conversation_transcripts
  await supabase.from('conversation_transcripts').insert({
    user_id: userId,
    conversation_id,
    target_language: targetLanguage,
    transcript
  });

  // NEW: Process session for memory updates
  // Run async - don't block webhook response
  processSessionTranscript(
    userId,
    targetLanguage,
    conversation_id,
    transcript
  ).catch(error => {
    console.error('Session processing failed:', error);
    // Queue for retry
  });

  return Response.json({
    message: 'Webhook processed',
    conversation_id,
    memory_processing: 'queued'
  });
}
```

---

## Cross-Language Intelligence

### Language Transfer Detection

Some concepts transfer between languages (especially in language families).

```typescript
// src/lib/memory/cross-language.ts

interface LanguageFamily {
  name: string;
  languages: string[];
  sharedConcepts: string[];
}

const languageFamilies: LanguageFamily[] = [
  {
    name: 'Romance',
    languages: ['spa', 'fra', 'ita', 'por', 'ron'],
    sharedConcepts: [
      'gendered_nouns',
      'adjective_agreement',
      'verb_conjugation',
      'subjunctive_mood',
      'reflexive_verbs'
    ]
  },
  {
    name: 'Germanic',
    languages: ['deu', 'nld', 'swe', 'nor', 'dan'],
    sharedConcepts: [
      'case_system',
      'verb_second_order',
      'compound_words',
      'modal_verbs'
    ]
  }
];

async function getTransferableKnowledge(
  userId: string,
  targetLanguage: string
): Promise<{
  relatedLanguages: string[];
  transferableConcepts: GrammarMemory[];
  accelerationOpportunities: string[];
}> {
  // Find languages in same family that user knows
  const targetFamily = languageFamilies.find(
    f => f.languages.includes(targetLanguage)
  );

  if (!targetFamily) {
    return { relatedLanguages: [], transferableConcepts: [], accelerationOpportunities: [] };
  }

  // Get user's progress in related languages
  const relatedProgress = await supabase
    .from('language_progress')
    .select('*')
    .eq('user_id', userId)
    .in('language_code', targetFamily.languages)
    .neq('language_code', targetLanguage)
    .gt('proficiency_score', 30); // At least intermediate

  if (!relatedProgress.data?.length) {
    return { relatedLanguages: [], transferableConcepts: [], accelerationOpportunities: [] };
  }

  // Get mastered grammar from related languages
  const relatedLangs = relatedProgress.data.map(p => p.language_code);
  const masteredGrammar = await supabase
    .from('grammar_memory')
    .select('*')
    .eq('user_id', userId)
    .in('language_code', relatedLangs)
    .gt('mastery_level', 0.7)
    .in('concept_name', targetFamily.sharedConcepts);

  return {
    relatedLanguages: relatedLangs,
    transferableConcepts: masteredGrammar.data || [],
    accelerationOpportunities: targetFamily.sharedConcepts.filter(
      c => masteredGrammar.data?.some(g => g.concept_name === c)
    )
  };
}
```

### Cross-Language Context Injection

```typescript
// Added to context generation when applicable

if (transferableKnowledge.accelerationOpportunities.length > 0) {
  sections.push(`
## Cross-Language Advantage
Student has mastered these concepts in ${transferableKnowledge.relatedLanguages.join(', ')}:
${transferableKnowledge.accelerationOpportunities.map(c => `- ${c}`).join('\n')}

You can reference their existing knowledge: "Remember how in Spanish you use subjunctive
after 'quiero que'? French works the same way with 'je veux que'..."
`);
}
```

---

## Database Migrations

### Migration 1: Core Memory Tables

```sql
-- supabase/migrations/20250104000001_create_memory_tables.sql

-- Learner Profile (cross-language)
CREATE TABLE learner_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  learning_style JSONB DEFAULT '{}'::jsonb,
  interests TEXT[] DEFAULT '{}',
  session_preferences JSONB DEFAULT '{}'::jsonb,
  cross_language_notes TEXT,
  learner_summary TEXT,
  summary_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Language Progress (per language)
CREATE TABLE language_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  proficiency_level TEXT DEFAULT 'beginner',
  proficiency_score NUMERIC(5,2) DEFAULT 0,
  current_lesson_id INTEGER,
  completed_lesson_ids INTEGER[] DEFAULT '{}',
  total_session_count INTEGER DEFAULT 0,
  total_practice_minutes INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_practice_at TIMESTAMPTZ,
  vocabulary_learned_count INTEGER DEFAULT 0,
  vocabulary_mastered_count INTEGER DEFAULT 0,
  grammar_learned_count INTEGER DEFAULT 0,
  grammar_mastered_count INTEGER DEFAULT 0,
  progress_summary TEXT,
  summary_updated_at TIMESTAMPTZ,
  recommended_focus JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_language UNIQUE (user_id, language_code)
);

-- Indexes
CREATE INDEX idx_learner_profile_user ON learner_profile(user_id);
CREATE INDEX idx_language_progress_user ON language_progress(user_id);
CREATE INDEX idx_language_progress_lang ON language_progress(language_code);
CREATE INDEX idx_language_progress_last_practice ON language_progress(last_practice_at);

-- RLS
ALTER TABLE learner_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE language_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON learner_profile
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON language_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access profile" ON learner_profile
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access progress" ON language_progress
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

### Migration 2: Vocabulary & Grammar Memory

```sql
-- supabase/migrations/20250104000002_create_concept_memory_tables.sql

-- Vocabulary Memory
CREATE TABLE vocabulary_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  term TEXT NOT NULL,
  translation TEXT NOT NULL,
  phonetic TEXT,
  part_of_speech TEXT,
  category TEXT,
  example_sentences JSONB DEFAULT '[]'::jsonb,
  mastery_level NUMERIC(3,2) DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 1),
  easiness_factor NUMERIC(3,2) DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  times_incorrect INTEGER DEFAULT 0,
  common_errors TEXT[],
  first_introduced_at TIMESTAMPTZ DEFAULT NOW(),
  introduced_in_session UUID,
  curriculum_lesson_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_vocab UNIQUE (user_id, language_code, term)
);

-- Grammar Memory
CREATE TABLE grammar_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  concept_name TEXT NOT NULL,
  concept_display TEXT NOT NULL,
  category TEXT,
  difficulty_tier INTEGER DEFAULT 1,
  prerequisites TEXT[],
  unlocks TEXT[],
  explanation TEXT,
  example_sentences JSONB DEFAULT '[]'::jsonb,
  mastery_level NUMERIC(3,2) DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 1),
  easiness_factor NUMERIC(3,2) DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  times_practiced INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  times_struggled INTEGER DEFAULT 0,
  error_patterns JSONB DEFAULT '[]'::jsonb,
  first_introduced_at TIMESTAMPTZ DEFAULT NOW(),
  introduced_in_session UUID,
  curriculum_lesson_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_grammar UNIQUE (user_id, language_code, concept_name)
);

-- Indexes
CREATE INDEX idx_vocab_user_lang ON vocabulary_memory(user_id, language_code);
CREATE INDEX idx_vocab_next_review ON vocabulary_memory(user_id, next_review_at);
CREATE INDEX idx_vocab_mastery ON vocabulary_memory(user_id, language_code, mastery_level);
CREATE INDEX idx_vocab_category ON vocabulary_memory(user_id, language_code, category);

CREATE INDEX idx_grammar_user_lang ON grammar_memory(user_id, language_code);
CREATE INDEX idx_grammar_next_review ON grammar_memory(user_id, next_review_at);
CREATE INDEX idx_grammar_mastery ON grammar_memory(user_id, language_code, mastery_level);
CREATE INDEX idx_grammar_category ON grammar_memory(user_id, language_code, category);

-- RLS
ALTER TABLE vocabulary_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vocabulary" ON vocabulary_memory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own grammar" ON grammar_memory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access vocabulary" ON vocabulary_memory
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access grammar" ON grammar_memory
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

### Migration 3: Session & Events

```sql
-- supabase/migrations/20250104000003_create_session_event_tables.sql

-- Lesson Sessions (enhanced history)
CREATE TABLE lesson_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  curriculum_lesson_id INTEGER,
  lesson_title TEXT,
  lesson_level TEXT,
  session_type TEXT DEFAULT 'lesson'
    CHECK (session_type IN ('lesson', 'review', 'practice', 'assessment')),
  vocabulary_introduced TEXT[] DEFAULT '{}',
  vocabulary_reviewed TEXT[] DEFAULT '{}',
  grammar_introduced TEXT[] DEFAULT '{}',
  grammar_reviewed TEXT[] DEFAULT '{}',
  custom_topic TEXT,
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  conversation_id TEXT,
  transcript_summary TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  next_session_recommendations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Concept Events (append-only log)
CREATE TABLE concept_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES lesson_sessions(id) ON DELETE SET NULL,
  language_code TEXT NOT NULL,
  event_type TEXT NOT NULL
    CHECK (event_type IN (
      'introduced', 'reviewed', 'correct', 'incorrect',
      'struggled', 'mastered', 'forgot', 'self_corrected'
    )),
  concept_type TEXT NOT NULL CHECK (concept_type IN ('vocabulary', 'grammar')),
  concept_id UUID,
  concept_identifier TEXT,
  context JSONB DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  session_timestamp_seconds INTEGER
);

-- Indexes
CREATE INDEX idx_sessions_user ON lesson_sessions(user_id);
CREATE INDEX idx_sessions_user_lang ON lesson_sessions(user_id, language_code);
CREATE INDEX idx_sessions_started ON lesson_sessions(started_at DESC);
CREATE INDEX idx_sessions_conversation ON lesson_sessions(conversation_id);

CREATE INDEX idx_events_user ON concept_events(user_id);
CREATE INDEX idx_events_user_lang ON concept_events(user_id, language_code);
CREATE INDEX idx_events_session ON concept_events(session_id);
CREATE INDEX idx_events_type ON concept_events(event_type);
CREATE INDEX idx_events_occurred ON concept_events(occurred_at DESC);
CREATE INDEX idx_events_concept ON concept_events(concept_type, concept_identifier);

-- RLS
ALTER TABLE lesson_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON lesson_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own events" ON concept_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access sessions" ON lesson_sessions
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access events" ON concept_events
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

---

## File Structure

```
poppa_frontend/
└── src/
    └── lib/
        └── memory/
            ├── index.ts                    # Public exports
            ├── types.ts                    # Memory-related types
            ├── context-generator.ts        # Lesson context generation
            ├── prompt-builder.ts           # Context → prompt transformation
            ├── realtime-queries.ts         # Mid-lesson query functions
            ├── spaced-repetition.ts        # SM-2 algorithm
            ├── session-processor.ts        # Post-session analysis
            ├── cross-language.ts           # Language family intelligence
            └── client-tools.ts             # ElevenLabs client tool definitions
```

---

## Integration Points

### 1. Lesson Generation (`/api/generate-lesson`)

```typescript
// Before generating lesson, fetch memory context
const memoryContext = await generateLessonContext(userId, languageCode, {
  useCurriculum,
  customTopic,
  sessionType: 'lesson'
});

// Build enhanced prompt with memory
const baseInstruction = generateThinkingMethodInstruction(language, nativeLanguage);
const memoryPrompt = buildTutorPrompt(memoryContext);
const fullPrompt = `${baseInstruction}\n\n${memoryPrompt}`;
```

### 2. Chat Component

```typescript
// Add client tools for real-time memory access
const conversation = useConversation({
  clientTools: memoryClientTools(user.id, targetLanguage, sessionId),
  // ... existing config
});

// Create session record on connect
const handleConnect = async () => {
  const session = await createLessonSession({ userId, languageCode });
  setCurrentSessionId(session.id);
  // ... existing connect logic
};
```

### 3. ElevenLabs Webhook

```typescript
// Trigger async session processing after saving transcript
await queueSessionProcessing({
  userId,
  languageCode,
  conversationId,
  transcript
});
```

### 4. Dashboard

```typescript
// Show memory-enhanced progress
const languageProgress = await getLanguageProgress(userId, languageCode);
const dueForReview = await getItemsDueForReview(userId, languageCode);
const streakData = await getStreakData(userId);
```

---

## Performance Considerations

### Caching Strategy

```typescript
// Cache frequently accessed memory context
const MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const memoryCache = new Map<string, { data: LessonContext; expires: number }>();

async function getOrGenerateContext(userId: string, languageCode: string) {
  const key = `${userId}:${languageCode}`;
  const cached = memoryCache.get(key);

  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const context = await generateLessonContext(userId, languageCode);
  memoryCache.set(key, { data: context, expires: Date.now() + MEMORY_CACHE_TTL });

  return context;
}
```

### Query Optimization

- All tables have targeted indexes for common queries
- Denormalized counts in `language_progress` avoid expensive aggregations
- `concept_events` is append-only with time-based partitioning option
- Real-time queries use simple, indexed lookups

### Async Processing

- Session analysis runs asynchronously after webhook
- Summary regeneration is periodic, not per-session
- Streak calculations cached and updated daily

---

## Success Metrics

Track framework effectiveness:

1. **Retention**: Compare mastery decay rates with/without spaced repetition
2. **Accuracy**: AI-detected errors vs human review
3. **Engagement**: Session frequency correlation with memory features usage
4. **Learning Speed**: Time to reach proficiency milestones
5. **Cross-Language Transfer**: Accelerated learning for related languages

---

## Future Enhancements

### Phase 2: Advanced Features

1. **Pronunciation Memory**: Track pronunciation issues via audio analysis
2. **Conversation Style Memory**: Remember preferred topics, humor, formality
3. **Adaptive Difficulty**: Auto-adjust lesson complexity based on performance
4. **Social Learning**: Compare progress with similar learners (anonymized)

### Phase 3: AI Enhancements

1. **Predictive Forgetting**: Preemptively review items before they decay
2. **Pattern Detection**: Identify systematic error patterns across students
3. **Curriculum Optimization**: Use aggregate data to improve lesson sequencing

---

## Summary

This memory framework transforms Poppa from a stateless conversation tool into a personalized tutor that:

- **Remembers** every vocabulary word and grammar concept
- **Tracks** mastery with proven spaced repetition
- **Identifies** struggling areas and reinforces them
- **Leverages** cross-language knowledge for acceleration
- **Adapts** to each learner's style and preferences

The result: Students feel known and understood, lessons build meaningfully on prior knowledge, and the learning experience is fundamentally stickier than alternatives.
