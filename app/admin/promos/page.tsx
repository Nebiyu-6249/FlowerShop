"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useDB } from "@/lib/data/db";
import type { PromoCode } from "@/lib/types";
import { addDaysISO, aed, uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";

export default function AdminPromos() {
  const { promoCodes, upsertPromo, deletePromo } = useDB();
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [open, setOpen] = useState(false);

  const blank = (): PromoCode => ({
    id: "",
    code: "",
    type: "percent",
    value: 10,
    minOrder: 0,
    expiresAt: addDaysISO(90),
    usageLimit: 100,
    usedCount: 0,
    active: true,
  });

  const describe = (p: PromoCode) =>
    p.type === "percent" ? `${p.value}% off` : `${aed(p.value)} off`;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Promo codes</h1>
          <p className="mt-1 text-sm text-ink-mute">Codes apply instantly in the cart.</p>
        </div>
        <Button onClick={() => { setEditing(blank()); setOpen(true); }}>
          <Plus className="h-4 w-4" /> New code
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl2 border border-line bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line bg-sand/50 text-xs text-ink-mute">
              <th className="p-3 text-start font-medium">Code</th>
              <th className="p-3 text-start font-medium">Discount</th>
              <th className="p-3 text-start font-medium">Min order</th>
              <th className="p-3 text-start font-medium">Usage</th>
              <th className="p-3 text-start font-medium">Expires</th>
              <th className="p-3 text-start font-medium">Status</th>
              <th className="p-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((p) => {
              const expired = new Date(p.expiresAt) < new Date();
              return (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="p-3 font-mono font-semibold text-wine">{p.code}</td>
                  <td className="p-3">{describe(p)}</td>
                  <td className="p-3">{p.minOrder ? aed(p.minOrder) : "—"}</td>
                  <td className="p-3 text-ink-soft">{p.usedCount}/{p.usageLimit}</td>
                  <td className="p-3 text-ink-soft">{p.expiresAt}</td>
                  <td className="p-3">
                    <Badge tone={p.active && !expired ? "sage" : "sand"}>
                      {expired ? "Expired" : p.active ? "Active" : "Off"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label={`Edit ${p.code}`} onClick={() => { setEditing({ ...p }); setOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Delete ${p.code}`} onClick={() => { if (confirm(`Delete ${p.code}?`)) deletePromo(p.id); }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing?.id ? "Edit promo code" : "New promo code"}>
        {editing && (
          <PromoForm
            key={editing.id || "new"}
            promo={editing}
            onSave={(p) => {
              upsertPromo({ ...p, id: p.id || uid("pr"), code: p.code.toUpperCase().trim() });
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
}

function PromoForm({ promo, onSave, onCancel }: { promo: PromoCode; onSave: (p: PromoCode) => void; onCancel: () => void }) {
  const [p, setP] = useState<PromoCode>(promo);
  const set = <K extends keyof PromoCode>(k: K, v: PromoCode[K]) => setP((cur) => ({ ...cur, [k]: v }));
  const valid = p.code.trim().length >= 3 && p.value > 0;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="pr-code">Code</Label>
          <Input id="pr-code" className="mt-1.5 font-mono uppercase" value={p.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="SUMMER20" />
        </div>
        <div>
          <Label htmlFor="pr-type">Type</Label>
          <Select id="pr-type" className="mt-1.5" value={p.type} onChange={(e) => set("type", e.target.value as PromoCode["type"])}>
            <option value="percent">Percent off</option>
            <option value="fixed">Fixed AED off</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="pr-value">{p.type === "percent" ? "Percent" : "Amount (AED)"}</Label>
          <Input id="pr-value" type="number" min={1} className="mt-1.5" value={p.value} onChange={(e) => set("value", Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label htmlFor="pr-min">Minimum order (AED)</Label>
          <Input id="pr-min" type="number" min={0} className="mt-1.5" value={p.minOrder} onChange={(e) => set("minOrder", Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label htmlFor="pr-exp">Expires</Label>
          <input
            id="pr-exp" type="date" value={p.expiresAt}
            onChange={(e) => set("expiresAt", e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-wine"
          />
        </div>
        <div>
          <Label htmlFor="pr-limit">Usage limit</Label>
          <Input id="pr-limit" type="number" min={1} className="mt-1.5" value={p.usageLimit} onChange={(e) => set("usageLimit", Number(e.target.value) || 1)} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={p.active} onChange={(v) => set("active", v)} /> Active
      </label>
      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => valid && onSave(p)} disabled={!valid}>Save code</Button>
      </div>
    </div>
  );
}
