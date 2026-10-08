import type { Category, Product } from "@/lib/types";

/**
 * Data layer for the BazarDor API.
 * The primary host is tried first; if it is unreachable or returns a server error
 * the alternative host is used automatically. Override either via env vars.
 */
const BASES = [
  process.env.BAZARDOR_API_URL ?? "https://api.api-store.workers.dev/api/bazardor",
  process.env.BAZARDOR_API_FALLBACK_URL ?? "https://api.abcz.workers.dev/api/bazardor",
];

const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ApiError";
  }
}

/** Returns parsed JSON, `null` when the resource does not exist (404), or throws ApiError. */
async function request(path: string): Promise<unknown | null> {
  let lastError: unknown;
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new ApiError(`API responded with ${res.status}`);
      return await res.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw new ApiError("পণ্যের তথ্য আনা যায়নি", { cause: lastError });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.slug === "string" &&
    typeof value.nameBn === "string" &&
    typeof value.today === "number" &&
    isRecord(value.change) &&
    Array.isArray(value.markets)
  );
}

function isCategory(value: unknown): value is Category {
  return isRecord(value) && typeof value.slug === "string" && typeof value.nameBn === "string";
}

export async function getCategories(): Promise<Category[]> {
  const data = await request("/categories");
  if (!Array.isArray(data)) throw new ApiError("Unexpected categories response");
  return data.filter(isCategory);
}

export async function getCategory(slug: string): Promise<Category | null> {
  const data = await request(`/categories/${encodeURIComponent(slug)}`);
  return isCategory(data) ? data : null;
}

export async function getProducts(category?: string): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const data = await request(`/products${query}`);
  if (data === null) return [];
  if (!Array.isArray(data)) throw new ApiError("Unexpected products response");
  return data.filter(isProduct);
}

/** Resolves a product by its slug (or numeric id, which maps to /products/:id). */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (/^\d+$/.test(slug)) {
    const data = await request(`/products/${slug}`);
    return isProduct(data) ? data : null;
  }
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}
