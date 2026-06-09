import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

const LEADS_PATH = path.join(process.cwd(), "data", "leads.jsonl");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LeadType = "rechner" | "satellit";

type LeadInput = {
  type: LeadType;
  email?: string;
  plz?: string;
  hausnummer?: string;
  dachflaecheM2?: number;
  verbrauchKwh?: number;
  strompreisCt?: number;
  dachtyp?: string;
  bestehendePv?: boolean;
};

function isLeadInput(value: unknown): value is LeadInput {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return v.type === "rechner" || v.type === "satellit";
}

function validate(input: LeadInput): string | null {
  if (input.email && !EMAIL_RE.test(input.email)) return "E-Mail ungueltig";
  if (input.plz && !/^\d{5}$/.test(input.plz)) return "PLZ muss 5 Ziffern haben";
  if (input.type === "satellit" && !input.plz) return "PLZ erforderlich";
  if (input.type === "rechner") {
    if (!input.email) return "E-Mail erforderlich";
    if (!input.dachflaecheM2 || input.dachflaecheM2 < 50)
      return "Dachflaeche mindestens 50 m2";
    if (!input.verbrauchKwh || input.verbrauchKwh < 1000)
      return "Verbrauch mindestens 1000 kWh";
  }
  return null;
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Body muss JSON sein" }, { status: 400 });
  }

  if (!isLeadInput(raw)) {
    return NextResponse.json(
      { error: "Feld 'type' muss 'rechner' oder 'satellit' sein" },
      { status: 400 },
    );
  }

  const err = validate(raw);
  if (err) return NextResponse.json({ error: err }, { status: 422 });

  const record = {
    ts: new Date().toISOString(),
    ip: request.headers.get("x-forwarded-for") ?? null,
    ...raw,
  };

  try {
    await fs.mkdir(path.dirname(LEADS_PATH), { recursive: true });
    await fs.appendFile(LEADS_PATH, JSON.stringify(record) + "\n", "utf8");
  } catch (e) {
    console.error("Lead-Persistenz fehlgeschlagen:", e);
    return NextResponse.json(
      { error: "Server-Fehler beim Speichern" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
