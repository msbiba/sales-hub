import Link from "next/link";
import { getPipeline } from "@/lib/data";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default function PipelinePage() {
  const eintraege = getPipeline();

  const offeneAngebote = eintraege.filter((e) => e.status === "angebot_raus").length;
  const pipelineVolumen = eintraege
    .filter((e) => e.status !== "verloren")
    .reduce((sum, e) => sum + e.volumen_eur, 0);
  const gewonnenDiesenMonat = eintraege.filter((e) => {
    if (e.status !== "gewonnen") return false;
    const d = new Date(e.angebotsdatum);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const formatEur = (n: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  const stats = [
    { label: "Offene Angebote", value: offeneAngebote },
    { label: "Pipeline-Volumen", value: formatEur(pipelineVolumen) },
    { label: "Gewonnen diesen Monat", value: gewonnenDiesenMonat },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Pipeline-Übersicht</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Pipeline-Eintraege</h2>
        <Link
          href="/pipeline/neu"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Neuen Pipeline-Eintrag anlegen
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Firma", "Anlagengröße kWp", "Volumen €", "Angebotsdatum", "Status"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {eintraege.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">
                  <Link
                    href={`/pipeline/${e.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {e.firma}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{e.anlagengroesse_kwp}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatEur(e.volumen_eur)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{e.angebotsdatum}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={e.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
