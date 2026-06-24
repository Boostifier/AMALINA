"use client";

import { useActionState } from "react";
import ImageField from "@/components/admin/image-field";
import type { CategoryRow } from "@/lib/supabase/types";
import type { AdminFormState } from "@/app/actions/admin";

type Action = (prev: AdminFormState, fd: FormData) => Promise<AdminFormState>;

export default function CategoryForm({
  action,
  category,
  submitLabel,
}: {
  action: Action;
  category?: CategoryRow;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      {category && <input type="hidden" name="id" value={category.id} />}

      {state?.error && (
        <p className="rounded-xl bg-rosegold/10 px-4 py-3 text-sm text-rosegold-dark">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Nom *" defaultValue={category?.name} />
        <Field
          name="slug"
          label="Slug *"
          defaultValue={category?.slug}
          hint="Identifiant unique dans l'URL, ex : huiles-soins"
        />
        <Field name="tagline" label="Accroche" defaultValue={category?.tagline} />
        <Field
          name="sort_order"
          label="Ordre d'affichage"
          type="number"
          defaultValue={category ? String(category.sort_order) : "0"}
        />
      </div>

      <ImageField defaultValue={category?.image} label="Image de la catégorie" />

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

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  hint?: string;
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
        defaultValue={defaultValue}
        className="h-12 w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 text-sm focus:border-rosegold focus:outline-none"
      />
      {hint && <p className="mt-1 text-xs text-mauve">{hint}</p>}
    </div>
  );
}
