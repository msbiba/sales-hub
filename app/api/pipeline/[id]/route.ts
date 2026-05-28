import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { validatePipeline, type PipelineInput } from "@/lib/validation";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = (await request.json()) as Partial<PipelineInput>;

    const input: PipelineInput = {
      customer_id: "skip-validation", // bei Update nicht erforderlich, Kunde aendert sich nicht
      firma: String(body.firma ?? ""),
      volumen_eur: String(body.volumen_eur ?? ""),
      angebotsdatum: String(body.angebotsdatum ?? ""),
      status: String(body.status ?? ""),
      notiz: String(body.notiz ?? ""),
    };

    const errors = validatePipeline(input);
    if (Object.keys(errors).length > 0) {
      const firstField = Object.keys(errors)[0] as keyof PipelineInput;
      return NextResponse.json(
        { error: errors[firstField], fieldErrors: errors },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("pipeline")
      .update({
        firma: input.firma.trim(),
        volumen_eur: Number(input.volumen_eur),
        angebotsdatum: input.angebotsdatum,
        status: input.status,
        notiz: input.notiz.trim(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: `Supabase-Fehler: ${error.message}` },
        { status: 400 }
      );
    }

    revalidatePath("/pipeline");
    revalidatePath(`/pipeline/${id}`);

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
    const { id } = await params;

    const { error } = await supabase
      .from("pipeline")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: `Supabase-Fehler: ${error.message}` },
        { status: 400 }
      );
    }

    revalidatePath("/pipeline");
    revalidatePath(`/pipeline/${id}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Loeschen fehlgeschlagen, bitte erneut versuchen" },
      { status: 500 }
    );
  }
}
