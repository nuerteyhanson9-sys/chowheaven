"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Heart } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";
import { formatMoney, cn } from "@/lib/utils";
import { FoodDetailModal } from "@/components/menu/food-detail-modal";
import Image from "next/image";
import { toast } from "sonner";
import { toggleFavorite, getFavoriteIds } from "@/app/actions/favorites";

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
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  imageUrl?: string | null;
  ingredients: string[];
  allergens: string[];
  spiceLevel: number;
  isVegetarian: boolean;
  isFeatured: boolean;
  tags: string[];
  categoryName: string | null;
  categoryId: string;
  options: Option[];
};

type Category = { id: string; name: string; slug: string; description: string | null };

export function MenuClient({ categories, items }: { categories: Category[]; items: MenuItem[] }) {
  const { addItem, isAuthed: userId } = useCart();
  const [active, setActive] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const isAuthed = useCart().isAuthed;

  useEffect(() => {
    getFavoriteIds().then(setFavorites).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (active !== "ALL") {
      const cat = categories.find((c) => c.id === active || c.slug === active);
      if (cat) list = list.filter((i) => i.categoryId === cat.id);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [active, search, items, categories]);

  async function handleFav(e: React.MouseEvent, itemId: string) {
    e.stopPropagation();
    if (!isAuthed) {
      toast.info("Sign in to save favourites");
      return;
    }
    const res = await toggleFavorite(itemId);
    if (!res.ok) {
      toast.error(res.error ?? "Could not update favourite");
      return;
    }
    setFavorites((prev) => {
      const next = new Set(prev);
      if (res.added) next.add(itemId);
      else next.delete(itemId);
      return next;
    });
    toast.success(res.added ? "Added to favourites" : "Removed from favourites");
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar flex flex-wrap gap-2 overflow-x-auto pb-1">
          <FilterTab
            label="All"
            active={active === "ALL"}
            onClick={() => setActive("ALL")}
          />
          {categories.map((cat) => (
            <FilterTab
              key={cat.id}
              label={cat.name}
              active={active === cat.id}
              onClick={() => setActive(cat.id)}
            />
          ))}
        </div>
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="input-field pl-9 py-2.5"
            aria-label="Search menu items"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <SlidersHorizontal className="mx-auto h-8 w-8 text-ink-faint" />
          <p className="mt-4 font-serif text-lg text-ink">No dishes match your search.</p>
          <p className="mt-1 text-sm text-ink-muted">Try a different keyword or category.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              isFav={favorites.has(item.id)}
              onFav={(e) => handleFav(e, item.id)}
              onOpen={() => setDetailItem(item)}
              onQuickAdd={() => {
                addItem(
                  {
                    itemId: item.id,
                    name: item.name,
                    slug: item.slug,
                    price: item.discountPrice ?? item.price,
                    imageUrl: item.imageUrl,
                    categoryName: item.categoryName,
                    options: [],
                  },
                  1,
                );
                toast.success(`${item.name} added to cart`);
              }}
            />
          ))}
        </div>
      )}

      <FoodDetailModal
        item={detailItem}
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        onAdd={(qty, opts, note) => {
          if (!detailItem) return;
          const unitPrice = detailItem.discountPrice ?? detailItem.price;
          const modifierTotal = opts.reduce((s, o) => s + o.priceModifier, 0);
          addItem(
            {
              itemId: detailItem.id,
              name: detailItem.name,
              slug: detailItem.slug,
              price: unitPrice,
              imageUrl: detailItem.imageUrl,
              categoryName: detailItem.categoryName,
              options: opts.map((o) => ({ groupName: o.groupName, optionName: o.optionName, priceModifier: o.priceModifier })),
            },
            qty,
          );
          setDetailItem(null);
          toast.success(`${detailItem.name} added to cart`);
        }}
      />
    </>
  );
}

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all",
        active
          ? "border-ink bg-ink text-paper"
          : "border-ink/15 bg-paper-card text-ink-muted hover:border-ink/30 hover:text-ink",
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function FoodCard({
  item,
  isFav,
  onFav,
  onOpen,
  onQuickAdd,
}: {
  item: MenuItem;
  isFav: boolean;
  onFav: (e: React.MouseEvent) => void;
  onOpen: () => void;
  onQuickAdd: () => void;
}) {
  const price = item.discountPrice ?? item.price;
  return (
    <article className="group card-shell overflow-hidden transition-shadow hover:shadow-lift cursor-pointer" onClick={onOpen}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-paper-deep text-sm text-ink-faint">No image</div>
        )}
        <button
          onClick={onFav}
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper/80 backdrop-blur-sm transition-colors hover:bg-paper"
          aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart className={cn("h-4 w-4 transition-colors", isFav ? "fill-burgundy text-burgundy" : "text-ink-muted")} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-[15px] font-medium leading-snug text-ink">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-muted">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-serif text-base font-bold text-burgundy">
            {formatMoney(price)}
            {item.discountPrice && (
              <span className="ml-2 text-xs font-normal text-ink-faint line-through">{formatMoney(item.price)}</span>
            )}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onQuickAdd(); }}
            className="inline-flex items-center rounded-sm bg-ink/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink transition-all hover:bg-burgundy hover:text-paper"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}