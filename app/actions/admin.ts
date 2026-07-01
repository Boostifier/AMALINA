"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadImage, UploadError } from "@/lib/supabase/upload";
import { requireAdmin } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/orders";
import { effectivePrice } from "@/lib/products";
import type { OrderStatus } from "@/lib/supabase/types";

export type AdminFormState = { error?: string } | undefined;

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function num(fd: FormData, key: string): number {
  const n = Number(fd.get(key));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Sale price is optional. Return the parsed number only when it is a valid,
 * positive value strictly below the regular price; otherwise null (no sale).
 */
function parseSalePrice(fd: FormData): number | null {
  const raw = str(fd, "sale_price");
  if (!raw) return null;
  const sale = Number(raw);
  const price = num(fd, "price");
  if (!Number.isFinite(sale) || sale <= 0 || sale >= price) return null;
  return sale;
}

/**
 * If the form carries an uploaded file (`image_file`), store it and return its
 * public URL; otherwise return null so the caller keeps the pasted path/URL.
 */
async function resolveImageUpload(
  fd: FormData,
  folder: string
): Promise<string | null> {
  const file = fd.get("image_file");
  if (file instanceof File && file.size > 0) {
    return uploadImage(file, folder);
  }
  return null;
}

function parseProduct(fd: FormData) {
  return {
    slug: str(fd, "slug"),
    name: str(fd, "name"),
    brand: str(fd, "brand"),
    category_slug: str(fd, "category_slug"),
    price: num(fd, "price"),
    sale_price: parseSalePrice(fd),
    short_description: str(fd, "short_description"),
    description: str(fd, "description"),
    details: str(fd, "details")
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean),
    image: str(fd, "image"),
    stock: Math.max(0, Math.floor(num(fd, "stock"))),
    sort_order: Math.floor(num(fd, "sort_order")),
    bestseller: fd.get("bestseller") === "on",
    active: fd.get("active") === "on",
  };
}

function revalidateCatalog() {
  revalidatePath("/", "layout");
  revalidatePath("/produits");
  revalidatePath("/admin/produits");
}

export async function createProduct(
  _prev: AdminFormState,
  fd: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const product = parseProduct(fd);

  if (!product.slug || !product.name || !product.category_slug) {
    return { error: "Le slug, le nom et la catégorie sont obligatoires." };
  }

  try {
    const uploaded = await resolveImageUpload(fd, "products/");
    if (uploaded) product.image = uploaded;
  } catch (e) {
    return { error: e instanceof UploadError ? e.message : "Le téléchargement de l'image a échoué." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert(product);
  if (error) {
    return {
      error: error.code === "23505"
        ? "Un produit avec ce slug existe déjà."
        : "Impossible de créer le produit. Vérifiez la catégorie et les champs.",
    };
  }

  revalidateCatalog();
  redirect("/admin/produits");
}

export async function updateProduct(
  _prev: AdminFormState,
  fd: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const id = str(fd, "id");
  if (!id) return { error: "Produit introuvable." };
  const product = parseProduct(fd);

  if (!product.slug || !product.name || !product.category_slug) {
    return { error: "Le slug, le nom et la catégorie sont obligatoires." };
  }

  try {
    const uploaded = await resolveImageUpload(fd, "products/");
    if (uploaded) product.image = uploaded;
  } catch (e) {
    return { error: e instanceof UploadError ? e.message : "Le téléchargement de l'image a échoué." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(product).eq("id", id);
  if (error) {
    return {
      error: error.code === "23505"
        ? "Un produit avec ce slug existe déjà."
        : "Impossible de mettre à jour le produit.",
    };
  }

  revalidateCatalog();
  revalidatePath(`/produits/${product.slug}`);
  redirect("/admin/produits");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidateCatalog();
  redirect("/admin/produits");
}

export async function updateOrderStatus(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const status = str(fd, "status") as OrderStatus;
  if (!id || !ORDER_STATUSES.includes(status)) return;

  const supabase = await createClient();
  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${id}`);
}

export type AdminOrderInput = {
  full_name: string;
  phone: string;
  email?: string;
  address?: string;
  city: string;
  postal_code?: string;
  notes?: string;
  status?: OrderStatus;
  items: { slug: string; qty: number }[];
};

/**
 * Admin-created order (e.g. a phone/COD order taken manually). Prices and
 * names come from the database, never the client — mirrors the storefront
 * checkout. Like the storefront, it does not touch stock.
 */
export async function createOrder(
  input: AdminOrderInput
): Promise<{ ok: false; error: string }> {
  await requireAdmin();

  const full_name = input.full_name?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";
  const city = input.city?.trim() ?? "";
  if (!full_name || !phone || !city) {
    return { ok: false, error: "Le nom, le téléphone et la ville sont obligatoires." };
  }

  // Normalize + dedupe requested items.
  const wanted = new Map<string, number>();
  for (const it of input.items ?? []) {
    const qty = Math.floor(Number(it.qty));
    if (it.slug && qty > 0) wanted.set(it.slug, (wanted.get(it.slug) ?? 0) + qty);
  }
  if (wanted.size === 0) {
    return { ok: false, error: "Ajoutez au moins un produit." };
  }

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("slug, name, price, sale_price, active")
    .in("slug", [...wanted.keys()]);

  const lines = (products ?? [])
    .filter((p) => p.active)
    .map((p) => {
      const qty = wanted.get(p.slug)!;
      const unit = effectivePrice({ price: Number(p.price), salePrice: p.sale_price });
      return {
        product_slug: p.slug,
        product_name: p.name,
        unit_price: unit,
        qty,
        line_total: Number((unit * qty).toFixed(2)),
      };
    });
  if (lines.length === 0) {
    return { ok: false, error: "Les produits sélectionnés sont introuvables." };
  }

  const subtotal = Number(lines.reduce((s, l) => s + l.line_total, 0).toFixed(2));
  const shipping = subtotal >= 400 ? 0 : 3;
  const total = Number((subtotal + shipping).toFixed(2));
  const status =
    input.status && ORDER_STATUSES.includes(input.status) ? input.status : "pending";

  const orderId = randomUUID();
  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    user_id: null,
    status,
    full_name,
    email: (input.email ?? "").trim(),
    phone,
    address: (input.address ?? "").trim(),
    city,
    postal_code: (input.postal_code ?? "").trim(),
    notes: (input.notes ?? "").trim(),
    payment_method: "cod",
    subtotal,
    shipping,
    total,
  });
  if (orderError) {
    return { ok: false, error: "Impossible d'enregistrer la commande." };
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(lines.map((l) => ({ order_id: orderId, ...l })));
  if (itemsError) {
    // Roll back the orphaned order (needs service role: no RLS delete policy).
    await createAdminClient().from("orders").delete().eq("id", orderId);
    return { ok: false, error: "Impossible d'enregistrer les articles." };
  }

  revalidatePath("/admin/commandes");
  redirect(`/admin/commandes/${orderId}`);
}

export async function deleteOrder(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  if (!id) return;

  // `orders` has no RLS delete policy, so use the service-role client (the
  // action itself is admin-gated above). order_items are removed via
  // `on delete cascade`.
  const admin = createAdminClient();
  await admin.from("orders").delete().eq("id", id);

  revalidatePath("/admin/commandes");
  redirect("/admin/commandes");
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

function parseCategory(fd: FormData) {
  return {
    slug: str(fd, "slug"),
    name: str(fd, "name"),
    tagline: str(fd, "tagline"),
    image: str(fd, "image"),
    sort_order: Math.floor(num(fd, "sort_order")),
  };
}

function revalidateCategories() {
  // Categories drive the storefront nav (root layout) and the catalog.
  revalidatePath("/", "layout");
  revalidatePath("/produits");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/produits");
}

export async function createCategory(
  _prev: AdminFormState,
  fd: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const category = parseCategory(fd);

  if (!category.slug || !category.name) {
    return { error: "Le slug et le nom sont obligatoires." };
  }

  try {
    const uploaded = await resolveImageUpload(fd, "categories/");
    if (uploaded) category.image = uploaded;
  } catch (e) {
    return { error: e instanceof UploadError ? e.message : "Le téléchargement de l'image a échoué." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(category);
  if (error) {
    return {
      error: error.code === "23505"
        ? "Une catégorie avec ce slug existe déjà."
        : "Impossible de créer la catégorie.",
    };
  }

  revalidateCategories();
  redirect("/admin/categories");
}

export async function updateCategory(
  _prev: AdminFormState,
  fd: FormData
): Promise<AdminFormState> {
  await requireAdmin();
  const id = str(fd, "id");
  if (!id) return { error: "Catégorie introuvable." };
  const category = parseCategory(fd);

  if (!category.slug || !category.name) {
    return { error: "Le slug et le nom sont obligatoires." };
  }

  try {
    const uploaded = await resolveImageUpload(fd, "categories/");
    if (uploaded) category.image = uploaded;
  } catch (e) {
    return { error: e instanceof UploadError ? e.message : "Le téléchargement de l'image a échoué." };
  }

  const supabase = await createClient();
  // The products.category_slug FK is `on update cascade`, so renaming the
  // slug here automatically follows through to every linked product.
  const { error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id);
  if (error) {
    return {
      error: error.code === "23505"
        ? "Une catégorie avec ce slug existe déjà."
        : "Impossible de mettre à jour la catégorie.",
    };
  }

  revalidateCategories();
  redirect("/admin/categories");
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const slug = str(fd, "slug");
  if (!id || !slug) return;

  const supabase = await createClient();

  // A category that still has products cannot be removed (FK restriction).
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_slug", slug);

  if ((count ?? 0) > 0) {
    redirect("/admin/categories?error=in-use");
  }

  await supabase.from("categories").delete().eq("id", id);
  revalidateCategories();
  redirect("/admin/categories");
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function setUserAdmin(fd: FormData) {
  const me = await requireAdmin();
  const id = str(fd, "id");
  const makeAdmin = fd.get("is_admin") === "true";
  if (!id) return;

  // Guard against an admin accidentally locking themselves out.
  if (id === me.id) redirect("/admin/utilisateurs?error=self-admin");

  // Use the request-scoped client (not the service-role one): the
  // `protect_is_admin` trigger only allows the change when the *acting*
  // user is an admin, which it verifies through auth.uid().
  const supabase = await createClient();
  await supabase.from("profiles").update({ is_admin: makeAdmin }).eq("id", id);

  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs");
}

export async function deleteUser(fd: FormData) {
  const me = await requireAdmin();
  const id = str(fd, "id");
  if (!id) return;

  if (id === me.id) redirect("/admin/utilisateurs?error=self-delete");

  // Deleting an auth user requires the service-role key. The profile row is
  // removed via `on delete cascade`; past orders keep their snapshot data
  // and have their user_id set to null (`on delete set null`).
  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(id);

  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs");
}
