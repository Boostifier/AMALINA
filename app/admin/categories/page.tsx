import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteCategory } from "@/app/actions/admin";
import ConfirmSubmit from "@/components/admin/confirm-submit";
import type { CategoryRow, ProductRow } from "@/lib/supabase/types";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: cats }, { data: prods }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("products").select("category_slug"),
  ]);

  const categories = (cats ?? []) as CategoryRow[];
  const products = (prods ?? []) as Pick<ProductRow, "category_slug">[];

  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p.category_slug, (counts.get(p.category_slug) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-charcoal">Catégories</h1>
        <Link
          href="/admin/categories/nouveau"
          className="inline-flex h-11 items-center justify-center rounded-full bg-rosegold px-6 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
        >
          + Nouvelle catégorie
        </Link>
      </div>

      {error === "in-use" && (
        <p className="rounded-xl bg-rosegold/10 px-4 py-3 text-sm text-rosegold-dark">
          Impossible de supprimer une catégorie qui contient encore des produits.
          Déplacez ou supprimez d&apos;abord ces produits.
        </p>
      )}

      {categories.length === 0 ? (
        <p className="rounded-2xl border border-blush-deep/40 bg-white/60 p-6 text-charcoal-soft">
          Aucune catégorie pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-blush-deep/40 bg-white/60">
          <table className="w-full text-sm">
            <thead className="text-left text-mauve">
              <tr className="border-b border-blush-deep/30">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Accroche</th>
                <th className="px-4 py-3 text-right font-medium">Produits</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const count = counts.get(c.slug) ?? 0;
                return (
                  <tr key={c.id} className="border-b border-blush-deep/20 last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/categories/${c.slug}`}
                        className="font-medium text-rosegold hover:underline"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-charcoal-soft">{c.slug}</td>
                    <td className="px-4 py-3 text-charcoal-soft">{c.tagline || "—"}</td>
                    <td className="px-4 py-3 text-right text-charcoal-soft">{count}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/categories/${c.slug}`}
                          className="text-charcoal-soft hover:text-rosegold"
                        >
                          Modifier
                        </Link>
                        <form action={deleteCategory}>
                          <input type="hidden" name="id" value={c.id} />
                          <input type="hidden" name="slug" value={c.slug} />
                          <ConfirmSubmit
                            confirm={`Supprimer la catégorie « ${c.name} » ?`}
                            className="text-rose-600 transition-colors hover:text-rose-700 disabled:opacity-50"
                          >
                            Supprimer
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
