"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/providers/cart-provider";
import { cartItemKey } from "@/lib/cart";
import { cn, formatMoney as fmtMoney } from "@/lib/utils";
import { validateCoupon } from "@/app/actions/orders";

export function CartView() {
  const {
    items,
    coupon,
    setCoupon,
    updateQty,
    removeItem,
    totals,
    meta,
    isAuthed,
    hydrated,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [applying, setApplying] = useState(false);

  const groupedItems = useMemo(() => items, [items]);

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setApplying(true);
    const result = await validateCoupon({
      code: couponInput.trim(),
      subtotal: totals.subtotal,
      deliveryFee: meta.deliveryFee,
    });
    setApplying(false);
    if (!result.ok || !result.coupon) {
      toast.error(result.error ?? "Coupon is not valid.");
      return;
    }
    setCoupon(result.coupon);
    setCouponInput("");
    toast.success(`Coupon ${result.coupon.code} applied`);
  }

  if (!hydrated) {
    return <div className="grid gap-6 py-8 lg:grid-cols-[1fr_360px]">{<SkeletonRows />}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="border border-ink/10 bg-paper-card px-6 py-20 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-ink-faint" />
        <h2 className="mt-5 font-serif text-2xl text-ink">Your cart is empty</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
          Start with our smoky jollof, sizzling suya or a comforting bowl of pepper soup.
        </p>
        <Link href="/menu" className="btn-primary mt-8">
          Explore the Menu <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        {groupedItems.map((item) => {
          const key = cartItemKey(item);
          const unitPrice = item.price + (item.options ?? []).reduce((s, o) => s + o.priceModifier, 0);
          return (
            <article key={key} className="card-shell flex gap-4 p-4 sm:gap-5">
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-sm sm:w-28">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="120px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-paper-deep text-xs text-ink-faint">
                    Chow Heaven
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-base text-ink sm:text-lg">{item.name}</h3>
                    {item.categoryName && <p className="text-xs text-ink-faint">{item.categoryName}</p>}
                  </div>
                  <button
                    onClick={() => removeItem(key)}
                    className="text-ink-faint transition-colors hover:text-burgundy"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {(item.options ?? []).length > 0 && (
                  <p className="mt-1 text-xs text-ink-muted">
                    {(item.options ?? []).map((o) => `${o.optionName}`).join(" · ")}
                  </p>
                )}
                {item.note && <p className="mt-1 text-xs italic text-ink-faint">“{item.note}”</p>}

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-sm border border-ink/15">
                    <button
                      onClick={() => updateQty(key, item.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink hover:bg-ink/5"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold" aria-live="polite">{item.qty}</span>
                    <button
                      onClick={() => updateQty(key, item.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink hover:bg-ink/5"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-faint">
                      {fmtMoney(unitPrice)} × {item.qty}
                    </p>
                    <p className="font-serif text-base font-bold text-burgundy">{fmtMoney(unitPrice * item.qty)}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <div className="flex items-center justify-between pt-2">
          <Link href="/menu" className="link-quiet text-sm font-semibold text-ink">
            ← Continue shopping
          </Link>
        </div>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 h-fit">
        <div className="card-shell p-6">
          <h2 className="font-serif text-xl text-ink">Order Summary</h2>

          <div className="mt-5 space-y-2.5 text-sm">
            <Row label={`Subtotal (${items.reduce((s, i) => s + i.qty, 0)} items)`} value={fmtMoney(totals.subtotal)} />
            <Row label="Delivery" value={totals.deliveryFee > 0 ? fmtMoney(totals.deliveryFee) : "Free"} />
            {totals.discount > 0 && (
              <div className="flex justify-between gap-3 font-medium text-gold-deep">
                <span>Discount {coupon ? `(${coupon.code})` : ""}</span>
                <span>-{fmtMoney(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-bold text-ink">
              <span>Total</span>
              <span className="text-burgundy">{fmtMoney(totals.total)}</span>
            </div>
          </div>

          {!coupon ? (
            <div className="mt-5">
              <label htmlFor="coupon" className="label-field">Coupon code</label>
              <div className="flex gap-2">
                <input
                  id="coupon"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  placeholder="e.g. CHOW10"
                  className="input-field py-2.5"
                />
                <button onClick={applyCoupon} disabled={applying || !couponInput} className="btn bg-ink px-4 py-2.5 text-xs text-paper hover:bg-burgundy">
                  {applying ? "…" : "Apply"}
                </button>
              </div>
              {!isAuthed && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-faint">
                  <Tag className="h-3 w-3" /> Checkout works without an account too.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-5 flex items-center justify-between rounded-sm border border-gold/40 bg-gold/5 px-3 py-2 text-sm">
              <span className="font-bold text-gold-deep">{coupon.code} applied</span>
              <button onClick={() => setCoupon(null)} className="text-xs font-semibold text-ink-muted hover:text-burgundy">
                Remove
              </button>
            </div>
          )}

          {totals.discount > 0 && totals.deliveryFee === 0 && items.length > 0 && (
            <p className="mt-3 text-xs text-ink-faint">
              {coupon?.discountType === "FREE_DELIVERY" ? "Delivery is on us." : "Enjoy your savings."}
            </p>
          )}

          <Link
            href={isAuthed ? "/checkout" : "/checkout"}
            className={cn("btn-primary mt-6 w-full justify-center")}
            aria-disabled={items.length === 0}
          >
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-center text-xs text-ink-faint">
            Prices verified at checkout. Pay with card, transfer, USSD or on pickup.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-ink-muted">
      <span>{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

function SkeletonRows() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4">
          <div className="skeleton h-24 w-24" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-3 w-1/3" />
          </div>
        </div>
      ))}
    </>
  );
}