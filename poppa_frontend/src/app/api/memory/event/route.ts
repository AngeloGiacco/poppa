/**
 * Memory Event API
 * Record concept events during lessons
 */

import supabaseClient from "@/lib/supabase";
import { assessQualityFromEvent } from "@/lib/memory/spaced-repetition";
import type { RecordEventRequest } from "@/types/memory.types";

export async function POST(req: Request) {
  try {
    const body: RecordEventRequest = await req.json();
    const {
      userId,
      sessionId,
      languageCode,
      eventType,
      conceptType,
      conceptIdentifier,
      conceptId,
      context,
      sessionTimestampSeconds,
    } = body;

    if (!userId || !languageCode || !eventType || !conceptType || !conceptIdentifier) {
      return Response.json(
        {
          error:
            "Missing required fields: userId, languageCode, eventType, conceptType, conceptIdentifier",
        },
        { status: 400 }
      );
    }

    // Record the event
    const { data: event, error: eventError } = await supabaseClient
      .from("concept_events")
      .insert({
        user_id: userId,
        session_id: sessionId,
        language_code: languageCode,
        event_type: eventType,
        concept_type: conceptType,
        concept_id: conceptId,
        concept_identifier: conceptIdentifier,
        context: context || {},
        session_timestamp_seconds: sessionTimestampSeconds,
      })
      .select()
      .single();

    if (eventError) throw eventError;

    // Update the concept memory with spaced repetition
    const quality = assessQualityFromEvent(eventType, context);

    if (conceptType === "vocabulary") {
      try {
        await supabaseClient.rpc("update_vocabulary_after_review", {
          p_user_id: userId,
          p_language_code: languageCode,
          p_term: conceptIdentifier,
          p_quality: quality,
        });
      } catch (e) {
        // Vocabulary might not exist yet - that's ok
        console.log("Vocabulary not found for update:", conceptIdentifier);
      }
    } else if (conceptType === "grammar") {
      try {
        await supabaseClient.rpc("update_grammar_after_practice", {
          p_user_id: userId,
          p_language_code: languageCode,
          p_concept_name: conceptIdentifier,
          p_quality: quality,
        });
      } catch (e) {
        // Grammar might not exist yet - that's ok
        console.log("Grammar not found for update:", conceptIdentifier);
      }
    }

    return Response.json({ event, qualityScore: quality });
  } catch (error) {
    console.error("Record event error:", error);
    return Response.json(
      { error: "Failed to record concept event" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const languageCode = searchParams.get("languageCode");
    const conceptType = searchParams.get("conceptType");
    const conceptIdentifier = searchParams.get("conceptIdentifier");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!userId) {
      return Response.json(
        { error: "Missing required param: userId" },
        { status: 400 }
      );
    }

    let query = supabaseClient
      .from("concept_events")
      .select("*")
      .eq("user_id", userId)
      .order("occurred_at", { ascending: false })
      .limit(limit);

    if (languageCode) {
      query = query.eq("language_code", languageCode);
    }
    if (conceptType) {
      query = query.eq("concept_type", conceptType);
    }
    if (conceptIdentifier) {
      query = query.eq("concept_identifier", conceptIdentifier);
    }

    const { data, error } = await query;

    if (error) throw error;

    return Response.json({ events: data });
  } catch (error) {
    console.error("Get events error:", error);
    return Response.json(
      { error: "Failed to get concept events" },
      { status: 500 }
    );
  }
}
