import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export const GRID_CLASSES = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={GRID_CLASSES}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
