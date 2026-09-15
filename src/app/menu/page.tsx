import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { MenuClient } from "@/components/menu/menu-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse authentic Nigerian dishes at Chow Heaven — jollof rice, suya, egusi soup, grilled catfish, pepper soup and more.",
};

export const revalidate = 120;

async function getMenu() {
  const [categories, items] = await Promise.all([
    prisma.menuCategory.findMany({ orderBy: { ordering: "asc" } }),
    prisma.menuItem.findMany({
      where: { available: true },
      include: { category: true, options: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return {
    categories: categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description ?? null })),
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      slug: i.slug,
      description: i.description,
      price: Number(i.price),
      discountPrice: i.discountPrice ? Number(i.discountPrice) : null,
      imageUrl: i.imageUrl,
      ingredients: i.ingredients,
      allergens: i.allergens,
      spiceLevel: i.spiceLevel,
      isVegetarian: i.isVegetarian,
      isFeatured: i.isFeatured,
      tags: i.tags,
      categoryName: i.category?.name ?? null,
      categoryId: i.categoryId,
      options: i.options.map((o) => ({
        id: o.id,
        groupName: o.groupName,
        optionName: o.optionName,
        priceModifier: Number(o.priceModifier),
        isDefault: o.isDefault,
      })),
    })),
  };
}

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <section className="pt-32 pb-20">
      <div className="container-x">
        <p className="eyebrow">Explore our dishes</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tightest sm:text-5xl">
          The Menu
        </h1>
        <p className="mt-4 max-w-xl text-[15px] text-ink-muted">
          Every dish is prepared to order using the freshest ingredients — honouring
          tradition, served with care.
        </p>
      </div>
      <div className="container-x mt-12">
        <MenuClient
          categories={menu.categories}
          items={menu.items}
        />
      </div>
    </section>
  );
}