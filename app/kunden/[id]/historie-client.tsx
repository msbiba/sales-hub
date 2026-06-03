"use client";

import { HistoryEntry } from "@/lib/history";

const TYP_LABEL: Record<HistoryEntry["event_type"], string> = {
  insert: "Angelegt",
  update: "Geändert",
};

function formatDatum(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatWert(wert: string | null): string {
  return wert === null || wert === "" ? "—" : wert;
}

function formatBeschreibung(entry: HistoryEntry): string {
  if (entry.event_type === "insert") {
    return "Datensatz angelegt";
  }
  // update
  return `${entry.field}: „${formatWert(entry.old_value)}" → „${formatWert(entry.new_value)}"`;
}

export default function HistorieClient({ entries }: { entries: HistoryEntry[] }) {
  return (
    <details className="mt-8 rounded-lg border border-gray-200 bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-gray-900 hover:bg-gray-50">
        Historie ({entries.length})
      </summary>

      <div className="border-t border-gray-200 px-4 py-3">
        {entries.length === 0 ? (
          <p className="text-sm text-gray-500">Noch keine Änderungen erfasst.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="px-2 py-2 font-medium">Datum/Zeit</th>
                  <th className="px-2 py-2 font-medium">Typ</th>
                  <th className="px-2 py-2 font-medium">Autor</th>
                  <th className="px-2 py-2 font-medium">Beschreibung</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-2 py-2 text-gray-700">
                      {formatDatum(entry.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-gray-700">
                      {TYP_LABEL[entry.event_type]}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-gray-700">
                      {entry.author_email ?? "System"}
                    </td>
                    <td className="px-2 py-2 text-gray-700">
                      {formatBeschreibung(entry)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </details>
  );
}
