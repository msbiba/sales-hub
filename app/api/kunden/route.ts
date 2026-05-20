import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

const CSV_PATH = path.join(process.cwd(), "data", "solarwerk_kunden.csv");


export async function POST(request: NextRequest) {
  try {
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

    const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
    const lines = csvContent.trimEnd().split("\n");

    let maxId = 0;
    for (let i = 1; i < lines.length; i++) {
      const id = parseInt(lines[i].split(",")[0], 10);
      if (id > maxId) maxId = id;
    }

    const today = new Date().toISOString().split("T")[0];

    const escapeCsv = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const newRow = [
      maxId + 1,
      escapeCsv(body.firma.trim()),
      escapeCsv((body.ansprechpartner || "").trim()),
      escapeCsv((body.branche || "").trim()),
      body.anlagengroesse_kwp || "",
      body.status || "aktiv",
      today,
      escapeCsv((body.telefon || "").trim()),
      escapeCsv((body.email || "").trim()),
      escapeCsv((body.notiz || "").trim()),
    ].join(",");

    fs.appendFileSync(CSV_PATH, "\r\n" + newRow);

    revalidatePath("/");
    revalidatePath("/kunden");

    return NextResponse.json({ success: true, id: maxId + 1 });
  } catch {
    return NextResponse.json(
      { error: "Speichern fehlgeschlagen, bitte erneut versuchen" },
      { status: 500 }
    );
  }
}
