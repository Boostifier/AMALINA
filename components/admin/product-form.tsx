"use client";

import { useActionState } from "react";
import ImageField from "@/components/admin/image-field";
import type { Category } from "@/lib/products";
import type { ProductRow } from "@/lib/supabase/types";
import type { AdminFormState } from "@/app/actions/admin";

type Action = (
  prev: AdminFormState,
  fd: FormData
) => Promise<AdminFormState>;

export default function ProductForm({
  action,
  categories,
  product,
  submitLabel,
}: {
  action: Action;
  categories: Category[];
  product?: ProductRow;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      {state?.error && (
        <p className="rounded-xl bg-rosegold/10 px-4 py-3 text-sm text-rosegold-dark">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="name" label="Nom *" defaultValue={product?.name} />
        <Text name="slug" label="Slug *" defaultValue={product?.slug} hint="Identifiant unique dans l'URL, ex : masque-keratine" />
        <Text name="brand" label="Marque" defaultValue={product?.brand} />
        <div>
          <Label htmlFor="category_slug">Catégorie *</Label>
          <select
            id="category_slug"
            name="category_slug"
            defaultValue={product?.category_slug ?? categories[0]?.slug}
            className="h-12 w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 text-sm focus:border-rosegold focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Text name="price" label="Prix (DT) *" type="number" step="0.01" defaultValue={product ? String(product.price) : ""} />
        <Text name="sale_price" label="Prix promo (DT)" type="number" step="0.01" defaultValue={product?.sale_price != null ? String(product.sale_price) : ""} hint="Laisser vide si pas en promo. Doit être inférieur au prix." />
        <Text name="stock" label="Stock" type="number" defaultValue={product ? String(product.stock) : "0"} />
        <Text name="sort_order" label="Ordre d'affichage" type="number" defaultValue={product ? String(product.sort_order) : "0"} />
      </div>

      <ImageField defaultValue={product?.image} label="Image du produit" />

      <div>
        <Label htmlFor="short_description">Description courte</Label>
        <textarea
          id="short_description"
          name="short_description"
          rows={2}
          defaultValue={product?.short_description}
          className="w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description}
          className="w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
        />
      </div>

      <div>
        <Label htmlFor="details">Caractéristiques (une par ligne)</Label>
        <textarea
          id="details"
          name="details"
          rows={4}
          defaultValue={product?.details?.join("\n")}
          className="w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <Checkbox name="bestseller" label="Best-seller" defaultChecked={product?.bestseller} />
        <Checkbox name="active" label="Visible sur le site" defaultChecked={product ? product.active : true} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-charcoal-soft">
      {children}
    </label>
  );
}

function Text({
  name,
  label,
  type = "text",
  step,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  type?: string;
  step?: string;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        className="h-12 w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 text-sm focus:border-rosegold focus:outline-none"
      />
      {hint && <p className="mt-1 text-xs text-mauve">{hint}</p>}
    </div>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-charcoal-soft">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-blush-deep/60 text-rosegold focus:ring-rosegold"
      />
      {label}
    </label>
  );
}
