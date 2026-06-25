import Image from "next/image";
import type { Product } from "@/lib/products";

type Props = {
  product: Pick<Product, "name" | "image">;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

// Renders the real product photo. Images live in /public/products and are
// referenced by path from the product data in lib/products.ts.
export default function ProductImage({
  product,
  className,
  priority,
  sizes,
}: Props) {
  const src = product.image?.trim();

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-ivory to-blush/50 ${
        className ?? ""
      }`}
    >
      {src ? (
        <Image
          src={src}
          alt={product.name}
          fill
          sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
          className="object-cover"
          priority={priority}
        />
      ) : (
        // No image yet — elegant on-brand placeholder.
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-rosegold/70">
          <span className="font-serif text-4xl italic">
            {product.name?.charAt(0).toUpperCase() || "A"}
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-mauve">
            Amalina
          </span>
        </div>
      )}
    </div>
  );
}
