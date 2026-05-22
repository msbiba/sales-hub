import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { PipelineEintrag } from "@/types";
import { validatePipeline, type PipelineInput } from "@/lib/validation";

const CSV_PATH = path.join(process.cwd(), "data", "solarwerk_pipeline.csv");
const COLUMNS = [
  "id",
  "firma",
  "ansprechpartner",
  "branche",
  "anlagengroesse_kwp",
  "volumen_eur",
  "angebotsdatum",
  "status",
  "notiz",
];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Ungueltige Id" }, { status: 400 });
    }

    const body = (await request.json()) as Partial<PipelineInput>;

    const input: PipelineInput = {
      firma: String(body.firma ?? ""),
      ansprechpartner: String(body.ansprechpartner ?? ""),
      branche: String(body.branche ?? ""),
      anlagengroesse_kwp: String(body.anlagengroesse_kwp ?? ""),
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

    const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
    const parsed = Papa.parse<PipelineEintrag>(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    const rows = parsed.data;
    const idx = rows.findIndex((r) => Number(r.id) === id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Pipeline-Eintrag nicht gefunden" },
        { status: 404 }
      );
    }

    rows[idx] = {
      ...rows[idx],
      firma: input.firma.trim(),
      ansprechpartner: input.ansprechpartner.trim(),
      branche: input.branche.trim(),
      anlagengroesse_kwp: Number(input.anlagengroesse_kwp),
      volumen_eur: Number(input.volumen_eur),
      angebotsdatum: input.angebotsdatum,
      status: input.status as PipelineEintrag["status"],
      notiz: input.notiz.trim(),
    };

    const csv = Papa.unparse(rows, { columns: COLUMNS, newline: "\r\n" });
    fs.writeFileSync(CSV_PATH, csv);

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
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Ungueltige Id" }, { status: 400 });
    }

    const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
    const parsed = Papa.parse<PipelineEintrag>(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    const rows = parsed.data;
    const idx = rows.findIndex((r) => Number(r.id) === id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Pipeline-Eintrag nicht gefunden" },
        { status: 404 }
      );
    }

    rows.splice(idx, 1);

    const csv = Papa.unparse(rows, { columns: COLUMNS, newline: "\r\n" });
    fs.writeFileSync(CSV_PATH, csv);

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
