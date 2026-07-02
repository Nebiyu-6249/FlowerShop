"use client";

/**
 * Rehydrates the persisted Zustand stores after mount.
 *
 * All three stores use `skipHydration: true`, so the server render and the first client
 * render both use seed/default state (no hydration mismatch). Once mounted, we pull the
 * saved state back in from localStorage.
 */

import { useEffect } from "react";
import { useDB } from "@/lib/data/db";
import { useCart } from "@/lib/store/cart";
import { useSession } from "@/lib/store/session";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useDB.persist.rehydrate();
    useCart.persist.rehydrate();
    useSession.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
