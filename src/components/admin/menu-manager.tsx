"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Star, Trash2, Flame, Leaf } from "lucide-react";
import { toast } from "sonner";

import { cn, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { upsertMenuItem, deleteMenuItem, toggleItemAvailability, toggleItemFeatured } from "@/app/actions/admin";

type MenuItemLite = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string | null;
  ingredients: string[];
  allergens: string[];
  tags: string[];
  spiceLevel: number;
  isVegetarian: boolean;
  available: boolean;
  isFeatured: boolean;
  categoryId: string;
  categoryName: string;
  options: Array<{ id: string; groupName: string; optionName: string; priceModifier: number }>;
};

type FormState = {
  id?: string;
  name: string;
  categoryId: string;
  description: string;
  price: string;
  discountPrice: string;
  imageUrl: string;
  ingredients: string;
  allergens: string;
  tags: string;
  spiceLevel: string;
  isVegetarian: boolean;
  available: boolean;
  isFeatured: boolean;
};

function emptyForm(categoryId: string): FormState {
  return {
    name: "",
    categoryId,
    description: "",
    price: "",
    discountPrice: "",
    imageUrl: "",
    ingredients: "",
    allergens: "",
    tags: "",
    spiceLevel: "0",
    isVegetarian: false,
    available: true,
    isFeatured: false,
  };
}

export function MenuManager({ items, categories }: { items: MenuItemLite[]; categories: Array<{ id: string; name: string; slug: string }> }) {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(categories[0]?.id ?? ""));
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const filtered = items.filter((i) => (filter === "ALL" ? true : i.categoryId === filter));

  function openNew() {
    setForm(emptyForm(categories[0]?.id ?? ""));
    setOpen(true);
  }

  function openEdit(item: MenuItemLite) {
    setForm({
      id: item.id,
      name: item.name,
      categoryId: item.categoryId,
      description: item.description,
      price: String(item.price),
      discountPrice: item.discountPrice != null ? String(item.discountPrice) : "",
      imageUrl: item.imageUrl ?? "",
      ingredients: item.ingredients.join(", "),
      allergens: item.allergens.join(", "),
      tags: item.tags.join(", "),
      spiceLevel: String(item.spiceLevel),
      isVegetarian: item.isVegetarian,
      available: item.available,
      isFeatured: item.isFeatured,
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await upsertMenuItem(form);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not save dish.");
      return;
    }
    toast.success(form.id ? "Dish updated." : "Dish created.");
    setOpen(false);
    router.refresh();
  }

  async function toggleAvail(item: MenuItemLite) {
    await toggleItemAvailability(item.id, !item.available);
    toast.success(item.available ? "Marked unavailable." : "Dish is available again.");
    router.refresh();
  }

  async function toggleFeat(item: MenuItemLite) {
    await toggleItemFeatured(item.id, !item.isFeatured);
    toast.success(item.isFeatured ? "Removed from featured." : "Marked as featured.");
    router.refresh();
  }

  async function handleDelete(item: MenuItemLite) {
    if (!window.confirm(`Delete "${item.name}"? This can't be undone.`)) return;
    const result = await deleteMenuItem(item.id);
    if (!result.ok) {
      toast.error(result.error ?? "Could not delete dish.");
      return;
    }
    toast.success("Dish deleted.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={cn(
              "shrink-0 rounded-sm border px-3 py-1.5 text-xs font-semibold",
              filter === "ALL" ? "border-gold bg-gold text-night" : "border-white/15 text-paper/70 hover:border-gold/50 hover:text-paper",
            )}
          >
            All ({items.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={cn(
                "shrink-0 rounded-sm border px-3 py-1.5 text-xs font-semibold capitalize",
                filter === c.id ? "border-gold bg-gold text-night" : "border-white/15 text-paper/70 hover:border-gold/50 hover:text-paper",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
        <Button variant="gold" onClick={openNew}>
          <Plus className="h-4 w-4" /> Add dish
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-sm border border-white/10 bg-white/5 p-10 text-center text-sm text-paper/50">No dishes in this category.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-sm border border-white/10 bg-white/5 p-4">
              <div className="flex gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-white/5">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[0.6rem] text-paper/30">No img</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-serif text-lg text-paper">
                    <span className="truncate">{item.name}</span>
                    {item.isFeatured && <Star className="h-4 w-4 shrink-0 fill-gold text-gold" />}
                  </p>
                  <p className="text-xs capitalize text-paper/40">{item.categoryName}</p>
                  <p className="mt-1 text-sm text-gold">
                    {formatMoney(item.price)}
                    {item.discountPrice != null && <span className="ml-2 text-xs text-paper/40 line-through">{formatMoney(item.discountPrice)}</span>}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[0.65rem] text-paper/40">
                    {item.spiceLevel > 0 && (
                      <span className="flex items-center gap-0.5 text-orange-300">
                        <Flame className="h-3 w-3" />{"Level "}{item.spiceLevel}
                      </span>
                    )}
                    {item.isVegetarian && <span className="flex items-center gap-0.5 text-emerald-300"><Leaf className="h-3 w-3" /> Veg</span>}
                    {item.options.length > 0 && <span>{item.options.length} option{item.options.length > 1 ? "s" : ""}</span>}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(item)} className="text-paper/60 hover:bg-white/10 hover:text-paper">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleAvail(item)} className={item.available ? "text-paper/60 hover:bg-white/10 hover:text-paper" : "text-gold"}>
                  {item.available ? "In stock" : "Sold out"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleFeat(item)} className={cn(item.isFeatured && "text-gold")}>
                  <Star className="h-3.5 w-3.5 fill-current" /> {item.isFeatured ? "Featured" : "Feature"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(item)} className="ml-auto text-rose-300 hover:bg-rose-500/10 hover:text-rose-200">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Edit dish" : "New dish"} wide>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Input label="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="sm:col-span-2" />
          <Select
            label="Category *"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
          <Input label="Spice level (0-3)" type="number" min={0} max={3} value={form.spiceLevel} onChange={(e) => setForm({ ...form, spiceLevel: e.target.value })} />
          <Input label="Price (₦) *" type="number" step="0.01" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input label="Discount price (₦)" type="number" step="0.01" min={0} value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
          <Textarea label="Description *" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2" />
          <Input label="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" className="sm:col-span-2" />
          <Input label="Ingredients (comma separated)" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="sm:col-span-2" />
          <Input label="Allergens (comma separated)" value={form.allergens} onChange={(e) => setForm({ ...form, allergens: e.target.value })} />
          <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <div className="flex flex-wrap gap-4 sm:col-span-2">
            <Toggle label="Vegetarian" checked={form.isVegetarian} onChange={(v) => setForm({ ...form, isVegetarian: v })} />
            <Toggle label="Available" checked={form.available} onChange={(v) => setForm({ ...form, available: v })} />
            <Toggle label="Featured on homepage" checked={form.isFeatured} onChange={(v) => setForm({ ...form, isFeatured: v })} />
          </div>
          <div className="mt-2 flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{form.id ? "Save changes" : "Create dish"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-paper/80">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-gold" />
      {label}
    </label>
  );
}