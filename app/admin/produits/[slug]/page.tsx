import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { updateProduct, deleteProduct } from "@/app/actions/admin";
import ProductForm from "@/components/admin/product-form";
import type { ProductRow } from "@/lib/supabase/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) notFound();
  const product = data as ProductRow;
  const categories = await getCategories();

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/produits" className="text-sm text-rosegold hover:underline">
        ← Retour aux produits
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-charcoal">{product.name}</h1>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="rounded-full border border-rose-300 px-4 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
          >
            Supprimer
          </button>
        </form>
      </div>

      <ProductForm
        action={updateProduct}
        categories={categories}
        product={product}
        submitLabel="Enregistrer les modifications"
      />
    </div>
  );
}
