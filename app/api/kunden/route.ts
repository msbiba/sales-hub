import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();

    if (!body.firma || !body.firma.trim()) {
      return NextResponse.json(
        { error: "Firmenname ist erforderlich" },
        { status: 400 }
      );
    }

    if (
      body.anlagengroesse_kwp !== "" &&
      body.anlagengroesse_kwp !== undefined &&
      isNaN(Number(body.anlagengroesse_kwp))
    ) {
      return NextResponse.json(
        { error: "Anlagengroesse muss eine gueltige Zahl sein" },
        { status: 400 }
      );
    }

    if (
      body.email &&
      body.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
    ) {
      return NextResponse.json(
        { error: "Bitte eine gueltige E-Mail-Adresse eingeben" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("kunden")
      .insert({
        firma: body.firma.trim(),
        ansprechpartner: (body.ansprechpartner || "").trim(),
        branche: (body.branche || "").trim(),
        anlagengroesse_kwp: body.anlagengroesse_kwp
          ? Number(body.anlagengroesse_kwp)
          : 0,
        status: body.status || "aktiv",
        letzter_kontakt: today,
        telefon: (body.telefon || "").trim(),
        email: (body.email || "").trim(),
        notiz: (body.notiz || "").trim(),
        bearbeiter_id: body.bearbeiter_id ?? user?.id ?? null,
        pipeline_stufe: body.pipeline_stufe?.trim() || null,
        vertriebler: body.vertriebler?.trim() || null,
        produkt_interesse: body.produkt_interesse?.trim() || null,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Supabase-Fehler: ${error.message}` },
        { status: 500 }
      );
    }

    revalidatePath("/");
    revalidatePath("/kunden");

    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json(
      { error: "Speichern fehlgeschlagen, bitte erneut versuchen" },
      { status: 500 }
    );
  }
}
