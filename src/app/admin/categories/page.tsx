import { getCategories } from "@/app/actions/admin";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-paper">Categories</h1>
        <p className="mt-1 text-sm text-paper/50">Organise the menu and set display order.</p>
      </div>
      <CategoriesManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          ordering: c.ordering,
          imageUrl: c.imageUrl,
          itemCount: c._count.items,
        }))}
      />
    </div>
  );
}