"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/admin";
import { ORDER_STATUSES, STATUS_LABELS, STATUS_CLASSES } from "@/lib/orders";
import type { OrderStatus } from "@/lib/supabase/types";

/**
 * Inline status dropdown for the admin orders list. Submits the change to the
 * server action on selection — no need to open each order.
 */
export default function OrderStatusSelect({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      aria-label="Statut de la commande"
      onChange={(e) => {
        const next = e.target.value;
        const fd = new FormData();
        fd.set("id", id);
        fd.set("status", next);
        startTransition(() => updateOrderStatus(fd));
      }}
      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rosegold/50 disabled:opacity-50 ${STATUS_CLASSES[status]}`}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
