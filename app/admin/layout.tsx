"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flower2, LayoutDashboard, Loader2, Lock, LogOut, MapPin, Package, Percent,
  RotateCcw, ShoppingBag, Tags, Type, Users,
} from "lucide-react";
import { useSession } from "@/lib/store/session";
import { useDB } from "@/lib/data/db";
import { SITE_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/promos", label: "Promo codes", icon: Percent },
  { href: "/admin/zones", label: "Delivery zones", icon: MapPin },
  { href: "/admin/content", label: "Content", icon: Type },
];

// TODO: replace with real auth + role checks.
const ADMIN_EMAIL = "admin@fleuraya.ae";
const ADMIN_PASSWORD = "admin123";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { adminAuthed, adminSignIn, adminSignOut } = useSession();
  const resetDemo = useDB((s) => s.resetDemo);
  const pathname = usePathname();

  if (!adminAuthed) return <AdminLogin onSuccess={adminSignIn} />;

  return (
    <div className="flex min-h-screen bg-porcelain">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-60 flex-col border-e border-line bg-white md:flex print:hidden">
        <Link href="/" className="flex items-center gap-2 border-b border-line px-5 py-5">
          <Flower2 className="h-5 w-5 text-wine" />
          <span className="font-display text-lg">{SITE_NAME}</span>
          <span className="rounded-full bg-blush px-2 py-0.5 text-[10px] font-semibold text-wine-deep">Admin</span>
        </Link>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-wine text-white" : "text-ink-soft hover:bg-sand hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-line p-3">
          <button
            onClick={() => { if (confirm("Restore all sample data? This resets products, orders and settings.")) resetDemo(); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-sand"
          >
            <RotateCcw className="h-4 w-4" /> Restore sample data
          </button>
          <button
            onClick={adminSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-sand"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center gap-2 overflow-x-auto border-b border-line bg-white px-4 py-3 md:hidden print:hidden">
        <Flower2 className="h-4 w-4 shrink-0 text-wine" />
        {NAV.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs",
              (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)) ? "bg-wine text-white" : "bg-sand text-ink-soft",
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <main className="flex-1 px-4 pb-16 pt-20 md:ps-[17rem] md:pt-8 md:pe-8 print:p-0 print:m-0">
        {children}
      </main>
    </div>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setErr(null);
    await new Promise((r) => setTimeout(r, 400));
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) onSuccess();
    else setErr("Email or password doesn't match.");
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-porcelain px-4">
      <div className="w-full max-w-sm rounded-xl2 border border-line bg-white p-8 shadow-soft">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-wine" />
          <h1 className="font-display text-2xl">Admin sign in</h1>
        </div>
        <div className="mt-5 grid gap-3">
          <div>
            <Label htmlFor="ad-email">Email</Label>
            <Input id="ad-email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ad-pass">Password</Label>
            <Input id="ad-pass" type="password" className="mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>
          {err && <p className="text-xs text-red-600">{err}</p>}
          <Button onClick={submit} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}</Button>
          <Link href="/" className="text-center text-xs text-ink-soft underline-offset-2 hover:underline">Back to storefront</Link>
        </div>
      </div>
    </div>
  );
}
