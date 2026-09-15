"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Flame, Leaf, Check } from "lucide-react";

import { formatMoney, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type Option = {
  id: string;
  groupName: string;
  optionName: string;
  priceModifier: number;
  isDefault: boolean;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl?: string | null;
  ingredients: string[];
  allergens: string[];
  spiceLevel: number;
  isVegetarian: boolean;
  tags: string[];
  categoryName: string | null;
  options: Option[];
};

export type SelectedOption = { groupName: string; optionName: string; priceModifier: number };

type Props = {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (qty: number, opts: SelectedOption[], note: string) => void;
};

export function FoodDetailModal({ item, isOpen, onClose, onAdd }: Props) {
  const [qty, setQty] = useState(1);
  const [selections, setSelections] = useState<Record<string, Option>>({});
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!item) return;
    setQty(1);
    setNote("");
    setAdding(false);
    setJustAdded(false);
    const defaults: Record<string, Option> = {};
    for (const opt of item.options) {
      if (opt.isDefault && !defaults[opt.groupName]) defaults[opt.groupName] = opt;
    }
    setSelections(defaults);
  }, [item]);

  const basePrice = item ? (item.discountPrice ?? item.price) : 0;
  const modifierTotal = useMemo(
    () => Object.values(selections).reduce((sum, o) => sum + (o.priceModifier ?? 0), 0),
    [selections],
  );
  const unitTotal = basePrice + modifierTotal;

  const grouped = useMemo(() => {
    const map: Record<string, Option[]> = {};
    for (const opt of item?.options ?? []) {
      (map[opt.groupName] ??= []).push(opt);
    }
    return map;
  }, [item]);

  if (!item) return null;

  function select(groupName: string, opt: Option) {
    setSelections((prev) => ({ ...prev, [groupName]: opt }));
  }

  function handleAdd() {
    setAdding(true);
    const opts = Object.values(selections).map((o) => ({ groupName: o.groupName, optionName: o.optionName, priceModifier: o.priceModifier }));
    window.setTimeout(() => {
      onAdd(qty, opts, note);
      setAdding(false);
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1400);
    }, 500);
  }

  return (
    <Modal open={isOpen} onClose={onClose} wide>
      <div className="grid md:grid-cols-2">
        <div className="relative -m-6 mb-0 aspect-[4/3] md:m-0 md:aspect-auto md:min-h-[320px] md:rounded-l-sm">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="rounded-t-sm object-cover md:rounded-l-sm md:rounded-tr-none"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-paper-deep text-sm text-ink-faint">No image</div>
          )}
        </div>

        <div className="flex flex-col gap-4 py-2 md:py-0 md:pl-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-faint">
              <span className="text-gold">{item.categoryName ?? "Signature"}</span>
              {item.spiceLevel > 0 && (
                <span className="inline-flex items-center gap-1 text-burgundy">
                  <Flame className="h-3 w-3" /> {"🌶".repeat(item.spiceLevel)}
                </span>
              )}
              {item.isVegetarian && (
                <span className="inline-flex items-center gap-1 text-ink-muted">
                  <Leaf className="h-3 w-3 text-ink-faint" /> Vegetarian
                </span>
              )}
            </div>
            <h3 className="mt-1.5 font-serif text-2xl text-ink">{item.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
          </div>

          {item.ingredients.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Ingredients</p>
              <p className="mt-1 text-sm text-ink/70">{item.ingredients.join(", ")}</p>
            </div>
          )}
          {item.allergens.length > 0 && (
            <div className="rounded-sm border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-ink-muted">
              <span className="font-bold text-gold-deep">Allergens:</span> {item.allergens.join(", ")}
            </div>
          )}

          {Object.entries(grouped).length > 0 && (
            <div className="space-y-3">
              {Object.entries(grouped).map(([groupName, options]) => (
                <fieldset key={groupName}>
                  <legend className="text-xs font-bold uppercase tracking-wider text-ink-muted">{groupName}</legend>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {options.map((opt) => {
                      const active = selections[groupName]?.id === opt.id;
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => select(groupName, opt)}
                          className={cn(
                            "rounded-sm border px-3 py-1.5 text-xs font-medium transition-all",
                            active
                              ? "border-ink bg-ink text-paper"
                              : "border-ink/15 bg-paper-card text-ink-muted hover:border-ink/30 hover:text-ink",
                          )}
                          aria-pressed={active}
                        >
                          {opt.optionName}
                          {opt.priceModifier > 0 && <span className="ml-1 text-gold">+{formatMoney(opt.priceModifier)}</span>}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          )}

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Order note</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Extra spice, no onions"
              className="input-field mt-1.5 py-2.5 text-sm"
            />
          </label>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
            <div className="inline-flex items-center rounded-sm border border-ink/15">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-ink hover:bg-ink/5 disabled:opacity-30"
                aria-label="Decrease quantity"
                disabled={qty <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-ink" aria-live="polite">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="flex h-10 w-10 items-center justify-center text-ink hover:bg-ink/5"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-faint">Total</p>
              <p className="font-serif text-xl font-bold text-burgundy" aria-live="polite">
                {formatMoney(unitTotal * qty)}
              </p>
            </div>
          </div>

          <Button onClick={handleAdd} loading={adding} className="w-full">
            {justAdded ? (
              <>
                <Check className="h-4 w-4" /> Added to Cart
              </>
            ) : (
              `Add to Cart · ${formatMoney(unitTotal * qty)}`
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}