"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import FormField from "@/components/FormField";
import SocialButtons from "@/components/SocialButtons";
import SubmitButton from "@/components/SubmitButton";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = { name?: string; email?: string; password?: string; confirm?: string };

export default function SignUpForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    const nextErrors: Errors = {};
    if (name.length < 2) nextErrors.name = "আপনার নাম লিখুন";
    if (!EMAIL_PATTERN.test(email)) nextErrors.email = "সঠিক ইমেইল ঠিকানা দিন";
    if (password.length < 8) nextErrors.password = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
    if (confirm !== password) nextErrors.confirm = "দুটি পাসওয়ার্ড মিলছে না";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error(Object.values(nextErrors)[0]!);
      return;
    }

    setPending(true);
    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) {
      toast.error(authErrorMessage(error));
      setPending(false);
      return;
    }
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এবার সাইন ইন করুন");
    router.push(
      callbackUrl === "/" ? "/signin" : `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  const signInHref =
    callbackUrl === "/" ? "/signin" : `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormField label="নাম" name="name" autoComplete="name" placeholder="যেমন: রহিম উদ্দিন" error={errors.name} />
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
          autoComplete="new-password"
          placeholder="কমপক্ষে ৮ অক্ষর"
          error={errors.password}
        />
        <FormField
          label="পাসওয়ার্ড নিশ্চিত করুন"
          name="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="আবার লিখুন"
          error={errors.confirm}
        />
        <SubmitButton pending={pending}>অ্যাকাউন্ট তৈরি করুন</SubmitButton>
      </form>
      <SocialButtons callbackUrl={callbackUrl} />
      <p className="mt-6 text-center text-sm">
        অ্যাকাউন্ট আছে?{" "}
        <Link href={signInHref} className="font-medium text-brand hover:underline">
          সাইন ইন করুন
        </Link>
      </p>
    </>
  );
}
