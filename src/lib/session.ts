import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Validated session for the current request (deduplicated per render). Fails closed. */
export const getServerSession = cache(async () => {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
});

/** Server-side route guard: redirects to /signin and carries a toast hint. */
export async function requireSession(returnTo: string) {
  const session = await getServerSession();
  if (!session) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(returnTo)}&reason=protected`);
  }
  return session;
}
