import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserProfile } from "@/lib/auth/role";

const VALID_ROLES = ["admin", "bearbeiter", "buchhaltung"] as const;
type Role = (typeof VALID_ROLES)[number];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const me = await getCurrentUserProfile();
    if (!me || me.role !== "admin") {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
    }

    const { id: targetId } = await params;
    const body = await request.json();
    const newRole = body.role as Role | undefined;
    const newActive = typeof body.is_active === "boolean" ? body.is_active : undefined;

    if (newRole && !VALID_ROLES.includes(newRole)) {
      return NextResponse.json({ error: "Ungueltige Rolle" }, { status: 400 });
    }

    // Self-Protection
    if (targetId === me.id) {
      if (newRole && newRole !== me.role) {
        return NextResponse.json(
          { error: "Eigene Rolle kann nicht geaendert werden" },
          { status: 400 }
        );
      }
      if (newActive === false) {
        return NextResponse.json(
          { error: "Eigene Deaktivierung nicht erlaubt" },
          { status: 400 }
        );
      }
    }

    const supabase = await createSupabaseServerClient();

    // Last-Admin-Protection (Demote oder Deactivate eines Admins)
    if (newRole && newRole !== "admin") {
      const { data: target } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", targetId)
        .single();
      if (target?.role === "admin") {
        const { count } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "admin")
          .eq("is_active", true);
        if ((count ?? 0) <= 1) {
          return NextResponse.json(
            { error: "Letzter aktiver Admin kann nicht degradiert werden" },
            { status: 400 }
          );
        }
      }
    }
    if (newActive === false) {
      const { data: target } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", targetId)
        .single();
      if (target?.role === "admin") {
        const { count } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "admin")
          .eq("is_active", true);
        if ((count ?? 0) <= 1) {
          return NextResponse.json(
            { error: "Letzter aktiver Admin kann nicht deaktiviert werden" },
            { status: 400 }
          );
        }
      }
    }

    // Update via Admin-Client (bypasst RLS-Restrictions auf update-Policy)
    const admin = createSupabaseAdminClient();
    const update: { role?: Role; is_active?: boolean } = {};
    if (newRole) update.role = newRole;
    if (newActive !== undefined) update.is_active = newActive;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nichts zu aendern" }, { status: 400 });
    }

    const { error } = await admin.from("profiles").update(update).eq("id", targetId);
    if (error) {
      return NextResponse.json(
        { error: `Supabase-Fehler: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
