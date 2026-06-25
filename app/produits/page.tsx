import Link from "next/link";
import type { Metadata } from "next";
import {
  getCategories,
  getProducts,
  getCategory,
  productsByCategory,
} from "@/lib/catalog";
import ProductCard from "@/components/product-card";

export const metadata: Metadata = {
  title: "Boutique — Amalina Market",
  description:
    "Découvrez tous nos soins capillaires : masques nourrissants, huiles, shampoings et accessoires.",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const { categorie, q } = await searchParams;
  const [categories, activeCat] = await Promise.all([
    getCategories(),
    categorie ? getCategory(categorie) : Promise.resolve(undefined),
  ]);

  let list = activeCat
    ? await productsByCategory(activeCat.slug)
    : await getProducts();

  const query = (q ?? "").trim().toLowerCase();
  if (query) {
    list = list.filter((p) =>
      [p.name, p.brand, p.shortDescription, p.description].some((f) =>
        f?.toLowerCase().includes(query)
      )
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rosegold">
          {query ? "Recherche" : "La boutique"}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">
          {query
            ? `« ${q} »`
            : activeCat
              ? activeCat.name
              : "Tous nos produits"}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-charcoal-soft">
          {query
            ? `${list.length} produit${list.length > 1 ? "s" : ""} trouvé${list.length > 1 ? "s" : ""}`
            : activeCat
              ? activeCat.tagline
              : "Une sélection raffinée pour révéler votre éclat naturel."}
        </p>
      </div>

      {/* Filter pills */}
      <div className="mb-12 flex flex-wrap justify-center gap-2.5">
        <FilterPill href="/produits" active={!activeCat}>
          Tous
        </FilterPill>
        {categories.map((c) => (
          <FilterPill
            key={c.slug}
            href={`/produits?categorie=${c.slug}`}
            active={activeCat?.slug === c.slug}
          >
            {c.name}
          </FilterPill>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="py-16 text-center text-charcoal-soft">
          Aucun produit ne correspond{query ? ` à « ${q} »` : ""}.{" "}
          <Link href="/produits" className="text-rosegold hover:underline">
            Voir tout
          </Link>
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-rosegold text-white"
          : "border border-blush-deep/60 bg-white/50 text-charcoal-soft hover:border-rosegold/50 hover:text-rosegold"
      }`}
    >
      {children}
    </Link>
  );
}
