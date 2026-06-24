"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; notice?: string } | undefined;

function getString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = getString(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = getString(formData, "next") || "/compte";

  if (!email || !password) {
    return { error: "Veuillez renseigner votre e-mail et votre mot de passe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "E-mail ou mot de passe incorrect." };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signup(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const fullName = getString(formData, "full_name");
  const email = getString(formData, "email");
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Tous les champs sont obligatoires." };
  }
  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: origin ? `${origin}/auth/confirm?next=/compte` : undefined,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return { error: "Un compte existe déjà avec cette adresse e-mail." };
    }
    return { error: "Une erreur est survenue. Veuillez réessayer." };
  }

  // No session means email confirmation is required.
  if (!data.session) {
    return {
      notice:
        "Votre compte a été créé. Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/compte");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
