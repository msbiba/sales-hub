import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { validatePipeline, type PipelineInput } from "@/lib/validation";

const CSV_PATH = path.join(process.cwd(), "data", "solarwerk_pipeline.csv");

export async function POST(request: NextRequest) {
  try {
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
    const lines = csvContent.trimEnd().split("\n");

    let maxId = 0;
    for (let i = 1; i < lines.length; i++) {
      const id = parseInt(lines[i].split(",")[0], 10);
      if (id > maxId) maxId = id;
    }

    const escapeCsv = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const newRow = [
      maxId + 1,
      escapeCsv(input.firma.trim()),
      escapeCsv(input.ansprechpartner.trim()),
      escapeCsv(input.branche.trim()),
      Number(input.anlagengroesse_kwp),
      Number(input.volumen_eur),
      input.angebotsdatum,
      input.status,
      escapeCsv(input.notiz.trim()),
    ].join(",");

    fs.appendFileSync(CSV_PATH, "\r\n" + newRow);

    revalidatePath("/pipeline");

    return NextResponse.json({ success: true, id: maxId + 1 });
  } catch {
    return NextResponse.json(
      { error: "Speichern fehlgeschlagen, bitte erneut versuchen" },
      { status: 500 }
    );
  }
}
