import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";
import { STATUS_LABELS, formatDate } from "@/lib/orders";
import type { OrderItemRow, OrderRow } from "@/lib/supabase/types";
import PrintButton from "@/components/admin/print-button";

type OrderWithItems = OrderRow & { order_items: OrderItemRow[] };

const STORE = {
  name: "Amalina Market",
  tagline: "Le soin de soi, tout simplement.",
  email: "contact@amalina-market.tn",
  country: "Tunisie",
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const order = data as unknown as OrderWithItems;
  const reference = `AM-${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="space-y-6">
      {/* Toolbar — hidden when printing */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/commandes/${order.id}`}
          className="text-sm text-rosegold hover:underline"
        >
          ← Retour à la commande
        </Link>
        <PrintButton />
      </div>

      {/* Invoice sheet */}
      <article className="invoice-sheet mx-auto max-w-3xl rounded-2xl border border-blush-deep/40 bg-white p-8 text-charcoal shadow-sm sm:p-12">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-blush-deep/40 pb-8">
          <div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-2xl tracking-[0.18em] text-charcoal">
                AMALINA
              </span>
              <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.42em] text-rosegold">
                Market
              </span>
            </div>
            <p className="mt-3 text-sm text-charcoal-soft">{STORE.tagline}</p>
            <p className="mt-1 text-xs text-mauve">
              {STORE.email} · {STORE.country}
            </p>
          </div>
          <div className="text-right">
            <h1 className="font-serif text-3xl text-rosegold-dark">Facture</h1>
            <p className="mt-2 text-sm text-charcoal">
              N° <span className="font-semibold">{order.order_number}</span>
            </p>
            <p className="text-xs text-mauve">Réf. {reference}</p>
            <p className="mt-1 text-xs text-mauve">{formatDate(order.created_at)}</p>
            <span className="mt-2 inline-block rounded-full bg-blush/60 px-3 py-1 text-xs font-semibold text-rosegold-dark">
              {STATUS_LABELS[order.status]}
            </span>
          </div>
        </header>

        {/* Parties */}
        <section className="grid gap-8 py-8 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-mauve">
              Facturé à
            </h2>
            <p className="mt-2 font-medium text-charcoal">{order.full_name}</p>
            <p className="text-sm text-charcoal-soft">{order.phone}</p>
            {order.email && (
              <p className="text-sm text-charcoal-soft">{order.email}</p>
            )}
            <p className="mt-1 text-sm text-charcoal-soft">
              {order.address}
              {order.postal_code ? `, ${order.postal_code}` : ""}
              <br />
              {order.city}
            </p>
          </div>
          <div className="sm:text-right">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-mauve">
              Paiement
            </h2>
            <p className="mt-2 text-sm text-charcoal-soft">À la livraison (COD)</p>
            <h2 className="mt-4 text-xs font-semibold uppercase tracking-widest text-mauve">
              Total à payer
            </h2>
            <p className="mt-1 font-serif text-2xl text-rosegold-dark">
              {formatPrice(Number(order.total))}
            </p>
          </div>
        </section>

        {/* Items */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-blush-deep/40 text-left text-mauve">
              <th className="py-2.5 font-medium">Article</th>
              <th className="py-2.5 text-center font-medium">Qté</th>
              <th className="py-2.5 text-right font-medium">P.U.</th>
              <th className="py-2.5 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item) => (
              <tr key={item.id} className="border-b border-blush-deep/25">
                <td className="py-3 text-charcoal">{item.product_name}</td>
                <td className="py-3 text-center text-charcoal-soft">{item.qty}</td>
                <td className="py-3 text-right text-charcoal-soft">
                  {formatPrice(Number(item.unit_price))}
                </td>
                <td className="py-3 text-right text-charcoal">
                  {formatPrice(Number(item.line_total))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <dl className="w-full max-w-xs space-y-2 text-sm">
            <Row label="Sous-total" value={formatPrice(Number(order.subtotal))} />
            <Row
              label="Livraison"
              value={order.shipping === 0 ? "Offerte" : formatPrice(Number(order.shipping))}
            />
            <div className="flex justify-between border-t border-blush-deep/40 pt-2 font-serif text-lg text-charcoal">
              <dt>Total</dt>
              <dd className="text-rosegold-dark">{formatPrice(Number(order.total))}</dd>
            </div>
          </dl>
        </div>

        {order.notes && (
          <p className="mt-8 rounded-xl bg-blush/30 px-4 py-3 text-sm text-charcoal-soft">
            <span className="font-medium">Note :</span> {order.notes}
          </p>
        )}

        {/* Footer */}
        <footer className="mt-10 border-t border-blush-deep/40 pt-6 text-center text-xs text-mauve">
          Merci pour votre confiance — {STORE.name}
        </footer>
      </article>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-charcoal-soft">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
