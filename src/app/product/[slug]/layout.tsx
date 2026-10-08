import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * Runs before the page's loading skeleton starts streaming, so unauthenticated
 * visitors get a real 307 redirect and unknown products a real 404 status.
 * page.tsx repeats the session check, so the guard also holds on client navigations
 * (layouts are not re-rendered between sibling pages).
 */
export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireSession(`/product/${slug}`);
  if (!(await getProductBySlug(slug))) notFound();
  return children;
}
