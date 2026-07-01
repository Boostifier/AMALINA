import Link from "next/link";
import Image from "next/image";
import { getCategories, getBestsellers, getSaleProducts } from "@/lib/catalog";
import { discountPercent } from "@/lib/products";
import ProductCard from "@/components/product-card";

export default async function Home() {
  const [categories, featured, saleProducts] = await Promise.all([
    getCategories(),
    getBestsellers(),
    getSaleProducts(),
  ]);
  const promos = saleProducts.slice(0, 4);
  const maxDiscount = saleProducts.reduce(
    (max, p) => Math.max(max, discountPercent(p)),
    0,
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="animate-gradient absolute inset-0 -z-10 bg-[linear-gradient(120deg,#f7ede9,#f4ddd8,#e9b9b5,#d99ca0,#e9b9b5,#f4ddd8,#f7ede9)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-rosegold/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-rosegold/25 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 -z-10 h-72 w-72 rounded-full bg-blush-deep/50 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:py-32">
          {/* Copy */}
          <div className="animate-fade-up max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-rosegold/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-rosegold backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-rosegold" />
              Soins authentiques
            </span>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-charcoal sm:text-6xl lg:text-7xl">
              Une <span className="italic text-rosegold">beauté</span> saine, pas
              parfaite.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal-soft">
              Découvrez notre sélection de soins du visage, soins capillaires,
              écrans solaires, shampoings, huiles et masques pour prendre soin de
              vous au quotidien.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/produits"
                className="inline-flex h-12 items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white shadow-[0_14px_30px_-12px_rgba(156,88,98,0.6)] transition-colors hover:bg-rosegold-dark"
              >
                Découvrir la boutique
              </Link>
              <Link
                href="/a-propos"
                className="inline-flex h-12 items-center justify-center rounded-full border border-rosegold/40 px-8 text-sm font-semibold uppercase tracking-widest text-rosegold transition-colors hover:bg-rosegold hover:text-white"
              >
                Notre histoire
              </Link>
            </div>
          </div>

          {/* Decorative medallion */}
          <div className="animate-fade-up relative hidden lg:block" style={{ animationDelay: "0.15s" }}>
            <div className="relative mx-auto aspect-square w-full max-w-md">
              {/* glow */}
              <div className="absolute inset-4 rounded-full bg-rosegold/20 blur-2xl" />
              {/* dotted rotating ring */}
              <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-rosegold/30" />
              {/* main disc */}
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-blush via-blush-deep to-rosegold/60 shadow-[inset_0_4px_50px_rgba(156,88,98,0.3),0_40px_70px_-30px_rgba(156,88,98,0.65)]" />
              <div className="absolute inset-14 rounded-full border border-rosegold/25" />
              {/* wordmark */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-serif text-5xl italic text-rosegold-dark">Amalina</span>
                <span className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-mauve">
                  Market
                </span>
                <span className="mt-4 text-sm tracking-[0.3em] text-rosegold">✦ ✦ ✦</span>
              </div>

              {/* floating glass card — rating */}
              <div
                className="animate-float absolute -left-6 top-14 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-lg backdrop-blur"
                style={{ animationDelay: "0.4s" }}
              >
                <p className="text-sm tracking-widest text-rosegold">★★★★★</p>
                <p className="mt-0.5 text-xs text-charcoal-soft">Clientes ravies</p>
              </div>

              {/* floating glass card — natural */}
              <div
                className="animate-float absolute -right-4 top-1/3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-lg backdrop-blur"
                style={{ animationDelay: "1.2s" }}
              >
                <p className="font-serif text-lg text-charcoal">Naturel</p>
                <p className="text-xs text-charcoal-soft">& nourrissant</p>
              </div>

              {/* floating glass card — shipping */}
              <div
                className="animate-float absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-lg backdrop-blur"
                style={{ animationDelay: "0.8s" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-rosegold">
                  Livraison en Tunisie
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-12 flex flex-col items-center text-center">
          <Eyebrow>Nos univers</Eyebrow>
          <h2 className="mt-4 font-serif text-4xl text-charcoal sm:text-5xl">
            Découvrez nos catégories
          </h2>
          <p className="mt-3 max-w-md text-charcoal-soft">
            Une sélection complète de soins pour la peau, les cheveux et la
            protection solaire.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              href={`/produits?categorie=${c.slug}`}
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl ring-1 ring-blush-deep/40 transition-all duration-300 hover:-translate-y-1.5 hover:ring-2 hover:ring-rosegold/60 hover:shadow-[0_26px_50px_-22px_rgba(156,88,98,0.55)] sm:aspect-square lg:aspect-[3/4]"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              {/* gradient scrim, deepens on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

              {/* editorial index */}
              <span className="absolute left-5 top-4 font-serif text-sm text-white/70">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative p-5 sm:p-6">
                <h3 className="font-serif text-xl text-white">{c.name}</h3>
                <p className="mt-1 text-sm text-white/75">{c.tagline}</p>
                {/* CTA: reveals + slides up on hover */}
                <span className="mt-3 flex max-h-0 items-center gap-1.5 overflow-hidden text-sm font-medium text-blush-deep opacity-0 transition-all duration-300 group-hover:max-h-8 group-hover:opacity-100">
                  Découvrir
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Coups de cœur</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl text-charcoal sm:text-5xl">
              Nos best-sellers
            </h2>
          </div>
          <Link
            href="/produits"
            className="group inline-flex items-center gap-2 text-sm font-medium text-rosegold transition-colors hover:text-rosegold-dark"
          >
            Tout voir
            <span className="transition-transform group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Promotions — only shown when something is on sale */}
      {promos.length > 0 && (
        <section className="bg-blush/40">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Offres du moment</Eyebrow>
                <h2 className="mt-4 font-serif text-4xl text-charcoal sm:text-5xl">
                  En promotion
                </h2>
                {maxDiscount > 0 && (
                  <p className="mt-3 text-charcoal-soft">
                    Jusqu&apos;à <span className="font-semibold text-rosegold-dark">−{maxDiscount}%</span> sur une sélection de soins.
                  </p>
                )}
              </div>
              <Link
                href="/promotions"
                className="group inline-flex items-center gap-2 text-sm font-medium text-rosegold transition-colors hover:text-rosegold-dark"
              >
                Toutes les promos
                <span className="transition-transform group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {promos.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand promise */}
      <section className="relative overflow-hidden bg-charcoal">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-rosegold/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-rosegold/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-rosegold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-blush-deep backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-rosegold" />
              Notre promesse
            </span>
            <h2 className="mt-4 font-serif text-4xl text-ivory sm:text-5xl">
              Le soin de soi, tout simplement.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: <SparkleIcon />,
                title: "Sélection raffinée",
                text: "Des produits choisis avec soin pour leur qualité et leur élégance.",
              },
              {
                icon: <LeafIcon />,
                title: "Beauté responsable",
                text: "Des formules respectueuses pour votre beauté et votre bien-être.",
              },
              {
                icon: <TruckIcon />,
                title: "Livraison soignée",
                text: "Vos commandes préparées et livrées avec la plus grande attention.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-rosegold/50 hover:bg-white/[0.08]"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rosegold/15 text-blush-deep transition-colors group-hover:bg-rosegold group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl text-ivory">{item.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-white/65">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rosegold to-rosegold-dark px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <span className="text-sm tracking-[0.4em] text-blush-deep">✦</span>
            <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
              Rejoignez la maison Amalina
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/85">
              Recevez nos nouveautés, conseils beauté et offres exclusives.
            </p>
            <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="Votre adresse e-mail"
                className="h-12 flex-1 rounded-full border border-white/30 bg-white/15 px-5 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="h-12 rounded-full bg-white px-7 text-sm font-semibold uppercase tracking-widest text-rosegold transition-colors hover:bg-ivory"
              >
                S&apos;inscrire
              </button>
            </form>
            <p className="mx-auto mt-4 max-w-md text-xs text-white/65">
              Pas de spam. Désinscription en un clic.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-rosegold/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-rosegold backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-rosegold" />
      {children}
    </span>
  );
}

function iconProps() {
  return {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function ArrowIcon() {
  return (
    <svg {...iconProps()} width={16} height={16}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3l1.8 4.9L18.7 9l-4.9 1.1L12 15l-1.8-4.9L5.3 9l4.9-1.1L12 3Z" />
      <path d="M18 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 16-9 0 9-4 14-9 14Z" />
      <path d="M4 20c4-4 8-6 12-7" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 6h11v9H3z" />
      <path d="M14 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}
