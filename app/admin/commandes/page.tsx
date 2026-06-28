import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";
import {
  ORDER_STATUSES,
  STATUS_LABELS,
  formatDate,
} from "@/lib/orders";
import type { OrderRow, OrderStatus } from "@/lib/supabase/types";
import OrderStatusSelect from "@/components/admin/order-status-select";

function isStatus(v: string | undefined): v is OrderStatus {
  return !!v && (ORDER_STATUSES as string[]).includes(v);
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = isStatus(params.status) ? params.status : undefined;
  // Strip characters that would break the PostgREST `.or()` filter syntax.
  const q = (params.q ?? "").replace(/[,()%]/g, "").trim();

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (q) {
    const filters = [`full_name.ilike.%${q}%`, `phone.ilike.%${q}%`];
    if (/^\d+$/.test(q)) filters.push(`order_number.eq.${q}`);
    query = query.or(filters.join(","));
  }

  const { data } = await query;
  const orders = (data ?? []) as OrderRow[];

  // Preserve the active search term when switching status chips.
  const chipHref = (s?: OrderStatus) => {
    const sp = new URLSearchParams();
    if (s) sp.set("status", s);
    if (q) sp.set("q", q);
    const qs = sp.toString();
    return qs ? `/admin/commandes?${qs}` : "/admin/commandes";
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-charcoal">Commandes</h1>

      {/* Search */}
      <form method="get" className="flex flex-wrap gap-3">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher par nom, téléphone ou n°…"
          className="h-11 w-full max-w-sm rounded-xl border border-blush-deep/60 bg-white/70 px-4 text-sm focus:border-rosegold focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-full bg-rosegold px-6 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
        >
          Rechercher
        </button>
        {(q || status) && (
          <Link
            href="/admin/commandes"
            className="inline-flex h-11 items-center justify-center rounded-full border border-blush-deep/60 px-5 text-sm text-charcoal-soft transition-colors hover:bg-blush/40"
          >
            Réinitialiser
          </Link>
        )}
      </form>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2">
        <Chip href={chipHref()} active={!status}>
          Toutes
        </Chip>
        {ORDER_STATUSES.map((s) => (
          <Chip key={s} href={chipHref(s)} active={status === s}>
            {STATUS_LABELS[s]}
          </Chip>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-blush-deep/40 bg-white/60 p-6 text-charcoal-soft">
          Aucune commande {q || status ? "ne correspond à ce filtre" : "pour le moment"}.
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
                  <td className="px-4 py-3 text-charcoal-soft">
                    <a href={`tel:${order.phone}`} className="hover:text-rosegold hover:underline">
                      {order.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-charcoal-soft">{order.city}</td>
                  <td className="px-4 py-3 text-charcoal-soft">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect id={order.id} status={order.status} />
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

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "bg-rosegold text-white"
          : "border border-blush-deep/50 text-charcoal-soft hover:bg-blush/40"
      }`}
    >
      {children}
    </Link>
  );
}
