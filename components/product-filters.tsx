"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/products";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tri : populaire" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name", label: "Nom (A→Z)" },
];

export default function ProductFilters({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategorie = searchParams.get("categorie") ?? "";
  const currentSort = searchParams.get("sort") ?? "";
  const currentQuery = searchParams.get("q") ?? "";

  /** Update one param, drop empties, reset pagination, and navigate. */
  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="mb-12 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const value = String(new FormData(e.currentTarget).get("q") ?? "");
            setParam("q", value.trim());
          }}
          className="relative flex-1"
        >
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mauve">
            <SearchIcon />
          </span>
          <input
            key={currentQuery}
            type="search"
            name="q"
            defaultValue={currentQuery}
            placeholder="Rechercher un produit…"
            aria-label="Rechercher un produit"
            className="h-12 w-full rounded-full border border-blush-deep/60 bg-white/70 pl-11 pr-24 text-sm text-charcoal placeholder:text-mauve/70 focus:border-rosegold focus:outline-none"
          />
          {currentQuery && (
            <button
              type="button"
              onClick={() => setParam("q", "")}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-xs font-medium text-mauve hover:text-rosegold"
            >
              Effacer
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-rosegold px-4 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
          >
            OK
          </button>
        </form>

        {/* Sort */}
        <label className="relative shrink-0">
          <span className="sr-only">Trier</span>
          <select
            value={currentSort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="h-12 w-full appearance-none rounded-full border border-blush-deep/60 bg-white/70 pl-5 pr-10 text-sm text-charcoal-soft focus:border-rosegold focus:outline-none sm:w-56"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mauve">
            <ChevronIcon />
          </span>
        </label>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          <Pill active={!currentCategorie} onClick={() => setParam("categorie", "")}>
            Toutes
          </Pill>
          {categories.map((c) => (
            <Pill
              key={c.slug}
              active={currentCategorie === c.slug}
              onClick={() => setParam("categorie", c.slug)}
            >
              {c.name}
            </Pill>
          ))}
        </div>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-rosegold text-white"
          : "border border-blush-deep/60 bg-white/50 text-charcoal-soft hover:border-rosegold/50 hover:text-rosegold"
      }`}
    >
      {children}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
