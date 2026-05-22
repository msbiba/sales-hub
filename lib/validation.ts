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
