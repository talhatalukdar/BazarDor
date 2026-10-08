import { GRID_CLASSES } from "@/components/ProductGrid";

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-card p-5" aria-hidden="true">
      <div className="flex items-center gap-4">
        <div className="size-14 rounded-xl bg-line" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded bg-line" />
          <div className="h-3 w-1/3 rounded bg-line" />
        </div>
      </div>
      <div className="mt-5 h-3 w-20 rounded bg-line" />
      <div className="mt-2 flex items-center justify-between">
        <div className="h-7 w-28 rounded bg-line" />
        <div className="h-7 w-16 rounded-full bg-line" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="লোড হচ্ছে…" className={GRID_CLASSES}>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function SectionTitleSkeleton() {
  return <div aria-hidden="true" className="h-8 w-48 animate-pulse rounded bg-line" />;
}
