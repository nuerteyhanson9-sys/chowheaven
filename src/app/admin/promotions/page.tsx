import { getCoupons } from "@/app/actions/admin";
import { CouponsManager } from "@/components/admin/coupons-manager";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const coupons = await getCoupons();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-paper">Promotions</h1>
        <p className="mt-1 text-sm text-paper/50">Create, pause or remove discount codes.</p>
      </div>
      <CouponsManager coupons={coupons.map((c) => ({ ...c, discountValue: c.discountValue.toNumber(), minOrderValue: c.minOrderValue.toNumber() }))} />
    </div>
  );
}