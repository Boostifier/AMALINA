import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — Amalina Market",
  description:
    "Découvrez l'histoire et les valeurs d'Amalina Market, votre maison de soins capillaires.",
};

export default function AProposPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blush via-ivory to-cream">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rosegold">
            Notre maison
          </p>
          <h1 className="mt-4 font-serif text-5xl text-charcoal sm:text-6xl">
            L&apos;élégance au service de votre beauté
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal-soft">
            Amalina Market est née d&apos;une passion : celle de rendre la beauté
            accessible, raffinée et authentique. Nous sélectionnons chaque produit
            avec exigence pour prendre soin de vous.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <div className="space-y-6 text-lg leading-relaxed text-charcoal-soft">
          <p>
            Chez Amalina Market, nous croyons que la beauté est avant tout une
            histoire de bien-être et de confiance en soi. C&apos;est pourquoi nous
            avons réuni une collection de soins capillaires — masques, huiles,
            shampoings et accessoires — qui allient qualité, douceur et élégance.
          </p>
          <p>
            Chaque produit est choisi pour ses formules respectueuses de la peau et
            pour la sensation de luxe qu&apos;il procure au quotidien. Notre
            ambition : vous offrir des instants de beauté précieux, jour après
            jour.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <h2 className="mb-12 text-center font-serif text-4xl text-charcoal">
            Nos valeurs
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Qualité",
                text: "Des produits sélectionnés avec soin pour leur excellence et leur efficacité.",
              },
              {
                title: "Authenticité",
                text: "Une beauté sincère, respectueuse de votre peau et de votre personnalité.",
              },
              {
                title: "Élégance",
                text: "Le raffinement dans chaque détail, du produit à la livraison.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-blush-deep/30 bg-white/60 p-8 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-rosegold/40">
                  <span className="font-serif text-xl text-rosegold">✦</span>
                </div>
                <h3 className="font-serif text-xl text-charcoal">{v.title}</h3>
                <p className="mt-2 text-sm text-charcoal-soft">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
        <h2 className="font-serif text-4xl text-charcoal">
          Prête à révéler votre éclat ?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-charcoal-soft">
          Parcourez notre boutique et trouvez les produits faits pour vous.
        </p>
        <Link
          href="/produits"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
        >
          Découvrir la boutique
        </Link>
      </section>
    </div>
  );
}
