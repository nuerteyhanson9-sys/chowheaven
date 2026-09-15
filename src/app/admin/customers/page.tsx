import { getAllCustomers } from "@/app/actions/admin";
import { formatDateTime, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-paper">Customers</h1>
        <p className="mt-1 text-sm text-paper/50">{customers.length} registered customer{customers.length === 1 ? "" : "s"}</p>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-sm border border-white/10 bg-white/5 p-10 text-center text-sm text-paper/50">No customers yet.</div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-paper/50">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Role</th>
                <th className="hidden px-4 py-3 md:table-cell">Phone</th>
                <th className="hidden px-4 py-3 md:table-cell">Orders</th>
                <th className="hidden px-4 py-3 lg:table-cell">Loyalty</th>
                <th className="hidden px-4 py-3 lg:table-cell">Spent</th>
                <th className="hidden px-4 py-3 xl:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-paper">{c.user.fullName}</p>
                    <p className="text-xs text-paper/40">{c.user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={c.user.role === "ADMIN" ? "rounded-sm bg-gold px-2 py-0.5 text-[0.65rem] font-bold uppercase text-night" : "text-paper/60"}>
                      {c.user.role}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-paper/60 md:table-cell">{c.user.phone ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-paper/60 md:table-cell">{c.ordersCount}</td>
                  <td className="hidden px-4 py-3 text-gold lg:table-cell">{c.loyaltyPoints}</td>
                  <td className="hidden px-4 py-3 text-paper/60 lg:table-cell">{formatMoney(c.totalSpent.toString())}</td>
                  <td className="hidden px-4 py-3 text-paper/40 xl:table-cell">{formatDateTime(c.user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}