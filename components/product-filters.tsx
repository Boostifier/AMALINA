"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/products";
import SortDropdown from "@/components/sort-dropdown";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Populaire" },
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
        <SortDropdown
          value={currentSort}
          options={SORT_OPTIONS}
          onChange={(v) => setParam("sort", v)}
        />
      </div>

      {/* Category segmented control */}
      {categories.length > 0 && (
        <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
          <div className="inline-flex gap-1 rounded-full border border-blush-deep/50 bg-white/60 p-1 shadow-[0_10px_28px_-24px_rgba(43,36,34,0.5)] sm:flex sm:w-full">
            <Segment active={!currentCategorie} onClick={() => setParam("categorie", "")}>
              Toutes
            </Segment>
            {categories.map((c) => (
              <Segment
                key={c.slug}
                active={currentCategorie === c.slug}
                onClick={() => setParam("categorie", c.slug)}
              >
                {c.name}
              </Segment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Segment({
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
      className={`whitespace-nowrap rounded-full px-4 py-2 text-center text-sm font-medium transition-colors sm:flex-1 ${
        active
          ? "bg-rosegold text-white shadow-sm"
          : "text-charcoal-soft hover:text-rosegold"
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

