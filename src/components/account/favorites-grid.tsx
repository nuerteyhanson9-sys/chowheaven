"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn, formatMoney } from "@/lib/utils";
import { toggleFavorite } from "@/app/actions/favorites";
import { useCart } from "@/components/providers/cart-provider";

type FavItem = {
  id: string;
  menuItemId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  categoryName: string;
};

export function FavoritesGrid({ items }: { items: FavItem[] }) {
  const [list, setList] = useState(items);
  const cart = useCart();

  async function remove(favId: string, itemId: string) {
    const result = await toggleFavorite(itemId);
    if (result.ok && result.added === false) {
      setList((l) => l.filter((i) => i.id !== favId));
      toast.success("Removed from favourites.");
    }
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((item) => (
        <div key={item.id} className="card-shell overflow-hidden">
          <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-faint text-xs">No image</div>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs text-ink-faint">{item.categoryName}</p>
            <Link href={`/menu?open=${item.slug}`} className="mt-1 block font-serif text-lg text-ink hover:text-burgundy">
              {item.name}
            </Link>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-serif text-lg font-semibold text-burgundy">{formatMoney(item.price)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    cart.addItem({
                      itemId: item.menuItemId,
                      name: item.name,
                      slug: item.slug,
                      price: item.price,
                      imageUrl: item.imageUrl,
                      categoryName: item.categoryName,
                      options: [],
                    })
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-sm border border-ink/15 text-ink-muted transition-colors hover:border-gold hover:text-gold"
                  aria-label={`Add ${item.name} to cart`}
                >
                  <ShoppingBag className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(item.id, item.menuItemId)}
                  className="flex h-9 w-9 items-center justify-center rounded-sm border border-ink/15 text-ink-muted transition-colors hover:border-burgundy hover:text-burgundy"
                  aria-label={`Remove ${item.name} from favourites`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}