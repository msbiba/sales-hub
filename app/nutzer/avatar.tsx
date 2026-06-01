// Deterministischer Farb-Avatar mit Initialen.
// Server-Component (kein "use client"), keine Hooks.

const PALETTE = [
  "bg-teal-600",
  "bg-orange-600",
  "bg-purple-600",
  "bg-blue-600",
  "bg-pink-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function initials(fullName: string | null, email: string): string {
  if (fullName && fullName.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export default function Avatar({
  fullName,
  email,
  size = "md",
}: {
  fullName: string | null;
  email: string;
  size?: "sm" | "md" | "lg";
}) {
  const color = PALETTE[hash(email) % PALETTE.length];
  const sizeCls =
    size === "lg" ? "h-14 w-14 text-base" : size === "sm" ? "h-7 w-7 text-xs" : "h-10 w-10 text-sm";
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${color} ${sizeCls}`}
    >
      {initials(fullName, email)}
    </div>
  );
}
