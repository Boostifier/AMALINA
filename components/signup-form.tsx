"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type AuthState } from "@/app/actions/auth";

export default function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signup,
    undefined
  );

  if (state?.notice) {
    return (
      <p className="rounded-xl bg-rosegold/10 px-5 py-4 text-sm leading-relaxed text-rosegold-dark">
        {state.notice}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p className="rounded-xl bg-rosegold/10 px-4 py-3 text-sm text-rosegold-dark">
          {state.error}
        </p>
      )}

      <div>
        <label
          htmlFor="full_name"
          className="mb-1.5 block text-sm text-charcoal-soft"
        >
          Nom complet
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          autoComplete="name"
          className="h-12 w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 text-sm focus:border-rosegold focus:outline-none"
        />
      </div>

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
          minLength={6}
          autoComplete="new-password"
          className="h-12 w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 text-sm focus:border-rosegold focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-mauve">Au moins 6 caractères.</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark disabled:opacity-60"
      >
        {pending ? "Création…" : "Créer mon compte"}
      </button>

      <p className="text-center text-sm text-charcoal-soft">
        Déjà inscrite ?{" "}
        <Link href="/connexion" className="font-medium text-rosegold hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
