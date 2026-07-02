"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, Lock, ShieldCheck, User } from "lucide-react";
import { useDB } from "@/lib/data/db";
import { useCart } from "@/lib/store/cart";
import { useSession } from "@/lib/store/session";
import { useI18n } from "@/lib/i18n/provider";
import { login, placeOrder } from "@/lib/data/api";
import type { PaymentMethod, Slot } from "@/lib/types";
import { aed, addDaysISO, cn, orderNumber, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type Mode = "choose" | "guest" | "signin" | "form";

const PAYMENTS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: "Card", label: "Card", hint: "Visa, Mastercard, Amex" },
  { id: "Apple Pay", label: " Pay", hint: "Apple Pay" },
  { id: "Google Pay", label: "G Pay", hint: "Google Pay" },
  { id: "Tabby", label: "tabby", hint: "4 interest-free payments" },
  { id: "Tamara", label: "tamara", hint: "Split in 3, no fees" },
];

export default function CheckoutPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { items, deliveryDate, slot, promoCode, promoDiscount, clear, setDelivery } = useCart();
  const products = useDB((s) => s.products);
  const addOns = useDB((s) => s.addOns);
  const zones = useDB((s) => s.zones);
  const customers = useDB((s) => s.customers);
  const session = useSession();

  const me = customers.find((c) => c.email === session.customerEmail);
  const [mode, setMode] = useState<Mode>("choose");

  // sender
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // sign-in
  const [password, setPassword] = useState("");
  const [authErr, setAuthErr] = useState<string | null>(null);
  const [authing, setAuthing] = useState(false);
  // recipient + address
  const [recipient, setRecipient] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [emirate, setEmirate] = useState("Dubai");
  const [area, setArea] = useState("");
  const [building, setBuilding] = useState("");
  const [notes, setNotes] = useState("");
  // delivery
  const [date, setDate] = useState(deliveryDate || todayISO());
  const [chosenSlot, setChosenSlot] = useState<Slot | "">(slot || "");
  // payment
  const [method, setMethod] = useState<PaymentMethod>("Card");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExp, setCardExp] = useState("12/27");
  const [cardCvc, setCardCvc] = useState("123");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // signed-in users skip the account step and get prefilled details
  useEffect(() => {
    if (me) {
      setMode("form");
      setName((v) => v || me.name);
      setEmail((v) => v || me.email);
      setPhone((v) => v || me.phone);
      const a = me.addresses[0];
      if (a) {
        setRecipient((v) => v || a.recipientName);
        setRecipientPhone((v) => v || a.phone);
        setEmirate(a.emirate);
        setArea((v) => v || a.area);
        setBuilding((v) => v || a.building);
      }
    }
  }, [me]);

  const zone = zones.find((z) => z.emirate === emirate);
  const zoneSlots = zone?.slots ?? [];

  useEffect(() => {
    if (chosenSlot && !zoneSlots.includes(chosenSlot as Slot)) setChosenSlot("");
  }, [emirate]); // eslint-disable-line react-hooks/exhaustive-deps

  const lines = useMemo(
    () =>
      items
        .map((line) => {
          const product = products.find((p) => p.id === line.productId);
          if (!product) return null;
          const lineAddOns = line.addOnIds.map((id) => addOns.find((a) => a.id === id)).filter(Boolean) as typeof addOns;
          const unit = product.sizePricing[line.size] + lineAddOns.reduce((s, a) => s + a.price, 0);
          return { line, product, lineAddOns, unit };
        })
        .filter(Boolean) as { line: (typeof items)[number]; product: (typeof products)[number]; lineAddOns: typeof addOns; unit: number }[],
    [items, products, addOns],
  );

  const subtotal = lines.reduce((s, l) => s + l.unit * l.line.qty, 0);
  const deliveryFee = zone ? (zone.freeOver && subtotal >= zone.freeOver ? 0 : zone.fee) : 0;
  const total = Math.max(0, subtotal - promoDiscount) + deliveryFee;

  if (items.length === 0 && !paying) {
    return (
      <div className="container py-24 text-center">
        <p className="font-display text-2xl">Your cart is empty</p>
        <Link href="/shop" className="mt-3 inline-block text-sm text-wine underline">Browse the shop</Link>
      </div>
    );
  }

  const handleSignIn = async () => {
    setAuthing(true);
    setAuthErr(null);
    const res = await login(email, password);
    if (res.ok) {
      session.signIn(res.customer.email);
      setMode("form");
    } else {
      setAuthErr(res.reason);
    }
    setAuthing(false);
  };

  const validate = (): string | null => {
    if (!name.trim() || !email.trim() || !phone.trim()) return "Please fill in your name, email and phone.";
    if (!recipient.trim()) return "Please add the recipient's name.";
    if (!area.trim() || !building.trim()) return "Please complete the delivery address.";
    if (!date) return "Pick a delivery date.";
    if (!chosenSlot) return "Pick a delivery time slot.";
    return null;
  };

  const handlePay = async () => {
    const problem = validate();
    if (problem) { setError(problem); return; }
    setError(null);
    setPaying(true);
    const order = await placeOrder({
      id: orderNumber(),
      customerEmail: email.trim(),
      customerName: name.trim(),
      phone: phone.trim(),
      items: lines.map(({ line, product, lineAddOns, unit }) => ({
        productId: product.id,
        productName: product.name,
        size: line.size,
        qty: line.qty,
        unitPrice: unit,
        addOns: lineAddOns.map((a) => ({ name: a.name, price: a.price })),
        giftMessage: line.giftMessage,
      })),
      subtotal,
      deliveryFee,
      discount: promoDiscount,
      total,
      promoCode,
      paymentMethod: method,
      emirate,
      area: area.trim(),
      building: building.trim(),
      addressNotes: notes.trim() || undefined,
      deliveryDate: date,
      slot: chosenSlot as Slot,
    });
    setDelivery(date, chosenSlot as Slot);
    clear();
    router.push(`/order-confirmation/${order.id}`);
  };

  return (
    <div className="container py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl">{t("checkout")}</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Step 0: guest or sign in */}
          {mode === "choose" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <button onClick={() => setMode("guest")} className="rounded-xl2 border border-line bg-white p-6 text-start transition-colors hover:border-wine">
                <User className="h-6 w-6 text-wine" />
                <p className="mt-3 font-medium">Checkout as guest</p>
                <p className="mt-1 text-sm text-ink-mute">No account needed. Quick and easy.</p>
              </button>
              <button onClick={() => setMode("signin")} className="rounded-xl2 border border-line bg-white p-6 text-start transition-colors hover:border-wine">
                <Lock className="h-6 w-6 text-wine" />
                <p className="mt-3 font-medium">Sign in</p>
                <p className="mt-1 text-sm text-ink-mute">Use saved addresses and earn loyalty points.</p>
              </button>
            </div>
          )}

          {/* Sign in */}
          {mode === "signin" && (
            <section className="rounded-xl2 border border-line bg-white p-6">
              <h2 className="font-display text-xl">Sign in</h2>
              <div className="mt-4 grid gap-3">
                <div>
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="si-pass">Password</Label>
                  <Input id="si-pass" type="password" className="mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSignIn()} />
                </div>
                {authErr && <p className="text-xs text-red-600">{authErr}</p>}
                <div className="flex gap-2">
                  <Button onClick={handleSignIn} disabled={authing}>{authing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}</Button>
                  <Button variant="ghost" onClick={() => setMode("guest")}>Continue as guest instead</Button>
                </div>
              </div>
            </section>
          )}

          {/* Details form (guest or signed-in) */}
          {(mode === "guest" || mode === "form") && (
            <>
              <section className="rounded-xl2 border border-line bg-white p-6">
                <h2 className="font-display text-xl">Your details</h2>
                {me && <p className="mt-1 text-xs text-sage">Signed in as {me.email}. Details prefilled.</p>}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" className="mt-1.5" placeholder="+971 5x xxx xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                  </div>
                </div>
              </section>

              <section className="rounded-xl2 border border-line bg-white p-6">
                <h2 className="font-display text-xl">Delivery</h2>
                {me && me.addresses.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {me.addresses.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setRecipient(a.recipientName); setRecipientPhone(a.phone); setEmirate(a.emirate);
                          setArea(a.area); setBuilding(a.building); setNotes(a.notes ?? "");
                        }}
                        className="rounded-full border border-line bg-porcelain px-3 py-1.5 text-xs hover:border-wine hover:text-wine"
                      >
                        Use “{a.label}”
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="recipient">Recipient name</Label>
                    <Input id="recipient" className="mt-1.5" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="rphone">Recipient phone (optional)</Label>
                    <Input id="rphone" className="mt-1.5" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="emirate">Emirate</Label>
                    <Select id="emirate" className="mt-1.5" value={emirate} onChange={(e) => setEmirate(e.target.value)}>
                      {zones.map((z) => <option key={z.id} value={z.emirate}>{z.emirate}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="area">Area</Label>
                    <Input id="area" className="mt-1.5" placeholder={zone?.areas.slice(0, 2).join(", ") ?? "Area"} value={area} onChange={(e) => setArea(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="building">Building, street, villa / apt</Label>
                    <Input id="building" className="mt-1.5" value={building} onChange={(e) => setBuilding(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Delivery notes (optional)</Label>
                    <Textarea id="notes" rows={2} className="mt-1.5" placeholder="Gate code, leave with reception..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="ddate">{t("delivery_date")}</Label>
                    <input
                      id="ddate" type="date" min={todayISO()} max={addDaysISO(30)} value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-wine"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dslot">{t("time_slot")}</Label>
                    <Select id="dslot" className="mt-1.5" value={chosenSlot} onChange={(e) => setChosenSlot(e.target.value as Slot)}>
                      <option value="" disabled>Choose a slot…</option>
                      {zoneSlots.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                    {zone && !zone.slots.includes("Express (within 1 hour)") && (
                      <p className="mt-1 text-[11px] text-ink-mute">Express 1-hour is Dubai only.</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-xl2 border border-line bg-white p-6">
                <h2 className="font-display text-xl">Payment</h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-mute">
                  <ShieldCheck className="h-3.5 w-3.5 text-sage" /> SSL secured checkout.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Payment method">
                  {PAYMENTS.map((p) => (
                    <button
                      key={p.id}
                      role="radio"
                      aria-checked={method === p.id}
                      onClick={() => setMethod(p.id)}
                      className={cn(
                        "rounded-xl border p-3 text-center transition-colors",
                        method === p.id ? "border-wine bg-blush/60" : "border-line bg-white hover:border-wine/50",
                      )}
                    >
                      <p className="text-sm font-semibold">{p.label}</p>
                      <p className="mt-0.5 text-[10px] leading-tight text-ink-mute">{p.hint}</p>
                    </button>
                  ))}
                </div>

                {method === "Card" && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_120px_100px]">
                    <div className="sm:col-span-3">
                      <Label htmlFor="cardn">Card number</Label>
                      <div className="relative mt-1.5">
                        <CreditCard className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
                        <Input id="cardn" className="ps-10" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} inputMode="numeric" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cexp">Expiry</Label>
                      <Input id="cexp" className="mt-1.5" value={cardExp} onChange={(e) => setCardExp(e.target.value)} placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="ccvc">CVC</Label>
                      <Input id="ccvc" className="mt-1.5" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} inputMode="numeric" />
                    </div>
                    {/* TODO: integrate Stripe — replace this mock card form with Stripe Elements
                        and create a PaymentIntent server-side before confirming. */}
                  </div>
                )}
                {(method === "Tabby" || method === "Tamara") && (
                  <p className="mt-4 rounded-xl bg-sand p-3 text-xs text-ink-soft">
                    Split {aed(total)} into interest-free installments with {method}. You&apos;ll confirm when you place the order.
                  </p>
                )}
                {(method === "Apple Pay" || method === "Google Pay") && (
                  <p className="mt-4 rounded-xl bg-sand p-3 text-xs text-ink-soft">
                    You&apos;ll confirm your payment with {method} when you place the order.
                  </p>
                )}
              </section>

              {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

              <Button size="lg" className="w-full sm:w-auto" onClick={handlePay} disabled={paying}>
                {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing payment…</> : <>Pay {aed(total)}</>}
              </Button>
            </>
          )}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-xl2 border border-line bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map(({ line, product, unit }) => (
              <li key={line.id} className="flex justify-between gap-3">
                <span className="text-ink-soft">{line.qty}× {product.name} <span className="text-ink-mute">({line.size})</span></span>
                <span className="shrink-0">{aed(unit * line.qty)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">{t("subtotal")}</span><span>{aed(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">{t("delivery_fee")} ({emirate})</span><span>{deliveryFee === 0 ? t("free") : aed(deliveryFee)}</span></div>
            {promoDiscount > 0 && <div className="flex justify-between text-sage"><span>{promoCode}</span><span>-{aed(promoDiscount)}</span></div>}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="font-medium">{t("total")}</span>
            <span className="font-display text-2xl text-wine">{aed(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
