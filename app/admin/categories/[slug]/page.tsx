import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateCategory, deleteCategory } from "@/app/actions/admin";
import CategoryForm from "@/components/admin/category-form";
import ConfirmSubmit from "@/components/admin/confirm-submit";
import type { CategoryRow } from "@/lib/supabase/types";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) notFound();
  const category = data as CategoryRow;

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_slug", category.slug);
  const productCount = count ?? 0;

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/categories" className="text-sm text-rosegold hover:underline">
        ← Retour aux catégories
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-charcoal">{category.name}</h1>
        <form action={deleteCategory}>
          <input type="hidden" name="id" value={category.id} />
          <input type="hidden" name="slug" value={category.slug} />
          <ConfirmSubmit
            confirm={`Supprimer la catégorie « ${category.name} » ?`}
            className="rounded-full border border-rose-300 px-4 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
          >
            Supprimer
          </ConfirmSubmit>
        </form>
      </div>

      {productCount > 0 && (
        <p className="rounded-xl bg-blush/40 px-4 py-3 text-sm text-charcoal-soft">
          {productCount} produit{productCount > 1 ? "s" : ""} dans cette catégorie.
          Renommer le slug mettra automatiquement à jour ces produits ; la
          suppression n&apos;est possible qu&apos;une fois la catégorie vide.
        </p>
      )}

      <CategoryForm
        action={updateCategory}
        category={category}
        submitLabel="Enregistrer les modifications"
      />
    </div>
  );
}
