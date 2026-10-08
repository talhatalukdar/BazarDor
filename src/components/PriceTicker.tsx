import { getProducts } from "@/lib/api";
import { directionSymbol, formatNumberBn, formatPercent, unitShort } from "@/lib/format";
import type { Product } from "@/lib/types";

const COLOR = { up: "text-rise", down: "text-fall", flat: "text-gray-500" } as const;

function TickerItem({ product }: { product: Product }) {
  return (
    <li className="flex shrink-0 items-center gap-2 border-r border-line px-5 py-2.5 text-sm whitespace-nowrap">
      <span aria-hidden="true">{product.image}</span>
      <span className="font-medium">{product.nameBn}</span>
      <span className="text-muted">
        {formatNumberBn(product.today)} টাকা/{unitShort(product.unit)}
      </span>
      <span className={`font-semibold ${COLOR[product.change.dir]}`}>
        {directionSymbol(product.change.dir)} {formatPercent(product.change.pct)}
      </span>
    </li>
  );
}

export default async function PriceTicker() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    return null; // the ticker is decorative; the page must still render
  }
  if (products.length === 0) return null;

  return (
    <div className="ticker overflow-hidden border-b border-line bg-card" aria-label="আজকের দামের তালিকা">
      <ul className="ticker-track">
        {products.map((product) => (
          <TickerItem key={product.id} product={product} />
        ))}
        {/* Duplicate set for a seamless infinite loop (hidden from assistive tech) */}
        {products.map((product) => (
          <div key={`dup-${product.id}`} aria-hidden="true" className="contents">
            <TickerItem product={product} />
          </div>
        ))}
      </ul>
    </div>
  );
}
