import Link from "next/link";
import type { Category } from "@/lib/products";

export default function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-24 border-t border-blush-deep/40 bg-gradient-to-br from-blush-deep via-blush to-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex flex-col leading-none">
            <span className="font-serif text-2xl tracking-[0.18em] text-charcoal">
              AMALINA
            </span>
            <span className="mt-0.5 text-[0.62rem] font-medium uppercase tracking-[0.42em] text-rosegold">
              Market
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-charcoal-soft">
            Une sélection raffinée de soins capillaires, pensée pour révéler la
            beauté naturelle de vos cheveux.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-mauve">
            Boutique
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/produits?categorie=${c.slug}`}
                  className="text-charcoal-soft transition-colors hover:text-rosegold"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-mauve">
            Maison
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                href="/a-propos"
                className="text-charcoal-soft transition-colors hover:text-rosegold"
              >
                À propos
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-charcoal-soft transition-colors hover:text-rosegold"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/produits"
                className="text-charcoal-soft transition-colors hover:text-rosegold"
              >
                Tous les produits
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-mauve">
            Suivez-nous
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <span className="text-charcoal-soft">Instagram</span>
            </li>
            <li>
              <span className="text-charcoal-soft">Facebook</span>
            </li>
            <li>
              <span className="text-charcoal-soft">contact@amalina-market.tn</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blush-deep/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-mauve sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Amalina Market. Tous droits réservés.</p>
          <p>Élégance & beauté naturelle</p>
        </div>
      </div>
    </footer>
  );
}
