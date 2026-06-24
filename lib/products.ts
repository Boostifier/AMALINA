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
  price: number; // in TND (DT)
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
