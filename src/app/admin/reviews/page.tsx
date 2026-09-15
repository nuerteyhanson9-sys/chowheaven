import { getAllReviews } from "@/app/actions/reviews";
import { ReviewsManager } from "@/components/admin/reviews-manager";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-paper">Reviews</h1>
        <p className="mt-1 text-sm text-paper/50">Approve or remove customer feedback.</p>
      </div>
      <ReviewsManager
        reviews={reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          approved: r.approved,
          createdAt: r.createdAt,
          customerName: r.customerName ?? r.user?.fullName ?? "Anonymous",
        }))}
      />
    </div>
  );
}