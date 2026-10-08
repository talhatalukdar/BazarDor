import { notFound } from "next/navigation";
import { getCategory } from "@/lib/api";

export const dynamic = "force-dynamic";

/** Resolves the category before streaming starts so invalid slugs return a real 404 status. */
export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(await getCategory(slug))) notFound();
  return children;
}
