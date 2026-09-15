import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { MenuClient } from "@/components/menu/menu-client";
import { PageHero } from "@/components/ui/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse authentic Nigerian dishes at Chow Heaven — jollof rice, suya, egusi soup, grilled catfish, pepper soup and more.",
};

export const revalidate = 120;

const HERO_1 = "/images/menu/grilled-catfish.jpg";
const HERO_2 = "/images/menu/party-jollof.jpg";
const HERO_3 = "/images/menu/suya-platter.jpg";

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
    <>
      <PageHero
        images={[
          { src: HERO_1, alt: "Whole grilled catfish served with Nigerian sides and pepper sauce" },
          { src: HERO_2, alt: "House-special Nigerian party jollof rice" },
          { src: HERO_3, alt: "Charcoal-grilled suya with pepper sauce" },
        ]}
        eyebrow="Explore our dishes"
        title="THE MENU"
        subtitle="Nigerian flavours, our way. Every dish is prepared to order using the freshest ingredients — honouring tradition, served with care."
        showScroll={false}
        align="center"
      />

      <section className="pb-24 pt-20">
        <div className="container-x">
          <MenuClient categories={menu.categories} items={menu.items} />
        </div>
      </section>
    </>
  );
}