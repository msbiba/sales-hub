import { KundenStatus } from "@/types";

const config: Record<KundenStatus, { label: string; className: string }> = {
  aktiv: { label: "Aktiv", className: "bg-green-100 text-green-700" },
  in_wartung: { label: "In Wartung", className: "bg-orange-100 text-orange-700" },
  beschwerde: { label: "Beschwerde", className: "bg-red-100 text-red-700" },
};

export default function KundeStatusBadge({
  status,
  size = "sm",
}: {
  status: KundenStatus;
  size?: "sm" | "md";
}) {
  const { label, className } = config[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };
  const sizeCls =
    size === "md" ? "px-3 py-1 text-sm" : "px-2 py-1 text-xs";
  return (
    <span
      className={`inline-block rounded-full font-medium ${sizeCls} ${className}`}
    >
      {label}
    </span>
  );
}
