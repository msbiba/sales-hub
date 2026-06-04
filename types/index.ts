export type KundenStatus = 'aktiv' | 'in_wartung' | 'beschwerde' | 'interessent';

export type PipelineStatus = 'erstkontakt' | 'angebot_raus' | 'verhandlung' | 'gewonnen' | 'verloren' | 'loeschbar';

export type UserRole = 'admin' | 'bearbeiter' | 'buchhaltung';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

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
  bearbeiter_id: string | null;
  pipeline_stufe: string | null;
  vertriebler: string | null;
  produkt_interesse: string | null;
}

export type AktivitaetenTyp = 'Anruf' | 'Termin' | 'E-Mail';

export interface Aktivitaet {
  id: string;
  kunde_id: string;
  typ: AktivitaetenTyp;
  datum: string;
  notiz: string | null;
  created_at: string;
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
  bearbeiter: string; // freitext in DB, UI dropdown beschraenkt auf Anna/Ben/Clara (legacy snapshot)
  bearbeiter_id: string | null; // FK auf auth.users(id) (RBAC)
  // Felder via JOIN aus kunden (optional, koennen null sein wenn Kunde-Daten fehlen)
  ansprechpartner?: string;
  branche?: string;
  anlagengroesse_kwp?: number;
}
