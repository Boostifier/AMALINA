import Link from "next/link";
import type { Metadata } from "next";
import { getSaleProducts, getCategories } from "@/lib/catalog";
import { applyProductFilters, listBrands, discountPercent } from "@/lib/products";
import ProductCard from "@/components/product-card";
import ProductFilters from "@/components/product-filters";
import BrandSidebar from "@/components/brand-sidebar";
import Pagination, { PAGE_SIZE } from "@/components/pagination";

export const metadata: Metadata = {
  title: "Promotions — Amalina Market",
  description:
    "Profitez de nos offres du moment : soins en promotion à prix réduit, dans la limite des stocks disponibles.",
};

export default async function PromotionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    categorie?: string;
    marque?: string;
    q?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const { categorie, marque, q, sort, page: pageParam } = await searchParams;
  const [allSale, categories] = await Promise.all([
    getSaleProducts(),
    getCategories(),
  ]);

  const hasAnyPromo = allSale.length > 0;
  const maxDiscount = allSale.reduce(
    (max, p) => Math.max(max, discountPercent(p)),
    0,
  );
  // Only offer categories/brands that actually have something on sale.
  const promoCategories = categories.filter((c) =>
    allSale.some((p) => p.category === c.slug),
  );
  // Brands reflect the current view (category + search) within the sale set,
  // excluding the brand filter itself.
  const brandScope = applyProductFilters(allSale, { q, categorie });
  const promoBrands = listBrands(brandScope);

  const list = applyProductFilters(allSale, { q, categorie, marque, sort });
  const count = list.length;

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const page = Math.min(Math.max(1, Math.floor(Number(pageParam) || 1)), totalPages);
  const pageItems = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const makeHref = (p: number) => {
    const sp = new URLSearchParams();
    if (categorie) sp.set("categorie", categorie);
    if (marque) sp.set("marque", marque);
    if (q) sp.set("q", q);
    if (sort) sp.set("sort", sort);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/promotions?${qs}` : "/promotions";
  };

  return (
    <>
      {/* Hero band */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rosegold to-rosegold-dark">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="animate-fade-up relative mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Offres limitées
          </span>
          <h1 className="mt-6 font-serif text-5xl italic text-white sm:text-6xl lg:text-7xl">
            Promotions
          </h1>
          <p className="mx-auto mt-5 max-w-md text-white/85">
            Nos soins coups de cœur à prix réduit, à saisir dans la limite des
            stocks disponibles.
          </p>

          {hasAnyPromo && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                {allSale.length} produit{allSale.length > 1 ? "s" : ""} en promo
              </span>
              {maxDiscount > 0 && (
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-rosegold-dark">
                  Jusqu&apos;à −{maxDiscount}%
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {!hasAnyPromo ? (
          <div className="mx-auto max-w-md rounded-3xl border border-blush-deep/50 bg-white/70 px-8 py-16 text-center">
            <span className="text-2xl text-rosegold">✦</span>
            <p className="mt-4 font-serif text-2xl text-charcoal">
              Pas de promotion en ce moment
            </p>
            <p className="mt-2 text-sm text-charcoal-soft">
              Revenez bientôt — ou explorez toute la collection en attendant.
            </p>
            <Link
              href="/produits"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-rosegold px-7 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
            >
              Voir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <BrandSidebar brands={promoBrands} total={brandScope.length} />

            <div className="min-w-0">
              <ProductFilters categories={promoCategories} />

              {count === 0 ? (
                <p className="py-16 text-center text-charcoal-soft">
                  Aucune promotion ne correspond à votre recherche.{" "}
                  <Link href="/promotions" className="text-rosegold hover:underline">
                    Voir toutes les promos
                  </Link>
                </p>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pageItems.map((p) => (
                      <ProductCard key={p.slug} product={p} />
                    ))}
                  </div>
                  <Pagination page={page} totalPages={totalPages} makeHref={makeHref} />
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
