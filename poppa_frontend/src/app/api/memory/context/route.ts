/**
 * Memory Context API
 * Generates lesson context for AI tutor at session start
 */

import { generateLessonContext } from "@/lib/memory/context-generator";
import { buildTutorPrompt } from "@/lib/memory/prompt-builder";
import type { GenerateContextRequest } from "@/types/memory.types";

export async function POST(req: Request) {
  try {
    const body: GenerateContextRequest = await req.json();
    const { userId, languageCode, options } = body;

    if (!userId || !languageCode) {
      return Response.json(
        { error: "Missing required fields: userId, languageCode" },
        { status: 400 }
      );
    }

    // Generate comprehensive context
    const context = await generateLessonContext(userId, languageCode, {
      useCurriculum: options?.useCurriculum,
      customTopic: options?.customTopic,
      sessionType: options?.sessionType,
      lessonId: options?.lessonId,
    });

    // Build tutor prompt from context
    const tutorPrompt = buildTutorPrompt(context);

    return Response.json({
      context,
      tutorPrompt,
    });
  } catch (error) {
    console.error("Memory context error:", error);
    return Response.json({ error: "Failed to generate memory context" }, { status: 500 });
  }
}
