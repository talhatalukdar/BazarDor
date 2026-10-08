import { ProductGridSkeleton } from "@/components/Skeletons";

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex animate-pulse items-center gap-4" aria-hidden="true">
        <div className="size-14 rounded-2xl bg-line" />
        <div className="space-y-2">
          <div className="h-7 w-40 rounded bg-line" />
          <div className="h-4 w-24 rounded bg-line" />
        </div>
      </div>
      <ProductGridSkeleton count={6} />
    </div>
  );
}
