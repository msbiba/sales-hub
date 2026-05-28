import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { validatePipeline, type PipelineInput } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<PipelineInput>;

    const input: PipelineInput = {
      customer_id: String(body.customer_id ?? ""),
      firma: String(body.firma ?? ""),
      volumen_eur: String(body.volumen_eur ?? ""),
      angebotsdatum: String(body.angebotsdatum ?? ""),
      status: String(body.status ?? ""),
      notiz: String(body.notiz ?? ""),
      bearbeiter: String(body.bearbeiter ?? ""),
    };

    const errors = validatePipeline(input);
    if (Object.keys(errors).length > 0) {
      const firstField = Object.keys(errors)[0] as keyof PipelineInput;
      return NextResponse.json(
        { error: errors[firstField], fieldErrors: errors },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("pipeline")
      .insert({
        customer_id: input.customer_id,
        firma: input.firma.trim(),
        volumen_eur: Number(input.volumen_eur),
        angebotsdatum: input.angebotsdatum,
        status: input.status,
        notiz: input.notiz.trim(),
        bearbeiter: input.bearbeiter,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Supabase-Fehler: ${error.message}` },
        { status: 400 }
      );
    }

    revalidatePath("/pipeline");

    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json(
      { error: "Speichern fehlgeschlagen, bitte erneut versuchen" },
      { status: 500 }
    );
  }
}
