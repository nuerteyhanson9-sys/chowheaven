import { getAllOrders } from "@/app/actions/admin";
import { OrdersTable } from "@/components/admin/orders-table";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const take = 25;
  const page = Math.max(1, Number(params.page) || 1);
  const result = await getAllOrders({ status: params.status, q: params.q, take, skip: (page - 1) * take });
  const totalPages = Math.max(1, Math.ceil(result.total / take));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-paper">Orders</h1>
        <p className="mt-1 text-sm text-paper/50">{result.total} order{result.total === 1 ? "" : "s"} total</p>
      </div>

      <OrdersTable
        orders={result.items.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          createdAt: o.createdAt,
          status: o.status,
          orderType: o.orderType,
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          customerEmail: o.customerEmail,
          addressText: o.addressText,
          total: o.total.toNumber(),
          items: o.items.map((i) => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.price.toNumber(),
            note: i.note,
          })),
          payment: o.payment
            ? { status: o.payment.status, reference: o.payment.reference, method: o.payment.method }
            : null,
        }))}
        page={page}
        totalPages={totalPages}
        currentStatus={params.status}
        query={params.q}
      />
    </div>
  );
}