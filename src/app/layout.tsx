import type { Metadata } from "next";
import Link from "next/link";
import { Coffee } from "lucide-react";
import "@/app/globals.css";
import { AuthNav } from "@/components/auth-nav";
import { SiteSearch } from "@/components/site-search";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "WestlakeCafe",
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
                <Coffee size={18} aria-hidden="true" />
              </span>
              <span>WestlakeCafe</span>
            </Link>
            <SiteSearch />
            <nav className="nav-actions" aria-label="主导航">
              <AuthNav initialUser={user} />
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
