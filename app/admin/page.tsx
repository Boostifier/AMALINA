import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";
import { STATUS_LABELS, STATUS_CLASSES, formatDate } from "@/lib/orders";
import type { OrderRow } from "@/lib/supabase/types";

export default async function AdminHome() {
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: categoryCount },
    { count: userCount },
    { data: orders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const allOrders = (orders ?? []) as OrderRow[];
  const pending = allOrders.filter((o) => o.status === "pending").length;
  const revenue = allOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const recent = allOrders.slice(0, 6);

  return (
    <div className="space-y-10">
      <h1 className="font-serif text-3xl text-charcoal">Tableau de bord</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="Produits" value={String(productCount ?? 0)} href="/admin/produits" />
        <Stat label="Catégories" value={String(categoryCount ?? 0)} href="/admin/categories" />
        <Stat label="Commandes" value={String(allOrders.length)} href="/admin/commandes" />
        <Stat label="En attente" value={String(pending)} href="/admin/commandes" />
        <Stat label="Utilisateurs" value={String(userCount ?? 0)} href="/admin/utilisateurs" />
        <Stat label="Chiffre d'affaires" value={formatPrice(Number(revenue.toFixed(2)))} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-charcoal">Dernières commandes</h2>
          <Link href="/admin/commandes" className="text-sm text-rosegold hover:underline">
            Tout voir →
          </Link>
        </div>

        {recent.length === 0 ? (
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
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order.id} className="border-b border-blush-deep/20 last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/admin/commandes/${order.id}`} className="text-rosegold hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-charcoal">{order.full_name}</td>
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
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <div className="rounded-2xl border border-blush-deep/40 bg-white/60 p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-mauve">{label}</p>
      <p className="mt-2 font-serif text-3xl text-charcoal">{value}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="transition-transform hover:-translate-y-0.5">
      {inner}
    </Link>
  ) : (
    inner
  );
}
