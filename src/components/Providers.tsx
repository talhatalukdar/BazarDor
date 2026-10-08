"use client";

import { Toaster } from "react-hot-toast";

export default function Providers() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: { fontFamily: "var(--font-sans)", borderRadius: "12px" },
        success: { iconTheme: { primary: "#068a42", secondary: "#fff" } },
      }}
    />
  );
}
