"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { sortProducts, toBn } from "@/lib/format";
import type { Product, SortMode } from "@/lib/types";

const OPTIONS: { value: SortMode; label: string }[] = [
  { value: "default", label: "ডিফল্ট" },
  { value: "price-asc", label: "দাম: কম থেকে বেশি" },
  { value: "price-desc", label: "দাম: বেশি থেকে কম" },
];

interface Props {
  title: string;
  icon: string;
  products: Product[];
}

export default function CategoryProducts({ title, icon, products }: Props) {
  const [mode, setMode] = useState<SortMode>("default");
  const sorted = useMemo(() => sortProducts(products, mode), [products, mode]);

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-8">
      <header className="flex items-center gap-4 rounded-2xl border border-line bg-card p-6 sm:p-8">
        <span aria-hidden="true" className="text-5xl">
          {icon}
        </span>
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-1 text-muted">{toBn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </header>

      <div className="flex items-center justify-end gap-3 rounded-2xl border border-line bg-card px-6 py-5">
        <label htmlFor="sort" className="text-muted">
          সাজান
        </label>
        <div className="relative">
          <select
            id="sort"
            value={mode}
            onChange={(event) => setMode(event.target.value as SortMode)}
            className="cursor-pointer appearance-none rounded-lg border border-line bg-card py-2 pr-9 pl-3 text-sm focus-visible:outline-2 focus-visible:outline-brand"
          >
            {OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2"
          />
        </div>
      </div>

      <p className="text-muted">মোট {toBn(products.length)}টি পণ্য দেখানো হচ্ছে</p>

      <ProductGrid products={sorted} />
    </div>
  );
}
