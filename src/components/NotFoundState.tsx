import Link from "next/link";

interface Props {
  title?: string;
  description?: string;
}

export default function NotFoundState({
  title = "পেজটি খুঁজে পাওয়া যায়নি",
  description = "আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে অথবা ঠিকানাটি সঠিক নয়।",
}: Props) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <p aria-hidden="true" className="text-7xl font-bold text-brand">৪০৪</p>
      <h1 className="mt-4 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-muted">{description}</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-brand px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
      >
        হোম পেজে ফিরে যান
      </Link>
    </section>
  );
}
