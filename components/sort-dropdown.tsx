"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

export default function SortDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-12 w-full items-center gap-2.5 rounded-full border bg-white/70 pl-4 pr-4 text-sm font-medium text-charcoal-soft shadow-[0_10px_28px_-24px_rgba(43,36,34,0.5)] transition-colors sm:w-60 ${
          open ? "border-rosegold" : "border-blush-deep/60 hover:border-rosegold/50"
        }`}
      >
        <span className="text-rosegold">
          <SortIcon />
        </span>
        <span className="flex-1 truncate text-left">{current?.label}</span>
        <span
          className={`text-mauve transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="animate-fade-up absolute right-0 z-30 mt-2 w-full min-w-[14rem] rounded-2xl border border-blush-deep/50 bg-white p-1.5 shadow-[0_24px_55px_-24px_rgba(43,36,34,0.55)]"
        >
          {options.map((o) => {
            const selected = o.value === value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    selected
                      ? "bg-blush/60 font-semibold text-rosegold-dark"
                      : "text-charcoal-soft hover:bg-blush/40"
                  }`}
                >
                  <span className="flex-1 text-left">{o.label}</span>
                  {selected && (
                    <span className="text-rosegold">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SortIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 6h13M4 12h9M4 18h5" />
      <path d="m17 15 3 3 3-3M20 18V9" />
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

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}
