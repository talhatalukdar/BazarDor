import type { Metadata } from "next";
import { Avatar } from "@/components/AuthMenu";
import SignOutButton from "@/components/SignOutButton";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "আমার প্রোফাইল" };

export default async function ProfilePage() {
  const { user } = await requireSession("/profile");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">আমার প্রোফাইল</h1>
      <p className="mt-1 text-muted">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>

      <section className="mt-8 flex flex-col gap-5 rounded-3xl border border-line bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <Avatar name={user.name} image={user.image} size={80} />
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-semibold">{user.name}</h2>
            <p className="truncate text-muted">{user.email}</p>
          </div>
        </div>
        <SignOutButton />
      </section>

      <section className="mt-6 rounded-3xl border border-line bg-card p-6 sm:p-8">
        <h2 className="mb-5 text-lg font-semibold">তথ্য</h2>
        <UpdateProfileForm currentName={user.name} />
      </section>
    </div>
  );
}