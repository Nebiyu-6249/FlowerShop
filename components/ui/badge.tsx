import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Tone = "wine" | "blush" | "sage" | "sand" | "amber" | "sky";

const tones: Record<Tone, string> = {
  wine: "bg-wine text-white",
  blush: "bg-blush text-wine-deep",
  sage: "bg-sage/15 text-[#4E5C45]",
  sand: "bg-sand text-ink-soft",
  amber: "bg-amber-100 text-amber-800",
  sky: "bg-sky-100 text-sky-800",
};

export function Badge({ className, tone = "blush", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
