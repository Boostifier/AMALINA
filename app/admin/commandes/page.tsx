import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";
import { STATUS_LABELS, STATUS_CLASSES, formatDate } from "@/lib/orders";
import type { OrderRow } from "@/lib/supabase/types";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as OrderRow[];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-charcoal">Commandes</h1>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-blush-deep/40 bg-white/60 p-6 text-charcoal-soft">
          Aucune commande pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-blush-deep/40 bg-white/60">
          <table className="w-full text-sm">
            <thead className="text-left text-mauve">
              <tr className="border-b border-blush-deep/30">
                <th className="px-4 py-3 font-medium">N°</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-blush-deep/20 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/commandes/${order.id}`} className="text-rosegold hover:underline">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-charcoal">{order.full_name}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{order.phone}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{order.city}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-charcoal">
                    {formatPrice(Number(order.total))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
