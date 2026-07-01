"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-context";
import type { Product } from "@/lib/products";
import { effectivePrice } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(
      { slug: product.slug, name: product.name, price: effectivePrice(product) },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="inline-flex items-center rounded-full border border-blush-deep/60 bg-white/60">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center text-lg text-charcoal-soft transition-colors hover:text-rosegold"
          aria-label="Diminuer la quantité"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="flex h-11 w-11 items-center justify-center text-lg text-charcoal-soft transition-colors hover:text-rosegold"
          aria-label="Augmenter la quantité"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark sm:flex-none"
      >
        {added ? "Ajouté ✓" : "Ajouter au panier"}
      </button>
    </div>
  );
}
