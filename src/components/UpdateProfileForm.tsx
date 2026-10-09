"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";

export default function UpdateProfileForm({ currentName }: { currentName: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();

    if (name.length < 2) {
      setError("আপনার নাম লিখুন");
      toast.error("আপনার নাম লিখুন");
      return;
    }
    setError(undefined);

    setPending(true);
    const { error: updateError } = await authClient.updateUser({ name });
    if (updateError) {
      toast.error(authErrorMessage(updateError));
      setPending(false);
      return;
    }
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormField label="নাম" name="name" defaultValue={currentName} autoComplete="name" error={error} />
      <SubmitButton pending={pending} pendingLabel="আপডেট হচ্ছে…">
        তথ্য আপডেট করুন
      </SubmitButton>
    </form>
  );
}