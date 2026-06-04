"use client";

import { Aktivitaet } from "@/types";
import { Phone, Mail, Calendar } from "lucide-react";

const TYP_CONFIG: Record<
  Aktivitaet["typ"],
  { label: string; icon: typeof Phone; className: string }
> = {
  Anruf: { label: "Anruf", icon: Phone, className: "text-blue-600" },
  "E-Mail": { label: "E-Mail", icon: Mail, className: "text-green-600" },
  Termin: { label: "Termin", icon: Calendar, className: "text-purple-600" },
};

function formatDatum(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AktivitaetenClient({
  entries,
}: {
  entries: Aktivitaet[];
}) {
  return (
    <details className="mt-4 rounded-lg border border-gray-200 bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-gray-900 hover:bg-gray-50">
        Aktivitäten ({entries.length})
      </summary>

      <div className="border-t border-gray-200 px-4 py-3">
        {entries.length === 0 ? (
          <p className="text-sm text-gray-500">
            Noch keine Aktivitäten erfasst.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="px-2 py-2 font-medium">Datum</th>
                  <th className="px-2 py-2 font-medium">Typ</th>
                  <th className="px-2 py-2 font-medium">Notiz</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const cfg = TYP_CONFIG[entry.typ];
                  const Icon = cfg.icon;
                  return (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="whitespace-nowrap px-2 py-2 text-gray-700">
                        {formatDatum(entry.datum)}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2">
                        <span className={`inline-flex items-center gap-1 ${cfg.className}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-gray-700">
                        {entry.notiz ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </details>
  );
}
