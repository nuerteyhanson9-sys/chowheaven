"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { GALLERY_CATEGORIES } from "@/lib/constants";

type GalleryItem = {
  id: string;
  category: string;
  title: string;
  imageUrl: string;
  alt: string | null;
};

type Filter = "ALL" | (typeof GALLERY_CATEGORIES)[number]["value"];

export function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "ALL" ? items : items.filter((i) => i.category === filter);

  useEffect(() => {
    if (lightbox === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((v) => (v === null ? v : (v + 1) % filtered.length));
      if (e.key === "ArrowLeft") setLightbox((v) => (v === null ? v : (v - 1 + filtered.length) % filtered.length));
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [lightbox, filtered.length]);

  const active = lightbox !== null ? filtered[lightbox] : null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={cn(
            "rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all",
            filter === "ALL" ? "border-ink bg-ink text-paper" : "border-ink/15 bg-paper-card text-ink-muted hover:border-ink/30 hover:text-ink",
          )}
          aria-pressed={filter === "ALL"}
        >
          All
        </button>
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={cn(
              "rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all",
              filter === cat.value ? "border-ink bg-ink text-paper" : "border-ink/15 bg-paper-card text-ink-muted hover:border-ink/30 hover:text-ink",
            )}
            aria-pressed={filter === cat.value}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-ink-muted">No images in this category yet — check back soon.</p>
      ) : (
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setLightbox(index)}
              className="group mb-4 block w-full overflow-hidden focus-visible:outline-gold"
              aria-label={`View ${item.title}`}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.alt ?? item.title}
                  width={800}
                  height={600}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-night/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-left font-serif text-sm text-paper">{item.title}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {active && lightbox !== null && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={active.title}>
          <div className="absolute inset-0 bg-night/90 backdrop-blur-sm" onClick={() => setLightbox(null)} />
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full text-paper hover:bg-paper/10"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={() => setLightbox((lightbox - 1 + filtered.length) % filtered.length)}
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-paper hover:bg-paper/10 sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <figure className="relative z-[5] max-h-[85vh] w-full max-w-4xl">
            <Image
              src={active.imageUrl}
              alt={active.alt ?? active.title}
              width={1600}
              height={1200}
              className="max-h-[80vh] w-full rounded-sm object-contain"
            />
            <figcaption className="mt-3 flex items-center justify-between text-sm">
              <span className="font-serif text-paper">{active.title}</span>
              <span className="text-paper/50">{lightbox + 1} / {filtered.length}</span>
            </figcaption>
          </figure>
          <button
            onClick={() => setLightbox((lightbox + 1) % filtered.length)}
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-paper hover:bg-paper/10 sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </>
  );
}