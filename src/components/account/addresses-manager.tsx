"use client";

import { useState } from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { upsertAddress, deleteAddress } from "@/app/actions/account";

type Address = {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string | null;
  isDefault: boolean;
};

type FormState = {
  id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
};

const empty: FormState = { label: "Home", street: "", city: "", state: "", zip: "", isDefault: false };

export function AddressesManager({ addresses }: { addresses: Address[] }) {
  const [list, setList] = useState(addresses);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setForm({ ...empty, isDefault: list.length === 0 });
    setOpen(true);
  }

  function openEdit(a: Address) {
    setForm({ id: a.id, label: a.label, street: a.street, city: a.city, state: a.state, zip: a.zip ?? "", isDefault: a.isDefault });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await upsertAddress(form);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not save address.");
      return;
    }
    toast.success("Address saved.");
    setOpen(false);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    const result = await deleteAddress(id);
    if (!result.ok) {
      toast.error(result.error ?? "Could not delete address.");
      return;
    }
    toast.success("Address deleted.");
    setList((l) => l.filter((a) => a.id !== id));
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{list.length} saved address{list.length === 1 ? "" : "es"}</p>
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" /> Add address
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="card-shell mt-4 flex flex-col items-center p-10 text-center">
          <MapPin className="h-9 w-9 text-ink/15" />
          <p className="mt-3 font-serif text-lg text-ink">No saved addresses</p>
          <p className="mt-1 text-sm text-ink-muted">Add your delivery address for one-tap checkout.</p>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {list.map((a) => (
            <li key={a.id} className={cn("card-shell relative p-5", a.isDefault && "border-gold/50 ring-1 ring-gold/30")}>
              <p className="flex items-center gap-2 font-serif text-lg text-ink">
                <MapPin className="h-4 w-4 text-gold" />
                {a.label}
                {a.isDefault && <span className="badge ml-auto">Default</span>}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {a.street}<br />
                {a.city}, {a.state} {a.zip}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(a)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)} className="text-burgundy hover:text-burgundy">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Edit address" : "Add address"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Label" placeholder="Home, Office…" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <Input label="Street address" placeholder="12 Adeola Odeku St" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" placeholder="Victoria Island" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input label="State" placeholder="Lagos" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <Input label="Postal code (optional)" placeholder="101241" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="h-4 w-4 accent-burgundy"
            />
            Make this my default address
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save address</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}