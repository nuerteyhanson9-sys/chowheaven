import { getPaymentsAdmin } from "@/app/actions/admin";
import { formatDate, formatMoney } from "@/lib/utils";
import { PAYMENT_STATUS_LABEL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const payments = await getPaymentsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-paper">Payments</h1>
        <p className="mt-1 text-sm text-paper/50">All payment transactions (demo mode — no real gateway integrations).</p>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-sm border border-white/10 bg-white/5 p-10 text-center text-sm text-paper/50">No payments yet.</div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-paper/50">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden px-4 py-3 md:table-cell">Provider</th>
                <th className="hidden px-4 py-3 md:table-cell">Reference</th>
                <th className="hidden px-4 py-3 lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-mono font-semibold text-paper">
                    #{String(p.order.orderNumber).padStart(4, "0")}
                  </td>
                  <td className="px-4 py-3 text-paper/70">{p.order.customerName}</td>
                  <td className="px-4 py-3 font-semibold text-gold">{formatMoney(p.amount.toNumber())}</td>
                  <td className="px-4 py-3">
                    <span className={
                      p.status === "SUCCESSFUL" ? "rounded-sm bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-emerald-800"
                        : p.status === "FAILED" ? "rounded-sm bg-rose-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-rose-800"
                        : "rounded-sm bg-amber-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-amber-800"
                    }>
                      {PAYMENT_STATUS_LABEL[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-paper/60 md:table-cell">{p.provider}</td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-paper/40 md:table-cell">{p.reference}</td>
                  <td className="hidden px-4 py-3 text-paper/40 lg:table-cell">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}