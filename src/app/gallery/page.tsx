import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { GalleryClient } from "@/components/gallery/gallery-client";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual journey through Chow Heaven — our food, restaurant, people and the moments that make dining special.",
};

export const revalidate = 120;

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    where: { active: true },
    orderBy: [{ ordering: "asc" }, { createdAt: "desc" }],
    take: 120,
  });

  const items = images.map((img) => ({
    id: img.id,
    category: img.category,
    title: img.title,
    imageUrl: img.imageUrl,
    alt: img.alt,
  }));

  return (
    <section className="pt-32 pb-20">
      <div className="container-x">
        <p className="eyebrow">Gallery</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tightest sm:text-5xl">Moments at Chow Heaven</h1>
        <p className="mt-4 max-w-xl text-[15px] text-ink-muted">
          Plates, people and places. Filter by category to explore.
        </p>
      </div>
      <div className="container-x mt-10">
        <GalleryClient items={items} />
      </div>
    </section>
  );
}