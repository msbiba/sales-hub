import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const THROTTLE_MS = 60 * 60 * 1000; // 1h

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("last_login_at")
      .eq("id", user.id)
      .single();

    const now = new Date();
    const last = profile?.last_login_at ? new Date(profile.last_login_at) : null;

    if (last && now.getTime() - last.getTime() < THROTTLE_MS) {
      return NextResponse.json({ success: true, throttled: true });
    }

    await supabase
      .from("profiles")
      .update({ last_login_at: now.toISOString() })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "login-hook failed" }, { status: 500 });
  }
}
