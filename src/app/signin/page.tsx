import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import SignInForm from "@/components/SignInForm";
import { getServerSession } from "@/lib/session";
import { safeRedirectPath } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "সাইন ইন" };

type Props = { searchParams: Promise<{ callbackUrl?: string; reason?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const query = await searchParams;
  const callbackUrl = safeRedirectPath(query.callbackUrl);

  if (await getServerSession()) redirect(callbackUrl);

  return (
    <AuthShell title="সাইন ইন" subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।">
      <SignInForm callbackUrl={callbackUrl} protectedRedirect={query.reason === "protected"} />
    </AuthShell>
  );
}
