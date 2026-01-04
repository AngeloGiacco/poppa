/**
 * Process Session API
 * Post-session transcript analysis and memory updates
 */

import { embedSession } from "@/lib/memory/embeddings";
import { processSessionTranscript } from "@/lib/memory/session-processor";
import type { ProcessSessionRequest, TranscriptMessage } from "@/types/memory.types";

export async function POST(req: Request) {
  try {
    const body: ProcessSessionRequest = await req.json();
    const { userId, languageCode, conversationId, transcript, sessionId } = body;

    if (!userId || !languageCode || !conversationId || !transcript || !sessionId) {
      return Response.json(
        {
          error:
            "Missing required fields: userId, languageCode, conversationId, transcript, sessionId",
        },
        { status: 400 }
      );
    }

    // Process the transcript
    const analysis = await processSessionTranscript(
      userId,
      languageCode,
      conversationId,
      transcript as TranscriptMessage[],
      sessionId
    );

    // Generate embedding for the session (async, don't wait)
    embedSession(sessionId).catch((error) => {
      console.error("Failed to embed session:", error);
    });

    return Response.json({
      success: true,
      analysis: {
        vocabularyCount: analysis.vocabularyEvents.length,
        grammarCount: analysis.grammarEvents.length,
        summary: analysis.summary,
        highlights: analysis.highlights,
        recommendations: analysis.recommendations,
      },
    });
  } catch (error) {
    console.error("Process session error:", error);
    return Response.json({ error: "Failed to process session transcript" }, { status: 500 });
  }
}
