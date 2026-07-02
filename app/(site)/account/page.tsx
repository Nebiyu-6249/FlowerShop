"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Award, Loader2, LogOut, MapPin, Package } from "lucide-react";
import { useDB } from "@/lib/data/db";
import { useSession } from "@/lib/store/session";
import { login, register } from "@/lib/data/api";
import { LOYALTY_REWARD_TARGET } from "@/lib/config";
import { aed, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/site/order-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AccountPage() {
  const session = useSession();
  const customers = useDB((s) => s.customers);
  const orders = useDB((s) => s.orders);
  const me = customers.find((c) => c.email === session.customerEmail);

  const myOrders = useMemo(
    () =>
      me
        ? orders
            .filter((o) => o.customerEmail.toLowerCase() === me.email.toLowerCase())
            .sort((a, b) => b.placedAt.localeCompare(a.placedAt))
        : [],
    [orders, me],
  );

  if (!me) return <AuthPanel />;

  const points = me.loyaltyPoints;
  const progress = Math.min(100, Math.round((points / LOYALTY_REWARD_TARGET) * 100));

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-wine">Account</p>
          <h1 className="font-display text-3xl md:text-4xl">Hi, {me.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-ink-mute">{me.email} · {me.phone}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => session.signOut()}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Loyalty */}
        <section className="rounded-xl2 border border-line bg-white p-6">
          <p className="flex items-center gap-2 text-sm font-semibold"><Award className="h-4 w-4 text-wine" /> Loyalty points</p>
          <p className="mt-3 font-display text-4xl text-wine">{points}</p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-sand">
            <div className="h-full rounded-full bg-wine transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-ink-mute">
            {points >= LOYALTY_REWARD_TARGET
              ? "Reward unlocked! AED 50 off your next order."
              : `${LOYALTY_REWARD_TARGET - points} points to your next reward (AED 50 off).`}
          </p>
          <p className="mt-1 text-[11px] text-ink-mute">Earn 1 point per AED 10 spent.</p>
        </section>

        {/* Addresses */}
        <section className="rounded-xl2 border border-line bg-white p-6 lg:col-span-2">
          <p className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-wine" /> Saved addresses</p>
          {me.addresses.length === 0 ? (
            <p className="mt-3 text-sm text-ink-mute">No saved addresses yet. Addresses can be added at checkout.</p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {me.addresses.map((a) => (
                <div key={a.id} className="rounded-xl border border-line bg-porcelain p-4">
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="mt-1 text-xs text-ink-soft">{a.recipientName} · {a.phone}</p>
                  <p className="text-xs text-ink-soft">{a.building}, {a.area}, {a.emirate}</p>
                  {a.notes && <p className="mt-1 text-[11px] text-ink-mute">{a.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Orders */}
      <section className="mt-6 rounded-xl2 border border-line bg-white p-6">
        <p className="flex items-center gap-2 text-sm font-semibold"><Package className="h-4 w-4 text-wine" /> Order history</p>
        {myOrders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-line p-8 text-center">
            <p className="text-sm text-ink-mute">No orders yet.</p>
            <Link href="/shop" className="mt-2 inline-block text-sm text-wine underline">Start with something beautiful</Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {myOrders.map((o) => (
              <details key={o.id} className="group rounded-xl border border-line bg-porcelain open:bg-white">
                <summary className="flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 p-4 [&::-webkit-details-marker]:hidden">
                  <span className="font-medium">{o.id}</span>
                  <span className="text-xs text-ink-mute">{formatDate(o.placedAt)}</span>
                  <OrderStatusBadge status={o.status} />
                  <span className="ms-auto font-display text-lg text-wine">{aed(o.total)}</span>
                </summary>
                <div className="px-4 pb-4">
                  <Separator className="mb-3" />
                  <ul className="space-y-1.5 text-sm">
                    {o.items.map((i, idx) => (
                      <li key={idx} className="flex justify-between gap-3">
                        <span className="text-ink-soft">{i.qty}× {i.productName} ({i.size})</span>
                        <span>{aed(i.unitPrice * i.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-ink-mute">
                    Delivery: {formatDate(o.deliveryDate)}, {o.slot} → {o.building}, {o.area}, {o.emirate}
                  </p>
                  <p className="text-xs text-ink-mute">Paid with {o.paymentMethod} · Earned {o.pointsEarned} points</p>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AuthPanel() {
  const session = useSession();
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setErr(null);
    const res =
      tab === "signin"
        ? await login(email, password)
        : await register(name.trim(), email, phone.trim(), password);
    if (res.ok) session.signIn(res.customer.email);
    else setErr(res.reason);
    setBusy(false);
  };

  return (
    <div className="container max-w-md py-12 md:py-20">
      <div className="rounded-xl2 border border-line bg-white p-8 shadow-soft">
        <h1 className="font-display text-2xl">Your account</h1>

        <div className="mt-5 grid grid-cols-2 rounded-full bg-sand p-1 text-sm">
          {(["signin", "register"] as const).map((k) => (
            <button
              key={k}
              onClick={() => { setTab(k); setErr(null); }}
              className={`rounded-full py-2 transition-colors ${tab === k ? "bg-white font-medium text-wine shadow-soft" : "text-ink-soft"}`}
            >
              {k === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3">
          {tab === "register" && (
            <>
              <div>
                <Label htmlFor="a-name">Full name</Label>
                <Input id="a-name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="a-phone">Phone</Label>
                <Input id="a-phone" className="mt-1.5" placeholder="+971 5x xxx xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="a-email">Email</Label>
            <Input id="a-email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="a-pass">Password</Label>
            <Input id="a-pass" type="password" className="mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>
          {err && <p className="text-xs text-red-600">{err}</p>}
          <Button className="mt-1" onClick={submit} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : tab === "signin" ? "Sign in" : "Create account"}
          </Button>
          {/* TODO: replace with real auth (NextAuth.js/Clerk) — see lib/data/api.ts */}
        </div>
      </div>
    </div>
  );
}
