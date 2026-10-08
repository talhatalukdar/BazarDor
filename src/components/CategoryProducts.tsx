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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex size-14 items-center justify-center rounded-2xl bg-card text-3xl ring-1 ring-line"
          >
            {icon}
          </span>
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted">মোট {toBn(products.length)}টি পণ্য</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm font-medium">
            সাজান:
          </label>
          <div className="relative">
            <select
              id="sort"
              value={mode}
              onChange={(event) => setMode(event.target.value as SortMode)}
              className="min-w-48 cursor-pointer appearance-none rounded-lg border border-line bg-card py-2.5 pr-10 pl-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-brand"
            >
              {OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
            />
          </div>
        </div>
      </div>

      <ProductGrid products={sorted} />
    </div>
  );
}
