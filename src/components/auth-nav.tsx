"use client";

import Link from "next/link";
import { LogIn, LogOut, PenLine, UserPlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { PublicUser } from "@/lib/types";

export function AuthNav({ initialUser }: { initialUser: PublicUser | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<PublicUser | null>(initialUser);
  const [pending, startTransition] = useTransition();
  const nextParam = useMemo(() => encodeURIComponent(pathname || "/"), [pathname]);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json();

        if (!cancelled) {
          setUser(data.user ?? null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      }
    }

    loadUser();
    window.addEventListener("focus", loadUser);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", loadUser);
    };
  }, [pathname]);

  return (
    <>
      <Link className="button ghost" href="/topics">
        浏览 topics
      </Link>
      <Link className="button secondary" href={`/topics/new?next=${nextParam}`}>
        <PenLine size={16} aria-hidden="true" />
        创建 topic
      </Link>
      {user ? (
        <>
          <span className="chip">{user.name}</span>
          <button
            className="button secondary"
            disabled={pending}
            type="button"
            onClick={() => {
              startTransition(async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                setUser(null);
                router.refresh();
              });
            }}
          >
            <LogOut size={16} aria-hidden="true" />
            {pending ? "退出中" : "退出"}
          </button>
        </>
      ) : (
        <>
          <Link className="button secondary" href={`/login?next=${nextParam}`}>
            <LogIn size={16} aria-hidden="true" />
            登录
          </Link>
          <Link className="button" href={`/register?next=${nextParam}`}>
            <UserPlus size={16} aria-hidden="true" />
            注册
          </Link>
        </>
      )}
    </>
  );
}
