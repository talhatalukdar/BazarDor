"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <p aria-hidden="true" className="text-6xl">⚠️</p>
      <h1 className="mt-4 text-2xl font-bold">তথ্য লোড করা যায়নি</h1>
      <p className="mt-2 text-muted">
        সার্ভার বা ইন্টারনেট সংযোগে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-white shadow-sm hover:bg-brand-dark"
        >
          আবার চেষ্টা করুন
        </button>
        <Link href="/" className="rounded-lg border border-line bg-card px-6 py-3 font-semibold hover:bg-brand-soft">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}
