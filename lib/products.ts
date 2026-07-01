// Pure, client-safe types and helpers shared across server and client components.
// Data access lives in lib/catalog.ts (server-only).

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  image: string; // representative photo (a /public path or a Storage URL)
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: string; // category slug
  price: number; // regular price in TND (DT)
  salePrice?: number; // discounted price when on sale (below `price`)
  shortDescription: string;
  description: string;
  details: string[];
  image: string;
  bestseller?: boolean;
  stock?: number;
};

export function formatPrice(value: number): string {
  return `${value.toLocaleString("fr-FR")} DT`;
}

type Priced = { price: number; salePrice?: number | null };

/** A product is on sale when it has a sale price strictly below its regular price. */
export function isOnSale(p: Priced): boolean {
  return p.salePrice != null && p.salePrice > 0 && p.salePrice < p.price;
}

/** The price the customer actually pays (sale price when on sale, else regular). */
export function effectivePrice(p: Priced): number {
  return isOnSale(p) ? (p.salePrice as number) : p.price;
}

/** Rounded discount percentage (e.g. 25 for "−25%"), or 0 when not on sale. */
export function discountPercent(p: Priced): number {
  if (!isOnSale(p)) return 0;
  return Math.round((1 - (p.salePrice as number) / p.price) * 100);
}
