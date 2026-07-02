"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useDB } from "@/lib/data/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCategories() {
  const {
    categories, occasions, products,
    addCategory, renameCategory, deleteCategory, addOccasion, deleteOccasion,
  } = useDB();

  const [newCat, setNewCat] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newOcc, setNewOcc] = useState("");
  const [newEmoji, setNewEmoji] = useState("💐");

  const countFor = (catId: string) => products.filter((p) => p.categoryId === catId).length;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl">Categories &amp; occasions</h1>
      <p className="mt-1 text-sm text-ink-mute">The taxonomy behind shop filters, home tiles and product forms.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Categories */}
        <section className="rounded-xl2 border border-line bg-white p-6">
          <h2 className="text-sm font-semibold">Categories</h2>
          <ul className="mt-3 space-y-2">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-2 rounded-xl border border-line bg-porcelain px-3 py-2">
                {editingId === c.id ? (
                  <>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9" onKeyDown={(e) => { if (e.key === "Enter" && editName.trim()) { renameCategory(c.id, editName.trim()); setEditingId(null); } }} />
                    <Button size="icon" variant="ghost" aria-label="Save name" onClick={() => { if (editName.trim()) renameCategory(c.id, editName.trim()); setEditingId(null); }}>
                      <Check className="h-4 w-4 text-sage" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium">{c.name}</span>
                    <span className="text-xs text-ink-mute">{countFor(c.id)} products</span>
                    <Button size="icon" variant="ghost" aria-label={`Rename ${c.name}`} onClick={() => { setEditingId(c.id); setEditName(c.name); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon" variant="ghost" aria-label={`Delete ${c.name}`}
                      onClick={() => {
                        const n = countFor(c.id);
                        if (confirm(n ? `“${c.name}” still has ${n} products, they'll lose their category. Delete anyway?` : `Delete “${c.name}”?`)) deleteCategory(c.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <Input placeholder="New category name" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newCat.trim()) { addCategory(newCat.trim()); setNewCat(""); } }} />
            <Button variant="outline" onClick={() => { if (newCat.trim()) { addCategory(newCat.trim()); setNewCat(""); } }}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </section>

        {/* Occasions */}
        <section className="rounded-xl2 border border-line bg-white p-6">
          <h2 className="text-sm font-semibold">Occasions</h2>
          <ul className="mt-3 space-y-2">
            {occasions.map((o) => (
              <li key={o.id} className="flex items-center gap-2 rounded-xl border border-line bg-porcelain px-3 py-2">
                <span className="text-lg">{o.emoji}</span>
                <span className="flex-1 text-sm font-medium">{o.name}</span>
                <Button size="icon" variant="ghost" aria-label={`Delete ${o.name}`} onClick={() => { if (confirm(`Delete “${o.name}”?`)) deleteOccasion(o.id); }}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <Input className="w-16 text-center" aria-label="Emoji" value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} />
            <Input placeholder="New occasion" value={newOcc} onChange={(e) => setNewOcc(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newOcc.trim()) { addOccasion(newOcc.trim(), newEmoji || "💐"); setNewOcc(""); } }} />
            <Button variant="outline" onClick={() => { if (newOcc.trim()) { addOccasion(newOcc.trim(), newEmoji || "💐"); setNewOcc(""); } }}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
