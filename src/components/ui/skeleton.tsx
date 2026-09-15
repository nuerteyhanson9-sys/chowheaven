"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} role="status" aria-label="Loading" />;
}

export function RatingStars({
  value,
  onChange,
  size = "md",
  readOnly = true,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-7 w-7" };
  return (
    <div
      className={cn("flex items-center gap-0.5", !readOnly && "select-none")}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange?.(star)}
            className={cn(
              !readOnly && "cursor-pointer transition-transform hover:scale-110",
              readOnly && "pointer-events-none",
            )}
          >
            <svg viewBox="0 0 24 24" className={cn(sizes[size], filled ? "text-gold" : "text-ink/15")} fill="currentColor" aria-hidden>
              <path d="M12 2.6l2.87 6.5 7.11.82-5.3 4.83 1.45 7.02L12 18.6l-6.13 3.17 1.45-7.02L2.02 9.92l7.11-.82L12 2.6z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}