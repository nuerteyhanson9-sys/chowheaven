import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { GalleryClient } from "@/components/gallery/gallery-client";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual journey through Chow Heaven — our food, our people, our Lagos.",
};

export const revalidate = 120;

const MONTAGE_1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Suya_with_pepper_sauce.jpg/1200px-Suya_with_pepper_sauce.jpg";
const MONTAGE_2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/A_plate_of_jollof_rice_and_chicken.jpg/1200px-A_plate_of_jollof_rice_and_chicken.jpg";
const MONTAGE_3 = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=70";
const MONTAGE_4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Pot_of_Egusi_soup.jpg/960px-Pot_of_Egusi_soup.jpg";

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
    <>
      <PageHero
        images={[
          { src: MONTAGE_2, alt: "House-special party jollof with grilled chicken" },
          { src: MONTAGE_1, alt: "Charcoal-grilled suya skewers with pepper sauce" },
          { src: MONTAGE_3, alt: "Beautifully plated dish at Chow Heaven" },
          { src: MONTAGE_4, alt: "Rich pot of Nigerian egusi soup" },
        ]}
        eyebrow="Our Gallery"
        title={
          <>
            A TASTE OF<br />
            CHOW HEAVEN.
          </>
        }
        subtitle="Plates, people and places — a moving picture of the moments that make dining with us special."
        showScroll={false}
        align="center"
      />

      <section className="pb-24 pt-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Gallery</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
                Moments at Chow Heaven
              </h2>
            </div>
            <p className="max-w-sm text-sm text-ink-muted">Filter by category to explore.</p>
          </div>
        </div>
        <div className="container-x mt-10">
          <GalleryClient items={items} />
        </div>
      </section>
    </>
  );
}