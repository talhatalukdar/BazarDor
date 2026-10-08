import Link from "next/link";
import ChangeBadge from "@/components/ChangeBadge";
import { formatPrice, unitLabel } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-line bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface text-3xl"
        >
          {product.image}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-lg leading-snug font-semibold group-hover:text-brand-dark">
            {product.nameBn}
          </h3>
          <p className="text-sm text-muted">{unitLabel(product.unit)}</p>
        </div>
      </div>
      <p className="mt-5 text-sm text-muted">আজকের দাম</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-2xl font-bold">{formatPrice(product.today)}</p>
        <ChangeBadge change={product.change} />
      </div>
    </Link>
  );
}
