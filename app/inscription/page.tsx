import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SignupForm from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Créer un compte — Amalina Market",
};

export default async function InscriptionPage() {
  const user = await getCurrentUser();
  if (user) redirect("/compte");

  return (
    <div className="mx-auto max-w-md px-5 py-20 sm:px-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl text-charcoal">Créer un compte</h1>
        <p className="mt-2 text-charcoal-soft">
          Suivez vos commandes et gagnez du temps lors de vos achats.
        </p>
      </div>

      <SignupForm />
    </div>
  );
}
