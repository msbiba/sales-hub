import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { id } = await params;

    const body = await request.json();

    if (!body.firma || !String(body.firma).trim()) {
      return NextResponse.json(
        { error: "Firmenname ist erforderlich" },
        { status: 400 }
      );
    }

    if (
      body.anlagengroesse_kwp !== "" &&
      body.anlagengroesse_kwp !== undefined &&
      body.anlagengroesse_kwp !== null &&
      isNaN(Number(body.anlagengroesse_kwp))
    ) {
      return NextResponse.json(
        { error: "Anlagengroesse muss eine gueltige Zahl sein" },
        { status: 400 }
      );
    }

    if (
      body.email &&
      String(body.email).trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
    ) {
      return NextResponse.json(
        { error: "Bitte eine gueltige E-Mail-Adresse eingeben" },
        { status: 400 }
      );
    }

    const allowedStatus = ["aktiv", "in_wartung", "beschwerde", "interessent"];
    if (body.status && !allowedStatus.includes(body.status)) {
      return NextResponse.json({ error: "Ungueltiger Status" }, { status: 400 });
    }

    if (
      body.letzter_kontakt &&
      !/^\d{4}-\d{2}-\d{2}$/.test(body.letzter_kontakt)
    ) {
      return NextResponse.json(
        { error: "Letzter Kontakt muss Format YYYY-MM-DD haben" },
        { status: 400 }
      );
    }

    const updateData = {
      firma: String(body.firma).trim(),
      ansprechpartner: String(body.ansprechpartner ?? "").trim(),
      branche: String(body.branche ?? "").trim(),
      anlagengroesse_kwp:
        body.anlagengroesse_kwp === "" || body.anlagengroesse_kwp == null
          ? 0
          : Number(body.anlagengroesse_kwp),
      status: body.status,
      letzter_kontakt: body.letzter_kontakt || null,
      telefon: String(body.telefon ?? "").trim(),
      email: String(body.email ?? "").trim(),
      notiz: String(body.notiz ?? "").trim(),
    };

    const { error } = await supabase
      .from("kunden")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: `Supabase-Fehler: ${error.message}` },
        { status: 500 }
      );
    }

    revalidatePath("/");
    revalidatePath(`/kunden/${id}`);
    revalidatePath("/berichte");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Speichern fehlgeschlagen, bitte erneut versuchen" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { id } = await params;

    const { error } = await supabase
      .from("kunden")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: `Supabase-Fehler: ${error.message}` },
        { status: 500 }
      );
    }

    revalidatePath("/");
    revalidatePath(`/kunden/${id}`);
    revalidatePath("/berichte");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Loeschen fehlgeschlagen, bitte erneut versuchen" },
      { status: 500 }
    );
  }
}
