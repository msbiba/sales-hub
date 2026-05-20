import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { Kunde } from "@/types";

const CSV_PATH = path.join(process.cwd(), "data", "solarwerk_kunden.csv");

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

    const allowedStatus = ["aktiv", "in_wartung", "beschwerde"];
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

    const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
    const parsed = Papa.parse<Kunde>(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    const rows = parsed.data;
    const idx = rows.findIndex((r) => Number(r.id) === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Kunde nicht gefunden" }, { status: 404 });
    }

    rows[idx] = {
      ...rows[idx],
      firma: String(body.firma).trim(),
      ansprechpartner: String(body.ansprechpartner ?? "").trim(),
      branche: String(body.branche ?? "").trim(),
      anlagengroesse_kwp:
        body.anlagengroesse_kwp === "" || body.anlagengroesse_kwp == null
          ? (0 as number)
          : Number(body.anlagengroesse_kwp),
      status: body.status ?? rows[idx].status,
      letzter_kontakt: body.letzter_kontakt ?? rows[idx].letzter_kontakt,
      telefon: String(body.telefon ?? "").trim(),
      email: String(body.email ?? "").trim(),
      notiz: String(body.notiz ?? "").trim(),
    };

    const csv = Papa.unparse(rows, {
      columns: [
        "id",
        "firma",
        "ansprechpartner",
        "branche",
        "anlagengroesse_kwp",
        "status",
        "letzter_kontakt",
        "telefon",
        "email",
        "notiz",
      ],
      newline: "\r\n",
    });

    fs.writeFileSync(CSV_PATH, csv);

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
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Ungueltige Id" }, { status: 400 });
    }

    const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
    const parsed = Papa.parse<Kunde>(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    const rows = parsed.data;
    const idx = rows.findIndex((r) => Number(r.id) === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Kunde nicht gefunden" }, { status: 404 });
    }

    rows.splice(idx, 1);

    const csv = Papa.unparse(rows, {
      columns: [
        "id",
        "firma",
        "ansprechpartner",
        "branche",
        "anlagengroesse_kwp",
        "status",
        "letzter_kontakt",
        "telefon",
        "email",
        "notiz",
      ],
      newline: "\r\n",
    });

    fs.writeFileSync(CSV_PATH, csv);

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
