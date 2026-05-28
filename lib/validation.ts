export type KundeInput = {
  firma: string;
  ansprechpartner: string;
  branche: string;
  anlagengroesse_kwp: string;
  telefon: string;
  email: string;
};

export type ValidationErrors = Partial<Record<keyof KundeInput, string>>;

export function validateKunde(data: KundeInput): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.firma.trim()) {
    errors.firma = "Firma darf nicht leer sein.";
  }

  if (!data.email.includes("@")) {
    errors.email = "E-Mail muss ein @-Zeichen enthalten.";
  }

  if (data.ansprechpartner.trim().length < 4) {
    errors.ansprechpartner = "Ansprechpartner muss mindestens 4 Zeichen enthalten.";
  }

  if (data.branche.trim().length < 4) {
    errors.branche = "Branche muss mindestens 4 Zeichen enthalten.";
  }

  const kwp = Number(data.anlagengroesse_kwp);
  if (!Number.isFinite(kwp) || kwp < 10 || kwp > 10000) {
    errors.anlagengroesse_kwp = "Anlagengroesse muss zwischen 10 und 10000 liegen.";
  }

  if (!data.telefon.startsWith("+")) {
    errors.telefon = "Telefon muss mit + beginnen.";
  }

  return errors;
}

export type PipelineStatus =
  | "erstkontakt"
  | "angebot_raus"
  | "verhandlung"
  | "gewonnen"
  | "verloren"
  | "loeschbar";

export type PipelineInput = {
  customer_id: string;
  firma: string;
  volumen_eur: string;
  angebotsdatum: string;
  status: string;
  notiz: string;
  bearbeiter: string;
};

export const BEARBEITER_LISTE = ["Anna", "Ben", "Clara"] as const;
export type BearbeiterName = (typeof BEARBEITER_LISTE)[number];

export type PipelineErrors = Partial<Record<keyof PipelineInput, string>>;

const PIPELINE_STATUSES: readonly PipelineStatus[] = [
  "erstkontakt",
  "angebot_raus",
  "verhandlung",
  "gewonnen",
  "verloren",
  "loeschbar",
];

export function validatePipeline(data: PipelineInput): PipelineErrors {
  const errors: PipelineErrors = {};

  if (!data.customer_id || !data.customer_id.trim()) {
    errors.customer_id = "Kunde ist erforderlich.";
  }

  if (!data.firma.trim()) {
    errors.firma = "Firma darf nicht leer sein.";
  }

  const volumen = Number(data.volumen_eur);
  if (!Number.isFinite(volumen) || volumen <= 0 || volumen > 10_000_000) {
    errors.volumen_eur = "Volumen muss zwischen 1 und 10.000.000 EUR liegen.";
  }

  if (!data.angebotsdatum) {
    errors.angebotsdatum = "Angebotsdatum ist erforderlich.";
  } else {
    const d = new Date(data.angebotsdatum);
    if (Number.isNaN(d.getTime())) {
      errors.angebotsdatum = "Ungueltiges Datum.";
    } else {
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      if (d.getTime() > maxDate.getTime()) {
        errors.angebotsdatum =
          "Datum darf hoechstens 1 Jahr in der Zukunft liegen.";
      }
    }
  }

  if (!PIPELINE_STATUSES.includes(data.status as PipelineStatus)) {
    errors.status = "Bitte Status auswaehlen.";
  }

  if (!data.bearbeiter || !BEARBEITER_LISTE.includes(data.bearbeiter as BearbeiterName)) {
    errors.bearbeiter = "Bearbeiter ist erforderlich (Anna, Ben oder Clara).";
  }

  return errors;
}
