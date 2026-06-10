import { getKunden, getPipeline } from "@/lib/data";
import { parseFilter } from "@/lib/berichte-filter";
import { requireRole } from "@/lib/auth/role";
import {
  filterKunden,
  filterPipeline,
  countByStatus,
  berechneAuftragsvolumenTTM,
  berechneBearbeiterVolumen,
  kundenStatusLabels,
  pipelineStatusLabels,
} from "@/lib/berichte-aggregate";
import BerichteClient from "./berichte-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berichte · Solarwerk Sued",
};

export default async function BerichtePage({
  searchParams,
}: {
  searchParams: Promise<{
    ks?: string;
    ps?: string;
    bs?: string;
    mock?: string;
  }>;
}) {
  await requireRole(["admin", "buchhaltung"]);
  const params = await searchParams;
  const mockMode = params.mock ?? "normal";
  const filter = parseFilter(params);

  const [kunden, pipeline] = await Promise.all([
    getKunden(mockMode),
    getPipeline(mockMode),
  ]);

  const kundenGefiltert = filterKunden(kunden, pipeline, filter);
  const pipelineGefiltert = filterPipeline(pipeline, kunden, filter);

  const anzahlKunden = kundenGefiltert.length;
  const auftragsvolumen = berechneAuftragsvolumenTTM(
    pipelineGefiltert,
    filter.ps
  );
  const kundenVerteilung = countByStatus(kundenGefiltert, kundenStatusLabels);
  const pipelineVerteilung = countByStatus(
    pipelineGefiltert,
    pipelineStatusLabels
  );
  const bearbeiterVerteilung = berechneBearbeiterVolumen(
    pipelineGefiltert,
    filter.ps
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Berichte
      </h1>
      <BerichteClient
        filter={filter}
        anzahlKunden={anzahlKunden}
        auftragsvolumen={auftragsvolumen}
        kundenVerteilung={kundenVerteilung}
        pipelineVerteilung={pipelineVerteilung}
        bearbeiterVerteilung={bearbeiterVerteilung}
      />
    </div>
  );
}
