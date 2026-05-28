export type KundenStatus = 'aktiv' | 'in_wartung' | 'beschwerde';

export type PipelineStatus = 'erstkontakt' | 'angebot_raus' | 'verhandlung' | 'gewonnen' | 'verloren' | 'loeschbar';

export interface Kunde {
  id: string;
  firma: string;
  ansprechpartner: string;
  branche: string;
  anlagengroesse_kwp: number;
  status: KundenStatus;
  letzter_kontakt: string;
  telefon: string;
  email: string;
  notiz: string;
}

export type Bearbeiter = 'Anna' | 'Ben' | 'Clara';

export interface PipelineEintrag {
  id: string;
  customer_id: string;
  firma: string;
  volumen_eur: number;
  angebotsdatum: string;
  status: PipelineStatus;
  notiz: string;
  bearbeiter: string; // freitext in DB, UI dropdown beschraenkt auf Anna/Ben/Clara
  // Felder via JOIN aus kunden (optional, koennen null sein wenn Kunde-Daten fehlen)
  ansprechpartner?: string;
  branche?: string;
  anlagengroesse_kwp?: number;
}
