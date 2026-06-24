import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import CheckoutClient from "@/components/checkout-client";

export const metadata: Metadata = {
  title: "Commande — Amalina Market",
};

export default async function CommandePage() {
  const user = await getCurrentUser();
  return (
    <CheckoutClient
      initialName={user?.profile?.full_name ?? ""}
      initialEmail={user?.email ?? ""}
    />
  );
}
