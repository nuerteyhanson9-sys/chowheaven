"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { formatDate, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { upsertCoupon, deleteCoupon } from "@/app/actions/admin";

type Coupon = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  expiryDate: Date | null;
  minOrderValue: number;
  usageLimit: number | null;
  usageCount: number;
  active: boolean;
};

type FormState = {
  id?: string;
  code: string;
  discountType: string;
  discountValue: string;
  expiryDate: string;
  minOrderValue: string;
  usageLimit: string;
  active: boolean;
};

const empty: FormState = { code: "", discountType: "PERCENTAGE", discountValue: "", expiryDate: "", minOrderValue: "", usageLimit: "", active: true };

export function CouponsManager({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setForm({ ...empty });
    setOpen(true);
  }

  function openEdit(c: Coupon) {
    setForm({
      id: c.id,
      code: c.code,
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().slice(0, 16) : "",
      minOrderValue: String(c.minOrderValue),
      usageLimit: c.usageLimit != null ? String(c.usageLimit) : "",
      active: c.active,
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await upsertCoupon(form);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not save coupon.");
      return;
    }
    toast.success(form.id ? "Coupon updated." : "Coupon created.");
    setOpen(false);
    router.refresh();
  }

  async function handleDelete(c: Coupon) {
    if (!window.confirm(`Delete coupon "${c.code}"?`)) return;
    const result = await deleteCoupon(c.id);
    if (!result.ok) {
      toast.error(result.error ?? "Could not delete coupon.");
      return;
    }
    toast.success("Coupon deleted.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="gold" onClick={openNew}>
          <Plus className="h-4 w-4" /> Create coupon
        </Button>
      </div>

      {coupons.length === 0 ? (
        <div className="rounded-sm border border-white/10 bg-white/5 p-10 text-center text-sm text-paper/50">No coupons yet.</div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-paper/50">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Value</th>
                <th className="hidden px-4 py-3 md:table-cell">Min order</th>
                <th className="hidden px-4 py-3 md:table-cell">Expiry</th>
                <th className="hidden px-4 py-3 lg:table-cell">Usage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-mono font-semibold text-gold">{c.code}</td>
                  <td className="px-4 py-3 text-paper/70">{c.discountType.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-paper">
                    {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : formatMoney(c.discountValue)}
                  </td>
                  <td className="hidden px-4 py-3 text-paper/60 md:table-cell">{c.minOrderValue > 0 ? formatMoney(c.minOrderValue) : "—"}</td>
                  <td className="hidden px-4 py-3 text-paper/60 md:table-cell">{c.expiryDate ? formatDate(c.expiryDate) : "No limit"}</td>
                  <td className="hidden px-4 py-3 text-paper/60 lg:table-cell">{c.usageLimit != null ? `${c.usageCount}/${c.usageLimit}` : c.usageCount}</td>
                  <td className="px-4 py-3">
                    <span className={c.active ? "rounded-sm bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-emerald-800" : "rounded-sm bg-neutral-200 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-neutral-700"}>
                      {c.active ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="rounded-sm p-1.5 text-paper/50 hover:bg-white/10 hover:text-gold" aria-label="Edit coupon">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(c)} className="rounded-sm p-1.5 text-paper/50 hover:bg-rose-500/10 hover:text-rose-300" aria-label="Delete coupon">
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

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Edit coupon" : "Create coupon"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Code *" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER20" />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Discount type *"
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
              options={[
                { value: "PERCENTAGE", label: "% off subtotal" },
                { value: "FIXED", label: "Fixed amount" },
                { value: "FREE_DELIVERY", label: "Free delivery" },
              ]}
            />
            <Input
              label={form.discountType === "PERCENTAGE" ? "% *" : "Amount (₦) *"}
              type="number"
              min={0}
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Min order (₦)" type="number" min={0} value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
            <Input label="Usage limit" type="number" min={0} value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="Unlimited" />
          </div>
          <Input label="Expiry date" type="datetime-local" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
          <div className="mt-2">
            <label className="flex items-center gap-2 text-sm text-paper/80">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-gold" />
              Active (visible to customers)
            </label>
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