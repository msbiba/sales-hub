import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Kunde, PipelineEintrag } from '@/types';

export async function getKunden(): Promise<Kunde[]> {
  const filePath = path.join(process.cwd(), 'data', 'solarwerk_kunden.csv');
  const csv = await fs.promises.readFile(filePath, 'utf-8');
  const result = Papa.parse<Kunde>(csv, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  return result.data;
}

export async function getKunde(id: number): Promise<Kunde | null> {
  const kunden = await getKunden();
  return kunden.find((k) => k.id === id) ?? null;
}

export function getPipeline(): PipelineEintrag[] {
  const filePath = path.join(process.cwd(), 'data', 'solarwerk_pipeline.csv');
  const csv = fs.readFileSync(filePath, 'utf-8');
  const result = Papa.parse<PipelineEintrag>(csv, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });
  return result.data;
}

export function getPipelineEintrag(id: number): PipelineEintrag | null {
  return getPipeline().find((e) => e.id === id) ?? null;
}
