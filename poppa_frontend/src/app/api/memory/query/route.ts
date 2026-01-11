/**
 * Memory Query API
 * Real-time memory lookups for mid-lesson queries
 */

import { queryMemoryNaturalLanguage } from "@/lib/memory/natural-language-query";
import {
  checkVocabularyHistory,
  getVocabularyDueForReview,
  getGrammarDueForReview,
  getLastSessionSummary,
  getGrammarStrugglePoints,
  getVocabularyStrugglePoints,
  getRelatedVocabulary,
} from "@/lib/memory/realtime-queries";
import type { MemoryQueryRequest } from "@/types/memory.types";

export async function POST(req: Request) {
  try {
    const body: MemoryQueryRequest = await req.json();
    const { userId, languageCode, queryType, params } = body;

    if (!userId || !languageCode || !queryType) {
      return Response.json(
        { error: "Missing required fields: userId, languageCode, queryType" },
        { status: 400 }
      );
    }

    let result: unknown;

    switch (queryType) {
      case "check_vocabulary":
        if (!params?.term) {
          return Response.json({ error: "Missing param: term" }, { status: 400 });
        }
        result = await checkVocabularyHistory(userId, languageCode, params.term as string);
        break;

      case "get_review_items": {
        const [vocab, grammar] = await Promise.all([
          getVocabularyDueForReview(userId, languageCode),
          getGrammarDueForReview(userId, languageCode),
        ]);
        result = { vocabulary: vocab, grammar };
        break;
      }

      case "get_last_session":
        result = await getLastSessionSummary(userId, languageCode);
        break;

      case "get_struggling_areas": {
        const [strugglingVocab, strugglingGrammar] = await Promise.all([
          getVocabularyStrugglePoints(userId, languageCode),
          getGrammarStrugglePoints(userId, languageCode),
        ]);
        result = {
          vocabulary: strugglingVocab,
          grammar: strugglingGrammar,
        };
        break;
      }

      case "get_related_vocabulary":
        if (!params?.category) {
          return Response.json({ error: "Missing param: category" }, { status: 400 });
        }
        result = await getRelatedVocabulary(userId, languageCode, params.category as string);
        break;

      case "natural_language":
        if (!params?.query) {
          return Response.json({ error: "Missing param: query" }, { status: 400 });
        }
        result = await queryMemoryNaturalLanguage(userId, languageCode, params.query as string);
        break;

      default:
        return Response.json({ error: `Unknown query type: ${queryType}` }, { status: 400 });
    }

    return Response.json({ result });
  } catch (error) {
    console.error("Memory query error:", error);
    return Response.json({ error: "Failed to execute memory query" }, { status: 500 });
  }
}
