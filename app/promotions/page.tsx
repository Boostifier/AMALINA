import Link from "next/link";
import type { Metadata } from "next";
import { getSaleProducts } from "@/lib/catalog";
import { discountPercent } from "@/lib/products";
import ProductCard from "@/components/product-card";
import Pagination, { PAGE_SIZE } from "@/components/pagination";

export const metadata: Metadata = {
  title: "Promotions — Amalina Market",
  description:
    "Profitez de nos offres du moment : soins en promotion à prix réduit, dans la limite des stocks disponibles.",
};

export default async function PromotionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const products = await getSaleProducts();
  const maxDiscount = products.reduce(
    (max, p) => Math.max(max, discountPercent(p)),
    0,
  );

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Math.floor(Number(pageParam) || 1)), totalPages);
  const pageItems = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const makeHref = (p: number) => (p > 1 ? `/promotions?page=${p}` : "/promotions");

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

          {products.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                {products.length} produit{products.length > 1 ? "s" : ""} en promo
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
        {products.length === 0 ? (
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
