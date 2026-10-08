import { Loader2 } from "lucide-react";

interface Props {
  pending: boolean;
  children: React.ReactNode;
  pendingLabel?: string;
}

export default function SubmitButton({ pending, children, pendingLabel = "অপেক্ষা করুন…" }: Props) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
      {pending ? pendingLabel : children}
    </button>
  );
}
