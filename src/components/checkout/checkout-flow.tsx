"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Banknote,
  CreditCard,
  Smartphone,
  Store,
  Truck,
  CircleDollarSign,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/components/providers/cart-provider";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatMoney } from "@/lib/utils";
import { customerDetailsSchema } from "@/lib/validation";
import { PAYMENT_METHODS } from "@/lib/constants";
import { submitOrder, processPayment, validateCoupon } from "@/app/actions/orders";
import type { CustomerDetailsInput } from "@/lib/validation";

const STEPS = ["Your details", "Order type", "Summary", "Payment", "Done"] as const;

type StepIndex = 0 | 1 | 2 | 3 | 4;

const methodIcon: Record<string, React.ReactNode> = {
  card: <CreditCard className="h-5 w-5" />,
  bank_transfer: <Banknote className="h-5 w-5" />,
  ussd: <Smartphone className="h-5 w-5" />,
  pay_on_pickup: <CircleDollarSign className="h-5 w-5" />,
};

export function CheckoutFlow() {
  const router = useRouter();
  const { items, totals, meta, clearCart, coupon, setCoupon } = useCart();
  const [step, setStep] = useState<StepIndex>(0);
  const [details, setDetails] = useState<CustomerDetailsInput>({
    fullName: "",
    phone: "",
    email: "",
    note: "",
    street: "",
    city: "",
    state: "",
    scheduledFor: "",
  });
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [method, setMethod] = useState<string>("card");
  const [paymentState, setPaymentState] = useState<"pending" | "processing" | "successful" | "failed">("pending");
  const [placing, setPlacing] = useState(false);
  const [orderResult, setOrderResult] = useState<{ id: string; ref: string } | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const orderIdRef = useRef<string | null>(null);

  const deliveryAddressMissing = useMemo(
    () => !details.street?.trim() || !details.city?.trim() || !details.state?.trim(),
    [details],
  );

  if (!items.length && step === 0) {
    return (
      <div className="border border-ink/10 bg-paper-card px-6 py-16 text-center">
        <Store className="mx-auto h-10 w-10 text-ink-faint" />
        <h2 className="mt-5 font-serif text-2xl">Your cart is empty</h2>
        <button onClick={() => router.push("/menu")} className="btn-primary mt-8">Browse the Menu</button>
      </div>
    );
  }

  function validateStep1(): boolean {
    const result = customerDetailsSchema.safeParse(details);
    if (!result.success) {
      setDetailsError(result.error.issues[0]?.message ?? "Please complete your details.");
      return false;
    }
    setDetailsError(null);
    setDetails(result.data);
    return true;
  }

  async function handlePlaceOrder() {
    if (!items.length) return;
    setPlacing(true);
    setPaymentState("pending");

    const result = await submitOrder(
      {
        orderType,
        customerName: details.fullName.trim(),
        customerPhone: details.phone.trim(),
        customerEmail: details.email || null,
        note: details.note || null,
        scheduledFor: details.scheduledFor || null,
        address: orderType === "DELIVERY"
          ? { street: details.street!, city: details.city!, state: details.state! }
          : null,
        couponCode: coupon?.code ?? null,
      },
      items.map((i) => ({
        itemId: i.itemId,
        qty: i.qty,
        options: i.options ?? [],
        note: i.note,
      })),
    );

    if (!result.ok || !result.orderId || !result.paymentRef) {
      setPaymentState("failed");
      setPlacing(false);
      toast.error(result.error ?? "We couldn't place your order. Please try again.");
      return;
    }

    orderIdRef.current = result.orderId;
    setOrderResult({ id: result.orderId, ref: result.paymentRef });

    // Process payment through the state machine: PENDING → PROCESSING → SUCCESSFUL/FAILED
    setPaymentState("processing");
    const pay = await processPayment(result.orderId);
    if (!pay.ok) {
      setPaymentState("failed");
      setPlacing(false);
      toast.error(pay.error ?? "Payment was declined.");
      return;
    }
    setPaymentState("successful");
    clearCart();
    setPlacing(false);
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function retryPayment(causedByDemoFailure: boolean) {
    if (!orderIdRef.current) return;
    setPlacing(true);
    setPaymentState("processing");
    if (causedByDemoFailure) {
      // A failed payment was simulated; reset so a genuine attempt can succeed.
      const { resetPaymentForRetry } = await import("@/app/actions/orders");
      const reset = await resetPaymentForRetry(orderIdRef.current);
      if (!reset.ok) {
        setPlacing(false);
        toast.error(reset.error ?? "Unable to retry. Please start a new order.");
        return;
      }
    }
    const pay = await processPayment(orderIdRef.current);
    if (!pay.ok) {
      setPaymentState("failed");
      setPlacing(false);
      toast.error(pay.error ?? "Payment was declined.");
      return;
    }
    setPaymentState("successful");
    clearCart();
    setPlacing(false);
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function simulateFailure() {
    if (!orderIdRef.current) return;
    setPlacing(true);
    setPaymentState("processing");
    const pay = await processPayment(orderIdRef.current, { fail: true });
    setPaymentState("failed");
    setPlacing(false);
    toast.error(pay.error ?? "Payment declined (demo).");
  }

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    const res = await validateCoupon({ code: couponInput.trim(), subtotal: totals.subtotal, deliveryFee: meta.deliveryFee });
    setApplyingCoupon(false);
    if (!res.ok || !res.coupon) {
      toast.error(res.error ?? "Coupon not valid.");
      return;
    }
    setCoupon(res.coupon);
    setCouponInput("");
    toast.success(`Coupon ${res.coupon.code} applied`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <ol className="flex items-center gap-1 overflow-x-auto pb-4 text-xs font-semibold uppercase tracking-wider">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={label} className="flex shrink-0 items-center gap-1">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[10px]",
                    done && "border-burgundy bg-burgundy text-paper",
                    active && "border-ink bg-ink text-paper",
                    !done && !active && "border-ink/20 text-ink-faint",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={cn("px-1", active ? "text-ink" : "text-ink-faint", done && "text-ink-muted")}>
                  {label}
                </span>
                {i < STEPS.length - 1 && <span className="h-px w-6 bg-ink/15 sm:w-10" />}
              </li>
            );
          })}
        </ol>

        <div className="card-shell p-6 sm:p-8">
          {/* STEP 1 — DETAILS */}
          {step === 0 && (
            <div>
              <h2 className="font-serif text-2xl text-ink">Customer details</h2>
              <p className="mt-1 text-sm text-ink-muted">Where should we deliver, and how can we reach you?</p>
              {detailsError && (
                <p className="mt-3 rounded-sm border border-burgundy/30 bg-burgundy/5 px-3 py-2 text-sm text-burgundy" role="alert">
                  {detailsError}
                </p>
              )}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input label="Full name *" placeholder="Ada Obi" value={details.fullName} onChange={(e) => setDetails({ ...details, fullName: e.target.value })} />
                <Input label="Phone *" type="tel" placeholder="+234 800 000 0000" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} />
              </div>
              <div className="mt-4">
                <Input label="Email" type="email" placeholder="you@email.com (for order updates)" value={details.email ?? ""} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
              </div>
              <div className="mt-6">
                <p className="label-field">Delivery address (for delivery orders)</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <Input placeholder="Street address, building, apartment" value={details.street ?? ""} onChange={(e) => setDetails({ ...details, street: e.target.value })} aria-label="Street address" />
                  </div>
                  <Input placeholder="City / Area" value={details.city ?? ""} onChange={(e) => setDetails({ ...details, city: e.target.value })} aria-label="City" />
                  <Input placeholder="State" value={details.state ?? ""} onChange={(e) => setDetails({ ...details, state: e.target.value })} aria-label="State" />
                  <Input placeholder="Optional scheduled delivery date & time" type="datetime-local" value={details.scheduledFor ?? ""} onChange={(e) => setDetails({ ...details, scheduledFor: e.target.value })} aria-label="Scheduled delivery" className="text-xs" />
                </div>
              </div>
              <div className="mt-4">
                <Textarea label="Order note" placeholder="Anything for the kitchen? (allergies, extra spice…)" value={details.note ?? ""} onChange={(e) => setDetails({ ...details, note: e.target.value })} />
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => validateStep1() && setStep(1)}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 — ORDER TYPE */}
          {step === 1 && (
            <div>
              <h2 className="font-serif text-2xl text-ink">How would you like your order?</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <OrderTypeCard
                  active={orderType === "DELIVERY"}
                  onSelect={() => setOrderType("DELIVERY")}
                  icon={<Truck className="h-6 w-6" />}
                  title="Delivery"
                  desc={`We bring it to your door — ${formatMoney(meta.deliveryFee)} fee`}
                />
                <OrderTypeCard
                  active={orderType === "PICKUP"}
                  onSelect={() => setOrderType("PICKUP")}
                  icon={<Store className="h-6 w-6" />}
                  title="Pickup"
                  desc="Collect from our kitchen, free"
                />
              </div>
              {orderType === "DELIVERY" && deliveryAddressMissing && (
                <p className="mt-4 flex items-start gap-2 rounded-sm border border-gold/40 bg-gold/5 px-3 py-2 text-sm text-ink-muted">
                  <ArrowLeft className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  Add your delivery address in step 1 before continuing.
                </p>
              )}
              <div className="mt-8 flex items-center justify-between">
                <button onClick={() => setStep(0)} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Back</button>
                <Button
                  onClick={() => {
                    if (orderType === "DELIVERY" && deliveryAddressMissing) {
                      toast.error("Please add your delivery address first.");
                      setStep(0);
                      return;
                    }
                    setStep(2);
                  }}
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 — SUMMARY */}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-2xl text-ink">Review your order</h2>
              <div className="mt-6 space-y-3">
                {items.map((item) => (
                  <div key={`${item.itemId}-${(item.options ?? []).map((o) => o.optionName).join("~")}`} className="flex items-center justify-between gap-4 border-b border-ink/5 pb-3 text-sm">
                    <div>
                      <p className="font-semibold text-ink">{item.qty} × {item.name}</p>
                      {(item.options ?? []).length > 0 && (
                        <p className="mt-0.5 text-xs text-ink-muted">{(item.options ?? []).map((o) => o.optionName).join(" · ")}</p>
                      )}
                    </div>
                    <span className="font-medium text-ink">{formatMoney((item.price + (item.options ?? []).reduce((s, o) => s + o.priceModifier, 0)) * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-sm border border-ink/10 bg-paper-warm p-4 text-sm">
                <p className="font-semibold uppercase tracking-wider text-ink-faint">Delivery details</p>
                <p className="mt-1.5 text-ink">{orderType === "DELIVERY" ? details.fullName : "Pickup"}</p>
                <p className="text-ink-muted">
                  {orderType === "DELIVERY" ? `${details.street}, ${details.city}, ${details.state}` : "Chow Heaven, 42 Market Street, Lagos Island"}
                </p>
                <p className="mt-1 text-ink-muted">{details.phone}</p>
                {details.note && <p className="mt-1 text-ink-faint">Note: {details.note}</p>}
                {details.scheduledFor && <p className="mt-1 text-ink-faint">Scheduled: {new Date(details.scheduledFor).toLocaleString()}</p>}
              </div>

              {coupon ? (
                <div className="mt-4 flex items-center justify-between rounded-sm border border-gold/40 bg-gold/5 px-3 py-2 text-sm">
                  <span className="font-bold text-gold-deep"><Tag className="mr-1 inline h-3.5 w-3.5" />{coupon.code} applied</span>
                  <button onClick={() => setCoupon(null)} className="text-xs font-semibold text-ink-muted hover:text-burgundy">Remove</button>
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <Input placeholder="Coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className="py-2.5" aria-label="Coupon code" />
                  <Button variant="dark" size="md" onClick={applyCoupon} loading={applyingCoupon}>Apply</Button>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button onClick={() => setStep(1)} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Back</button>
                <Button onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                  Continue to Payment <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4 — PAYMENT */}
          {step === 3 && (
            <div>
              <h2 className="font-serif text-2xl text-ink">Payment</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                <ShieldCheck className="h-4 w-4 text-gold" /> Payments are tokenised through a secure provider — we never see your card details.
              </p>

              <div className="mt-6 grid gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMethod(m.value)}
                    className={cn(
                      "flex items-center gap-4 rounded-sm border px-4 py-3.5 text-left transition-all",
                      method === m.value ? "border-ink bg-ink text-paper" : "border-ink/15 bg-paper-card text-ink hover:border-ink/30",
                    )}
                    aria-pressed={method === m.value}
                  >
                    <span className={method === m.value ? "text-gold-soft" : "text-ink-faint"}>{methodIcon[m.value]}</span>
                    <span>
                      <span className="block text-sm font-bold">{m.label}</span>
                      <span className={cn("block text-xs", method === m.value ? "text-paper/60" : "text-ink-faint")}>{m.hint}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-sm border border-ink/10 bg-paper-warm p-4 text-sm">
                <div className="flex justify-between"><span className="text-ink-muted">Subtotal</span><span>{formatMoney(totals.subtotal)}</span></div>
                <div className="mt-1 flex justify-between"><span className="text-ink-muted">Delivery</span><span>{totals.deliveryFee > 0 ? formatMoney(totals.deliveryFee) : "Free"}</span></div>
                {totals.discount > 0 && (
                  <div className="mt-1 flex justify-between text-gold-deep"><span>Discount</span><span>-{formatMoney(totals.discount)}</span></div>
                )}
                <div className="mt-2 flex justify-between border-t border-ink/10 pt-2 font-serif text-lg font-bold text-ink">
                  <span>Total due</span>
                  <span className="text-burgundy">{formatMoney(totals.total)}</span>
                </div>
              </div>

              {/* Payment states */}
              <div className="mt-6">
                {!orderIdRef.current && paymentState === "pending" && (
                  <Button onClick={handlePlaceOrder} disabled={placing} loading={placing} className="w-full">
                    Pay {formatMoney(totals.total)}
                  </Button>
                )}

                {paymentState === "processing" && (
                  <div className="flex items-center justify-center gap-3 rounded-sm border border-gold/40 bg-gold/5 px-4 py-4 text-sm text-ink-muted">
                    <CircleDollarSign className="h-5 w-5 animate-pulse text-gold" />
                    Processing your payment… please don&apos;t close this page.
                  </div>
                )}

                {paymentState === "failed" && (
                  <div className="rounded-sm border border-burgundy/30 bg-burgundy/5 p-4">
                    <p className="text-sm font-semibold text-burgundy">Payment failed</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      We couldn&apos;t confirm your payment. Check your details and try again —
                      your order is safe and waiting.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button onClick={() => retryPayment(true)} loading={placing}>Try payment again</Button>
                      <button onClick={() => router.push("/cart")} className="btn-ghost">Back to cart</button>
                    </div>
                    {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && !placing && (
                      <button onClick={() => { simulateFailure(); }} className="mt-3 inline-block text-xs text-ink-faint underline decoration-dotted underline-offset-4 hover:text-ink-muted">
                        Demo: replay the declined-payment simulation
                      </button>
                    )}
                  </div>
                )}

                {paymentState === "successful" && (
                  <div className="flex items-center gap-3 rounded-sm border border-gold/40 bg-gold/5 px-4 py-3 text-sm font-semibold text-gold-deep">
                    <Check className="h-5 w-5" /> Payment confirmed — creating your confirmation…
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5 — CONFIRMATION */}
          {step === 4 && orderResult && (
            <div>
              <div className="flex flex-col items-center py-6 text-center">
                <span className="animate-pop-in flex h-16 w-16 items-center justify-center rounded-full bg-gold text-night">
                  <Check className="h-8 w-8" />
                </span>
                <h2 className="mt-6 font-serif text-3xl text-ink">Thank you — your order is in!</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                  We&apos;ve received your order and are preparing it with care. You&apos;ll get an
                  update as soon as it moves to the kitchen.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button variant="gold" onClick={() => router.push(`/order/track?id=${orderResult.id}&key=${orderResult.ref}`)}>
                    Track my order <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/menu")}>Continue shopping</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Totals sidebar */}
      <aside className="lg:sticky lg:top-28 h-fit">
        <div className="card-shell p-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-ink">Order summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            {items.slice(0, 6).map((item) => (
              <div key={`${item.itemId}-${(item.options ?? []).length}`} className="flex justify-between gap-3 text-ink-muted">
                <span className="truncate">{item.qty} × {item.name}</span>
                <span className="shrink-0 font-medium text-ink">{formatMoney((item.price + (item.options ?? []).reduce((s, o) => s + o.priceModifier, 0)) * item.qty)}</span>
              </div>
            ))}
            {items.length > 6 && <p className="text-xs text-ink-faint">+{items.length - 6} more</p>}
          </div>
          <div className="mt-4 space-y-1.5 border-t border-ink/10 pt-3 text-sm">
            <div className="flex justify-between text-ink-muted"><span>Subtotal</span><span>{formatMoney(totals.subtotal)}</span></div>
            <div className="flex justify-between text-ink-muted"><span>Delivery</span><span>{totals.deliveryFee > 0 ? formatMoney(totals.deliveryFee) : "Free"}</span></div>
            {totals.discount > 0 && <div className="flex justify-between text-gold-deep"><span>Discount</span><span>-{formatMoney(totals.discount)}</span></div>}
            <div className="flex justify-between pt-1 font-serif text-lg font-bold text-ink">
              <span>Total</span>
              <span className="text-burgundy">{formatMoney(totals.total)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function OrderTypeCard({ active, onSelect, icon, title, desc }: {
  active: boolean; onSelect: () => void; icon: React.ReactNode; title: string; desc: string;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex items-start gap-4 rounded-sm border p-5 text-left transition-all",
        active ? "border-ink bg-ink text-paper shadow-lift" : "border-ink/15 bg-paper-card text-ink hover:border-ink/30",
      )}
      aria-pressed={active}
    >
      <span className={active ? "text-gold-soft" : "text-gold"}>{icon}</span>
      <span>
        <span className="block text-base font-bold">{title}</span>
        <span className={cn("mt-0.5 block text-xs", active ? "text-paper/60" : "text-ink-muted")}>{desc}</span>
      </span>
    </button>
  );
}