import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatPrice } from "@/lib/products";
import {
  getProduct,
  getCategory,
  productsByCategory,
} from "@/lib/catalog";
import ProductImage from "@/components/product-image";
import ProductCard from "@/components/product-card";
import AddToCart from "@/components/add-to-cart";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produit introuvable — Amalina Market" };
  return {
    title: `${product.name} — Amalina Market`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const category = await getCategory(product.category);
  const related = (await productsByCategory(product.category))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-mauve">
        <Link href="/" className="hover:text-rosegold">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href="/produits" className="hover:text-rosegold">
          Boutique
        </Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/produits?categorie=${category.slug}`}
              className="hover:text-rosegold"
            >
              {category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductImage
          product={product}
          className="aspect-square w-full rounded-3xl"
        />

        <div className="flex flex-col">
          {category && (
            <Link
              href={`/produits?categorie=${category.slug}`}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-rosegold"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-medium text-rosegold-dark">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 leading-relaxed text-charcoal-soft">
            {product.description}
          </p>

          <ul className="mt-8 space-y-2.5">
            {product.details.map((d) => (
              <li
                key={d}
                className="flex items-start gap-3 text-sm text-charcoal-soft"
              >
                <span className="mt-1 text-rosegold">✦</span>
                {d}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <AddToCart product={product} />
          </div>

          <p className="mt-6 text-sm text-mauve">
            Livraison soignée · Paiement à la livraison disponible
          </p>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-serif text-3xl text-charcoal">
            Vous aimerez aussi
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
