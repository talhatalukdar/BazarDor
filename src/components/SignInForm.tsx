"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FormField from "@/components/FormField";
import SocialButtons from "@/components/SocialButtons";
import SubmitButton from "@/components/SubmitButton";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  callbackUrl: string;
  protectedRedirect: boolean;
}

export default function SignInForm({ callbackUrl, protectedRedirect }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (protectedRedirect) {
      // Fixed id prevents a duplicate toast under React StrictMode.
      toast.error("এই পেজ দেখতে আগে সাইন ইন করুন", { id: "protected-route" });
    }
  }, [protectedRedirect]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const nextErrors: typeof errors = {};
    if (!EMAIL_PATTERN.test(email)) nextErrors.email = "সঠিক ইমেইল ঠিকানা দিন";
    if (password.length < 8) nextErrors.password = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error(Object.values(nextErrors)[0]!);
      return;
    }

    setPending(true);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      toast.error(authErrorMessage(error));
      setPending(false);
      return;
    }
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push(callbackUrl);
    router.refresh();
  }

  const signUpHref =
    callbackUrl === "/" ? "/signup" : `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormField
          label="ইমেইল"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email}
        />
        <FormField
          label="পাসওয়ার্ড"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="কমপক্ষে ৮ অক্ষর"
          error={errors.password}
        />
        <SubmitButton pending={pending}>সাইন ইন</SubmitButton>
      </form>
      <SocialButtons callbackUrl={callbackUrl} />
      <p className="mt-6 text-center text-sm">
        অ্যাকাউন্ট নেই?{" "}
        <Link href={signUpHref} className="font-medium text-brand hover:underline">
          সাইন আপ করুন
        </Link>
      </p>
    </>
  );
}
