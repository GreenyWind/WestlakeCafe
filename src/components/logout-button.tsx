"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="button secondary"
      disabled={pending}
      type="button"
      onClick={() => {
        startTransition(async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          router.refresh();
          router.push("/");
        });
      }}
    >
      <LogOut size={16} aria-hidden="true" />
      {pending ? "退出中" : "退出"}
    </button>
  );
}
