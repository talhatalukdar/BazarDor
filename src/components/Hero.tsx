import Image from "next/image";
import { bengaliDate } from "@/lib/format";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-8">
      <div className="grid items-center gap-8 rounded-3xl border border-line bg-card p-6 sm:p-10 md:grid-cols-[1fr_auto]">
        <div>
          <span className="inline-block rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand-dark">
            {bengaliDate()}
          </span>
          <h1 className="mt-4 text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়,
            সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          {/* Plain anchor: scrolls within the page instead of changing the route */}
          <a
            href="#সব-পণ্য"
            className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-brand-dark"
          >
            সব পণ্য দেখুন
          </a>
        </div>
        <Image
          src="/bazar-hero.png"
          alt="ঝুড়িতে সাজানো তাজা ফল ও সবজি"
          width={315}
          height={263}
          priority
          className="mx-auto h-auto w-56 sm:w-64 md:mx-0 md:w-72"
        />
      </div>
    </section>
  );
}
