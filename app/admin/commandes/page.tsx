import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUSES, STATUS_LABELS } from "@/lib/orders";
import type { OrderRow as OrderRowType, OrderStatus } from "@/lib/supabase/types";
import OrderRow from "@/components/admin/order-row";

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
  const orders = (data ?? []) as OrderRowType[];

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-charcoal">Commandes</h1>
        <Link
          href="/admin/commandes/nouveau"
          className="inline-flex h-11 items-center justify-center rounded-full bg-rosegold px-6 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
        >
          Nouvelle commande
        </Link>
      </div>

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
                <OrderRow key={order.id} order={order} />
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
