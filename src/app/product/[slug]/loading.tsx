export default function ProductLoading() {
  return (
    <div role="status" aria-label="লোড হচ্ছে…" className="mx-auto max-w-6xl animate-pulse px-4 py-10">
      <div className="mb-6 h-4 w-48 rounded bg-line" />
      <div className="rounded-3xl border border-line bg-card p-8">
        <div className="flex items-center gap-5">
          <div className="size-20 rounded-2xl bg-line" />
          <div className="flex-1 space-y-3">
            <div className="h-9 w-56 rounded bg-line" />
            <div className="h-4 w-full max-w-lg rounded bg-line" />
            <div className="h-7 w-32 rounded-full bg-line" />
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((key) => (
          <div key={key} className="h-24 rounded-2xl bg-line" />
        ))}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((key) => (
          <div key={key} className="h-28 rounded-2xl bg-line" />
        ))}
      </div>
    </div>
  );
}
