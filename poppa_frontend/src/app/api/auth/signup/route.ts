import { NextResponse } from "next/server";

import { sendWelcomeEmail } from "@/lib/email";
import supabase from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, options, referralCode } = body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      console.error("Signup error:", error);
      return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }

    if (data.user && referralCode) {
      const { error: referralError } = await supabase.rpc("process_referral", {
        p_referral_code: referralCode,
        p_referred_user_id: data.user.id,
      });

      if (referralError) {
        console.error("Referral processing error:", referralError);
      }
    }

    if (data.user && email) {
      const firstName = options?.data?.first_name;
      sendWelcomeEmail(email, firstName).catch((err) => {
        console.error("Failed to send welcome email:", err);
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
