"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-context";
import type { Category } from "@/lib/products";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Boutique" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header({
  categories,
  userEmail,
  isAdmin = false,
}: {
  categories: Category[];
  userEmail: string | null;
  isAdmin?: boolean;
}) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const primaryLinks = [
    ...nav,
    ...(isAdmin ? [{ href: "/admin", label: "Dashboard admin" }] : []),
    { href: userEmail ? "/compte" : "/connexion", label: userEmail ? "Mon compte" : "Connexion" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-blush-deep/40 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo wordmark (text only — no image) */}
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-2xl tracking-[0.18em] text-charcoal">
            AMALINA
          </span>
          <span className="mt-0.5 text-[0.62rem] font-medium uppercase tracking-[0.42em] text-rosegold">
            Market
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-wide text-charcoal-soft transition-colors hover:text-rosegold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-ivory transition-colors hover:bg-charcoal-soft sm:inline-flex"
            >
              <DashboardIcon />
              Dashboard
            </Link>
          )}
          <Link
            href={userEmail ? "/compte" : "/connexion"}
            className="hidden text-sm font-medium tracking-wide text-charcoal-soft transition-colors hover:text-rosegold sm:inline-flex"
          >
            {userEmail ? "Mon compte" : "Connexion"}
          </Link>
          <Link
            href="/panier"
            className="relative inline-flex items-center gap-2 rounded-full border border-rosegold/40 px-4 py-2 text-sm font-medium text-rosegold transition-colors hover:bg-rosegold hover:text-white"
          >
            <span aria-hidden>Panier</span>
            {count > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rosegold px-1.5 text-xs font-semibold text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile toggle — animates into an X */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative inline-flex h-10 w-10 items-center justify-center text-charcoal md:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-charcoal transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rounded-full bg-charcoal transition-all duration-200 ${
                  open ? "scale-x-0 opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-charcoal transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Category sub-nav (desktop) */}
      <div className="hidden border-t border-blush-deep/30 bg-cream/70 md:block">
        <nav className="mx-auto flex max-w-7xl items-center justify-center gap-7 overflow-x-auto px-5 sm:px-8">
          <Link
            href="/produits"
            className="shrink-0 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-rosegold transition-colors hover:text-rosegold-dark"
          >
            Tous les produits
          </Link>
          <span className="h-3.5 w-px shrink-0 bg-blush-deep/50" aria-hidden />
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/produits?categorie=${c.slug}`}
              className="shrink-0 py-3 text-xs font-medium uppercase tracking-[0.14em] text-charcoal-soft transition-colors hover:text-rosegold"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-x-0 bottom-0 top-20 z-40 bg-charcoal/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile menu panel */}
      <div
        className={`absolute inset-x-0 top-full z-50 origin-top overflow-hidden border-b border-blush-deep/40 bg-ivory/95 backdrop-blur-md transition-all duration-300 ease-out md:hidden ${
          open
            ? "max-h-[85vh] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav className="px-5 py-5">
          <ul className="flex flex-col gap-1">
            {primaryLinks.map((item, i) => (
              <li
                key={item.href}
                style={{ transitionDelay: open ? `${i * 45}ms` : "0ms" }}
                className={`transition-all duration-300 ease-out ${
                  open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                }`}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 font-medium text-charcoal-soft transition-colors hover:bg-blush hover:text-rosegold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-blush-deep/40 pt-4">
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-widest text-mauve">
              Catégories
            </p>
            <ul className="grid grid-cols-2 gap-1">
              {categories.map((c, i) => (
                <li
                  key={c.slug}
                  style={{
                    transitionDelay: open
                      ? `${(primaryLinks.length + i) * 45}ms`
                      : "0ms",
                  }}
                  className={`transition-all duration-300 ease-out ${
                    open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                >
                  <Link
                    href={`/produits?categorie=${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm text-charcoal-soft transition-colors hover:bg-blush hover:text-rosegold"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

function DashboardIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
