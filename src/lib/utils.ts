/** Only allows same-site relative paths, preventing open redirects via ?callbackUrl=. */
export function safeRedirectPath(input: string | string[] | undefined, fallback = "/"): string {
  const value = Array.isArray(input) ? input[0] : input;
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}
