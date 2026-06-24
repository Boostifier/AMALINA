import "server-only";
import { formatPrice } from "@/lib/products";
import type { CheckoutCustomer } from "@/app/actions/orders";

type OrderLine = {
  product_name: string;
  qty: number;
  unit_price: number;
  line_total: number;
};

type OrderEmailData = {
  reference: string;
  orderNumber: number | null;
  customer: CheckoutCustomer;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
};

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM || "Amalina Market <onboarding@resend.dev>";
  if (!apiKey || !to) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error("Resend error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

function lineRows(lines: OrderLine[]): string {
  return lines
    .map(
      (l) =>
        `<tr>
          <td style="padding:6px 0;color:#4a3f42">${l.product_name} × ${l.qty}</td>
          <td style="padding:6px 0;text-align:right;color:#4a3f42">${formatPrice(l.line_total)}</td>
        </tr>`
    )
    .join("");
}

function reference(data: OrderEmailData): string {
  return data.orderNumber ? `n°${data.orderNumber}` : data.reference;
}

/** Sends the customer confirmation and (optionally) the shop-owner notification. */
export async function sendOrderEmails(data: OrderEmailData): Promise<void> {
  const ref = reference(data);

  const summary = `
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif">
      ${lineRows(data.lines)}
      <tr><td style="padding-top:10px;border-top:1px solid #eadfe1">Sous-total</td><td style="padding-top:10px;border-top:1px solid #eadfe1;text-align:right">${formatPrice(data.subtotal)}</td></tr>
      <tr><td>Livraison</td><td style="text-align:right">${data.shipping === 0 ? "Offerte" : formatPrice(data.shipping)}</td></tr>
      <tr><td style="font-weight:bold;padding-top:6px">Total</td><td style="font-weight:bold;text-align:right;padding-top:6px">${formatPrice(data.total)}</td></tr>
    </table>`;

  const customerHtml = `
    <div style="max-width:520px;margin:0 auto;font-family:Arial,sans-serif;color:#2d2528">
      <h1 style="font-size:22px;color:#9c5862">Merci pour votre commande !</h1>
      <p>Bonjour ${data.customer.full_name},</p>
      <p>Votre commande <strong>${ref}</strong> a bien été enregistrée. Nous vous contacterons prochainement pour confirmer la livraison.</p>
      <p style="color:#7a6f72">Paiement à la livraison.</p>
      ${summary}
      <p style="margin-top:18px">Livraison à : ${data.customer.address}, ${data.customer.city} ${data.customer.postal_code ?? ""}</p>
      <p style="color:#9c5862;margin-top:24px">Amalina Market</p>
    </div>`;

  await sendEmail(
    data.customer.email,
    `Confirmation de votre commande ${ref} — Amalina Market`,
    customerHtml
  );

  const adminTo = process.env.ORDER_EMAIL_ADMIN;
  if (adminTo) {
    const adminHtml = `
      <div style="max-width:520px;margin:0 auto;font-family:Arial,sans-serif;color:#2d2528">
        <h1 style="font-size:20px">Nouvelle commande ${ref}</h1>
        <p><strong>Client :</strong> ${data.customer.full_name} (${data.customer.email}, ${data.customer.phone})</p>
        <p><strong>Adresse :</strong> ${data.customer.address}, ${data.customer.city} ${data.customer.postal_code ?? ""}</p>
        ${data.customer.notes ? `<p><strong>Note :</strong> ${data.customer.notes}</p>` : ""}
        ${summary}
      </div>`;
    await sendEmail(adminTo, `Nouvelle commande ${ref}`, adminHtml);
  }
}
