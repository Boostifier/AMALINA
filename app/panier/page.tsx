"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/products";

export default function PanierPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const shipping = total >= 400 || total === 0 ? 0 : 30;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-serif text-4xl text-charcoal">Votre panier est vide</h1>
        <p className="mt-4 text-charcoal-soft">
          Découvrez notre sélection de cosmétiques et ajoutez vos produits
          préférés.
        </p>
        <Link
          href="/produits"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <h1 className="mb-10 font-serif text-4xl text-charcoal sm:text-5xl">
        Votre panier
      </h1>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <ul className="divide-y divide-blush-deep/40 border-y border-blush-deep/40">
            {items.map((item) => (
              <li key={item.slug} className="flex items-center gap-4 py-5">
                <div className="flex-1">
                  <Link
                    href={`/produits/${item.slug}`}
                    className="font-serif text-lg text-charcoal hover:text-rosegold"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-mauve">
                    {formatPrice(item.price)} l&apos;unité
                  </p>
                </div>

                <div className="inline-flex items-center rounded-full border border-blush-deep/60 bg-white/60">
                  <button
                    onClick={() => setQty(item.slug, item.qty - 1)}
                    className="flex h-9 w-9 items-center justify-center text-charcoal-soft hover:text-rosegold"
                    aria-label="Diminuer"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.slug, item.qty + 1)}
                    className="flex h-9 w-9 items-center justify-center text-charcoal-soft hover:text-rosegold"
                    aria-label="Augmenter"
                  >
                    +
                  </button>
                </div>

                <div className="w-24 text-right font-medium text-charcoal">
                  {formatPrice(item.price * item.qty)}
                </div>

                <button
                  onClick={() => remove(item.slug)}
                  className="text-mauve transition-colors hover:text-rosegold-dark"
                  aria-label="Retirer"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={clear}
            className="mt-5 text-sm text-mauve transition-colors hover:text-rosegold-dark"
          >
            Vider le panier
          </button>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-blush-deep/40 bg-white/60 p-6">
          <h2 className="font-serif text-2xl text-charcoal">Récapitulatif</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-charcoal-soft">
              <dt>Sous-total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between text-charcoal-soft">
              <dt>Livraison</dt>
              <dd>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-mauve">
                Livraison offerte dès {formatPrice(400)} d&apos;achat.
              </p>
            )}
            <div className="flex justify-between border-t border-blush-deep/40 pt-3 text-base font-semibold text-charcoal">
              <dt>Total</dt>
              <dd>{formatPrice(total + shipping)}</dd>
            </div>
          </dl>

          <Link
            href="/commande"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
          >
            Passer la commande
          </Link>
          <p className="mt-3 text-center text-xs text-mauve">
            Paiement à la livraison disponible
          </p>
        </aside>
      </div>
    </div>
  );
}
