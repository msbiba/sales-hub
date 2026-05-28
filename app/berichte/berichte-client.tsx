"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BerichteFilter, isFilterActive } from "@/lib/berichte-filter";
import { formatEur } from "@/lib/berichte-aggregate";

const KUNDEN_COLORS: Record<string, string> = {
  aktiv: "#22c55e",
  in_wartung: "#f59e0b",
  beschwerde: "#ef4444",
};

const PIPELINE_COLORS: Record<string, string> = {
  erstkontakt: "#6b7280",
  angebot_raus: "#3b82f6",
  verhandlung: "#a855f7",
  gewonnen: "#22c55e",
  verloren: "#ef4444",
  loeschbar: "#eab308",
};

type Datum = { name: string; key: string; value: number };
type BearbeiterDatum = { bearbeiter: string; volumen: number };
type Auftragsvolumen = { wert: number; tooltip: string };

export default function BerichteClient({
  filter,
  anzahlKunden,
  auftragsvolumen,
  kundenVerteilung,
  pipelineVerteilung,
  bearbeiterVerteilung,
}: {
  filter: BerichteFilter;
  anzahlKunden: number;
  auftragsvolumen: Auftragsvolumen;
  kundenVerteilung: Datum[];
  pipelineVerteilung: Datum[];
  bearbeiterVerteilung: BearbeiterDatum[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const toggleFilter = (key: "ks" | "ps" | "bs", value: string) => {
    const next = new URLSearchParams(params);
    if (next.get(key) === value) {
      next.delete(key); // Toggle off
    } else {
      next.set(key, value);
    }
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const resetFilter = () => {
    router.push(pathname);
  };

  const filterActive = isFilterActive(filter);

  return (
    <div className="space-y-6">
      {filterActive && (
        <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="text-sm text-blue-900">
            <span className="font-medium">Aktive Filter:</span>{" "}
            {filter.ks && <span className="mr-2">Kunden: {filter.ks}</span>}
            {filter.ps && <span className="mr-2">Pipeline: {filter.ps}</span>}
            {filter.bs && <span className="mr-2">Bearbeiter: {filter.bs}</span>}
          </div>
          <button
            onClick={resetFilter}
            className="rounded-md bg-white border border-blue-300 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            Filterauswahl loeschen
          </button>
        </div>
      )}

      {/* Big Numbers */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Anzahl Kunden</p>
          <p className="mt-2 text-4xl font-bold text-gray-900">
            {anzahlKunden}
          </p>
        </div>
        <div
          className="rounded-lg border border-gray-200 bg-white p-6"
          title={auftragsvolumen.tooltip}
        >
          <p className="text-sm text-gray-500">
            Auftragsvolumen{" "}
            <span className="text-xs text-gray-400">
              ({auftragsvolumen.tooltip})
            </span>
          </p>
          <p className="mt-2 text-4xl font-bold text-gray-900">
            {formatEur(auftragsvolumen.wert)}
          </p>
        </div>
      </div>

      {/* Charts Status */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Kunden nach Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={kundenVerteilung}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                onClick={(d) => toggleFilter("ks", (d as unknown as Datum).key)}
                cursor="pointer"
              >
                {kundenVerteilung.map((d, i) => {
                  const active = filter.ks === d.key;
                  const anyActive = !!filter.ks;
                  return (
                    <Cell
                      key={i}
                      fill={KUNDEN_COLORS[d.key] ?? "#9ca3af"}
                      opacity={anyActive && !active ? 0.3 : 1}
                      stroke={active ? "#1e40af" : "none"}
                      strokeWidth={active ? 3 : 0}
                    />
                  );
                })}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Pipeline nach Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineVerteilung}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="value"
                name="Anzahl"
                radius={[4, 4, 0, 0]}
                onClick={(d) => toggleFilter("ps", (d as unknown as Datum).key)}
                cursor="pointer"
              >
                {pipelineVerteilung.map((d, i) => {
                  const active = filter.ps === d.key;
                  const anyActive = !!filter.ps;
                  return (
                    <Cell
                      key={i}
                      fill={PIPELINE_COLORS[d.key] ?? "#9ca3af"}
                      opacity={anyActive && !active ? 0.3 : 1}
                      stroke={active ? "#1e40af" : "none"}
                      strokeWidth={active ? 3 : 0}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bearbeiter Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-900">
          Bearbeiter nach Volumen{" "}
          <span className="text-sm text-gray-400">
            ({filter.ps ?? "gewonnen"})
          </span>
        </h2>
        {bearbeiterVerteilung.length === 0 ? (
          <p className="py-8 text-center text-gray-400">
            Keine Daten fuer aktuelle Filterauswahl.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={bearbeiterVerteilung}
              layout="vertical"
              margin={{ left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(v) => formatEur(v)}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="bearbeiter"
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(v) => formatEur(Number(v))} />
              <Bar
                dataKey="volumen"
                name="Volumen"
                radius={[0, 4, 4, 0]}
                onClick={(d) =>
                  toggleFilter("bs", (d as unknown as BearbeiterDatum).bearbeiter)
                }
                cursor="pointer"
              >
                {bearbeiterVerteilung.map((d, i) => {
                  const active = filter.bs === d.bearbeiter;
                  const anyActive = !!filter.bs;
                  return (
                    <Cell
                      key={i}
                      fill="#3b82f6"
                      opacity={anyActive && !active ? 0.3 : 1}
                      stroke={active ? "#1e40af" : "none"}
                      strokeWidth={active ? 3 : 0}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
