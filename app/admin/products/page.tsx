"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useDB } from "@/lib/data/db";
import type { Product, Size } from "@/lib/types";
import { aed, slugify, uid } from "@/lib/utils";
import { ProductImage } from "@/components/site/product-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";

const SIZES: Size[] = ["Standard", "Deluxe", "Premium"];

export default function AdminProducts() {
  const { products, categories, occasions, upsertProduct, deleteProduct } = useDB();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    const needle = q.toLowerCase();
    return products.filter((p) => !needle || p.name.toLowerCase().includes(needle));
  }, [products, q]);

  const blank = (): Product => ({
    id: "",
    slug: "",
    name: "",
    description: "",
    careTips: "Trim stems at an angle, refresh water every two days, keep away from direct sun and AC vents.",
    basePrice: 199,
    sizePricing: { Standard: 199, Deluxe: 279, Premium: 359 },
    categoryId: categories[0]?.id ?? "",
    occasionIds: [],
    colors: [],
    images: [products[0]?.images[0] ?? ""],
    stock: 20,
    active: true,
    bestSeller: false,
    createdAt: new Date().toISOString(),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Products</h1>
          <p className="mt-1 text-sm text-ink-mute">{products.length} products · changes appear on the storefront instantly.</p>
        </div>
        <Button onClick={() => { setEditing(blank()); setOpen(true); }}>
          <Plus className="h-4 w-4" /> New product
        </Button>
      </div>

      <div className="relative mt-5 max-w-xs">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
        <Input placeholder="Search products…" className="ps-9" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl2 border border-line bg-white">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-line bg-sand/50 text-xs text-ink-mute">
              <th className="p-3 text-start font-medium">Product</th>
              <th className="p-3 text-start font-medium">Category</th>
              <th className="p-3 text-start font-medium">Price</th>
              <th className="p-3 text-start font-medium">Stock</th>
              <th className="p-3 text-start font-medium">Status</th>
              <th className="p-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded-lg bg-sand">
                      <ProductImage src={p.images[0]} alt="" sizes="36px" />
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-ink-mute">/{p.slug}</p>
                    </div>
                    {p.bestSeller && <Badge tone="wine">Best seller</Badge>}
                  </div>
                </td>
                <td className="p-3 text-ink-soft">{categories.find((c) => c.id === p.categoryId)?.name ?? "—"}</td>
                <td className="p-3">{aed(p.basePrice)}</td>
                <td className="p-3">
                  <span className={p.stock <= 5 ? "font-medium text-amber-600" : ""}>{p.stock}</span>
                </td>
                <td className="p-3">
                  <Badge tone={p.active ? "sage" : "sand"}>{p.active ? "Active" : "Hidden"}</Badge>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label={`Edit ${p.name}`} onClick={() => { setEditing({ ...p }); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" aria-label={`Delete ${p.name}`}
                      onClick={() => { if (confirm(`Delete “${p.name}”?`)) deleteProduct(p.id); }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} title={editing?.id ? "Edit product" : "New product"} wide>
        {editing && (
          <ProductForm
            key={editing.id || "new"}
            product={editing}
            categories={categories}
            occasions={occasions}
            onSave={(p) => {
              upsertProduct({ ...p, id: p.id || uid("p"), slug: p.slug || slugify(p.name) });
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
}

function ProductForm({
  product, categories, occasions, onSave, onCancel,
}: {
  product: Product;
  categories: { id: string; name: string }[];
  occasions: { id: string; name: string }[];
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const [p, setP] = useState<Product>(product);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((cur) => ({ ...cur, [k]: v }));

  const toggleOccasion = (id: string) =>
    set("occasionIds", p.occasionIds.includes(id) ? p.occasionIds.filter((x) => x !== id) : [...p.occasionIds, id]);

  const valid = p.name.trim() && p.categoryId && p.images[0];

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-name">Name</Label>
          <Input id="p-name" className="mt-1.5" value={p.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="p-cat">Category</Label>
          <Select id="p-cat" className="mt-1.5" value={p.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="p-desc">Description</Label>
        <Textarea id="p-desc" rows={3} className="mt-1.5" value={p.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {SIZES.map((s) => (
          <div key={s}>
            <Label htmlFor={`p-${s}`}>{s} (AED)</Label>
            <Input
              id={`p-${s}`} type="number" min={0} className="mt-1.5"
              value={p.sizePricing[s]}
              onChange={(e) => {
                const v = Number(e.target.value) || 0;
                setP((cur) => ({
                  ...cur,
                  sizePricing: { ...cur.sizePricing, [s]: v },
                  basePrice: s === "Standard" ? v : cur.basePrice,
                }));
              }}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-stock">Stock</Label>
          <Input id="p-stock" type="number" min={0} className="mt-1.5" value={p.stock} onChange={(e) => set("stock", Number(e.target.value) || 0)} />
        </div>
        <div>
          <Label htmlFor="p-colors">Colours (comma separated)</Label>
          <Input
            id="p-colors" className="mt-1.5" placeholder="Pink, White"
            value={p.colors.join(", ")}
            onChange={(e) => set("colors", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="p-img">Image URL</Label>
        <Input id="p-img" className="mt-1.5" value={p.images[0] ?? ""} onChange={(e) => set("images", [e.target.value, ...p.images.slice(1)])} />
        <p className="mt-1 text-[11px] text-ink-mute">Broken links fall back to a styled placeholder, so the storefront never breaks.</p>
      </div>

      <div>
        <Label>Occasions</Label>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {occasions.map((o) => (
            <button
              key={o.id}
              onClick={() => toggleOccasion(o.id)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${p.occasionIds.includes(o.id) ? "border-wine bg-wine text-white" : "border-line bg-porcelain text-ink-soft hover:border-wine"}`}
            >
              {o.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={p.active} onChange={(v) => set("active", v)} /> Active on storefront
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={Boolean(p.bestSeller)} onChange={(v) => set("bestSeller", v)} /> Best seller badge
        </label>
      </div>

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => valid && onSave(p)} disabled={!valid}>Save product</Button>
      </div>
    </div>
  );
}
