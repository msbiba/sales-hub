import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/landing" className={`inline-flex items-center ${className}`}>
      <span className="text-fs-4 font-semibold tracking-tight text-[var(--ink)]">
        solarwerk
      </span>
      <span
        aria-hidden
        className="mx-1 inline-block h-[7px] w-[7px] rounded-full bg-[var(--solar)]"
      />
      <span className="text-fs-4 font-semibold tracking-tight text-[var(--ink)]">
        süd
      </span>
    </Link>
  );
}
