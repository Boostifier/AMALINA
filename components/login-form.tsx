"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthState } from "@/app/actions/auth";

export default function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    undefined
  );

  return (
    <form action={action} className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}

      {state?.error && (
        <p className="rounded-xl bg-rosegold/10 px-4 py-3 text-sm text-rosegold-dark">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-charcoal-soft">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-12 w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 text-sm focus:border-rosegold focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm text-charcoal-soft"
        >
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-12 w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 text-sm focus:border-rosegold focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>

      <p className="text-center text-sm text-charcoal-soft">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-rosegold hover:underline">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
