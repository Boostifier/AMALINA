"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/products";
import { formatDate } from "@/lib/orders";
import OrderStatusSelect from "./order-status-select";
import type { OrderRow as OrderRowType } from "@/lib/supabase/types";

/**
 * A clickable orders-table row: clicking anywhere opens the order detail page,
 * except on the interactive cells (phone link, status dropdown).
 */
export default function OrderRow({ order }: { order: OrderRowType }) {
  const router = useRouter();
  const href = `/admin/commandes/${order.id}`;
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <tr
      onClick={() => router.push(href)}
      className="cursor-pointer border-b border-blush-deep/20 transition-colors last:border-0 hover:bg-blush/30"
    >
      <td className="px-4 py-3 font-medium text-rosegold">{order.order_number}</td>
      <td className="px-4 py-3 text-charcoal">{order.full_name}</td>
      <td className="px-4 py-3 text-charcoal-soft" onClick={stop}>
        <a href={`tel:${order.phone}`} className="hover:text-rosegold hover:underline">
          {order.phone}
        </a>
      </td>
      <td className="px-4 py-3 text-charcoal-soft">{order.city}</td>
      <td className="px-4 py-3 text-charcoal-soft">{formatDate(order.created_at)}</td>
      <td className="px-4 py-3" onClick={stop}>
        <OrderStatusSelect id={order.id} status={order.status} />
      </td>
      <td className="px-4 py-3 text-right font-medium text-charcoal">
        {formatPrice(Number(order.total))}
      </td>
    </tr>
  );
}
