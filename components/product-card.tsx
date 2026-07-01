"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { formatPrice, effectivePrice, isOnSale, discountPercent } from "@/lib/products";
import ProductImage from "@/components/product-image";
import { useCart } from "@/components/cart-context";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock === 0;
  const onSale = isOnSale(product);

  function handleAdd(e: React.MouseEvent) {
    // The card is a link; keep the click on the button only.
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    add({ slug: product.slug, name: product.name, price: effectivePrice(product) });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-blush-deep/40 bg-white shadow-[0_12px_34px_-24px_rgba(43,36,34,0.55)] transition-all duration-300 hover:-translate-y-1.5 hover:border-rosegold/50 hover:shadow-[0_30px_55px_-28px_rgba(156,88,98,0.6)]"
    >
      <div className="relative overflow-hidden bg-cream">
        <ProductImage
          product={product}
          className={`aspect-square w-full transition-transform duration-[600ms] ease-out group-hover:scale-[1.06] ${
            outOfStock ? "opacity-70 grayscale-[0.35]" : ""
          }`}
        />
        {/* Subtle scrim that deepens on hover for a little more depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {onSale && (
            <span className="rounded-full bg-rosegold px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-widest text-white shadow-sm">
              −{discountPercent(product)}%
            </span>
          )}
          {product.bestseller && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-widest text-rosegold shadow-sm backdrop-blur">
              Best-seller
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-charcoal/85 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-widest text-white">
              Rupture
            </span>
          )}
        </div>

        {/* Quick add — always visible on touch, reveal on hover from sm up */}
        {!outOfStock && (
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Ajouter ${product.name} au panier`}
            className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg ring-1 ring-white/30 transition-all duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 ${
              added ? "bg-emerald-600" : "bg-rosegold hover:bg-rosegold-dark"
            }`}
          >
            {added ? <CheckIcon /> : <CartPlusIcon />}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {product.brand && (
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-mauve">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 font-serif text-lg leading-snug text-charcoal transition-colors group-hover:text-rosegold-dark">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-charcoal-soft">
          {product.shortDescription}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-blush-deep/25 pt-4">
          {onSale ? (
            <span className="flex items-baseline gap-2">
              <span className="font-serif text-xl text-rosegold-dark">
                {formatPrice(effectivePrice(product))}
              </span>
              <span className="text-sm text-mauve line-through">
                {formatPrice(product.price)}
              </span>
            </span>
          ) : (
            <span className="font-serif text-xl text-rosegold-dark">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-rosegold/40 text-rosegold transition-colors group-hover:bg-rosegold group-hover:text-white">
            <ArrowIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

const svg = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function CartPlusIcon() {
  return (
    <svg {...svg} width={19} height={19}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h2.2l2 12.2a1.6 1.6 0 0 0 1.6 1.3h9.1a1.6 1.6 0 0 0 1.6-1.2L21 7H6" />
      <path d="M13 4v5M10.5 6.5h5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg {...svg} width={19} height={19}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg {...svg} width={15} height={15}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
