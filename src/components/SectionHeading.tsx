interface Props {
  title: string;
  subtitle?: string;
  symbol?: { char: string; className: string };
}

export default function SectionHeading({ title, subtitle, symbol }: Props) {
  return (
    <div className="mb-5">
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        {symbol && (
          <span aria-hidden="true" className={`text-lg ${symbol.className}`}>
            {symbol.char}
          </span>
        )}
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </div>
  );
}
