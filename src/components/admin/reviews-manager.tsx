"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { updateReviewApproval, deleteReview } from "@/app/actions/reviews";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  createdAt: Date;
  customerName: string;
};

export function ReviewsManager({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(id: string, approved: boolean) {
    setBusy(id);
    const result = await updateReviewApproval(id, approved);
    setBusy(null);
    if (!result.ok) {
      toast.error(result.error ?? "Could not update review.");
      return;
    }
    toast.success(approved ? "Review approved — it's now live." : "Review withdrawn from public site.");
    router.refresh();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this review permanently?")) return;
    setBusy(id);
    const result = await deleteReview(id);
    setBusy(null);
    if (!result.ok) {
      toast.error(result.error ?? "Could not delete review.");
      return;
    }
    toast.success("Review deleted.");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {reviews.length === 0 ? (
        <div className="rounded-sm border border-white/10 bg-white/5 p-10 text-center text-sm text-paper/50">No reviews yet.</div>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="rounded-sm border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="font-medium text-paper">{r.customerName}</p>
                <span className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={cn("h-3.5 w-3.5", n <= r.rating ? "fill-gold text-gold" : "text-paper/20")} />
                  ))}
                </span>
                <span className="text-xs text-paper/40">· {timeAgo(r.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("rounded-sm px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider", r.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800")}>
                  {r.approved ? "Live" : "Pending"}
                </span>
                <Button size="sm" variant="ghost" disabled={busy === r.id} onClick={() => toggle(r.id, !r.approved)} className="text-paper/60 hover:bg-white/10 hover:text-paper">
                  {r.approved ? "Unapprove" : "Approve"}
                </Button>
                <Button size="sm" variant="ghost" disabled={busy === r.id} onClick={() => remove(r.id)} className="text-rose-300 hover:bg-rose-500/10 hover:text-rose-200">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            {r.comment && <p className="mt-2 text-sm leading-relaxed text-paper/70">“{r.comment}”</p>}
          </div>
        ))
      )}
    </div>
  );
}