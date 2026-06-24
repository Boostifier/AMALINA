import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/products";
import type { CategoryRow, ProductRow } from "@/lib/supabase/types";

function toCategory(row: CategoryRow): Category {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    image: row.image,
  };
}

function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category_slug,
    price: Number(row.price),
    shortDescription: row.short_description,
    description: row.description,
    details: row.details ?? [],
    image: row.image,
    bestseller: row.bestseller,
    stock: row.stock,
  };
}

// Cached per request so multiple components can call these without refetching.
export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []).map(toCategory);
});

export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return (data ?? []).map(toProduct);
});

export async function getBestsellers(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.bestseller);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  return data ? toProduct(data) : undefined;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug);
}

export async function productsByCategory(slug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.category === slug);
}
