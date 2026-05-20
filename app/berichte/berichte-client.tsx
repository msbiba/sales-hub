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

const KUNDEN_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];
const PIPELINE_COLORS = ["#6b7280", "#3b82f6", "#a855f7", "#22c55e", "#ef4444"];

interface ChartDatum {
  name: string;
  value: number;
}

export default function BerichteClient({
  kundenVerteilung,
  pipelineVerteilung,
}: {
  kundenVerteilung: ChartDatum[];
  pipelineVerteilung: ChartDatum[];
}) {
  return (
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
            >
              {kundenVerteilung.map((_, i) => (
                <Cell key={i} fill={KUNDEN_COLORS[i % KUNDEN_COLORS.length]} />
              ))}
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
            <Bar dataKey="value" name="Anzahl" radius={[4, 4, 0, 0]}>
              {pipelineVerteilung.map((_, i) => (
                <Cell
                  key={i}
                  fill={PIPELINE_COLORS[i % PIPELINE_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
