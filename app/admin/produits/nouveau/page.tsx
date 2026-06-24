import Link from "next/link";
import { getCategories } from "@/lib/catalog";
import { createProduct } from "@/app/actions/admin";
import ProductForm from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/produits" className="text-sm text-rosegold hover:underline">
        ← Retour aux produits
      </Link>
      <h1 className="font-serif text-3xl text-charcoal">Nouveau produit</h1>
      <ProductForm
        action={createProduct}
        categories={categories}
        submitLabel="Créer le produit"
      />
    </div>
  );
}
