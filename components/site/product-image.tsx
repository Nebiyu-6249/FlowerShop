"use client";

import Image from "next/image";
import { useState } from "react";
import { Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Every product photo goes through this component. If a remote image ever fails
 * (offline demo, dead link), it degrades to an on-brand placeholder instead of a
 * broken image, so the pitch never looks broken.
 */
export function ProductImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-sand", className)}>
      {!failed && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blush via-sand to-porcelain"
        >
          <Flower2 className="h-10 w-10 text-wine/40" />
          <span className="max-w-[80%] text-center font-display text-sm italic text-wine/60">{alt}</span>
        </div>
      )}
    </div>
  );
}
