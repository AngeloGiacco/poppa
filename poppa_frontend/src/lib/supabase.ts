import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

// This file should only be imported in server-side code
if (typeof window !== "undefined") {
  throw new Error("This file should only be used on the server-side");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_KEY must be set in environment variables");
}

const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
  db: { schema: "public" },
});

export default supabaseClient;
