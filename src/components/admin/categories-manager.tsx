"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { upsertCategory, deleteCategory } from "@/app/actions/admin";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ordering: number;
  imageUrl: string | null;
  itemCount: number;
};

type FormState = { id?: string; name: string; description: string; ordering: string; imageUrl: string };

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", description: "", ordering: "0", imageUrl: "" });
  const [saving, setSaving] = useState(false);

  function openNew() {
    setForm({ name: "", description: "", ordering: String(categories.length), imageUrl: "" });
    setOpen(true);
  }

  function openEdit(c: Category) {
    setForm({ id: c.id, name: c.name, description: c.description ?? "", ordering: String(c.ordering), imageUrl: c.imageUrl ?? "" });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await upsertCategory(form);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not save category.");
      return;
    }
    toast.success(form.id ? "Category updated." : "Category created.");
    setOpen(false);
    router.refresh();
  }

  async function handleDelete(c: Category) {
    if (c.itemCount > 0) {
      toast.error(`"${c.name}" still has ${c.itemCount} dish${c.itemCount > 1 ? "es" : ""}. Move them first.`);
      return;
    }
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    const result = await deleteCategory(c.id);
    if (!result.ok) {
      toast.error(result.error ?? "Could not delete category.");
      return;
    }
    toast.success("Category deleted.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="gold" onClick={openNew}>
          <Plus className="h-4 w-4" /> Add category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-sm border border-white/10 bg-white/5 p-10 text-center text-sm text-paper/50">No categories yet.</div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-paper/50">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-center">Dishes</th>
                <th className="hidden px-4 py-3 md:table-cell">Slug</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-mono text-paper/50">{c.ordering}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium capitalize text-paper">{c.name}</p>
                    {c.description && <p className="mt-0.5 max-w-[280px] truncate text-xs text-paper/40">{c.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-center text-paper">{c.itemCount}</td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-paper/40 md:table-cell">/{c.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="rounded-sm p-1.5 text-paper/50 hover:bg-white/10 hover:text-gold" aria-label="Edit category">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(c)} className="rounded-sm p-1.5 text-paper/50 hover:bg-rose-500/10 hover:text-rose-300" aria-label="Delete category">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Edit category" : "New category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Order" type="number" min={0} value={form.ordering} onChange={(e) => setForm({ ...form, ordering: e.target.value })} />
            <Input label="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{form.id ? "Save changes" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}