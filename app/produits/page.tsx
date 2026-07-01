import Link from "next/link";
import type { Metadata } from "next";
import {
  getCategories,
  getProducts,
  getCategory,
  productsByCategory,
} from "@/lib/catalog";
import type { Category } from "@/lib/products";
import ProductCard from "@/components/product-card";
import Pagination, { PAGE_SIZE } from "@/components/pagination";

export const metadata: Metadata = {
  title: "Boutique — Amalina Market",
  description:
    "Découvrez tous nos soins : visage, cheveux, solaire, huiles, masques et accessoires.",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string; page?: string }>;
}) {
  const { categorie, q, page: pageParam } = await searchParams;
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

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const page = Math.min(Math.max(1, Math.floor(Number(pageParam) || 1)), totalPages);
  const pageItems = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const makeHref = (p: number) => {
    const sp = new URLSearchParams();
    if (categorie) sp.set("categorie", categorie);
    if (q) sp.set("q", q);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/produits?${qs}` : "/produits";
  };

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
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pageItems.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} makeHref={makeHref} />
          </>
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
    <section className="relative overflow-hidden bg-gradient-to-br from-cream via-blush to-blush-deep">
      <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-rosegold/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-rosegold/20 blur-3xl" />
      <div className="animate-fade-up relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Breadcrumb current={category.name} tone="light" />
        <h1 className="mt-4 font-serif text-5xl text-charcoal sm:text-6xl">
          {category.name}
        </h1>
        <p className="mt-3 max-w-md text-charcoal-soft">{category.tagline}</p>
        <span className="mt-6 inline-block rounded-full bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-rosegold backdrop-blur">
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
