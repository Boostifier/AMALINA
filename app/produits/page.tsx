import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getCategories,
  getProducts,
  getCategory,
  productsByCategory,
} from "@/lib/catalog";
import type { Category } from "@/lib/products";
import ProductCard from "@/components/product-card";

export const metadata: Metadata = {
  title: "Boutique — Amalina Market",
  description:
    "Découvrez tous nos soins : visage, cheveux, solaire, huiles, masques et accessoires.",
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
        f?.toLowerCase().includes(query),
      ),
    );
  }

  const count = list.length;
  const countLabel = `${count} produit${count > 1 ? "s" : ""}`;

  return (
    <>
      {/* Header */}
      {query ? (
        <SearchHeader query={q ?? ""} count={count} />
      ) : activeCat ? (
        <CategoryHero category={activeCat} countLabel={countLabel} />
      ) : (
        <AllProductsHero countLabel={countLabel} />
      )}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        {/* Filter pills */}
        <div className="mb-12 flex flex-wrap justify-center gap-2.5">
          <FilterPill href="/produits" active={!activeCat && !query}>
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

        {count === 0 ? (
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
      </section>
    </>
  );
}

/** Full-bleed banner built from the category's own photo. */
function CategoryHero({
  category,
  countLabel,
}: {
  category: Category;
  countLabel: string;
}) {
  return (
    <section className="relative overflow-hidden">
      {/* Brand gradient base — always visible, so the header never looks empty
          if the photo fails to load. */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-rosegold-dark to-charcoal" />
      {/* Category photo layered on top as an enhancement. */}
      <Image
        src={category.image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
      <div className="animate-fade-up relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Breadcrumb current={category.name} />
        <h1 className="mt-4 font-serif text-5xl text-ivory sm:text-6xl">
          {category.name}
        </h1>
        <p className="mt-3 max-w-md text-white/80">{category.tagline}</p>
        <span className="mt-6 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
          {countLabel}
        </span>
      </div>
    </section>
  );
}

/** Animated gradient band for the unfiltered catalogue. */
function AllProductsHero({ countLabel }: { countLabel: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="animate-gradient absolute inset-0 -z-10 bg-[linear-gradient(120deg,#f7ede9,#f4ddd8,#e9b9b5,#d99ca0,#e9b9b5,#f4ddd8,#f7ede9)]" />
      <div className="animate-fade-up mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-rosegold/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-rosegold backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-rosegold" />
          La boutique
        </span>
        <h1 className="mt-6 font-serif text-5xl text-charcoal sm:text-6xl lg:text-7xl">
          Tous nos <span className="italic text-rosegold">soins</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-charcoal-soft">
          Une sélection raffinée pour révéler votre éclat naturel — visage,
          cheveux et protection solaire.
        </p>
        <span className="mt-6 inline-block rounded-full bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-rosegold backdrop-blur">
          {countLabel}
        </span>
      </div>
    </section>
  );
}

function SearchHeader({ query, count }: { query: string; count: number }) {
  const plural = count > 1 ? "s" : "";
  return (
    <section className="mx-auto max-w-7xl px-5 pt-16 text-center sm:px-8">
      <Breadcrumb current="Recherche" tone="light" />
      <h1 className="mt-4 font-serif text-4xl text-charcoal sm:text-5xl">
        « {query} »
      </h1>
      <p className="mt-3 text-charcoal-soft">
        {count} produit{plural} trouvé{plural}
      </p>
    </section>
  );
}

function Breadcrumb({
  current,
  tone = "dark",
}: {
  current: string;
  tone?: "dark" | "light";
}) {
  const base = tone === "dark" ? "text-white/70" : "text-mauve";
  const link = tone === "dark" ? "hover:text-white" : "hover:text-rosegold";
  return (
    <nav className={`flex items-center gap-2 text-xs uppercase tracking-[0.18em] ${base}`}>
      <Link href="/" className={`transition-colors ${link}`}>
        Accueil
      </Link>
      <span aria-hidden>/</span>
      <Link href="/produits" className={`transition-colors ${link}`}>
        Boutique
      </Link>
      <span aria-hidden>/</span>
      <span className={tone === "dark" ? "text-white" : "text-charcoal"}>
        {current}
      </span>
    </nav>
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
