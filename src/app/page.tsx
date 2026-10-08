import { Suspense } from "react";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/SectionHeading";
import { ProductGridSkeleton, SectionTitleSkeleton } from "@/components/Skeletons";
import { getProducts } from "@/lib/api";
import { toBn, topFallers, topRisers } from "@/lib/format";

// Prices change daily and the API is unreachable at build time in some environments.
export const dynamic = "force-dynamic";

async function HomeSections() {
  const products = await getProducts();
  const risers = topRisers(products);
  const fallers = topFallers(products);

  return (
    <>
      {risers.length > 0 && (
        <section >
          <SectionHeading
            title="আজ দাম বেড়েছে"
            symbol={{ char: "▲", className: "text-rise" }}
          />
          <ProductGrid products={risers} />
        </section>
      )}
      {fallers.length > 0 && (
        <section >
          <SectionHeading
            title="আজ দাম কমেছে"
            symbol={{ char: "▼", className: "text-fall" }}
          />
          <ProductGrid products={fallers} />
        </section>
      )}
      <section id="সব-পণ্য" className="scroll-mt-6">
        <SectionHeading
          title="সব পণ্য"
          subtitle={`মোট ${toBn(products.length)}টি পণ্য দেখানো হচ্ছে`}
        />
        <ProductGrid products={products} />
      </section>
    </>
  );
}

function HomeFallback() {
  return (
    <>
      {[0, 1].map((key) => (
        <section key={key} className="space-y-5">
          <SectionTitleSkeleton />
          <ProductGridSkeleton />
        </section>
      ))}
      <section id="সব-পণ্য" className="scroll-mt-6 space-y-5">
        <SectionTitleSkeleton />
        <ProductGridSkeleton count={9} />
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        <Suspense fallback={<HomeFallback />}>
          <HomeSections />
        </Suspense>
      </div>
    </>
  );
}
