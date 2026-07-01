import Link from "next/link";
import type { Metadata } from "next";
import { getSaleProducts } from "@/lib/catalog";
import ProductCard from "@/components/product-card";

export const metadata: Metadata = {
  title: "Promotions — Amalina Market",
  description:
    "Profitez de nos offres du moment : soins en promotion à prix réduit, dans la limite des stocks disponibles.",
};

export default async function PromotionsPage() {
  const products = await getSaleProducts();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rosegold">
          Offres du moment
        </p>
        <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">
          Promotions
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-charcoal-soft">
          {products.length > 0
            ? `${products.length} produit${products.length > 1 ? "s" : ""} en promotion — à saisir avant la fin des stocks.`
            : "Aucune promotion en ce moment. Revenez bientôt !"}
        </p>
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-charcoal-soft">
          <Link href="/produits" className="text-rosegold hover:underline">
            Découvrir toute la boutique
          </Link>
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
