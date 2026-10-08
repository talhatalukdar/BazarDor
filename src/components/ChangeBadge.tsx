import { directionSymbol, formatPercent } from "@/lib/format";
import type { Product } from "@/lib/types";

const STYLES = {
  up: "bg-rise-soft text-rise",
  down: "bg-fall-soft text-fall",
  flat: "bg-gray-100 text-gray-500",
} as const;

export default function ChangeBadge({ change }: { change: Product["change"] }) {
  const label =
    change.dir === "up" ? "দাম বেড়েছে" : change.dir === "down" ? "দাম কমেছে" : "দাম অপরিবর্তিত";
  return (
    <span
      aria-label={`${label} ${formatPercent(change.pct)}`}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${STYLES[change.dir]}`}
    >
      <span aria-hidden="true">{directionSymbol(change.dir)}</span>
      {formatPercent(change.pct)}
    </span>
  );
}
