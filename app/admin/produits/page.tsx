import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";
import { deleteProduct } from "@/app/actions/admin";
import ConfirmSubmit from "@/components/admin/confirm-submit";
import ProductImage from "@/components/product-image";
import type { ProductRow } from "@/lib/supabase/types";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  const products = (data ?? []) as ProductRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-charcoal">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex h-11 items-center justify-center rounded-full bg-rosegold px-6 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
        >
          + Nouveau produit
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-blush-deep/40 bg-white/60">
        <table className="w-full text-sm">
          <thead className="text-left text-mauve">
            <tr className="border-b border-blush-deep/30">
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Image</span>
              </th>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Marque</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 text-right font-medium">Prix</th>
              <th className="px-4 py-3 text-right font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-blush-deep/20 last:border-0">
                <td className="py-2 pl-4 pr-0">
                  <Link href={`/admin/produits/${p.slug}`} className="block">
                    <ProductImage
                      product={p}
                      sizes="48px"
                      className="h-12 w-12 rounded-lg border border-blush-deep/30"
                    />
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/produits/${p.slug}`} className="text-rosegold hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-charcoal-soft">{p.brand}</td>
                <td className="px-4 py-3 text-charcoal-soft">{p.category_slug}</td>
                <td className="px-4 py-3 text-right text-charcoal">
                  {p.sale_price != null ? (
                    <span className="flex items-baseline justify-end gap-2">
                      <span className="font-medium text-rosegold-dark">{formatPrice(Number(p.sale_price))}</span>
                      <span className="text-xs text-mauve line-through">{formatPrice(Number(p.price))}</span>
                    </span>
                  ) : (
                    formatPrice(Number(p.price))
                  )}
                </td>
                <td className="px-4 py-3 text-right text-charcoal-soft">{p.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.active ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {p.active ? "Visible" : "Masqué"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/produits/${p.slug}`}
                      className="text-charcoal-soft hover:text-rosegold"
                    >
                      Modifier
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmSubmit
                        confirm={`Supprimer le produit « ${p.name} » ?`}
                        className="text-rose-600 transition-colors hover:text-rose-700 disabled:opacity-50"
                      >
                        Supprimer
                      </ConfirmSubmit>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
