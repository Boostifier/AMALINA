"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

type NavItem = { href: string; label: string; icon: React.ReactNode; exact?: boolean };

const NAV: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: <DashboardIcon />, exact: true },
  { href: "/admin/produits", label: "Produits", icon: <ProductIcon /> },
  { href: "/admin/categories", label: "Catégories", icon: <CategoryIcon /> },
  { href: "/admin/commandes", label: "Commandes", icon: <OrderIcon /> },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: <UserIcon /> },
];

export default function AdminSidebar({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-rosegold text-white shadow-sm"
                : "text-charcoal-soft hover:bg-blush/60 hover:text-rosegold-dark"
            }`}
          >
            <span className={active ? "text-white" : "text-mauve"}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-blush-deep/40 px-5 py-4 lg:hidden">
        <Link href="/admin" className="font-serif text-xl text-charcoal">
          Amalina · Admin
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="rounded-lg border border-blush-deep/60 p-2 text-charcoal-soft transition-colors hover:border-rosegold hover:text-rosegold"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Sidebar — static on desktop, slide-in drawer on mobile */}
      <aside
        className={`${
          open ? "block" : "hidden"
        } border-b border-blush-deep/40 bg-white/70 px-5 py-5 backdrop-blur lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r`}
      >
        <div className="flex h-full flex-col">
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="mb-8 hidden font-serif text-2xl text-charcoal lg:block"
          >
            Amalina
            <span className="block text-xs font-sans font-semibold uppercase tracking-[0.25em] text-mauve">
              Administration
            </span>
          </Link>

          {nav}

          <div className="mt-auto space-y-4 pt-8">
            <div className="rounded-xl border border-blush-deep/40 bg-blush/30 px-3.5 py-3">
              <p className="truncate text-sm font-medium text-charcoal">
                {userName || "Administrateur"}
              </p>
              <p className="truncate text-xs text-mauve">{userEmail}</p>
            </div>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-1 text-sm text-charcoal-soft transition-colors hover:text-rosegold"
            >
              <ExternalIcon /> Voir le site
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded-full border border-blush-deep/60 px-4 py-2 text-sm font-medium text-charcoal-soft transition-colors hover:border-rosegold hover:text-rosegold"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}

/* --- icons (inline so the admin shell has no extra deps) --- */

function iconProps() {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function DashboardIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M6 2 4 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-2-4Z" />
      <path d="M4 6h16" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg {...iconProps()} width={15} height={15}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg {...iconProps()} width={22} height={22}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg {...iconProps()} width={22} height={22}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
