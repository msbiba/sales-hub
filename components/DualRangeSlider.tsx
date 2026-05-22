"use client";

export default function DualRangeSlider({
  min,
  max,
  value,
  onChange,
  label,
  format,
  className,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (next: [number, number]) => void;
  label: string;
  format?: (n: number) => string;
  className?: string;
}) {
  const fmt = format ?? ((n: number) => String(n));
  return (
    <div className={`flex flex-col gap-1 ${className ?? "sm:w-72"}`}>
      <label className="text-xs text-gray-600">
        {label}: {fmt(value[0])}–{fmt(value[1])}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) =>
            onChange([Math.min(Number(e.target.value), value[1]), value[1]])
          }
          className="w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) =>
            onChange([value[0], Math.max(Number(e.target.value), value[0])])
          }
          className="w-full"
        />
      </div>
    </div>
  );
}
