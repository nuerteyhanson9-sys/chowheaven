"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PackageOpen, Star } from "lucide-react";
import { toast } from "sonner";

import { cn, formatMoney, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { submitReview } from "@/app/actions/reviews";

type OrderItemLite = {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string | null;
};

type OrderCardProps = {
  id: string;
  orderNumber: number;
  createdAt: Date;
  status: string;
  total: { toNumber(): number };
  items: OrderItemLite[];
  reviewed?: boolean;
  compact?: boolean;
};

export function OrderCard({ id, orderNumber, createdAt, status, total, items, reviewed = false, compact = false }: OrderCardProps) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canReview = status === "DELIVERED" && !reviewed && !submitted;
  const firstItem = items[0];

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await submitReview({ orderId: id, rating, comment });
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error ?? "Could not submit your review.");
      return;
    }
    setSubmitted(true);
    toast.success("Review submitted — thank you!");
  }

  return (
    <li className="card-shell overflow-hidden transition-shadow hover:shadow-xl hover:shadow-night/[0.08]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-paper-warm/60 px-5 py-3.5">
        <Link href={`/order/track?number=${orderNumber}`} className="flex items-center gap-3">
          {firstItem?.imageUrl ? (
            <Image src={firstItem.imageUrl} alt={firstItem.name} width={40} height={40} className="h-10 w-10 rounded-sm object-cover" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/20 text-gold-deep">
              <PackageOpen className="h-5 w-5" />
            </span>
          )}
          <div>
            <p className="text-sm font-bold text-ink">
              Order <span className="font-mono">#{String(orderNumber).padStart(4, "0")}</span>
            </p>
            <p className="text-xs text-ink-muted">{formatDateTime(createdAt)}</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className={cn("badge", status === "CANCELLED" && "badge--muted", status === "DELIVERED" && "badge--success")}>
            {ORDER_STATUS_LABEL[status] ?? status}
          </span>
          <p className="font-serif text-lg font-semibold text-burgundy">{formatMoney(total.toNumber())}</p>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 px-5 py-4 sm:flex-row sm:items-center">
        <ul className="min-w-0 space-y-1">
          {items.slice(0, compact ? 2 : 4).map((it) => (
            <li key={it.id} className="flex items-center gap-2 text-sm">
              <span className="font-mono text-xs text-ink-faint">{it.quantity}×</span>
              <span className="truncate text-ink">{it.name}</span>
            </li>
          ))}
          {items.length > 4 && <li className="text-xs text-ink-faint">+ {items.length - 4} more item{items.length - 4 > 1 ? "s" : ""}</li>}
        </ul>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link href={`/order/track?number=${orderNumber}`} className="btn-outline">
            Track order
          </Link>
          {canReview && (
            <Button variant="dark" onClick={() => setReviewOpen(true)}>
              <Star className="mr-1.5 h-4 w-4" /> Review
            </Button>
          )}
        </div>
      </div>

      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} title="How was your order?">
        {submitted ? (
          <div className="py-3 text-center">
            <Star className="mx-auto h-10 w-10 text-gold" fill="currentColor" />
            <p className="mt-3 font-serif text-lg text-ink">Review submitted</p>
            <p className="mt-1 text-sm text-ink-muted">Thank you for your feedback — it helps our kitchen improve.</p>
            <Button className="mt-5" onClick={() => setReviewOpen(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleReview}>
            <div className="flex items-center justify-center gap-1 py-3" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={cn("p-1 transition-transform hover:scale-110", n <= rating ? "text-gold" : "text-ink/15")}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  <Star className="h-8 w-8" fill={n <= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <Textarea label="Your review (optional)" placeholder="What stood out? What could we do better?" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setReviewOpen(false)}>Cancel</Button>
              <Button type="submit" loading={submitting}>Submit Review</Button>
            </div>
          </form>
        )}
      </Modal>
    </li>
  );
}