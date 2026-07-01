"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BrandCount } from "@/lib/products";

export default function BrandSidebar({
  brands,
  total,
}: {
  brands: BrandCount[];
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("marque") ?? "";

  if (brands.length === 0) return null;

  function select(marque: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (marque) params.set("marque", marque);
    else params.delete("marque");
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <aside className="lg:sticky lg:top-28 lg:h-max">
      <div className="lg:rounded-2xl lg:border lg:border-blush-deep/40 lg:bg-white/60 lg:p-5 lg:shadow-[0_12px_34px_-28px_rgba(43,36,34,0.5)]">
        <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-rosegold">
          <TagIcon />
          Marques
        </h2>

        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
          <BrandRow active={!current} count={total} onClick={() => select("")}>
            Toutes les marques
          </BrandRow>
          {brands.map((b) => (
            <BrandRow
              key={b.name}
              active={current === b.name}
              count={b.count}
              onClick={() => select(b.name)}
            >
              {b.name}
            </BrandRow>
          ))}
        </div>
      </div>
    </aside>
  );
}

function BrandRow({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors lg:w-full lg:rounded-lg lg:px-3 ${
        active
          ? "bg-rosegold text-white"
          : "border border-blush-deep/60 bg-white/60 text-charcoal-soft hover:border-rosegold/50 hover:text-rosegold lg:border-transparent lg:bg-transparent lg:hover:bg-blush/50"
      }`}
    >
      <span className="truncate lg:flex-1 lg:text-left">{children}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-[0.68rem] font-semibold tabular-nums ${
          active
            ? "bg-white/25 text-white"
            : "bg-blush/60 text-mauve group-hover:bg-blush"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function TagIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.6 13.4 12 22l-9-9V4h9l8.6 8.6a1 1 0 0 1 0 1.4Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}
