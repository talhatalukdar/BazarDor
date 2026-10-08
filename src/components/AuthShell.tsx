import Link from "next/link";

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthShell({ title, subtitle, children }: Props) {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-muted">{subtitle}</p>
      </div>
      <div className="mt-8 rounded-3xl border border-line bg-card p-6 sm:p-8">{children}</div>
      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← হোম পেজে ফিরে যান
        </Link>
      </p>
    </div>
  );
}
