"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendOrderEmails } from "@/lib/email";

export type CheckoutCustomer = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code?: string;
  notes?: string;
};

export type CheckoutItem = { slug: string; qty: number };

export type PlaceOrderResult =
  | { ok: true; reference: string; orderNumber: number | null }
  | { ok: false; error: string };

const FREE_SHIPPING_THRESHOLD = 400;
const SHIPPING_FEE = 3;

export async function placeOrder(
  customer: CheckoutCustomer,
  items: CheckoutItem[]
): Promise<PlaceOrderResult> {
  // --- validate customer ---
  const required: (keyof CheckoutCustomer)[] = [
    "full_name",
    "email",
    "phone",
    "address",
    "city",
  ];
  for (const field of required) {
    if (!String(customer[field] ?? "").trim()) {
      return { ok: false, error: "Veuillez remplir tous les champs obligatoires." };
    }
  }

  // --- validate + normalize items ---
  const wanted = new Map<string, number>();
  for (const item of items) {
    const qty = Math.floor(Number(item.qty));
    if (item.slug && qty > 0) {
      wanted.set(item.slug, (wanted.get(item.slug) ?? 0) + qty);
    }
  }
  if (wanted.size === 0) {
    return { ok: false, error: "Votre panier est vide." };
  }

  const supabase = await createClient();

  // Prices and names are taken from the database, never from the client.
  const { data: products } = await supabase
    .from("products")
    .select("slug, name, price, active")
    .in("slug", [...wanted.keys()]);

  const lines = (products ?? [])
    .filter((p) => p.active)
    .map((p) => {
      const qty = wanted.get(p.slug)!;
      const unit = Number(p.price);
      return {
        product_slug: p.slug,
        product_name: p.name,
        unit_price: unit,
        qty,
        line_total: Number((unit * qty).toFixed(2)),
      };
    });

  if (lines.length === 0) {
    return { ok: false, error: "Les produits de votre panier ne sont plus disponibles." };
  }

  const subtotal = Number(
    lines.reduce((sum, l) => sum + l.line_total, 0).toFixed(2)
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Number((subtotal + shipping).toFixed(2));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Generate the id client-side so we don't need to read the row back
  // (guest orders are not readable under RLS after insert).
  const orderId = randomUUID();

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    user_id: user?.id ?? null,
    full_name: customer.full_name.trim(),
    email: customer.email.trim(),
    phone: customer.phone.trim(),
    address: customer.address.trim(),
    city: customer.city.trim(),
    postal_code: (customer.postal_code ?? "").trim(),
    notes: (customer.notes ?? "").trim(),
    payment_method: "cod",
    subtotal,
    shipping,
    total,
  });

  if (orderError) {
    return { ok: false, error: "Une erreur est survenue lors de l'enregistrement de votre commande." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    lines.map((l) => ({ order_id: orderId, ...l }))
  );

  if (itemsError) {
    return { ok: false, error: "Une erreur est survenue lors de l'enregistrement de votre commande." };
  }

  // order_number is only readable for the owner (logged-in users) under RLS.
  const { data: created } = await supabase
    .from("orders")
    .select("order_number")
    .eq("id", orderId)
    .maybeSingle();

  const orderNumber = created?.order_number ?? null;
  const reference = `AM-${orderId.slice(0, 8).toUpperCase()}`;

  // Fire-and-forget emails (no-op if RESEND_API_KEY is unset).
  await sendOrderEmails({
    reference,
    orderNumber,
    customer,
    lines,
    subtotal,
    shipping,
    total,
  });

  if (user) revalidatePath("/compte");

  return { ok: true, reference, orderNumber };
}
