/**
 * Memory Progress API
 * Get and update language progress
 */

import supabaseClient from "@/lib/supabase";
import type { LanguageProgress } from "@/types/memory.types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const languageCode = searchParams.get("languageCode");

    if (!userId) {
      return Response.json(
        { error: "Missing required param: userId" },
        { status: 400 }
      );
    }

    if (languageCode) {
      // Get specific language progress
      const { data, error } = await supabaseClient
        .from("language_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("language_code", languageCode)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      return Response.json({ progress: data || null });
    } else {
      // Get all language progress for user
      const { data, error } = await supabaseClient
        .from("language_progress")
        .select("*")
        .eq("user_id", userId)
        .order("last_practice_at", { ascending: false, nullsFirst: false });

      if (error) throw error;

      return Response.json({ progress: data || [] });
    }
  } catch (error) {
    console.error("Get progress error:", error);
    return Response.json(
      { error: "Failed to get language progress" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, languageCode, updates } = body;

    if (!userId || !languageCode) {
      return Response.json(
        { error: "Missing required fields: userId, languageCode" },
        { status: 400 }
      );
    }

    // Get or create progress
    const { data: existing } = await supabaseClient
      .from("language_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("language_code", languageCode)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabaseClient
        .from("language_progress")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("language_code", languageCode)
        .select()
        .single();

      if (error) throw error;

      return Response.json({ progress: data });
    } else {
      // Create new
      const { data, error } = await supabaseClient
        .from("language_progress")
        .insert({
          user_id: userId,
          language_code: languageCode,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;

      return Response.json({ progress: data });
    }
  } catch (error) {
    console.error("Update progress error:", error);
    return Response.json(
      { error: "Failed to update language progress" },
      { status: 500 }
    );
  }
}
