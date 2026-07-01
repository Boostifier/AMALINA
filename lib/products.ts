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

export type SortKey = "" | "price-asc" | "price-desc" | "name";

export type ProductFilterOptions = {
  q?: string;
  categorie?: string;
  marque?: string;
  sort?: SortKey | string;
};

export type BrandCount = { name: string; count: number };

/** Distinct, non-empty brands with product counts, sorted by name (fr). */
export function listBrands(products: Product[]): BrandCount[] {
  const map = new Map<string, number>();
  for (const p of products) {
    const b = p.brand?.trim();
    if (b) map.set(b, (map.get(b) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

/**
 * Filter (by category + free-text query) and sort a product list. Sorting is by
 * the effective (sale-aware) price so it matches what the customer sees.
 * Client-safe: used by both the storefront pages and the filter toolbar.
 */
export function applyProductFilters(
  products: Product[],
  { q, categorie, marque, sort }: ProductFilterOptions,
): Product[] {
  let list = products;

  if (categorie) list = list.filter((p) => p.category === categorie);
  if (marque) list = list.filter((p) => p.brand === marque);

  const query = (q ?? "").trim().toLowerCase();
  if (query) {
    list = list.filter((p) =>
      [p.name, p.brand, p.shortDescription, p.description].some((f) =>
        f?.toLowerCase().includes(query),
      ),
    );
  }

  if (sort === "price-asc") {
    list = [...list].sort((a, b) => effectivePrice(a) - effectivePrice(b));
  } else if (sort === "price-desc") {
    list = [...list].sort((a, b) => effectivePrice(b) - effectivePrice(a));
  } else if (sort === "name") {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }

  return list;
}
