"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/products";
import { placeOrder, type CheckoutCustomer } from "@/app/actions/orders";

const FREE_SHIPPING_THRESHOLD = 400;
const SHIPPING_FEE = 3;

export default function CheckoutClient({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const { items, total, clear } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    orderNumber: number | null;
  } | null>(null);

  const shipping = total >= FREE_SHIPPING_THRESHOLD || total === 0 ? 0 : SHIPPING_FEE;

  if (confirmation) {
    const ref = confirmation.orderNumber
      ? `n°${confirmation.orderNumber}`
      : confirmation.reference;
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rosegold text-2xl text-white">
          ✓
        </div>
        <h1 className="font-serif text-4xl text-charcoal">
          Merci pour votre commande !
        </h1>
        <p className="mt-4 text-charcoal-soft">
          Votre commande <strong>{ref}</strong> a bien été enregistrée. Nous vous
          contacterons très prochainement pour confirmer la livraison.
        </p>
        <Link
          href="/produits"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
        >
          Continuer mes achats
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-serif text-4xl text-charcoal">Votre panier est vide</h1>
        <p className="mt-4 text-charcoal-soft">
          Ajoutez des produits avant de passer commande.
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

  function handleSubmit(formData: FormData) {
    setError(null);
    const customer: CheckoutCustomer = {
      full_name: String(formData.get("full_name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      address: String(formData.get("address") ?? ""),
      city: String(formData.get("city") ?? ""),
      postal_code: String(formData.get("postal_code") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };
    const payload = items.map((i) => ({ slug: i.slug, qty: i.qty }));

    startTransition(async () => {
      const result = await placeOrder(customer, payload);
      if (result.ok) {
        clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setConfirmation({
          reference: result.reference,
          orderNumber: result.orderNumber,
        });
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <h1 className="mb-10 font-serif text-4xl text-charcoal sm:text-5xl">
        Finaliser la commande
      </h1>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Delivery form */}
        <form action={handleSubmit} className="lg:col-span-2 space-y-5">
          <h2 className="font-serif text-2xl text-charcoal">
            Informations de livraison
          </h2>

          {error && (
            <p className="rounded-xl bg-rosegold/10 px-4 py-3 text-sm text-rosegold-dark">
              {error}
            </p>
          )}

          <Field name="full_name" label="Nom complet *" defaultValue={initialName} autoComplete="name" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="email" label="E-mail *" type="email" defaultValue={initialEmail} autoComplete="email" />
            <Field name="phone" label="Téléphone *" type="tel" autoComplete="tel" />
          </div>
          <Field name="address" label="Adresse *" autoComplete="street-address" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="city" label="Ville *" autoComplete="address-level2" />
            <Field name="postal_code" label="Code postal" autoComplete="postal-code" required={false} />
          </div>

          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm text-charcoal-soft">
              Note (optionnel)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark disabled:opacity-60 sm:w-auto"
          >
            {pending ? "Validation…" : "Confirmer la commande"}
          </button>
          <p className="text-sm text-mauve">Paiement à la livraison.</p>
        </form>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-blush-deep/40 bg-white/60 p-6">
          <h2 className="font-serif text-2xl text-charcoal">Récapitulatif</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.slug} className="flex justify-between text-charcoal-soft">
                <span>
                  {item.name} <span className="text-mauve">× {item.qty}</span>
                </span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-blush-deep/40 pt-5 text-sm">
            <div className="flex justify-between text-charcoal-soft">
              <dt>Sous-total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between text-charcoal-soft">
              <dt>Livraison</dt>
              <dd>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-blush-deep/40 pt-3 text-base font-semibold text-charcoal">
              <dt>Total</dt>
              <dd>{formatPrice(total + shipping)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  autoComplete,
  required = true,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-charcoal-soft">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="h-12 w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 text-sm focus:border-rosegold focus:outline-none"
      />
    </div>
  );
}
