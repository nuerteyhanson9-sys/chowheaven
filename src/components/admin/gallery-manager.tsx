"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { upsertGalleryImage, deleteGalleryImage } from "@/app/actions/admin";

type GalleryImageLite = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  alt: string | null;
  ordering: number;
  active: boolean;
};

type FormState = {
  id?: string;
  title: string;
  category: string;
  imageUrl: string;
  alt: string;
  ordering: string;
  active: boolean;
};

const empty: FormState = { title: "", category: "FOOD", imageUrl: "", alt: "", ordering: "0", active: true };

export function GalleryManager({ images }: { images: GalleryImageLite[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setForm({ ...empty, ordering: String(images.length) });
    setOpen(true);
  }

  function openEdit(img: GalleryImageLite) {
    setForm({ id: img.id, title: img.title, category: img.category, imageUrl: img.imageUrl, alt: img.alt ?? "", ordering: String(img.ordering), active: img.active });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await upsertGalleryImage(form);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not save image.");
      return;
    }
    toast.success(form.id ? "Image updated." : "Image added.");
    setOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remove this image from the gallery?")) return;
    const result = await deleteGalleryImage(id);
    if (!result.ok) {
      toast.error(result.error ?? "Could not delete image.");
      return;
    }
    toast.success("Image removed.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="gold" onClick={openNew}>
          <Plus className="h-4 w-4" /> Add image
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="rounded-sm border border-white/10 bg-white/5 p-10 text-center text-sm text-paper/50">No gallery images yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((img) => (
            <div key={img.id} className={cn("group relative overflow-hidden rounded-sm border bg-white/5", !img.active && "opacity-40")}>
              <div className="relative aspect-square">
                <Image src={img.imageUrl} alt={img.alt ?? img.title} fill className="object-cover" sizes="200px" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-night/80 via-transparent to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex justify-end gap-1">
                  <button onClick={() => openEdit(img)} className="rounded-sm bg-paper/90 p-1 text-night hover:bg-gold" aria-label="Edit image">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(img.id)} className="rounded-sm bg-paper/90 p-1 text-night hover:bg-rose-500" aria-label="Delete image">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <p className="text-xs font-semibold text-paper">{img.title}</p>
                  <p className="text-[0.6rem] uppercase tracking-wider text-paper/60">
                    {img.category.replace(/_/g, " ").toLowerCase()} · {img.active ? "live" : "hidden"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Edit image" : "Add image"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={GALLERY_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
          />
          <Input label="Image URL *" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" />
          <Input label="Alt text" value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} />
          <div className="grid grid-cols-2 items-end gap-3">
            <Input label="Order" type="number" min={0} value={form.ordering} onChange={(e) => setForm({ ...form, ordering: e.target.value })} />
            <div className="flex items-center justify-center rounded-sm border border-white/15 py-3">
              <label className="flex items-center gap-2 text-sm text-paper/80">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-gold" />
                Visible on site
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{form.id ? "Save changes" : "Add image"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}