"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, LogOut, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function Avatar({ name, image, size = 36 }: { name: string; image?: string | null; size?: number }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- provider avatars come from arbitrary hosts
      <img
        src={image}
        alt={name}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center rounded-full bg-brand font-semibold text-white"
      style={{ width: size, height: size }}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

export default function AuthMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    const { error } = await authClient.signOut();
    if (error) {
      toast.error("সাইন আউট করা যায়নি, আবার চেষ্টা করুন");
      return;
    }
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  }

  if (isPending) {
    return <div aria-hidden="true" className="h-10 w-32 animate-pulse rounded-full bg-line" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/signin" className="rounded-lg px-2 py-2 text-sm font-semibold hover:text-brand sm:px-3">
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark sm:px-5 sm:py-2.5"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const { name, image } = session.user;
  const firstName = name.split(" ")[0];

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-brand-soft"
      >
        <Avatar name={name} image={image} />
        <span className="max-w-24 truncate text-sm font-medium sm:max-w-40">{firstName}</span>
        <ChevronDown aria-hidden="true" className="size-4 text-muted" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-card shadow-lg"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted">{session.user.email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-brand-soft"
          >
            <User aria-hidden="true" className="size-4" /> আমার প্রোফাইল
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rise hover:bg-rise-soft"
          >
            <LogOut aria-hidden="true" className="size-4" /> সাইন আউট
          </button>
        </div>
      )}
    </div>
  );
}
