import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED_TYPEN = ["Anruf", "Termin", "E-Mail"] as const;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    const body = await request.json();
    const { kunde_id, typ, notiz } = body;

    if (!kunde_id || typeof kunde_id !== "string") {
      return NextResponse.json({ error: "kunde_id fehlt" }, { status: 400 });
    }

    if (!typ || !(ALLOWED_TYPEN as readonly string[]).includes(typ)) {
      return NextResponse.json(
        { error: "Ungueltiger Typ. Erlaubt: Anruf, Termin, E-Mail" },
        { status: 400 }
      );
    }

    if (notiz && typeof notiz === "string" && notiz.length > 1000) {
      return NextResponse.json(
        { error: "Notiz darf max. 1000 Zeichen haben" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("aktivitaeten").insert({
      kunde_id,
      typ,
      datum: today,
      notiz: notiz?.trim() || null,
    });

    if (error) {
      return NextResponse.json(
        { error: `Supabase-Fehler: ${error.message}` },
        { status: 500 }
      );
    }

    revalidatePath(`/kunden/${kunde_id}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Speichern fehlgeschlagen" },
      { status: 500 }
    );
  }
}
