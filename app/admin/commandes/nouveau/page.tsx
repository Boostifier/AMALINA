import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import AdminOrderForm from "@/components/admin/admin-order-form";

export default async function NewOrderPage() {
  const products = await getProducts();

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/commandes" className="text-sm text-rosegold hover:underline">
        ← Retour aux commandes
      </Link>
      <h1 className="font-serif text-3xl text-charcoal">Nouvelle commande</h1>
      <AdminOrderForm products={products} />
    </div>
  );
}
