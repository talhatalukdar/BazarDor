/** Maps Better Auth error codes/messages to friendly Bengali toast messages. */
export function authErrorMessage(error: { code?: string; message?: string } | null | undefined): string {
  const code = error?.code ?? "";
  if (code.includes("INVALID_EMAIL_OR_PASSWORD") || code.includes("INVALID_PASSWORD")) {
    return "ইমেইল বা পাসওয়ার্ড সঠিক নয়";
  }
  if (code.includes("USER_ALREADY_EXISTS")) return "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে";
  if (code.includes("USER_NOT_FOUND")) return "এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি";
  if (code.includes("PASSWORD_TOO_SHORT")) return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
  if (code.includes("INVALID_EMAIL")) return "সঠিক ইমেইল ঠিকানা দিন";
  if (code.includes("PROVIDER_NOT_FOUND")) return "এই সোশ্যাল লগইন এখনো চালু করা হয়নি";
  return error?.message || "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন";
}
