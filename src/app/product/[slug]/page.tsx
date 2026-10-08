import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ChangeBadge from "@/components/ChangeBadge";
import { getProductBySlug } from "@/lib/api";
import {
  formatNumberBn,
  formatPercent,
  formatPrice,
  groupByDivision,
  priceStats,
  toBn,
  unitLabel,
} from "@/lib/format";
import { requireSession } from "@/lib/session";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "পণ্যের বিস্তারিত" };

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function summaryLine(product: Product): string {
  const trend =
    product.change.dir === "up"
      ? `গতকালের চেয়ে ${formatPercent(product.change.pct)} বেড়েছে`
      : product.change.dir === "down"
        ? `গতকালের চেয়ে ${formatPercent(product.change.pct)} কমেছে`
        : "গতকালের তুলনায় দাম অপরিবর্তিত";
  return `${product.nameBn}র আজকের দাম ${formatPrice(product.today)} (${unitLabel(product.unit)}) — ${trend}। ${toBn(product.markets.length)}টি বাজারের তথ্যের ভিত্তিতে।`;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // Real route protection: validated on the server before any product data is fetched.
  await requireSession(`/product/${slug}`);

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const stats = priceStats(product.markets);
  const divisions = groupByDivision(product.markets);
  const span = Math.max(stats.max - stats.min, 1);

  const history = [
    { label: "গতকাল", value: product.yesterday },
    { label: "গত সপ্তাহ", value: product.lastWeek },
    { label: "গত মাস", value: product.lastMonth },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href={`/category/${product.category}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-brand"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> {product.categoryNameBn} ক্যাটাগরিতে ফিরে যান
      </Link>

      <section className="rounded-3xl border border-line bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <span
              aria-hidden="true"
              className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-surface text-5xl"
            >
              {product.image}
            </span>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{product.nameBn}</h1>
              <p className="mt-2 max-w-2xl text-muted">{summaryLine(product)}</p>
              <ul className="mt-4 flex flex-wrap gap-2 text-sm" aria-label="ক্যাটাগরি ও একক">
                <li>
                  <Link
                    href={`/category/${product.category}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 font-medium text-brand-dark hover:bg-brand hover:text-white"
                  >
                    <span aria-hidden="true">{product.categoryIcon}</span>
                    {product.categoryNameBn}
                  </Link>
                </li>
                <li className="rounded-full bg-surface px-3 py-1 font-medium ring-1 ring-line">
                  {unitLabel(product.unit)}
                </li>
              </ul>
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-sm text-muted">আজকের দাম</p>
            <p className="text-4xl font-bold">{formatPrice(product.today)}</p>
            <div className="mt-2 md:flex md:justify-end">
              <ChangeBadge change={product.change} />
            </div>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center">
          {history.map((item) => (
            <div key={item.label}>
              <dt className="text-sm text-muted">{item.label}</dt>
              <dd className="mt-1 font-semibold">{formatPrice(item.value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10" aria-labelledby="price-summary">
        <h2 id="price-summary" className="mb-4 text-2xl font-bold">
          দামের সারসংক্ষেপ
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="সর্বনিম্ন দাম" value={formatPrice(stats.min)} tone="text-fall" />
          <StatCard label="সর্বোচ্চ দাম" value={formatPrice(stats.max)} tone="text-rise" />
          <StatCard label="গড় দাম" value={formatPrice(stats.avg)} tone="text-ink" />
        </div>
      </section>

      <section className="mt-10" aria-labelledby="market-prices">
        <h2 id="market-prices" className="mb-4 text-2xl font-bold">
          বাজারভিত্তিক আজকের দাম
        </h2>
        <div className="space-y-8">
          {divisions.map(([division, markets]) => (
            <div key={division}>
              <h3 className="mb-3 text-lg font-semibold text-brand-dark">{division} বিভাগ</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {markets.map((market) => {
                  const left = ((market.min - stats.min) / span) * 100;
                  const width = Math.max(((market.max - market.min) / span) * 100, 3);
                  return (
                    <article
                      key={`${division}-${market.market}`}
                      className="rounded-2xl border border-line bg-card p-5"
                    >
                      <h4 className="font-semibold">{market.market}</h4>
                      <div className="mt-3 flex justify-between text-sm">
                        <span>
                          <span className="text-muted">সর্বনিম্ন </span>
                          <strong className="text-fall">{formatNumberBn(market.min)} টাকা</strong>
                        </span>
                        <span>
                          <span className="text-muted">সর্বোচ্চ </span>
                          <strong className="text-rise">{formatNumberBn(market.max)} টাকা</strong>
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="relative mt-3 h-2 overflow-hidden rounded-full bg-surface"
                      >
                        <span
                          className="absolute inset-y-0 rounded-full bg-brand"
                          style={{ left: `${left}%`, width: `${Math.min(width, 100 - left)}%` }}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
