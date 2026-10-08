import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ChangeBadge from "@/components/ChangeBadge";
import { getProductBySlug } from "@/lib/api";
import { formatAverage, formatNumberBn, formatPrice, priceStats, toBn, unitLabel, unitShort } from "@/lib/format";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "পণ্যের বিস্তারিত" };

function StatCard({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>
        {value} <span className="text-base font-semibold">টাকা</span>
      </p>
      <p className="mt-2 text-sm text-muted">{note}</p>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // Real route protection: validated on the server before any product data is fetched.
  await requireSession(`/product/${slug}`);

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const stats = priceStats(product.markets);
  const unit = unitLabel(product.unit).replace("প্রতি ", "");
  const rows = product.markets
    .map((market) => ({ ...market, avg: (market.min + market.max) / 2 }))
    .sort((a, b) => a.avg - b.avg);

  const diff = Math.abs(product.today - product.yesterday);
  const trendText =
    product.change.dir === "flat" || diff === 0 ? (
      "গতকালের তুলনায় আজ দাম অপরিবর্তিত"
    ) : (
      <>
        গতকালের তুলনায় আজ দাম <strong>{product.change.dir === "up" ? "বেড়েছে" : "কমেছে"}</strong> ·{" "}
        {toBn(diff)} টাকা
      </>
    );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <nav aria-label="breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Link href="/" className="hover:text-brand">হোম</Link>
          </li>
          <ChevronRight aria-hidden="true" className="size-4" />
          <li>
            <Link href={`/category/${product.category}`} className="hover:text-brand">
              {product.categoryNameBn}
            </Link>
          </li>
          <ChevronRight aria-hidden="true" className="size-4" />
          <li aria-current="page">{product.nameBn}</li>
        </ol>
      </nav>

      <section className="flex flex-col gap-6 rounded-2xl border border-line bg-card p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <span
            aria-hidden="true"
            className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-surface text-5xl sm:size-24"
          >
            {product.image}
          </span>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold sm:text-4xl">{product.nameBn}</h1>
            <p className="mt-1 text-muted">
              {unitLabel(product.unit)} · {product.categoryNameBn}
            </p>
            <p className="mt-3">{trendText}</p>
          </div>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-surface px-8 py-5 text-center">
          <p className="text-sm text-muted">আজকের দাম</p>
          <p className="text-4xl font-bold">{formatNumberBn(product.today)}</p>
          <p className="mt-1 text-sm text-muted">টাকা / {unitShort(product.unit)}</p>
          <div className="mt-2">
            <ChangeBadge change={product.change} />
          </div>
        </div>
      </section>

      <section aria-labelledby="price-summary" className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h2 id="price-summary" className="mb-5 text-xl font-bold">
          দামের সারসংক্ষেপ
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="সর্বনিম্ন দাম" value={formatNumberBn(stats.min)} note="সবচেয়ে কম দামের বাজার" tone="text-fall" />
          <StatCard label="সর্বাধিক দাম" value={formatNumberBn(stats.max)} note="সবচেয়ে বেশি দামের বাজার" tone="text-rise" />
          <StatCard label="গড় দাম" value={formatNumberBn(stats.avg)} note={`প্রতি ${unit}-এর হিসাবে`} tone="text-fall" />
        </div>
      </section>

      <section aria-labelledby="market-prices" className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h2 id="market-prices" className="mb-5 text-xl font-bold">
          বাজারভিত্তিক আজকের দাম
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="text-muted">
                <th scope="col" className="px-5 py-4 font-medium">বাজার</th>
                <th scope="col" className="px-5 py-4 font-medium">বিভাগ</th>
                <th scope="col" className="px-5 py-4 text-right font-medium">সর্বনিম্ন</th>
                <th scope="col" className="px-5 py-4 text-right font-medium">সর্বাধিক</th>
                <th scope="col" className="px-5 py-4 text-right font-medium">গড়</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.division}-${row.market}`} className="border-t border-ink/70 odd:bg-card even:bg-surface">
                  <th scope="row" className="px-5 py-4 font-medium">{row.market}</th>
                  <td className="px-5 py-4">{row.division}</td>
                  <td className="px-5 py-4 text-right">{formatPrice(row.min)}</td>
                  <td className="px-5 py-4 text-right">{formatPrice(row.max)}</td>
                  <td className="px-5 py-4 text-right font-bold">{formatAverage(row.avg)} টাকা</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
