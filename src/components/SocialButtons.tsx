"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";

type Provider = "google" | "github";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="size-5">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.4-4.7 7l7.3 5.7c4.3-4 7.1-9.9 7.1-17.2z" />
      <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.6 2.3-8.6 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export default function SocialButtons({ callbackUrl = "/" }: { callbackUrl?: string }) {
  const [pending, setPending] = useState<Provider | null>(null);

  async function handleSocial(provider: Provider) {
    setPending(provider);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
      errorCallbackURL: "/signin",
    });
    // On success the browser is redirected to the provider, so we only handle failures here.
    if (error) {
      toast.error(authErrorMessage(error));
      setPending(null);
    }
  }

  const buttonClass =
    "flex flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-card px-3 py-3 text-sm font-semibold transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <>
      <div className="my-6 flex items-center gap-4 text-sm text-muted">
        <span className="h-px flex-1 bg-line" />
        অথবা
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" disabled={pending !== null} onClick={() => handleSocial("google")} className={buttonClass}>
          <GoogleIcon /> Google দিয়ে চালিয়ে যান
        </button>
        <button type="button" disabled={pending !== null} onClick={() => handleSocial("github")} className={buttonClass}>
          <GitHubIcon /> GitHub দিয়ে চালিয়ে যান
        </button>
      </div>
    </>
  );
}