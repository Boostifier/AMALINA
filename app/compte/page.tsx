import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { formatPrice } from "@/lib/products";
import {
  STATUS_LABELS,
  STATUS_CLASSES,
  formatDate,
} from "@/lib/orders";
import type { OrderItemRow, OrderRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Mon compte — Amalina Market",
};

type OrderWithItems = OrderRow & { order_items: OrderItemRow[] };

export default async function ComptePage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as unknown as OrderWithItems[];
  const displayName = user.profile?.full_name || user.email;

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Mon compte</h1>
          <p className="mt-2 text-charcoal-soft">
            Bonjour {displayName}
            {user.profile?.is_admin && (
              <>
                {" · "}
                <Link href="/admin" className="font-medium text-rosegold hover:underline">
                  Espace admin
                </Link>
              </>
            )}
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-blush-deep/60 px-5 py-2 text-sm font-medium text-charcoal-soft transition-colors hover:border-rosegold hover:text-rosegold"
          >
            Se déconnecter
          </button>
        </form>
      </div>

      <h2 className="mb-5 font-serif text-2xl text-charcoal">Mes commandes</h2>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-blush-deep/40 bg-white/60 p-8 text-center">
          <p className="text-charcoal-soft">
            Vous n&apos;avez pas encore passé de commande.
          </p>
          <Link
            href="/produits"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-rosegold px-7 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
          >
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <ul className="space-y-5">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-2xl border border-blush-deep/40 bg-white/60 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blush-deep/30 pb-4">
                <div>
                  <p className="font-medium text-charcoal">
                    Commande n°{order.order_number}
                  </p>
                  <p className="text-sm text-mauve">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASSES[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {order.order_items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between text-charcoal-soft"
                  >
                    <span>
                      {item.product_name}{" "}
                      <span className="text-mauve">× {item.qty}</span>
                    </span>
                    <span>{formatPrice(Number(item.line_total))}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-between border-t border-blush-deep/30 pt-3 text-sm font-semibold text-charcoal">
                <span>Total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
