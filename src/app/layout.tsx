import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, LogIn, PenLine, UserPlus } from "lucide-react";
import "@/app/globals.css";
import { getCurrentUser } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: "Campus Topic Lab",
  description: "校内跨领域学术 topic 讨论平台 MVP"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="zh-CN">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <Link className="brand" href="/">
              <span className="brand-mark">
                <BookOpen size={18} aria-hidden="true" />
              </span>
              <span>Campus Topic Lab</span>
            </Link>
            <nav className="nav-actions" aria-label="主导航">
              <Link className="button ghost" href="/topics">
                浏览 topics
              </Link>
              <Link className="button secondary" href="/topics/new">
                <PenLine size={16} aria-hidden="true" />
                创建 topic
              </Link>
              {user ? (
                <>
                  <span className="chip">{user.name}</span>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link className="button secondary" href="/login">
                    <LogIn size={16} aria-hidden="true" />
                    登录
                  </Link>
                  <Link className="button" href="/register">
                    <UserPlus size={16} aria-hidden="true" />
                    注册
                  </Link>
                </>
              )}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
