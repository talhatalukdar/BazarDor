import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/api";
import { bengaliDate } from "@/lib/format";
import type { Category } from "@/lib/types";
import AuthMenu from "@/components/AuthMenu";
import CategoryNav from "@/components/CategoryNav";

export default async function Navbar() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    // Navigation degrades gracefully if the API is down; pages show their own error state.
  }

  return (
    <header className="bg-card">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="বাজার দর – হোম">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              width={24}
              height={24}
              priority
              className="size-6 object-contain"
            />
          </span>
          <span className="min-w-0">
            <span className="block text-xl leading-tight font-bold">বাজার দর</span>
            <span className="block truncate text-xs text-muted">{bengaliDate()}</span>
          </span>
        </Link>
        <AuthMenu />
      </div>
      {categories.length > 0 && <CategoryNav categories={categories} />}
    </header>
  );
}