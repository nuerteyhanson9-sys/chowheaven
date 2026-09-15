import type { Metadata } from "next";
import { getOrderHistory } from "@/app/actions/account";
import { getAllReviews } from "@/app/actions/reviews";
import { OrderHistoryList } from "@/components/account/order-history-list";

export const metadata: Metadata = { title: "My Orders" };
export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const [orders, reviews] = await Promise.all([getOrderHistory(), getAllReviews()]);
  const reviewedOrderIds = new Set(reviews.filter((r) => r.orderId).map((r) => r.orderId!));

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">Order history</h2>
      <p className="mt-1 text-sm text-ink-muted">Review, track and re-order from your past meals.</p>
      <div className="mt-6">
        <OrderHistoryList orders={orders} reviewedOrderIds={reviewedOrderIds} />
      </div>
    </div>
  );
}