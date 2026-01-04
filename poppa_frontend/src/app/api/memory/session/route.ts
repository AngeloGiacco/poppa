/**
 * Memory Session API
 * Create and manage lesson sessions
 */

import { createLessonSession, endLessonSession } from "@/lib/memory/session-processor";
import supabaseClient from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "create": {
        const {
          userId,
          languageCode,
          sessionType,
          curriculumLessonId,
          lessonTitle,
          lessonLevel,
          customTopic,
        } = body;

        if (!userId || !languageCode) {
          return Response.json(
            { error: "Missing required fields: userId, languageCode" },
            { status: 400 }
          );
        }

        const session = await createLessonSession({
          userId,
          languageCode,
          sessionType,
          curriculumLessonId,
          lessonTitle,
          lessonLevel,
          customTopic,
        });

        return Response.json({ session });
      }

      case "end": {
        const { sessionId, durationSeconds } = body;

        if (!sessionId) {
          return Response.json({ error: "Missing required field: sessionId" }, { status: 400 });
        }

        await endLessonSession(sessionId, durationSeconds || 0);

        return Response.json({ success: true });
      }

      case "update": {
        const { sessionId, updates } = body;

        if (!sessionId || !updates) {
          return Response.json(
            { error: "Missing required fields: sessionId, updates" },
            { status: 400 }
          );
        }

        await supabaseClient
          .from("lesson_sessions")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", sessionId);

        return Response.json({ success: true });
      }

      default:
        return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Session API error:", error);
    return Response.json({ error: "Failed to process session request" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const languageCode = searchParams.get("languageCode");
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);

    if (!userId) {
      return Response.json({ error: "Missing required param: userId" }, { status: 400 });
    }

    let query = supabaseClient
      .from("lesson_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(limit);

    if (languageCode) {
      query = query.eq("language_code", languageCode);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return Response.json({ sessions: data });
  } catch (error) {
    console.error("Get sessions error:", error);
    return Response.json({ error: "Failed to get sessions" }, { status: 500 });
  }
}
