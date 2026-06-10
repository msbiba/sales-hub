"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, CheckCircle, AlertTriangle } from "lucide-react";
import { Kunde, KundenStatus } from "@/types";
import KundeStatusBadge from "@/components/KundeStatusBadge";
import DualRangeSlider from "@/components/DualRangeSlider";

export default function DashboardClient({ kunden }: { kunden: Kunde[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<KundenStatus | "alle">(
    "alle"
  );
  const [suchbegriff, setSuchbegriff] = useState("");
  const [brancheFilter, setBrancheFilter] = useState<string>("alle");
  const [sortKey, setSortKey] = useState<keyof Kunde | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const branchen = useMemo(
    () =>
      Array.from(new Set(kunden.map((k) => k.branche).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b, "de")
      ),
    [kunden]
  );

  const { kwpMin, kwpMax } = useMemo(() => {
    const werte = kunden
      .map((k) => Number(k.anlagengroesse_kwp))
      .filter((n) => Number.isFinite(n));
    if (werte.length === 0) return { kwpMin: 0, kwpMax: 0 };
    return { kwpMin: Math.min(...werte), kwpMax: Math.max(...werte) };
  }, [kunden]);

  const [kwpRange, setKwpRange] = useState<[number, number]>([kwpMin, kwpMax]);

  function resetFilter() {
    setStatusFilter("alle");
    setSuchbegriff("");
    setBrancheFilter("alle");
    setKwpRange([kwpMin, kwpMax]);
  }

  function handleSort(key: keyof Kunde) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const gesamt = kunden.length;
  const aktive = kunden.filter((k) => k.status === "aktiv").length;
  const beschwerden = kunden.filter((k) => k.status === "beschwerde").length;

  const gefilterteKunden = kunden.filter((k) => {
    const statusPasst =
      statusFilter === "alle" || k.status === statusFilter;
    const suchPasst =
      suchbegriff === "" ||
      k.firma.toLowerCase().includes(suchbegriff.toLowerCase()) ||
      k.ansprechpartner.toLowerCase().includes(suchbegriff.toLowerCase());
    const branchePasst =
      brancheFilter === "alle" || k.branche === brancheFilter;
    const kwp = Number(k.anlagengroesse_kwp);
    const kwpPasst =
      !Number.isFinite(kwp) ||
      (kwp >= kwpRange[0] && kwp <= kwpRange[1]);
    return statusPasst && suchPasst && branchePasst && kwpPasst;
  });

  const sortierteKunden = [...gefilterteKunden].sort((a, b) => {
    if (!sortKey) return 0;
    const dir = sortDir === "asc" ? 1 : -1;
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv), "de") * dir;
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Gesamtkunden</p>
              <p className="text-2xl font-bold">{gesamt}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Aktive Kunden</p>
              <p className="text-2xl font-bold">{aktive}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Beschwerden</p>
              <p className="text-2xl font-bold">{beschwerden}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as KundenStatus | "alle")
          }
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="alle">Alle Status</option>
          <option value="aktiv">Aktiv</option>
          <option value="in_wartung">In Wartung</option>
          <option value="beschwerde">Beschwerde</option>
        </select>
        <input
          type="text"
          placeholder="Suche nach Firma oder Ansprechpartner..."
          value={suchbegriff}
          onChange={(e) => setSuchbegriff(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-80"
        />
        <select
          value={brancheFilter}
          onChange={(e) => setBrancheFilter(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="alle">Alle Branchen</option>
          {branchen.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <DualRangeSlider
          min={kwpMin}
          max={kwpMax}
          value={kwpRange}
          onChange={setKwpRange}
          label="Anlagengroesse"
          format={(n) => `${n} kWp`}
        />
        <button
          type="button"
          onClick={resetFilter}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Filter zurücksetzen
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {([
                ["firma", "Firma"],
                ["ansprechpartner", "Ansprechpartner"],
                ["branche", "Branche"],
                ["anlagengroesse_kwp", "Anlagengroesse (kWp)"],
                ["status", "Status"],
                ["letzter_kontakt", "Letzter Kontakt"],
              ] as [keyof Kunde, string][]).map(([key, label]) => (
                <th key={key} className="px-4 py-3">
                  <button
                    onClick={() => handleSort(key)}
                    className="flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900"
                  >
                    {label}
                    {sortKey === key && (
                      <span className="text-blue-600">{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortierteKunden.map((kunde) => (
              <tr
                key={kunde.id}
                role="link"
                tabIndex={0}
                aria-label={`Kunde ${kunde.firma} öffnen`}
                onClick={() => router.push(`/kunden/${kunde.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/kunden/${kunde.id}`);
                  }
                }}
                className="cursor-pointer border-b border-gray-100 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
              >
                <td className="px-4 py-3 font-medium">{kunde.firma}</td>
                <td className="px-4 py-3">{kunde.ansprechpartner}</td>
                <td className="px-4 py-3">{kunde.branche}</td>
                <td className="px-4 py-3">{kunde.anlagengroesse_kwp}</td>
                <td className="px-4 py-3">
                  <KundeStatusBadge status={kunde.status} />
                </td>
                <td className="px-4 py-3">{kunde.letzter_kontakt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortierteKunden.length === 0 && (
          <p className="px-4 py-8 text-center text-gray-400">
            Keine Kunden gefunden.
          </p>
        )}
      </div>
    </div>
  );
}
