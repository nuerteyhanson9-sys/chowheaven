"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { formatMoney } from "@/lib/utils";

const GOLD = "#c8a24a";
const PAPER = "#f7f2e8";
const BURGUNDY = "#701e18";
const CELLS = ["#c8a24a", "#701e18", "#4a3a27", "#9a5b3f", "#5f6f52", "#a8813f", "#8c2f2e", "#7a6a5a"];

export function DashboardCharts({
  revenue,
  orders,
  reservations,
  dishes,
  categories,
}: {
  revenue: Array<{ date: string; value: number }>;
  orders: Array<{ date: string; value: number }>;
  reservations: Array<{ date: string; value: number }>;
  dishes: Array<{ name: string; quantity: number; revenue: number }>;
  categories: Array<{ category: string; count: number }>;
}) {
  const combined = revenue.map((r) => ({
    date: short(r.date),
    revenue: r.value,
    orders: orders.find((o) => o.date === r.date)?.value ?? 0,
    reservations: reservations.find((o) => o.date === r.date)?.value ?? 0,
  }));

  return (
    <div className="grid gap-6">
      {/* Revenue */}
      <ChartCard title="Revenue — last 14 days" subtitle="Successful payments only">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={combined} margin={{ left: 8, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0.5} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(247,242,232,0.07)" vertical={false} />
            <XAxis dataKey="date" stroke={PAPER} opacity={0.4} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis stroke={PAPER} opacity={0.4} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))} />
            <Tooltip
              contentStyle={{ background: "#1b1712", border: "1px solid rgba(247,242,232,0.2)", borderRadius: 4, fontSize: 12 }}
              labelStyle={{ color: PAPER }}
              formatter={(value: number) => [formatMoney(value), "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2} fill="url(#rev)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders & reservations */}
        <ChartCard title="Orders & reservations" subtitle="Volume per day">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={combined} margin={{ left: 4, right: 4, top: 8 }}>
              <CartesianGrid stroke="rgba(247,242,232,0.07)" vertical={false} />
              <XAxis dataKey="date" stroke={PAPER} opacity={0.4} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis stroke={PAPER} opacity={0.4} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1b1712", border: "1px solid rgba(247,242,232,0.2)", borderRadius: 4, fontSize: 12 }} labelStyle={{ color: PAPER }} />
              <Bar dataKey="orders" name="Orders" fill={GOLD} radius={[2, 2, 0, 0]} />
              <Bar dataKey="reservations" name="Reservations" fill={BURGUNDY} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Popular dishes */}
        <ChartCard title="Best sellers" subtitle="By units ordered">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dishes} layout="vertical" margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid stroke="rgba(247,242,232,0.07)" horizontal={false} />
              <XAxis type="number" stroke={PAPER} opacity={0.4} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke={PAPER} opacity={0.7} tick={{ fontSize: 11 }} width={110} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1b1712", border: "1px solid rgba(247,242,232,0.2)", borderRadius: 4, fontSize: 12 }} labelStyle={{ color: PAPER }} />
              <Bar dataKey="quantity" name="Units sold" fill={GOLD} radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Category mix */}
      <ChartCard title="Orders by category" subtitle="Share of orders">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={categories} dataKey="count" nameKey="category" innerRadius={55} outerRadius={90} paddingAngle={2}>
              {categories.map((_, i) => (
                <Cell key={i} fill={CELLS[i % CELLS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#1b1712", border: "1px solid rgba(247,242,232,0.2)", borderRadius: 4, fontSize: 12 }} formatter={(value: number, name: string) => [value, name]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {categories.map((c, i) => (
            <span key={c.category} className="flex items-center gap-1.5 text-xs text-paper/60">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CELLS[i % CELLS.length] }} />
              {c.category} ({c.count})
            </span>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-white/10 bg-white/5 p-5">
      <h3 className="font-serif text-lg text-paper">{title}</h3>
      <p className="text-xs text-paper/40">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function short(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}`;
}