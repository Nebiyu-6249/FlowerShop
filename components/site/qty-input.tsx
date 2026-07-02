"use client";
import { Minus, Plus } from "lucide-react";

export function QtyInput({ value, onChange, small }: { value: number; onChange: (v: number) => void; small?: boolean }) {
  const cls = small ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white">
      <button aria-label="Decrease quantity" onClick={() => onChange(Math.max(1, value - 1))} className={`${cls} flex items-center justify-center rounded-full text-ink-soft hover:bg-sand`}>
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-[2rem] text-center text-sm font-semibold text-ink">{value}</span>
      <button aria-label="Increase quantity" onClick={() => onChange(value + 1)} className={`${cls} flex items-center justify-center rounded-full text-ink-soft hover:bg-sand`}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
