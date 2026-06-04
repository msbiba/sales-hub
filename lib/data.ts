import { Kunde, PipelineEintrag } from '@/types';
import { createSupabaseServerClient } from './supabase/server';

const mockMode = 'normal' // 'normal'|'loading'|'error'|'empty'

// --- Kunden: Supabase ---

async function ladeKundenAusSupabase(): Promise<Kunde[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('kunden')
    .select('id, firma, ansprechpartner, branche, anlagengroesse_kwp, status, letzter_kontakt, telefon, email, notiz, pipeline_stufe, vertriebler, produkt_interesse');

  if (error) throw new Error(`Supabase-Fehler: ${error.message}`);
  return data as Kunde[];
}

export async function getKunden(mode: string = mockMode): Promise<Kunde[]> {
  await new Promise(r => setTimeout(r, 1500))
  if (mode === 'loading') await new Promise(() => {}) // never resolves
  if (mode === 'error') throw new Error('Mock-Fehler')
  if (mode === 'empty') return []
  return ladeKundenAusSupabase()
}

export async function getKunde(id: string, mode: string = mockMode): Promise<Kunde | null> {
  await new Promise(r => setTimeout(r, 1500))
  if (mode === 'loading') await new Promise(() => {}) // never resolves
  if (mode === 'error') throw new Error('Mock-Fehler')
  if (mode === 'empty') return null

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('kunden')
    .select('id, firma, ansprechpartner, branche, anlagengroesse_kwp, status, letzter_kontakt, telefon, email, notiz, pipeline_stufe, vertriebler, produkt_interesse')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Kunde;
}

// --- Pipeline: Hilfsfunktionen ---

export async function hatPipelineEintraege(kundeId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from('pipeline')
    .select('id', { count: 'exact', head: true })
    .eq('customer_id', kundeId);

  if (error) return false;
  return (count ?? 0) > 0;
}

// --- Pipeline: Supabase mit JOIN auf kunden ---

type PipelineRow = {
  id: string;
  customer_id: string;
  firma: string;
  volumen_eur: number;
  angebotsdatum: string;
  status: PipelineEintrag['status'];
  notiz: string | null;
  bearbeiter: string;
  bearbeiter_id: string | null;
  kunden: {
    ansprechpartner: string | null;
    branche: string | null;
    anlagengroesse_kwp: number | null;
    status: string | null;
  } | null;
};

async function ladePipelineAusSupabase(): Promise<PipelineEintrag[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('pipeline')
    .select('id, customer_id, firma, volumen_eur, angebotsdatum, status, notiz, bearbeiter, bearbeiter_id, kunden(ansprechpartner, branche, anlagengroesse_kwp, status)');

  if (error) throw new Error(`Supabase-Fehler: ${error.message}`);

  return (data as unknown as PipelineRow[]).map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    firma: row.firma,
    volumen_eur: row.volumen_eur,
    angebotsdatum: row.angebotsdatum,
    status: row.status,
    notiz: row.notiz ?? '',
    bearbeiter: row.bearbeiter,
    bearbeiter_id: row.bearbeiter_id ?? null,
    ansprechpartner: row.kunden?.ansprechpartner ?? undefined,
    branche: row.kunden?.branche ?? undefined,
    anlagengroesse_kwp: row.kunden?.anlagengroesse_kwp ?? undefined,
  }));
}

export async function getPipeline(mode: string = mockMode): Promise<PipelineEintrag[]> {
  await new Promise(r => setTimeout(r, 1500))
  if (mode === 'loading') await new Promise(() => {}) // never resolves
  if (mode === 'error') throw new Error('Mock-Fehler: Pipeline')
  if (mode === 'empty') return []
  return ladePipelineAusSupabase()
}

export async function getPipelineEintrag(id: string, mode: string = mockMode): Promise<PipelineEintrag | null> {
  await new Promise(r => setTimeout(r, 1500))
  if (mode === 'loading') await new Promise(() => {}) // never resolves
  if (mode === 'error') throw new Error('Mock-Fehler: Pipeline')
  if (mode === 'empty') return null

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('pipeline')
    .select('id, customer_id, firma, volumen_eur, angebotsdatum, status, notiz, bearbeiter, bearbeiter_id, kunden(ansprechpartner, branche, anlagengroesse_kwp, status)')
    .eq('id', id)
    .single();

  if (error) return null;
  const row = data as unknown as PipelineRow;
  return {
    id: row.id,
    customer_id: row.customer_id,
    firma: row.firma,
    volumen_eur: row.volumen_eur,
    angebotsdatum: row.angebotsdatum,
    status: row.status,
    notiz: row.notiz ?? '',
    bearbeiter: row.bearbeiter,
    bearbeiter_id: row.bearbeiter_id ?? null,
    ansprechpartner: row.kunden?.ansprechpartner ?? undefined,
    branche: row.kunden?.branche ?? undefined,
    anlagengroesse_kwp: row.kunden?.anlagengroesse_kwp ?? undefined,
  };
}
