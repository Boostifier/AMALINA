import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateOrderStatus, deleteOrder } from "@/app/actions/admin";
import { formatPrice } from "@/lib/products";
import {
  ORDER_STATUSES,
  STATUS_LABELS,
  STATUS_CLASSES,
  formatDate,
} from "@/lib/orders";
import type { OrderItemRow, OrderRow } from "@/lib/supabase/types";

type OrderWithItems = OrderRow & { order_items: OrderItemRow[] };

export default async function AdminOrderDetailPage({
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

  return (
    <div className="max-w-3xl space-y-8">
      <Link href="/admin/commandes" className="text-sm text-rosegold hover:underline">
        ← Retour aux commandes
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">
            Commande n°{order.order_number}
          </h1>
          <p className="mt-1 text-sm text-mauve">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASSES[order.status]}`}>
            {STATUS_LABELS[order.status]}
          </span>
          <Link
            href={`/admin/commandes/${order.id}/facture`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-rosegold/40 px-5 text-sm font-semibold text-rosegold transition-colors hover:bg-rosegold hover:text-white"
          >
            Imprimer la facture
          </Link>
        </div>
      </div>

      {/* Status update */}
      <form action={updateOrderStatus} className="flex flex-wrap items-end gap-3 rounded-2xl border border-blush-deep/40 bg-white/60 p-5">
        <input type="hidden" name="id" value={order.id} />
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm text-charcoal-soft">
            Mettre à jour le statut
          </label>
          <select
            id="status"
            name="status"
            defaultValue={order.status}
            className="h-11 rounded-xl border border-blush-deep/60 bg-white px-4 text-sm focus:border-rosegold focus:outline-none"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-full bg-rosegold px-6 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
        >
          Enregistrer
        </button>
      </form>

      {/* Customer */}
      <section className="rounded-2xl border border-blush-deep/40 bg-white/60 p-6">
        <h2 className="mb-4 font-serif text-xl text-charcoal">Client</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <Info label="Nom" value={order.full_name} />
          <Info label="E-mail">
            <a href={`mailto:${order.email}`} className="text-rosegold hover:underline">
              {order.email}
            </a>
          </Info>
          <Info label="Téléphone">
            <span className="flex flex-wrap items-center gap-2">
              <a href={`tel:${order.phone}`} className="text-rosegold hover:underline">
                {order.phone}
              </a>
              <a
                href={waLink(order.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
              >
                WhatsApp
              </a>
            </span>
          </Info>
          <Info label="Ville" value={order.city} />
          <Info label="Adresse" value={`${order.address}${order.postal_code ? `, ${order.postal_code}` : ""}`} />
          <Info label="Paiement" value="À la livraison" />
        </dl>
        {order.notes && (
          <p className="mt-4 rounded-xl bg-blush/40 px-4 py-3 text-sm text-charcoal-soft">
            <span className="font-medium">Note :</span> {order.notes}
          </p>
        )}
      </section>

      {/* Items */}
      <section className="rounded-2xl border border-blush-deep/40 bg-white/60 p-6">
        <h2 className="mb-4 font-serif text-xl text-charcoal">Articles</h2>
        <ul className="divide-y divide-blush-deep/30">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex justify-between py-3 text-sm">
              <span className="text-charcoal">
                {item.product_name}{" "}
                <span className="text-mauve">× {item.qty}</span>
              </span>
              <span className="text-charcoal-soft">{formatPrice(Number(item.line_total))}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-blush-deep/30 pt-4 text-sm">
          <Row label="Sous-total" value={formatPrice(Number(order.subtotal))} />
          <Row label="Livraison" value={order.shipping === 0 ? "Offerte" : formatPrice(Number(order.shipping))} />
          <Row label="Total" value={formatPrice(Number(order.total))} strong />
        </dl>
      </section>

      {/* Danger zone */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
        <div>
          <h2 className="font-medium text-rose-900">Supprimer la commande</h2>
          <p className="text-sm text-rose-800/80">
            Cette action est définitive et supprime aussi les articles associés.
          </p>
        </div>
        <form action={deleteOrder}>
          <input type="hidden" name="id" value={order.id} />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full bg-rose-600 px-6 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rose-700"
          >
            Supprimer
          </button>
        </form>
      </section>
    </div>
  );
}

function Info({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-mauve">{label}</dt>
      <dd className="text-charcoal">{children ?? value}</dd>
    </div>
  );
}

/** Build a wa.me link, assuming Tunisian (+216) numbers when given 8 digits. */
function waLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.length === 8 ? `216${digits}` : digits;
  return `https://wa.me/${intl}`;
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "font-semibold text-charcoal" : "text-charcoal-soft"}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
