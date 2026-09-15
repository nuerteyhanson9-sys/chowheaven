"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cancelReservation } from "@/app/actions/reservations";

export function CancelReservationButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    const result = await cancelReservation(id);
    if (!result.ok) {
      toast.error(result.error ?? "Could not cancel reservation.");
      setLoading(false);
      return;
    }
    toast.success("Reservation cancelled.");
    setOpen(false);
    setLoading(false);
    window.location.reload();
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Cancel
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Cancel reservation?">
        <p className="text-sm text-ink-muted">
          Are you sure you want to cancel this reservation? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Keep it</Button>
          <Button variant="dark" loading={loading} onClick={handleCancel}>Yes, cancel</Button>
        </div>
      </Modal>
    </>
  );
}