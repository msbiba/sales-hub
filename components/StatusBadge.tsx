import { PipelineStatus } from "@/types";

const config: Record<PipelineStatus, { label: string; className: string }> = {
  erstkontakt: { label: "Erstkontakt", className: "bg-gray-100 text-gray-700" },
  angebot_raus: { label: "Angebot raus", className: "bg-blue-100 text-blue-700" },
  verhandlung: { label: "Verhandlung", className: "bg-purple-100 text-purple-700" },
  gewonnen: { label: "Gewonnen", className: "bg-green-100 text-green-700" },
  verloren: { label: "Verloren", className: "bg-red-100 text-red-700" },
};

export default function StatusBadge({ status }: { status: PipelineStatus }) {
  const { label, className } = config[status] ?? { label: status, className: "bg-gray-100 text-gray-700" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
