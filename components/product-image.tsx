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
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-ivory to-blush/50 ${
        className ?? ""
      }`}
    >
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
