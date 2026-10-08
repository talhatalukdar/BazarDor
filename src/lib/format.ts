import type { MarketPrice, PriceDirection, Product, SortMode } from "@/lib/types";

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Converts every ASCII digit in a string/number to its Bengali equivalent. */
export function toBn(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => BN_DIGITS[Number(digit)]);
}

export function formatNumberBn(value: number, maximumFractionDigits = 0): string {
  return toBn(new Intl.NumberFormat("en-IN", { maximumFractionDigits }).format(value));
}

export function formatPrice(value: number): string {
  return `${formatNumberBn(value)} টাকা`;
}

export function formatPercent(pct: number): string {
  return `${toBn(Math.abs(pct).toFixed(1))}%`;
}

const UNIT_LABELS: Record<string, { full: string; short: string }> = {
  kg: { full: "প্রতি কেজি", short: "কেজি" },
  litre: { full: "প্রতি লিটার", short: "লিটার" },
  dozen: { full: "প্রতি ডজন", short: "ডজন" },
  piece: { full: "প্রতি পিস", short: "পিস" },
};

export function unitLabel(unit: string): string {
  return UNIT_LABELS[unit]?.full ?? `প্রতি ${unit}`;
}

export function unitShort(unit: string): string {
  return UNIT_LABELS[unit]?.short ?? unit;
}

export function directionSymbol(dir: PriceDirection): string {
  return dir === "up" ? "▲" : dir === "down" ? "▼" : "—";
}

/** e.g. "মঙ্গলবার, ৬ অক্টোবর, ২০২৬" (Dhaka time). */
export function bengaliDate(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).formatToParts(date);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return toBn(`${pick("weekday")}, ${pick("day")} ${pick("month")}, ${pick("year")}`);
}

/** Numeric sort on the real price — never on the formatted Bengali string. */
export function sortProducts(products: Product[], mode: SortMode): Product[] {
  if (mode === "default") return products;
  const sorted = [...products];
  sorted.sort((a, b) => (mode === "price-asc" ? a.today - b.today : b.today - a.today));
  return sorted;
}

export function topRisers(products: Product[], count = 6): Product[] {
  return products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, count);
}

export function topFallers(products: Product[], count = 6): Product[] {
  return products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, count);
}

export function priceStats(markets: MarketPrice[]): { min: number; max: number; avg: number } {
  if (markets.length === 0) return { min: 0, max: 0, avg: 0 };
  const min = Math.min(...markets.map((m) => m.min));
  const max = Math.max(...markets.map((m) => m.max));
  const avg = markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0) / markets.length;
  return { min, max, avg: Math.round(avg) };
}

export function groupByDivision(markets: MarketPrice[]): [string, MarketPrice[]][] {
  const groups = new Map<string, MarketPrice[]>();
  for (const market of markets) {
    groups.set(market.division, [...(groups.get(market.division) ?? []), market]);
  }
  return [...groups.entries()];
}

/** Integers stay clean (৬২); fractions show two decimals (৬৩.৫০), as in the design. */
export function formatAverage(value: number): string {
  if (Number.isInteger(value)) return formatNumberBn(value);
  return toBn(
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
  );
}
