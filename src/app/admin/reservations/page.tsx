import { getReservationsAdmin } from "@/app/actions/admin";
import { ReservationsTable } from "@/components/admin/reservations-table";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const reservations = await getReservationsAdmin({ date: params.date, status: params.status, q: params.q });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-paper">Reservations</h1>
        <p className="mt-1 text-sm text-paper/50">Confirm, decline and manage table bookings.</p>
      </div>
      <ReservationsTable
        reservations={reservations.map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email,
          date: r.date,
          time: r.time,
          guests: r.guests,
          occasion: r.occasion,
          specialRequest: r.specialRequest,
          status: r.status,
        }))}
        currentDate={params.date}
        currentStatus={params.status}
        query={params.q}
      />
    </div>
  );
}