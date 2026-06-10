"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import DualRangeSlider from "@/components/DualRangeSlider";
import { PipelineEintrag, PipelineStatus } from "@/types";

type SortKey = keyof Pick<
  PipelineEintrag,
  "firma" | "anlagengroesse_kwp" | "volumen_eur" | "angebotsdatum" | "status"
>;

const formatEur = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export default function PipelineClient({
  eintraege,
}: {
  eintraege: PipelineEintrag[];
}) {
  const [statusFilter, setStatusFilter] = useState<PipelineStatus | "alle">(
    "alle"
  );
  const [suchbegriff, setSuchbegriff] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const { kwpMin, kwpMax, eurMin, eurMax } = useMemo(() => {
    const kwp = eintraege
      .map((e) => Number(e.anlagengroesse_kwp))
      .filter((n) => Number.isFinite(n));
    const eur = eintraege
      .map((e) => Number(e.volumen_eur))
      .filter((n) => Number.isFinite(n));
    return {
      kwpMin: kwp.length ? Math.min(...kwp) : 0,
      kwpMax: kwp.length ? Math.max(...kwp) : 0,
      eurMin: eur.length ? Math.min(...eur) : 0,
      eurMax: eur.length ? Math.max(...eur) : 0,
    };
  }, [eintraege]);

  const [kwpRange, setKwpRange] = useState<[number, number]>([kwpMin, kwpMax]);
  const [eurRange, setEurRange] = useState<[number, number]>([eurMin, eurMax]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function resetFilter() {
    setStatusFilter("alle");
    setSuchbegriff("");
    setKwpRange([kwpMin, kwpMax]);
    setEurRange([eurMin, eurMax]);
  }

  const gefiltert = eintraege.filter((e) => {
    const statusPasst =
      statusFilter === "alle" || e.status === statusFilter;
    const suchPasst =
      suchbegriff === "" ||
      e.firma.toLowerCase().includes(suchbegriff.toLowerCase());
    const kwp = Number(e.anlagengroesse_kwp);
    const kwpPasst =
      !Number.isFinite(kwp) || (kwp >= kwpRange[0] && kwp <= kwpRange[1]);
    const eur = Number(e.volumen_eur);
    const eurPasst =
      !Number.isFinite(eur) || (eur >= eurRange[0] && eur <= eurRange[1]);
    return statusPasst && suchPasst && kwpPasst && eurPasst;
  });

  const sortiert = [...gefiltert].sort((a, b) => {
    if (!sortKey) return 0;
    const dir = sortDir === "asc" ? 1 : -1;
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv), "de") * dir;
  });

  const offeneAngebote = eintraege.filter((e) => e.status === "angebot_raus")
    .length;
  const pipelineVolumen = eintraege
    .filter((e) => e.status !== "verloren")
    .reduce((sum, e) => sum + Number(e.volumen_eur || 0), 0);
  const gewonnenDiesenMonat = eintraege.filter((e) => {
    if (e.status !== "gewonnen") return false;
    const d = new Date(e.angebotsdatum);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  }).length;

  const stats = [
    { label: "Offene Angebote", value: offeneAngebote },
    { label: "Pipeline-Volumen", value: formatEur(pipelineVolumen) },
    { label: "Gewonnen diesen Monat", value: gewonnenDiesenMonat },
  ];

  const headers: { key: SortKey; label: string }[] = [
    { key: "firma", label: "Firma" },
    { key: "anlagengroesse_kwp", label: "Anlagengröße kWp" },
    { key: "volumen_eur", label: "Volumen €" },
    { key: "angebotsdatum", label: "Angebotsdatum" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Pipeline-Übersicht</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Pipeline-Eintraege
        </h2>
        <Link
          href="/pipeline/neu"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Neuen Pipeline-Eintrag anlegen
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as PipelineStatus | "alle")
          }
          aria-label="Nach Status filtern"
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="alle">Alle Status</option>
          <option value="erstkontakt">Erstkontakt</option>
          <option value="angebot_raus">Angebot raus</option>
          <option value="verhandlung">Verhandlung</option>
          <option value="gewonnen">Gewonnen</option>
          <option value="verloren">Verloren</option>
          <option value="loeschbar">Loeschbar</option>
        </select>
        <input
          type="text"
          placeholder="Suche nach Firma..."
          aria-label="Suche nach Firma"
          value={suchbegriff}
          onChange={(e) => setSuchbegriff(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-80"
        />
        <DualRangeSlider
          min={kwpMin}
          max={kwpMax}
          value={kwpRange}
          onChange={setKwpRange}
          label="Anlagengroesse"
          format={(n) => `${n} kWp`}
        />
        <DualRangeSlider
          min={eurMin}
          max={eurMax}
          value={eurRange}
          onChange={setEurRange}
          label="Volumen"
          format={formatEur}
        />
        <button
          type="button"
          onClick={resetFilter}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Filter zurücksetzen
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h) => (
                <th
                  key={h.key}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  <button
                    onClick={() => handleSort(h.key)}
                    className="flex items-center gap-1 hover:text-gray-900"
                  >
                    {h.label}
                    {sortKey === h.key && (
                      <span className="text-blue-600">
                        {sortDir === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortiert.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">
                  <Link
                    href={`/pipeline/${e.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {e.firma}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {e.anlagengroesse_kwp}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatEur(Number(e.volumen_eur))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {e.angebotsdatum}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={e.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortiert.length === 0 && (
          <p className="px-6 py-8 text-center text-gray-400">
            Keine Eintraege gefunden.
          </p>
        )}
      </div>
    </div>
  );
}
