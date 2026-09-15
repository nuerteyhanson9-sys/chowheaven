import { dashboardStats, revenueByDay, ordersByDay, popularDishes, ordersByCategory, reservationTrend } from "@/lib/analytics";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { KpiCards } from "@/components/admin/kpi-cards";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, revenue, orders, dishes, categories, reservations] = await Promise.all([
    dashboardStats(),
    revenueByDay(14),
    ordersByDay(14),
    popularDishes(8),
    ordersByCategory(8),
    reservationTrend(14),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-paper">Dashboard</h1>
        <p className="mt-1 text-sm text-paper/50">A real-time snapshot of the restaurant.</p>
      </div>

      <KpiCards
        stats={{
          todayRevenue: stats.todayRevenue,
          todayOrders: stats.todayOrders,
          todayReservations: stats.todayReservations,
          pendingOrders: stats.pendingOrders,
          totalCustomers: stats.totalCustomers,
          totalOrders: stats.totalOrders,
          totalRevenue: stats.totalRevenue,
        }}
      />

      <DashboardCharts revenue={revenue} orders={orders} reservations={reservations} dishes={dishes} categories={categories} />
    </div>
  );
}