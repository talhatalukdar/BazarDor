"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Avatar } from "@/components/AuthMenu";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";

const AVATAR_SIZE = 256;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

/** Center-crops to a square and shrinks to 256px so the stored image stays small. */
function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = AVATAR_SIZE;
      canvas.height = AVATAR_SIZE;
      const ctx = canvas.getContext("2d");
      URL.revokeObjectURL(objectUrl);
      if (!ctx) {
        reject(new Error("Canvas unavailable"));
        return;
      }
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image could not be read"));
    };
    img.src = objectUrl;
  });
}

interface Props {
  currentName: string;
  currentImage?: string | null;
}

export default function UpdateProfileForm({ currentName, currentImage }: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [newImage, setNewImage] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState(currentName);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("শুধু ছবির ফাইল দিন");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("ছবির সাইজ ৫ MB এর কম হতে হবে");
      return;
    }
    try {
      setNewImage(await resizeToDataUrl(file));
    } catch {
      toast.error("ছবিটি পড়া যায়নি, অন্য ছবি দিন");
    }
  }

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
    const { error: updateError } = await authClient.updateUser({
      name,
      ...(newImage ? { image: newImage } : {}),
    });
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
      <div className="flex items-center gap-4">
        <Avatar name={previewName} image={newImage ?? currentImage} size={80} />
        <div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="sr-only"
            aria-label="প্রোফাইল ছবি বাছাই করুন"
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded-lg border border-line bg-card px-4 py-2 text-sm font-semibold hover:bg-brand-soft"
          >
            ছবি বদলান
          </button>
          <p className="mt-1 text-xs text-muted">JPG বা PNG, সর্বোচ্চ ৫ MB</p>
        </div>
      </div>

      <FormField
        label="নাম"
        name="name"
        defaultValue={currentName}
        autoComplete="name"
        error={error}
        onChange={(event) => setPreviewName(event.target.value)}
      />
      <SubmitButton pending={pending} pendingLabel="আপডেট হচ্ছে…">
        তথ্য আপডেট করুন
      </SubmitButton>
    </form>
  );
}