import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";
import NotFoundState from "@/components/NotFoundState";
import { getCategory, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug).catch(() => null);
  return { title: category ? `${category.nameBn}র দাম` : "ক্যাটাগরি" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound(); // invalid slug -> global 404 with "হোম পেজে ফিরে যান"

  const products = await getProducts(category.slug);
  if (products.length === 0) {
    return (
      <NotFoundState
        title={`${category.nameBn} ক্যাটাগরিতে কোনো পণ্য নেই`}
        description="এই মুহূর্তে এই ক্যাটাগরিতে দেখানোর মতো পণ্য পাওয়া যায়নি।"
      />
    );
  }

  return <CategoryProducts title={category.nameBn} icon={category.icon} products={products} />;
}
