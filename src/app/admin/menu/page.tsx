import { getMenuItems, getCategories } from "@/app/actions/admin";
import { MenuManager } from "@/components/admin/menu-manager";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const [items, categories] = await Promise.all([getMenuItems(), getCategories()]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-paper">Menu</h1>
          <p className="mt-1 text-sm text-paper/50">{items.length} dish{items.length === 1 ? "" : "es"} · options & availability</p>
        </div>
      </div>

      <MenuManager
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        items={items.map((i) => ({
          id: i.id,
          name: i.name,
          slug: i.slug,
          description: i.description,
          price: i.price.toNumber(),
          discountPrice: i.discountPrice ? i.discountPrice.toNumber() : null,
          imageUrl: i.imageUrl,
          ingredients: i.ingredients,
          allergens: i.allergens,
          tags: i.tags,
          spiceLevel: i.spiceLevel,
          isVegetarian: i.isVegetarian,
          available: i.available,
          isFeatured: i.isFeatured,
          categoryId: i.categoryId,
          categoryName: i.category.name,
          options: i.options.map((o) => ({ id: o.id, groupName: o.groupName, optionName: o.optionName, priceModifier: o.priceModifier.toNumber() })),
        }))}
      />
    </div>
  );
}