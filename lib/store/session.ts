"use client";

/**
 * Mock session. TODO: replace with real auth (NextAuth.js or Clerk) — components read
 * the current user only through this hook, so swapping the source is contained here.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SessionState {
  customerEmail: string | null;
  adminAuthed: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
  adminSignIn: () => void;
  adminSignOut: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      customerEmail: null,
      adminAuthed: false,
      signIn: (customerEmail) => set({ customerEmail }),
      signOut: () => set({ customerEmail: null }),
      adminSignIn: () => set({ adminAuthed: true }),
      adminSignOut: () => set({ adminAuthed: false }),
    }),
    { name: "fleuraya-session-v1", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
