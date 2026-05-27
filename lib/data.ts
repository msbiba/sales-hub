import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Kunde, PipelineEintrag } from '@/types';
import { supabase } from './supabase';

let mockMode = 'normal' // 'normal'|'loading'|'error'|'empty'

// --- Kunden: Supabase ---

async function ladeKundenAusSupabase(): Promise<Kunde[]> {
  const { data, error } = await supabase
    .from('kunden')
    .select('id, firma, ansprechpartner, branche, anlagengroesse_kwp, status, letzter_kontakt, telefon, email, notiz');

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

  const { data, error } = await supabase
    .from('kunden')
    .select('id, firma, ansprechpartner, branche, anlagengroesse_kwp, status, letzter_kontakt, telefon, email, notiz')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Kunde;
}

// --- Pipeline: CSV (unveraendert) ---

function ladePipelineAusCsv(): PipelineEintrag[] {
  const filePath = path.join(process.cwd(), 'data', 'solarwerk_pipeline.csv');
  const csv = fs.readFileSync(filePath, 'utf-8');
  const result = Papa.parse<PipelineEintrag>(csv, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  return result.data;
}

export async function getPipeline(mode: string = mockMode): Promise<PipelineEintrag[]> {
  await new Promise(r => setTimeout(r, 1500))
  if (mode === 'loading') await new Promise(() => {}) // never resolves
  if (mode === 'error') throw new Error('Mock-Fehler: Pipeline')
  if (mode === 'empty') return []
  return ladePipelineAusCsv()
}

export async function getPipelineEintrag(id: number, mode: string = mockMode): Promise<PipelineEintrag | null> {
  const pipeline = await getPipeline(mode);
  return pipeline.find((e) => e.id === id) ?? null;
}
