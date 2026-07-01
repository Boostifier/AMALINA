import Link from "next/link";

export const PAGE_SIZE = 12;

/** Page numbers to show, collapsing long ranges with an ellipsis. */
function buildPages(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

export default function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const pages = buildPages(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-center gap-2"
    >
      <PageLink
        href={makeHref(page - 1)}
        disabled={page <= 1}
        ariaLabel="Page précédente"
      >
        ‹
      </PageLink>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-mauve">
            …
          </span>
        ) : (
          <PageLink
            key={p}
            href={makeHref(p)}
            active={p === page}
            ariaLabel={`Page ${p}`}
          >
            {p}
          </PageLink>
        ),
      )}

      <PageLink
        href={makeHref(page + 1)}
        disabled={page >= totalPages}
        ariaLabel="Page suivante"
      >
        ›
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  children,
  active = false,
  disabled = false,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const base =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors";

  if (disabled) {
    return (
      <span
        aria-disabled
        className={`${base} cursor-not-allowed border border-blush-deep/40 text-mauve/40`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={`${base} ${
        active
          ? "bg-rosegold text-white"
          : "border border-blush-deep/60 bg-white/50 text-charcoal-soft hover:border-rosegold/50 hover:text-rosegold"
      }`}
    >
      {children}
    </Link>
  );
}
