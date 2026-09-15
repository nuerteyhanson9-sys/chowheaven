import { getGalleryImages } from "@/app/actions/admin";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-paper">Gallery</h1>
        <p className="mt-1 text-sm text-paper/50">{images.length} image{images.length === 1 ? "" : "s"} · shown on the public gallery page</p>
      </div>
      <GalleryManager
        images={images.map((i) => ({
          id: i.id,
          title: i.title,
          category: i.category,
          imageUrl: i.imageUrl,
          alt: i.alt,
          ordering: i.ordering,
          active: i.active,
        }))}
      />
    </div>
  );
}