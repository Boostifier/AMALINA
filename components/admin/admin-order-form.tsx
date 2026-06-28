"use client";

import { useMemo, useState, useTransition } from "react";
import { createOrder } from "@/app/actions/admin";
import { formatPrice, type Product } from "@/lib/products";
import { ORDER_STATUSES, STATUS_LABELS } from "@/lib/orders";
import type { OrderStatus } from "@/lib/supabase/types";

type Line = { slug: string; qty: number };

const fieldClass =
  "h-11 w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 text-sm focus:border-rosegold focus:outline-none";

export default function AdminOrderForm({ products }: { products: Product[] }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [pickSlug, setPickSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const bySlug = useMemo(
    () => new Map(products.map((p) => [p.slug, p])),
    [products]
  );

  function addLine() {
    if (!pickSlug) return;
    setLines((prev) =>
      prev.some((l) => l.slug === pickSlug)
        ? prev.map((l) => (l.slug === pickSlug ? { ...l, qty: l.qty + 1 } : l))
        : [...prev, { slug: pickSlug, qty: 1 }]
    );
    setPickSlug("");
  }

  function setQty(slug: string, qty: number) {
    setLines((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, qty: Math.max(1, qty) } : l))
    );
  }

  function removeLine(slug: string) {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }

  const subtotal = lines.reduce(
    (s, l) => s + (bySlug.get(l.slug)?.price ?? 0) * l.qty,
    0
  );
  const shipping = subtotal === 0 || subtotal >= 400 ? 0 : 3;
  const total = subtotal + shipping;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (lines.length === 0) {
      setError("Ajoutez au moins un produit.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    startTransition(async () => {
      const res = await createOrder({
        full_name: get("full_name"),
        phone: get("phone"),
        email: get("email"),
        address: get("address"),
        city: get("city"),
        postal_code: get("postal_code"),
        notes: get("notes"),
        status: get("status") as OrderStatus,
        items: lines,
      });
      // On success the action redirects; we only get here on failure.
      if (res && !res.ok) setError(res.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Customer */}
      <section className="rounded-2xl border border-blush-deep/40 bg-white/60 p-6">
        <h2 className="mb-4 font-serif text-xl text-charcoal">Client</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom complet *" name="full_name" required />
          <Field label="Téléphone *" name="phone" required type="tel" />
          <Field label="E-mail" name="email" type="email" />
          <Field label="Ville *" name="city" required />
          <Field label="Adresse" name="address" />
          <Field label="Code postal" name="postal_code" />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm text-charcoal-soft">Note</label>
          <textarea
            name="notes"
            rows={2}
            className="w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 py-2.5 text-sm focus:border-rosegold focus:outline-none"
          />
        </div>
        <div className="mt-4 sm:max-w-xs">
          <label className="mb-1.5 block text-sm text-charcoal-soft">Statut</label>
          <select name="status" defaultValue="pending" className={fieldClass}>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Products */}
      <section className="rounded-2xl border border-blush-deep/40 bg-white/60 p-6">
        <h2 className="mb-4 font-serif text-xl text-charcoal">Articles</h2>

        <div className="flex flex-wrap gap-3">
          <select
            value={pickSlug}
            onChange={(e) => setPickSlug(e.target.value)}
            className={`${fieldClass} sm:max-w-md`}
          >
            <option value="">Choisir un produit…</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} — {formatPrice(p.price)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addLine}
            disabled={!pickSlug}
            className="inline-flex h-11 items-center justify-center rounded-full border border-rosegold/50 px-5 text-sm font-semibold text-rosegold transition-colors hover:bg-rosegold hover:text-white disabled:opacity-40"
          >
            Ajouter
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="mt-4 text-sm text-mauve">Aucun article pour le moment.</p>
        ) : (
          <ul className="mt-4 divide-y divide-blush-deep/30">
            {lines.map((l) => {
              const p = bySlug.get(l.slug);
              if (!p) return null;
              return (
                <li key={l.slug} className="flex items-center gap-3 py-3 text-sm">
                  <span className="flex-1 text-charcoal">{p.name}</span>
                  <input
                    type="number"
                    min={1}
                    value={l.qty}
                    onChange={(e) => setQty(l.slug, Math.floor(Number(e.target.value)))}
                    className="h-9 w-16 rounded-lg border border-blush-deep/60 bg-white px-2 text-center text-sm focus:border-rosegold focus:outline-none"
                  />
                  <span className="w-24 text-right text-charcoal-soft">
                    {formatPrice(p.price * l.qty)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLine(l.slug)}
                    className="text-rose-600 hover:text-rose-700"
                    aria-label="Retirer"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <dl className="mt-4 space-y-2 border-t border-blush-deep/30 pt-4 text-sm">
          <Row label="Sous-total" value={formatPrice(subtotal)} />
          <Row label="Livraison" value={shipping === 0 ? "Offerte" : formatPrice(shipping)} />
          <Row label="Total" value={formatPrice(total)} strong />
        </dl>
      </section>

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark disabled:opacity-50"
      >
        {pending ? "Création…" : "Créer la commande"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-charcoal-soft">
        {label}
      </label>
      <input id={name} name={name} type={type} required={required} className={fieldClass} />
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "font-semibold text-charcoal" : "text-charcoal-soft"}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
