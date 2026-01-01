import { NextResponse } from "next/server";

import supabase from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { languageCode, userId } = await request.json();

    if (!languageCode || !userId) {
      return NextResponse.json(
        { error: "Language code and user ID are required" },
        { status: 400 }
      );
    }

    // First, get the language ID from the languages table
    const { data: languageData, error: languageError } = await supabase
      .from("languages")
      .select("id")
      .eq("code", languageCode)
      .single();

    if (languageError || !languageData) {
      return NextResponse.json({ error: "Language not found" }, { status: 404 });
    }

    // Add the language to user_learns table
    const { data, error } = await supabase
      .from("user_learns")
      .insert([
        {
          id: crypto.randomUUID(), // Generate a unique ID
          user_id: userId,
          language_id: languageData.id,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
