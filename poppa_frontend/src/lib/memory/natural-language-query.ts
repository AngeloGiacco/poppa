/**
 * Natural Language Query Layer
 * LLM-powered query routing for flexible memory access
 */

import Anthropic from "@anthropic-ai/sdk";

import supabaseClient from "@/lib/supabase";
import type { NLQueryResult, QueryPlan, QueryDefinition } from "@/types/memory.types";

const anthropic = new Anthropic();

/**
 * Query memory using natural language
 */
export async function queryMemoryNaturalLanguage(
  userId: string,
  languageCode: string,
  query: string
): Promise<NLQueryResult> {
  // 1. Generate query plan using Claude
  const queryPlan = await generateQueryPlan(query, languageCode);

  // 2. Execute the structured queries
  const results = await executeQueryPlan(userId, languageCode, queryPlan);

  // 3. Synthesize results into natural language
  const answer = await synthesizeResponse(query, results, queryPlan);

  return {
    answer,
    sources: results,
    confidence: queryPlan.confidence,
  };
}

/**
 * Generate a query plan from natural language
 */
async function generateQueryPlan(query: string, languageCode: string): Promise<QueryPlan> {
  const response = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1024,
    system: `You are a query planner for a language learning memory system.
Given a natural language question about a student's learning progress, output a JSON query plan.

The student is learning: ${languageCode}

Available tables and their key columns:
- vocabulary_memory: term, translation, mastery_level (0-1), category, common_errors[], times_incorrect, times_seen, next_review_at, last_reviewed_at
- grammar_memory: concept_name, concept_display, mastery_level (0-1), category, error_patterns[], times_struggled, times_practiced, next_review_at
- lesson_sessions: started_at, vocabulary_introduced[], grammar_introduced[], transcript_summary, highlights[], performance_metrics, lesson_title
- concept_events: event_type (correct/incorrect/struggled/introduced/reviewed), concept_type (vocabulary/grammar), concept_identifier, occurred_at, context

Output ONLY valid JSON in this format:
{
  "queries": [
    {
      "table": "vocabulary_memory",
      "filters": { "mastery_level": { "lt": 0.5 } },
      "orderBy": "times_incorrect",
      "orderDirection": "desc",
      "limit": 10
    }
  ],
  "intent": "find_struggling_vocabulary",
  "confidence": 0.9
}

Filter operators: eq, neq, lt, lte, gt, gte, in, contains`,
    messages: [{ role: "user", content: query }],
  });

  try {
    const text = response.content[0].type === "text" ? response.content[0].text : "";
    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as QueryPlan;
    }
    throw new Error("No JSON found in response");
  } catch (error) {
    // Fallback query plan for common queries
    return getFallbackQueryPlan(query);
  }
}

/**
 * Execute the generated query plan
 */
async function executeQueryPlan(
  userId: string,
  languageCode: string,
  plan: QueryPlan
): Promise<Array<{ table: string; records: unknown[] }>> {
  const results: Array<{ table: string; records: unknown[] }> = [];

  for (const queryDef of plan.queries) {
    const records = await executeQuery(userId, languageCode, queryDef);
    results.push({ table: queryDef.table, records });
  }

  return results;
}

/**
 * Execute a single query definition
 */
async function executeQuery(
  userId: string,
  languageCode: string,
  queryDef: QueryDefinition
): Promise<unknown[]> {
  let query = supabaseClient
    .from(queryDef.table)
    .select("*")
    .eq("user_id", userId)
    .eq("language_code", languageCode);

  // Apply filters - using type assertions for dynamic filter application
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let typedQuery = query as any;
  for (const [field, condition] of Object.entries(queryDef.filters || {})) {
    if (typeof condition === "object" && condition !== null) {
      const ops = condition as Record<string, unknown>;
      if ("eq" in ops) {
        typedQuery = typedQuery.eq(field, ops.eq);
      }
      if ("neq" in ops) {
        typedQuery = typedQuery.neq(field, ops.neq);
      }
      if ("lt" in ops) {
        typedQuery = typedQuery.lt(field, ops.lt);
      }
      if ("lte" in ops) {
        typedQuery = typedQuery.lte(field, ops.lte);
      }
      if ("gt" in ops) {
        typedQuery = typedQuery.gt(field, ops.gt);
      }
      if ("gte" in ops) {
        typedQuery = typedQuery.gte(field, ops.gte);
      }
      if ("in" in ops) {
        typedQuery = typedQuery.in(field, ops.in as unknown[]);
      }
      if ("contains" in ops) {
        typedQuery = typedQuery.contains(field, ops.contains as unknown[]);
      }
    } else {
      typedQuery = typedQuery.eq(field, condition);
    }
  }
  query = typedQuery;

  // Apply ordering
  if (queryDef.orderBy) {
    const ascending = (queryDef as { orderDirection?: string }).orderDirection !== "desc";
    query = query.order(queryDef.orderBy, { ascending });
  }

  // Apply limit
  if (queryDef.limit) {
    query = query.limit(queryDef.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Query error:", error);
    return [];
  }

  return data || [];
}

/**
 * Synthesize query results into a natural language response
 */
async function synthesizeResponse(
  originalQuery: string,
  results: Array<{ table: string; records: unknown[] }>,
  plan: QueryPlan
): Promise<string> {
  // For simple queries, generate response directly
  if (results.length === 1 && results[0].records.length === 0) {
    return generateEmptyResultResponse(plan.intent);
  }

  // Use Claude to synthesize a natural response
  const response = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 512,
    system: `You are a helpful assistant summarizing language learning data.
Given query results, provide a concise, informative response.
Focus on actionable insights for a language tutor.
Keep responses under 100 words.`,
    messages: [
      {
        role: "user",
        content: `Original question: "${originalQuery}"

Query intent: ${plan.intent}

Results:
${JSON.stringify(results, null, 2)}

Provide a natural language summary of these results.`,
      },
    ],
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : "Unable to summarize results.";
}

/**
 * Generate response for empty results
 */
function generateEmptyResultResponse(intent: string): string {
  const responses: Record<string, string> = {
    find_struggling_vocabulary:
      "No vocabulary items are currently flagged as struggling. The student is doing well!",
    find_struggling_grammar: "No grammar concepts are currently causing difficulty.",
    find_due_for_review: "No items are currently due for review.",
    find_recent_sessions: "No recent sessions found for this language.",
    find_mastered_items: "No items have reached mastery level yet.",
  };

  return responses[intent] || "No matching data found.";
}

/**
 * Fallback query plan for common query patterns
 */
function getFallbackQueryPlan(query: string): QueryPlan {
  const lowerQuery = query.toLowerCase();

  if (
    lowerQuery.includes("struggle") ||
    lowerQuery.includes("difficult") ||
    lowerQuery.includes("trouble")
  ) {
    return {
      queries: [
        {
          table: "vocabulary_memory",
          filters: { mastery_level: { lt: 0.5 } },
          orderBy: "times_incorrect",
          limit: 10,
        },
        {
          table: "grammar_memory",
          filters: { mastery_level: { lt: 0.5 } },
          orderBy: "times_struggled",
          limit: 5,
        },
      ],
      intent: "find_struggling_concepts",
      confidence: 0.7,
    };
  }

  if (lowerQuery.includes("review") || lowerQuery.includes("due")) {
    return {
      queries: [
        {
          table: "vocabulary_memory",
          filters: { next_review_at: { lte: new Date().toISOString() } },
          orderBy: "next_review_at",
          limit: 10,
        },
      ],
      intent: "find_due_for_review",
      confidence: 0.7,
    };
  }

  if (
    lowerQuery.includes("last session") ||
    lowerQuery.includes("previous") ||
    lowerQuery.includes("last time")
  ) {
    return {
      queries: [
        {
          table: "lesson_sessions",
          filters: {},
          orderBy: "started_at",
          limit: 1,
        },
      ],
      intent: "find_last_session",
      confidence: 0.8,
    };
  }

  if (lowerQuery.includes("progress") || lowerQuery.includes("how")) {
    return {
      queries: [
        {
          table: "vocabulary_memory",
          filters: { mastery_level: { gte: 0.8 } },
          orderBy: "mastery_level",
          limit: 20,
        },
        {
          table: "grammar_memory",
          filters: { mastery_level: { gte: 0.8 } },
          orderBy: "mastery_level",
          limit: 10,
        },
      ],
      intent: "find_progress",
      confidence: 0.6,
    };
  }

  // Default: get recent activity
  return {
    queries: [
      {
        table: "lesson_sessions",
        filters: {},
        orderBy: "started_at",
        limit: 5,
      },
    ],
    intent: "general_query",
    confidence: 0.5,
  };
}

/**
 * Quick structured queries for common patterns
 */
export async function quickQuery(
  userId: string,
  languageCode: string,
  queryType:
    | "struggling_vocab"
    | "struggling_grammar"
    | "due_for_review"
    | "last_session"
    | "mastered_items"
): Promise<unknown[]> {
  const queryPlans: Record<string, QueryDefinition> = {
    struggling_vocab: {
      table: "vocabulary_memory",
      filters: { mastery_level: { lt: 0.5 } },
      orderBy: "times_incorrect",
      limit: 10,
    },
    struggling_grammar: {
      table: "grammar_memory",
      filters: { mastery_level: { lt: 0.5 } },
      orderBy: "times_struggled",
      limit: 5,
    },
    due_for_review: {
      table: "vocabulary_memory",
      filters: { next_review_at: { lte: new Date().toISOString() } },
      orderBy: "next_review_at",
      limit: 15,
    },
    last_session: {
      table: "lesson_sessions",
      filters: {},
      orderBy: "started_at",
      limit: 1,
    },
    mastered_items: {
      table: "vocabulary_memory",
      filters: { mastery_level: { gte: 0.8 } },
      orderBy: "mastery_level",
      limit: 30,
    },
  };

  return executeQuery(userId, languageCode, queryPlans[queryType]);
}
