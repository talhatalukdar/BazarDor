import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import SignUpForm from "@/components/SignUpForm";
import { getServerSession } from "@/lib/session";
import { safeRedirectPath } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "সাইন আপ" };

type Props = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function SignUpPage({ searchParams }: Props) {
  const query = await searchParams;
  const callbackUrl = safeRedirectPath(query.callbackUrl);

  if (await getServerSession()) redirect(callbackUrl);

  return (
    <AuthShell title="অ্যাকাউন্ট তৈরি করুন" subtitle="বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।">
      <SignUpForm callbackUrl={callbackUrl} />
    </AuthShell>
  );
}
