import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";

import { getFavoriteItems } from "@/app/actions/favorites";
import { FavoritesGrid } from "@/components/account/favorites-grid";

export const metadata: Metadata = { title: "My Favourites" };
export const dynamic = "force-dynamic";

export default async function AccountFavoritesPage() {
  const favorites = await getFavoriteItems();

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">Favourites</h2>
      <p className="mt-1 text-sm text-ink-muted">Your saved dishes, ready to reorder.</p>

      {favorites.length === 0 ? (
        <div className="card-shell mt-6 flex flex-col items-center p-10 text-center">
          <Heart className="h-10 w-10 text-ink/15" />
          <p className="mt-4 font-serif text-lg text-ink">No favourites yet</p>
          <p className="mt-1 text-sm text-ink-muted">Tap the heart on any dish to save it here.</p>
          <Link href="/menu" className="btn-primary mt-6">Browse the Menu</Link>
        </div>
      ) : (
        <FavoritesGrid items={favorites.map((f) => ({
          id: f.id,
          menuItemId: f.menuItem.id,
          name: f.menuItem.name,
          slug: f.menuItem.slug,
          price: f.menuItem.price.toNumber(),
          imageUrl: f.menuItem.imageUrl,
          categoryName: f.menuItem.category.name,
        }))} />
      )}
    </div>
  );
}