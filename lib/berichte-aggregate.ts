import { Kunde, PipelineEintrag } from "@/types";
import { BerichteFilter } from "./berichte-filter";

export const kundenStatusLabels: Record<string, string> = {
  aktiv: "Aktiv",
  in_wartung: "In Wartung",
  beschwerde: "Beschwerde",
};

export const pipelineStatusLabels: Record<string, string> = {
  erstkontakt: "Erstkontakt",
  angebot_raus: "Angebot raus",
  verhandlung: "Verhandlung",
  gewonnen: "Gewonnen",
  verloren: "Verloren",
  loeschbar: "Loeschbar",
};

// Filter Kunden basierend auf Filter (AND-Logik)
export function filterKunden(
  kunden: Kunde[],
  pipeline: PipelineEintrag[],
  filter: BerichteFilter
): Kunde[] {
  return kunden.filter((k) => {
    if (filter.ks && k.status !== filter.ks) return false;
    if (filter.ps || filter.bs) {
      const hatPassendenPipelineEintrag = pipeline.some(
        (p) =>
          p.customer_id === k.id &&
          (!filter.ps || p.status === filter.ps) &&
          (!filter.bs || p.bearbeiter === filter.bs)
      );
      if (!hatPassendenPipelineEintrag) return false;
    }
    return true;
  });
}

// Filter Pipeline basierend auf Filter (AND-Logik)
export function filterPipeline(
  pipeline: PipelineEintrag[],
  kunden: Kunde[],
  filter: BerichteFilter
): PipelineEintrag[] {
  const kundenStatusMap = new Map(kunden.map((k) => [k.id, k.status]));

  return pipeline.filter((p) => {
    if (filter.ps && p.status !== filter.ps) return false;
    if (filter.bs && p.bearbeiter !== filter.bs) return false;
    if (filter.ks) {
      const kStatus = kundenStatusMap.get(p.customer_id);
      if (kStatus !== filter.ks) return false;
    }
    return true;
  });
}

// Count nach Status mit Labels (auch wenn 0)
export function countByStatus<T extends { status: string }>(
  items: T[],
  labels: Record<string, string>
): { name: string; key: string; value: number }[] {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.status] = (counts[item.status] || 0) + 1;
  }
  return Object.entries(labels).map(([key, name]) => ({
    name,
    key,
    value: counts[key] || 0,
  }));
}

// TTM-Auftragsvolumen
export function berechneAuftragsvolumenTTM(
  pipeline: PipelineEintrag[],
  statusFilter: string | null
): { wert: number; tooltip: string } {
  const heute = new Date();
  const ttmGrenze = new Date(
    heute.getFullYear() - 1,
    heute.getMonth(),
    heute.getDate()
  );

  const gefiltert = pipeline.filter((p) => {
    const datum = new Date(p.angebotsdatum);
    if (datum < ttmGrenze) return false;
    if (datum > heute) return false; // Zukunft ausgeschlossen
    if (statusFilter) return p.status === statusFilter;
    return p.status !== "verloren" && p.status !== "loeschbar";
  });

  const wert = gefiltert.reduce((sum, p) => sum + (p.volumen_eur ?? 0), 0);
  const tooltip = statusFilter
    ? `TTM, Status: ${pipelineStatusLabels[statusFilter] ?? statusFilter}`
    : "TTM, ohne verloren/loeschbar";

  return { wert, tooltip };
}

// Bearbeiter-Volumen sortiert absteigend
// Listet ALLE bekannten Bearbeiter, auch mit 0 Volumen
export function berechneBearbeiterVolumen(
  pipeline: PipelineEintrag[],
  statusFilter: string | null,
  alleBearbeiter: string[] = ["Anna", "Ben", "Clara"]
): { bearbeiter: string; volumen: number }[] {
  const effektiverStatus = statusFilter ?? "gewonnen";
  const map = new Map<string, number>();

  // Init alle bekannten Bearbeiter mit 0
  for (const b of alleBearbeiter) {
    map.set(b, 0);
  }

  // Plus alle in Daten gefundenen (z.B. neue Bearbeiter aus DB)
  for (const p of pipeline) {
    if (!map.has(p.bearbeiter)) map.set(p.bearbeiter, 0);
  }

  // Volumen aufsummieren fuer effektiven Status
  for (const p of pipeline) {
    if (p.status !== effektiverStatus) continue;
    map.set(p.bearbeiter, (map.get(p.bearbeiter) ?? 0) + p.volumen_eur);
  }

  return Array.from(map.entries())
    .map(([bearbeiter, volumen]) => ({ bearbeiter, volumen }))
    .sort((a, b) => b.volumen - a.volumen);
}

export function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
