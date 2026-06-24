import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = {
  title: "Connexion — Amalina Market",
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(next || "/compte");

  return (
    <div className="mx-auto max-w-md px-5 py-20 sm:px-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl text-charcoal">Connexion</h1>
        <p className="mt-2 text-charcoal-soft">
          Accédez à votre compte et à vos commandes.
        </p>
      </div>

      {error === "confirmation" && (
        <p className="mb-5 rounded-xl bg-rosegold/10 px-4 py-3 text-sm text-rosegold-dark">
          Le lien de confirmation est invalide ou a expiré. Veuillez réessayer.
        </p>
      )}

      <LoginForm next={next} />
    </div>
  );
}
