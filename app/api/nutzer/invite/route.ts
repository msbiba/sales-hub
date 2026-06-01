import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserProfile } from "@/lib/auth/role";

const VALID_ROLES = ["admin", "bearbeiter", "buchhaltung"] as const;
type Role = (typeof VALID_ROLES)[number];

export async function POST(request: NextRequest) {
  try {
    const me = await getCurrentUserProfile();
    if (!me || me.role !== "admin") {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const role = body.role as Role | undefined;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ungueltige E-Mail" }, { status: 400 });
    }
    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Rolle ist Pflicht" }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email);
    if (error) {
      return NextResponse.json(
        { error: `Einladung fehlgeschlagen: ${error.message}` },
        { status: 400 }
      );
    }
    const newUserId = data.user?.id;
    if (!newUserId) {
      return NextResponse.json(
        { error: "Einladung versendet, aber keine User-ID erhalten" },
        { status: 500 }
      );
    }

    // Profil-Row update: Rolle setzen (Trigger hat sie auf bearbeiter gesetzt)
    const { error: roleErr } = await admin
      .from("profiles")
      .update({ role })
      .eq("id", newUserId);

    if (roleErr) {
      return NextResponse.json(
        { error: `Rolle konnte nicht gesetzt werden: ${roleErr.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: newUserId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
