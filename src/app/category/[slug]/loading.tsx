import { ProductGridSkeleton } from "@/components/Skeletons";

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-8">
      <div aria-hidden="true" className="flex animate-pulse items-center gap-4 rounded-2xl border border-line bg-card p-8">
        <div className="size-12 rounded-xl bg-line" />
        <div className="space-y-2">
          <div className="h-7 w-40 rounded bg-line" />
          <div className="h-4 w-56 rounded bg-line" />
        </div>
      </div>
      <div aria-hidden="true" className="h-[82px] animate-pulse rounded-2xl border border-line bg-card" />
      <ProductGridSkeleton count={6} />
    </div>
  );
}
