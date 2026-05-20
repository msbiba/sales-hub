import { getKunden, getPipeline } from "@/lib/data";
import BerichteClient from "./berichte-client";

const kundenLabels: Record<string, string> = {
  aktiv: "Aktiv",
  in_wartung: "In Wartung",
  beschwerde: "Beschwerde",
};

const pipelineLabels: Record<string, string> = {
  erstkontakt: "Erstkontakt",
  angebot_raus: "Angebot raus",
  verhandlung: "Verhandlung",
  gewonnen: "Gewonnen",
  verloren: "Verloren",
};

function countByStatus<T extends { status: string }>(
  items: T[],
  labels: Record<string, string>,
) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.status] = (counts[item.status] || 0) + 1;
  }
  return Object.entries(labels).map(([key, name]) => ({
    name,
    value: counts[key] || 0,
  }));
}

export default async function BerichtePage() {
  const kunden = await getKunden();
  const pipeline = getPipeline();

  const kundenVerteilung = countByStatus(kunden, kundenLabels);
  const pipelineVerteilung = countByStatus(pipeline, pipelineLabels);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Berichte</h1>
      <BerichteClient
        kundenVerteilung={kundenVerteilung}
        pipelineVerteilung={pipelineVerteilung}
      />
    </div>
  );
}
